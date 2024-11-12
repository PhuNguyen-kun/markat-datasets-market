const { log } = require("console");
const client = require("../config");
const Data = require('../models/data');
const fs = require('fs').promises;
const path = require('path');

const getDatasetAvatar = async (id_dataset) => {
  try {
    const imagePath = path.join(__dirname, '..', 'Package/Datasets/Avatar/avatar' + id_dataset.toString() + '.png');
    const imageBuffer = await fs.readFile(imagePath);
    return imageBuffer.toString('base64');
  } catch (err) {
    console.error(`Error reading file ${id_dataset}:`, err);
    return null;
  }
};

const getAllDatasetsDb = async ({ limit, offset }) => {
  const datasets = await client.query(
    `SELECT
    d.ID_dataset,
    d.Avatar,
    d.Name_dataset,
    (SELECT COUNT(*) FROM User_click uc WHERE uc.ID_dataset = d.ID_dataset) AS Views,
    d.Voucher,
    df.Data_format AS Data_Format,
    (SELECT COUNT(*) FROM Version v WHERE v.ID_Dataset = d.ID_Dataset) AS Version_Count
    FROM
        Dataset d
    LEFT JOIN
        Version v ON d.ID_Dataset = v.ID_Dataset
    LEFT JOIN
        Data_format df ON d.ID_data_format = df.ID_data_format
    GROUP BY
        d.ID_Dataset, d.Avatar, d.Name_dataset, d.Voucher, df.Data_format
    ORDER BY
        d.ID_Dataset ASC
    OFFSET $1 LIMIT $2;
    `,
    [offset, limit]
  );

  const datasetsWithAvatar = await Promise.all(datasets.rows.map(async (dataset) => {
    if (dataset.avatar && dataset.id_dataset) {
      dataset.avatar = await getDatasetAvatar(dataset.id_dataset)
    }
    return dataset;
  }));

  return { items: datasetsWithAvatar };
};
const getDatasetbyDatasetIdDb = async (id_dataset) => {
  const { rows: dataset } = await client.query(
    `SELECT
    d.Name_dataset,
    d.Avatar,
    COALESCE(dsr.Description, dbr.Description) AS Description,
    STRING_AGG(t.Tag_name, ', ') AS Tags
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
    WHERE
        d.ID_dataset = $1
    GROUP BY
    d.Name_dataset, d.Avatar, dsr.Description, dbr.Description;
    `,
    [id_dataset]
  );
  dataset[0].avatar = await getDatasetAvatar(id_dataset);
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

const roundDownToTwoDecimals = (value) => {
  return Math.floor(value * 100) / 100;
};
const versionBuyingTransactionDb = async (id_user, id_version) => {
  try {
    await client.query("BEGIN");
    const { rows: versionRows } = await client.query(
      `SELECT Price, Stock_percent,
              COALESCE((SELECT ID_seller FROM Data_selling_request WHERE ID_dataset = (SELECT ID_dataset FROM Version WHERE ID_version = $1) LIMIT 1),
                       (SELECT ID_buyer FROM Data_buying_request WHERE ID_dataset = (SELECT ID_dataset FROM Version WHERE ID_version = $1) LIMIT 1)) AS Requester_ID,
              (SELECT Voucher FROM Dataset WHERE ID_dataset = (SELECT ID_dataset FROM Version WHERE ID_version = $1)) AS Voucher
       FROM Version
       WHERE ID_version = $1`,
      [id_version]
    );
    let price = versionRows[0]?.price;
    let stockPercent = versionRows[0]?.stock_percent / 100;
    let requesterId = versionRows[0]?.requester_id;
    let voucher = versionRows[0]?.voucher;

    if (price === undefined || stockPercent === undefined || requesterId === undefined) {
      throw new Error("Version not found or necessary data not defined.");
    }
    // voucher
    price *= (1 - voucher / 100);
    const { rows: userRows } = await client.query(
      `SELECT Kat
       FROM Users
       WHERE ID_user = $1`,
      [id_user]
    );
    let currentKat = userRows[0]?.kat;

    if (currentKat === undefined) {
      throw new Error("User not found.");
    }

     if (currentKat >= price) {
      const { rows: transactionRows } = await client.query(
        `INSERT INTO Transaction (ID_buyer, ID_version)
         VALUES ($1, $2) RETURNING ID_transaction`,
        [id_user, id_version]
      );

      const transactionId = transactionRows[0].id_transaction;

      let remainingKat = currentKat - price;
      await client.query(
        `UPDATE Users
         SET Kat = $1
         WHERE ID_user = $2`,
        [remainingKat, id_user]
      );
      // Markat get 20%
      price *= 0.8
      // requester get 5%
      let requesterReward = price * 0.05
      let distributableAmount = price - requesterReward

      await client.query(
        `UPDATE Users
         SET Kat = Kat + $1
         WHERE ID_user = $2`,
        [requesterReward, requesterId]
      );

      await client.query(
        `INSERT INTO TransactionDetails (ID_transaction, ID_user, ID_version, amount_earned, role)
         VALUES ($1, $2, $3, $4, $5)`,
        [transactionId, requesterId, id_version, requesterReward, 'requester']
       );

      const labeledData = await Data.aggregate([
        { $match: { 'image.ID_version': id_version } },
        { $unwind: '$image.labeled' },
        { $group: {
            _id: '$image.labeled.labeler',
            labelCount: { $sum: 1 }
          }
        }
      ]);

      const totalLabels = labeledData.reduce((sum, user) => sum + user.labelCount, 0);

      const sendData = await Dataset.aggregate([
        { $match: { 'image.ID_version': id_version } },
        { $group: {
            _id: '$image.sender',
            sendCount: { $sum: 1 }
          }
        }
      ]);

      const totalImagesSent = sendData.reduce((sum, sender) => sum + sender.sendCount, 0);
       for (const labeler of labeledData) {
        let rewardForLabeler = roundDownToTwoDecimals((distributableAmount * stockPercent) * (labeler.labelCount / totalLabels));
         await client.query(
          `UPDATE Users
           SET Kat = Kat + $1
           WHERE ID_user = $2`,
          [rewardForLabeler, labeler._id]
        );
        await client.query(
          `INSERT INTO TransactionDetails (ID_transaction, ID_user, ID_version, amount_earned, role)
           VALUES ($1, $2, $3, $4, $5)`,
          [transactionId, labeler._id, id_version, rewardForLabeler, 'labeler']
        );
      }
       for (const sender of sendData) {
        let rewardForSender = roundDownToTwoDecimals((distributableAmount * (1 - stockPercent)) * (sender.sendCount / totalImagesSent));
        await client.query(
          `UPDATE Users
           SET Kat = Kat + $1
           WHERE ID_user = $2`,
          [rewardForSender, sender._id]
        );
        await client.query(
          `INSERT INTO TransactionDetails (ID_transaction, ID_user, ID_version, amount_earned, role)
           VALUES ($1, $2, $3, $4, $5)`,
          [transactionId, sender._id, id_version, rewardForSender, 'sender']
        );
      }

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
  getDatasetAvatar,
  getAllDatasetsDb,
  getDatasetbyDatasetIdDb,
  createDatasetDb,
  getUserOwnedDatasetsDb,
  getUserOwnedDatasetByIdDb,
  getVersionDb,
  versionBuyingTransactionDb,
};
