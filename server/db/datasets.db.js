const { default: mongoose } = require("mongoose");
const client = require("../config");
const fs = require('fs').promises;
const path = require('path');

const getDatasetAvatar = async (id_dataset) => {
  try {
    const imagePath = path.join(__dirname, '..', 'Package/Datasets/Avatar/avatar' + id_dataset.toString() + '.png');
    const imageBuffer = await fs.readFile(imagePath);
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
  } catch (err) {
    console.error(`Error reading file ${id_dataset}:`, err);
    return null;
  }
};

const getDatasetsByTopicDb = async ({ topic }) => {
  const { rows: datasets } = await client.query(
    `SELECT
      d.ID_dataset,
      d.Avatar,
      d.Name_dataset,
      d.Verified,
      d.Slug,
      (SELECT COUNT(*) FROM Dataset_view uc WHERE uc.ID_dataset = d.ID_dataset) AS Views,
      d.Voucher,
      df.Data_format AS Data_Format,
      CAST((SELECT COUNT(*) FROM Version v WHERE v.ID_Dataset = d.ID_Dataset) AS INTEGER) AS Version_Count, -- Ép kiểu số
      COALESCE(
        (
          SELECT MAX(v.Valuation_due_date)
          FROM Version v
          WHERE v.ID_dataset = d.ID_dataset AND v.Valuation_due_date <= NOW()
        ), '2024-01-01 10:00:00'
      ) AS latest_valuation_due_date
    FROM
      Dataset d
    LEFT JOIN
      Data_format df ON d.ID_data_format = df.ID_data_format
    LEFT JOIN
      Dataset_topic dt ON d.ID_dataset = dt.ID_dataset
    WHERE
      dt.Topic = $1
    GROUP BY
      d.ID_Dataset, d.Avatar, d.Name_dataset, d.Verified, d.Voucher, df.Data_format
    ORDER BY
      d.ID_Dataset ASC
    `,
    [topic]
  );

  const now = new Date();
  datasets.forEach(dataset => {
    if (dataset.latest_valuation_due_date) {
      const valuationDate = new Date(dataset.latest_valuation_due_date);
      const dayDifference = Math.floor((now - valuationDate) / (1000 * 60 * 60 * 24));
      dataset.day_updated = dayDifference > 0 ? `${dayDifference} days ago` : "Today";
    } else {
      dataset.day_updated = "No update available";
    }
  });

  return datasets;
};

const getDatasetbyDatasetSlugDb = async (slug) => {
  const { rows: dataset } = await client.query(
    `
    SELECT
    d.ID_dataset,
    d.Name_dataset,
    d.Avatar,
    COALESCE(dsr.Description, dbr.Description) AS Description,
    ARRAY_AGG(DISTINCT t.Tag_name) AS Tags,
    ARRAY_AGG(DISTINCT v.ID_version) AS Versions
    FROM
      Dataset d
    LEFT JOIN
      Data_selling_request dsr ON d.ID_dataset = dsr.ID_dataset AND d.Request_type = 'Selling'
    LEFT JOIN
      Data_buying_request dbr ON d.ID_dataset = dbr.ID_dataset AND d.Request_type = 'Buying'
    LEFT JOIN
      Dataset_tag dt ON d.ID_dataset = dt.ID_dataset
    LEFT JOIN
      Tag t ON dt.ID_tag = t.ID_tag
    LEFT JOIN
      Version v ON d.ID_dataset = v.ID_dataset
    WHERE
      d.Slug = $1
    GROUP BY
      d.ID_dataset, d.Name_dataset, d.Avatar, dsr.Description, dbr.Description;
    `,
    [slug]
  );
  return dataset[0];
};

const getDatasetbyDatasetIdDb = async (id_dataset) => {
  const { rows: dataset } = await client.query(
    `
    SELECT
    d.Slug
    d.Name_dataset,
    d.Avatar,
    COALESCE(dsr.Description, dbr.Description) AS Description,
    ARRAY_AGG(DISTINCT t.Tag_name) AS Tags,
    ARRAY_AGG(DISTINCT v.ID_version) AS Versions
    FROM
      Dataset d
    LEFT JOIN
      Data_selling_request dsr ON d.ID_dataset = dsr.ID_dataset AND d.Request_type = 'Selling'
    LEFT JOIN
      Data_buying_request dbr ON d.ID_dataset = dbr.ID_dataset AND d.Request_type = 'Buying'
    LEFT JOIN
      Dataset_tag dt ON d.ID_dataset = dt.ID_dataset
    LEFT JOIN
      Tag t ON dt.ID_tag = t.ID_tag
    LEFT JOIN
      Version v ON d.ID_dataset = v.ID_dataset
    WHERE
      d.ID_dataset = $1
    GROUP BY
      d.Name_dataset, d.Avatar, dsr.Description, dbr.Description;
    `,
    [id_dataset]
  );
  return dataset[0];
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

const getVersionDb = async (id_version) => {
  const { rows: version } = await client.query(
    `SELECT v.Price,
            v.Total_size,
            v.Number_of_data,
            v.Create_Date AS day_updated
     FROM Version v
     WHERE v.ID_version = $1
    `,
    [id_version]
  );
  return version[0];
};

const updateDatasetViewDb = async (id_dataset, id_user) => {
  const { rows } = await client.query(
    `
    INSERT INTO Dataset_view (ID_user, ID_dataset)
    VALUES ($1, $2)
    RETURNING *;
    `,
    [id_user, id_dataset]
  );
  return rows[0];
}

module.exports = {
  getDatasetAvatar,
  getDatasetsByTopicDb,
  getDatasetbyDatasetSlugDb,
  getDatasetbyDatasetIdDb,
  createDatasetDb,
  getUserOwnedDatasetsDb,
  getUserOwnedDatasetByIdDb,
  getVersionDb,
  updateDatasetViewDb,
};


