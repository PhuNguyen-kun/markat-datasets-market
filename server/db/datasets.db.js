const client = require("../config");

const getAllDatasetsDb = async ({ limit, offset }) => {
  const datasets = await client.query(
    `SELECT d.Avatar, d.Name_dataset,(SELECT COUNT(*) FROM User_Click uc WHERE uc.ID_Dataset = d.ID_Dataset) AS Views, d.Voucher,
        CASE
            WHEN v.Data_format = 1 THEN 'CSV'
            WHEN v.Data_format = 2 THEN 'Excel'
            -- Thêm các định dạng khác nếu cần
            ELSE 'Unknown'
        END AS Data_Format,
        (SELECT COUNT(*) FROM Version v WHERE v.ID_Dataset = d.ID_Dataset) AS Version_Count
        FROM
            Dataset d
        LEFT JOIN
            Version v ON d.ID_Dataset = v.ID_Dataset
        GROUP BY
            d.ID_Dataset, d.Avatar, d.Name_dataset, d.Voucher, v.Data_format
        ORDER BY
            d.ID_Dataset ASC
        OFFSET $1
        LIMIT $2
      `,
    [offset, limit]
  );
  return { items: datasets.rows };
};

const getDatasetbyDatasetIdDb = async (datasetId) => {
  console.log(datasetId);

  const {rows : datasets} = await client.query(
    `SELECT
    d.name_dataset,
    d.avatar,
    COALESCE(MAX(ds.Description), MAX(db.Description), 'No description available') AS description,
    STRING_AGG(DISTINCT e.Description, ', ') AS expert_tags
    FROM
        dataset d
    LEFT JOIN
        Data_sending_request ds ON ds.Dataset_ID = d.Dataset_ID
    LEFT JOIN
        Data_buying_request db ON db.Dataset_ID = d.Dataset_ID
    LEFT JOIN
        Dataset_Expert de ON d.Dataset_ID = de.Dataset_ID
    LEFT JOIN
        Expert e ON de.ID_Expert = e.ID_Expert
    WHERE
        d.Dataset_ID = $1
    GROUP BY
        d.name_dataset, d.avatar;
    `,
    [datasetId]
  );
  console.log(datasets);

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
        VALUES ($1,$2,$3,$4,$5)
        returning *
        `,
    [reliability_minimum, avatar, name_dataset, voucher, field]
  );
  return datasets[0];
};

const getUserOwnedDatasetsDb = async (id) => {
  const { rows: datasets } = await client.query(
    `SELECT
      d.ID_Dataset,
      d.Name_dataset,
      v.Stock_percent,
      SUM(v.Price) AS Total_Amount
    FROM
        Dataset d
    JOIN
        Version v ON d.ID_Dataset = v.ID_Dataset
    JOIN
        Database_Expert de ON d.ID_Dataset = de.ID_Dataset
    JOIN
        Expert e ON de.ID_Expert = e.ID_Expert
    WHERE
        e.ID_User = $1
    GROUP BY
        d.ID_Dataset, d.Name_dataset, v.Stock_percent
    `,
    [id]
  );
  return datasets;
};
const getUserOwnedDatasetByIdDb = async (datasetId) => {
  const { rows: dataset } = await client.query(
    `SELECT
      d.ID_Dataset,
      d.Name_dataset,
      v.Stock_percent,
      SUM(v.Price) AS Total_Amount
    FROM
        Dataset d
    JOIN
        Version v ON d.ID_Dataset = v.ID_Dataset
    JOIN
        Database_Expert de ON d.ID_Dataset = de.ID_Dataset
    JOIN
        Expert e ON de.ID_Expert = e.ID_Expert
    WHERE
        e.ID_User = $1
    GROUP BY
        d.ID_Dataset, d.Name_dataset, v.Stock_percent
    `,
    [datasetId]
  );
  return dataset;
};
module.exports = {
  getAllDatasetsDb,
  getDatasetbyDatasetIdDb,
  createDatasetDb,
  getUserOwnedDatasetsDb,
  getUserOwnedDatasetByIdDb,
};
