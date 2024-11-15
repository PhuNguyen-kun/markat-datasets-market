const client = require("../config");
const Data = require('../models/data');
const {
  getDatasetAvatar,
  getAllDatasetsDb,
  getDatasetbyDatasetIdDb,
  createDatasetDb,
  getUserOwnedDatasetsDb,
  getUserOwnedDatasetByIdDb,
  getVersionDb,
} = require("../db/datasets.db.js");
const { getKatByIdUserDb } = require("../db/users.db.js");
const { ErrorHandler } = require("../helpers/error");
const roundDownToTwoDecimals = require("../helpers/roundDownToTwoDecimals");

class DatasetService {
  createDataset = async (data) => {
    try {
      return await createDatasetDb(data);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getAllDatasets = async (page) => {
    const limit = 20;
    const offset = (page - 1) * limit;
    try {
      const datasets = await getAllDatasetsDb({ limit, offset });
      const datasetsWithAvatar = await Promise.all(datasets.map(async (dataset) => {
        if (dataset.avatar && dataset.id_dataset) {
          dataset.avatar = await getDatasetAvatar(dataset.id_dataset)
        }
        return dataset;
      }));
      return { datasets: datasetsWithAvatar };
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getDatasetbyDatasetId = async (id_dataset) => {
    try {
      const dataset = await getDatasetbyDatasetIdDb(id_dataset);
      dataset.avatar = await getDatasetAvatar(id_dataset);
      return dataset;
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getUserOwnedDatasets = async (id_user) => {
    try {
      return await getUserOwnedDatasetsDb(id_user);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getUserOwnedDatasetById = async (datasetId) => {
    try {
      return await getUserOwnedDatasetByIdDb(datasetId);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getVersion = async (id_dataset, name_version) => {
    try {
      return await getVersionDb(id_dataset, name_version);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  versionBuyingTransaction = async (id_user, id_version) => {
    try {
      await client.query("BEGIN");

      const { rows: versionRows } = await client.query(
        `
        SELECT Price, Stock_percent,
                COALESCE(
                  (SELECT ID_seller FROM Data_selling_request WHERE ID_dataset = (SELECT ID_dataset FROM Version WHERE ID_version = $1) LIMIT 1),
                  (SELECT ID_buyer FROM Data_buying_request WHERE ID_dataset = (SELECT ID_dataset FROM Version WHERE ID_version = $1) LIMIT 1)
                ) AS Requester_ID,
                (SELECT Voucher FROM Dataset WHERE ID_dataset = (SELECT ID_dataset FROM Version WHERE ID_version = $1)) AS Voucher
        FROM Version
        WHERE ID_version = $1
        `,
        [id_version]
      );

      if (!versionRows || versionRows.length === 0) {
        throw new Error("Version not found or necessary data not defined.");
      }

      let { price, stock_percent: stockPercent, requester_id: requesterId, voucher } = versionRows[0];
      stockPercent /= 100;

      // voucher
      price *= (1 - voucher / 100);

      const userRows = await getKatByIdUserDb(id_user);
      if (!userRows || userRows.length === 0) {
        throw new Error("User not found.");
      }

      let currentKat = userRows;
      console.log(userRows);

      if (currentKat >= price) {
        const { rows: transactionRows } = await client.query(
          `INSERT INTO Transaction (ID_buyer, ID_version) VALUES ($1, $2) RETURNING ID_transaction`,
          [id_user, id_version]
        );

        const transactionId = transactionRows[0].id_transaction;
        let remainingKat = currentKat - price;

        await client.query(
          `UPDATE Users SET Kat = $1 WHERE ID_user = $2`,
          [remainingKat, id_user]
        );

        price *= 0.8; // Markat 20%
        let requesterReward = price * 0.05; // requester 5%
        let distributableAmount = price - requesterReward;

        await client.query(
          `UPDATE Users SET Kat = Kat + $1 WHERE ID_user = $2`,
          [requesterReward, requesterId]
        );

        await client.query(
          `INSERT INTO TransactionDetails (ID_transaction, ID_user, ID_version, amount_earned, role) VALUES ($1, $2, $3, $4, $5)`,
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

        const sendData = await Data.aggregate([
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
        return { remainingKat : remainingKat };
      } else {
        await client.query("ROLLBACK");
        throw new Error("Insufficient balance to make transaction.");
      }
    } catch (error) {
      await client.query("ROLLBACK");
      throw new ErrorHandler(error.statusCode || 500, error.message || "Transaction failed");
    }
  };
}
module.exports = new DatasetService();
