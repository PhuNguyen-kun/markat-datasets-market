const client = require("../config");
const Data = require('../models/data');
const {
  getDatasetAvatar,
  getDatasetsByTopicDb,
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
  constructor(name) {
    this.name = name;
    for (const key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (typeof this[key] === "function" && key !== "constructor") {
        this[key] = this[key].bind(this);
      }
    }
  }
  async createDataset(data) {
    try {
      return await createDatasetDb(data);
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || "Failed to create dataset.");
    }
  }

  async getDatasetsByTopic({ offset, limit, topic }) {
    try {
      const datasets = await getDatasetsByTopicDb({ offset, limit, topic });

      await Promise.all(datasets.map(async (dataset) => {
        if (dataset.avatar && dataset.id_dataset) {
          dataset.avatar = await getDatasetAvatar(dataset.id_dataset);
        }
        return dataset;
      }));
      return { datasets };
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || "Failed to fetch datasets.");
    }
  }

  async getDatasetbyDatasetId({ id_dataset }) {
    try {
      const dataset = await getDatasetbyDatasetIdDb(id_dataset);
      if (!dataset) {
        throw new ErrorHandler(404, "Dataset not found.");
      }
      dataset.avatar = await getDatasetAvatar(id_dataset);
      return dataset;
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || "Failed to fetch dataset.");
    }
  }

  async getUserOwnedDatasets({ id_user }) {
    try {
      return await getUserOwnedDatasetsDb(id_user);
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || "Failed to fetch user-owned datasets.");
    }
  }

  async getUserOwnedDatasetById({ datasetId }) {
    try {
      return await getUserOwnedDatasetByIdDb(datasetId);
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || "Failed to fetch user-owned dataset.");
    }
  }

  async getVersion({ id_version }) {
    try {
      return await getVersionDb(id_version);
    } catch (error) {
      throw new ErrorHandler(error.statusCode || 500, error.message || "Failed to fetch version information.");
    }
  }

  async distributeRewards(id_version, distributableAmount, stockPercent, transactionId) {
    const labeledData = await Data.aggregate([
      { $match: { 'image.ID_version': id_version } },
      { $unwind: '$image.labeled' },
      { $group: { _id: '$image.labeled.labeler', labelCount: { $sum: 1 } } },
    ]);

    const sendData = await Data.aggregate([
      { $match: { 'image.ID_version': id_version } },
      { $group: { _id: '$image.sender', sendCount: { $sum: 1 } } },
    ]);

    const totalLabels = labeledData.reduce((sum, user) => sum + user.labelCount, 0);
    const totalImagesSent = sendData.reduce((sum, sender) => sum + sender.sendCount, 0);

    const rewardPromises = [];

    for (const labeler of labeledData) {
      const reward = roundDownToTwoDecimals(
        (distributableAmount * stockPercent) * (labeler.labelCount / totalLabels)
      );
      rewardPromises.push(
        client.query(`UPDATE Users SET Kat = Kat + $1 WHERE ID_user = $2`, [reward, labeler._id]),
        client.query(
          `INSERT INTO TransactionDetails (ID_transaction, ID_user, ID_version, amount_earned, role) VALUES ($1, $2, $3, $4, $5)`,
          [transactionId, labeler._id, id_version, reward, 'labeler']
        )
      );
    }

    for (const sender of sendData) {
      const reward = roundDownToTwoDecimals(
        (distributableAmount * (1 - stockPercent)) * (sender.sendCount / totalImagesSent)
      );
      rewardPromises.push(
        client.query(`UPDATE Users SET Kat = Kat + $1 WHERE ID_user = $2`, [reward, sender._id]),
        client.query(
          `INSERT INTO TransactionDetails (ID_transaction, ID_user, ID_version, amount_earned, role) VALUES ($1, $2, $3, $4, $5)`,
          [transactionId, sender._id, id_version, reward, 'sender']
        )
      );
    }

    await Promise.all(rewardPromises);
  }

  async versionBuyingTransaction({ id_user, id_version }) {
    try {
      await client.query("BEGIN");

      const { rows: versionRows } = await client.query(
        `
        SELECT Price, Stock_percent,
               COALESCE(
                  (SELECT ID_seller FROM Data_selling_request WHERE ID_dataset = (SELECT ID_dataset FROM Version WHERE ID_version = $1) LIMIT 1),
                  (SELECT ID_buyer FROM Data_buying_request WHERE ID_dataset = (SELECT ID_dataset FROM Version WHERE ID_version = $1) LIMIT 1)
               ) AS requester_id,
               (SELECT Voucher FROM Dataset WHERE ID_dataset = (SELECT ID_dataset FROM Version WHERE ID_version = $1)) AS voucher
        FROM Version
        WHERE ID_version = $1
        `,
        [id_version]
      );

      if (!versionRows || versionRows.length === 0) {
        throw new ErrorHandler(404, "Version not found.");
      }

      let { price, stock_percent: stockPercent, requester_id: requesterId, voucher } = versionRows[0];
      stockPercent /= 100;
      price *= (1 - voucher / 100);

      const currentKat = await getKatByIdUserDb(id_user);
      if (currentKat < price) {
        throw new ErrorHandler(400, "Insufficient balance to complete the transaction.");
      }

      const { rows: transactionRows } = await client.query(
        `INSERT INTO Transaction (ID_buyer, ID_version) VALUES ($1, $2) RETURNING ID_transaction`,
        [id_user, id_version]
      );
      const transactionId = transactionRows[0].id_transaction;

      const remainingKat = currentKat - price;
      await client.query(`UPDATE Users SET Kat = $1 WHERE ID_user = $2`, [remainingKat, id_user]);

      price *= 0.8; // Markat keeps 20%
      const requesterReward = roundDownToTwoDecimals(price * 0.05); // Requester gets 5%
      const distributableAmount = price - requesterReward;

      await client.query(`UPDATE Users SET Kat = Kat + $1 WHERE ID_user = $2`, [requesterReward, requesterId]);
      await client.query(
        `INSERT INTO TransactionDetails (ID_transaction, ID_user, ID_version, amount_earned, role) VALUES ($1, $2, $3, $4, $5)`,
        [transactionId, requesterId, id_version, requesterReward, 'requester']
      );

      // Distribute rewards to labelers and senders
      await this.distributeRewards(id_version, distributableAmount, stockPercent, transactionId);

      await client.query("COMMIT");
      return { remainingKat };
    } catch (error) {
      await client.query("ROLLBACK");
      throw new ErrorHandler(error.statusCode || 500, error.message || "Transaction failed.");
    }
  }
}

module.exports = new DatasetService();
