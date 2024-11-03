const client = require("../config");

const getAllDatasetsDb = async ({ limit, offset }) => {
  const datasets = await client.query(
    `SELECT d.ID_dataset,
            d.Avatar,
            d.Name_dataset,
            (SELECT COUNT(*) FROM User_Click uc WHERE uc.ID_dataset = d.ID_dataset) AS Views,
            d.Voucher,
            CASE
                WHEN v.Data_format = 1 THEN 'CSV'
                WHEN v.Data_format = 2 THEN 'Excel'
                -- Thêm các định dạng khác nếu cần
                ELSE 'Unknown'
                END                                                                 AS Data_Format,
            (SELECT COUNT(*) FROM Version v WHERE v.ID_Dataset = d.ID_Dataset)      AS Version_Count
     FROM Dataset d
              LEFT JOIN
          Version v ON d.ID_Dataset = v.ID_Dataset
     GROUP BY d.ID_Dataset, d.Avatar, d.Name_dataset, d.Voucher, v.Data_format
     ORDER BY d.ID_Dataset ASC
     OFFSET $1 LIMIT $2
    `,
    [offset, limit]
  );
  return { items: datasets.rows };
};

const getDatasetbyDatasetIdDb = async (id_dataset) => {
  const { rows: datasets } = await client.query(
    `SELECT d.name_dataset,
            d.avatar,
            COALESCE(MAX(ds.Description), MAX(db.Description), 'No description available') AS description,
            STRING_AGG(DISTINCT e.Description, ', ')                                       AS expert_tags,
            COUNT(v.ID_Dataset)                                                            AS version_count
     FROM dataset d
              LEFT JOIN Data_sending_request ds ON ds.ID_dataset = d.ID_dataset
              LEFT JOIN Data_buying_request db ON db.ID_dataset = d.ID_dataset
              LEFT JOIN Dataset_Expert de ON d.ID_dataset = de.ID_dataset
              LEFT JOIN Expert e ON de.ID_expert = e.ID_expert
              LEFT JOIN Version v ON d.ID_Dataset = v.ID_Dataset
     WHERE d.ID_dataset = $1
     GROUP BY d.name_dataset, d.avatar, d.id_dataset;
    `,
    [id_dataset]
  );
  return datasets[0];
};

const createDatasetDb = async ({
  reliability_minimum,
  avatar,
  name_dataset,
  voucher,
  field,
}) => {
  const { rows: datasets } = await client.query(
    `
        INSERT INTO Dataset (Reliability_minimum, Avatar, Name_dataset, Voucher, Field)
        VALUES ($1, $2, $3, $4, $5) returning *
    `,
    [reliability_minimum, avatar, name_dataset, voucher, field]
  );
  return datasets[0];
};

const getUserOwnedDatasetsDb = async (id_user) => {
  const { rows: datasets } = await client.query(
    `SELECT d.ID_Dataset,
            d.Name_dataset,
            v.Stock_percent,
            SUM(v.Price) AS Total_Amount
     FROM Dataset d
              JOIN
          Version v ON d.ID_Dataset = v.ID_Dataset
              JOIN
          Dataset_Expert de ON d.ID_Dataset = de.ID_Dataset
              JOIN
          Expert e ON de.ID_Expert = e.ID_Expert
     WHERE e.ID_User = $1
     GROUP BY d.ID_Dataset, d.Name_dataset, v.Stock_percent
    `,
    [id_user]
  );
  return datasets;
};
const getUserOwnedDatasetByIdDb = async (datasetId) => {
  const { rows: dataset } = await client.query(
    `SELECT d.ID_Dataset,
            d.Name_dataset,
            v.Stock_percent,
            SUM(v.Price) AS Total_Amount
     FROM Dataset d
              JOIN
          Version v ON d.ID_Dataset = v.ID_Dataset
              JOIN
          Database_Expert de ON d.ID_Dataset = de.ID_Dataset
              JOIN
          Expert e ON de.ID_Expert = e.ID_Expert
     WHERE e.ID_User = $1
     GROUP BY d.ID_Dataset, d.Name_dataset, v.Stock_percent
    `,
    [datasetId]
  );
  return dataset;
};
const getVersionDb = async (id_dataset, name_version) => {
  const { rows: version } = await client.query(
    `SELECT v.Price,
            v.Total_size,
            v.Number_of_data,
            v.Create_Date AS day_updated
     FROM Version v
     WHERE v.ID_dataset = $1
     ORDER BY v.ID_version ASC LIMIT 1
     OFFSET ($2 - 1)
    `,
    [id_dataset, name_version]
  );
  return version;
};

const versionBuyingTransactionDb = async (id_user, id_version) => {
  try {
    await client.query("BEGIN");
    // Get the price of the specified version and user's current Kat balance
    const { rows: versionRows } = await client.query(
      `SELECT Price
       FROM Version
       WHERE ID_version = $1`,
      [id_version]
    );
    const price = versionRows[0]?.price;

    const { rows: userRows } = await client.query(
      `SELECT Kat
       FROM Users
       WHERE ID_user = $1`,
      [id_user]
    );
    const currentKat = userRows[0]?.kat;

    // Check if the user has enough Kat
    if (currentKat >= price) {
      // Insert transaction and update user's Kat balance
      await client.query(
        `INSERT INTO Transaction (ID_user, ID_version)
         VALUES ($1, $2)`,
        [id_user, id_version]
      );

      const remainingKat = currentKat - price;

      await client.query(
        `UPDATE Users
         SET Kat = $1
         WHERE ID_user = $2`,
        [remainingKat, id_user]
      );

      await client.query("COMMIT");
      return { success: true, remainingKat };
    } else {
      await client.query("ROLLBACK");
      throw new Error("Insufficient balance to make transaction.");
    }
  } catch (error) {
    await client.query("ROLLBACK");
    return { success: false, error: error.message };
  }
};

module.exports = {
  getAllDatasetsDb,
  getDatasetbyDatasetIdDb,
  createDatasetDb,
  getUserOwnedDatasetsDb,
  getUserOwnedDatasetByIdDb,
  getVersionDb,
  versionBuyingTransactionDb,
};
