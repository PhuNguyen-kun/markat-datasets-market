const client = require("../config");
const Data = require('../models/data');
const fs = require('fs').promises;
const path = require('path');

// Hàm chung để xử lý avatar
const processAvatar = async (collection) => {
  if (collection.avatar && !collection.avatar.startsWith('data:image')) {
    const imagePath = path.join(__dirname, '..', 'Package/Datasets/Avatar', collection.avatar);
    const imageBuffer = await fs.readFile(imagePath);
    collection.avatar = imageBuffer.toString('base64');
  }
  return collection;
};

// Hàm xử lý hoạt động gần đây từ MongoDB
const getRecentActivityFromMongo = async (id_user, versionId) => {
  const recentActivity = await Data.aggregate([
    {
      $match: {
        'image.ID_version': versionId.toString(),
        $or: [
          { 'image.sender': id_user.toString() },
          { 'image.labeled.labeler': id_user.toString() }
        ]
      }
    },
    {
      $unwind: {
        path: '$image.labeled',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        latestLabeling: '$image.labeled.labeling_time',
        latestSending: '$image.sent_time'
      }
    },
    {
      $group: {
        _id: null,
        recentlyUpdated: { $max: { $max: ['$latestLabeling', '$latestSending'] } }
      }
    }
  ]);
  return recentActivity.length > 0 ? recentActivity[0].recentlyUpdated : null;
};

// Lấy tất cả phiên bản công việc
const getAllYourWorkVersionsByUserIdDb = async (id_user) => {
  try {
    const { rows: versions } = await client.query(
      `WITH VersionData AS (
         SELECT
           d.Name_dataset AS dataset_name,
           d.ID_Dataset,
           v.ID_version AS id_version,
           v.Create_Date,
           v.Data_sending_due_date,
           v.Data_labeling_due_date,
           v.Valuation_due_date,
           ROW_NUMBER() OVER (PARTITION BY d.ID_Dataset ORDER BY v.Create_Date) AS version_number
         FROM
           User_Version_Participation uvp
         JOIN
           Version v ON uvp.ID_version = v.ID_version
         JOIN
           Dataset d ON v.ID_Dataset = d.ID_Dataset
         WHERE
           uvp.id_user = $1
       )
       SELECT * FROM VersionData`,
      [id_user]
    );

    for (let version of versions) {
      const mongoRecent = await getRecentActivityFromMongo(id_user, version.id_version);
      const { rows: valuationRows } = await client.query(
        `SELECT MAX(Time_valuation) AS latestValuation
         FROM Valuation
         WHERE ID_user = $1 AND ID_version = $2`,
        [id_user, version.id_version]
      );
      const latestValuation = valuationRows[0]?.latestvaluation;
      version.recently_updated = [mongoRecent, latestValuation].filter(Boolean).sort().pop() || null;
    }

    return { versions };
  } catch (error) {
    console.error('Error retrieving work versions:', error);
    throw error;
  }
};

// Lấy chi tiết phiên bản công việc
const getYourWorkDetailDb = async (id_user, id_version) => {
  try {
    const versionStats = await Data.aggregate([
      {
        $match: {
          'image.ID_version': id_version.toString()
        }
      },
      {
        $group: {
          _id: '$image.ID_version',
          senders: { $addToSet: '$image.sender' },
          labelers: { $addToSet: '$image.labeled.labeler' },
          totalImageSizeMB: {
            $sum: {
              $divide: [{ $multiply: [{ $strLenBytes: '$image.base64Image' }, 3 / 4] }, 1024 * 1024]
            }
          },
          userLabeledCount: {
            $sum: {
              $size: {
                $filter: {
                  input: '$image.labeled',
                  as: 'label',
                  cond: { $eq: ['$$label.labeler', id_user.toString()] }
                }
              }
            }
          },
          userSentCount: {
            $sum: {
              $cond: { if: { $eq: ['$image.sender', id_user.toString()] }, then: 1, else: 0 }
            }
          }
        }
      },
      {
        $project: {
          totalImageSizeMB: 1,
          userLabeledCount: 1,
          userSentCount: 1,
          totalSenders: { $size: '$senders' },
          totalLabelers: { $size: '$labelers' }
        }
      }
    ]);

    return { version: versionStats };
  } catch (error) {
    console.error('Error retrieving version details:', error);
    throw error;
  }
};

// Lấy tất cả bộ sưu tập của người dùng
const getAllCollectionsByUserIdDb = async (id_user) => {
  try {
    const { rows: collections } = await client.query(
      `SELECT
         d.Avatar AS avatar,
         d.Name_dataset AS dataset_name,
         d.ID_Dataset AS id_dataset,
         COALESCE(SUM(td.amount_earned), 0) AS total_amount_received
       FROM Dataset d
       JOIN Version v ON d.ID_Dataset = v.ID_Dataset
       LEFT JOIN TransactionDetails td ON v.ID_version = td.ID_version AND td.ID_user = $1
       WHERE d.ID_Dataset IN (
         SELECT DISTINCT d2.ID_Dataset
         FROM Dataset d2
         JOIN Version v2 ON d2.ID_Dataset = v2.ID_Dataset
         JOIN User_Version_Participation uvp ON v2.ID_version = uvp.ID_version
         WHERE uvp.ID_user = $1
       )
       GROUP BY d.Avatar, d.Name_dataset, d.ID_Dataset`,
      [id_user]
    );

    return { collections: await Promise.all(collections.map(processAvatar)) };
  } catch (error) {
    console.error('Error retrieving collections:', error);
    throw error;
  }
};

const getCollectionDetailDb = async (id_user, id_dataset) => {
  try {
    const { rows: versionDetails } = await client.query(
      `WITH VersionOrder AS (
         SELECT
           v.ID_version AS id_version,
           v.ID_Dataset AS id_dataset, -- Đảm bảo id_dataset được chọn
           ROW_NUMBER() OVER (PARTITION BY v.ID_Dataset ORDER BY v.ID_version ASC) AS version_number
         FROM Version v
       )
       SELECT
         vo.id_version,
         vo.id_dataset, -- Bây giờ bạn có thể tham chiếu id_dataset
         vo.version_number,
         td.transaction_date,
         td.amount_earned AS amount_received,
         td.role
       FROM VersionOrder vo
       LEFT JOIN TransactionDetails td ON vo.id_version = td.ID_version AND td.ID_user = $1
       WHERE vo.id_dataset = $2 -- Sử dụng id_dataset ở đây
       AND td.amount_earned IS NOT NULL
       ORDER BY vo.version_number ASC, td.transaction_date ASC`,
      [id_user, id_dataset]
    );
    return { collection: versionDetails };
  } catch (error) {
    console.error('Error retrieving collection details:', error);
    throw error;
  }
};


module.exports = {
  getAllYourWorkVersionsByUserIdDb,
  getYourWorkDetailDb,
  getAllCollectionsByUserIdDb,
  getCollectionDetailDb,
};
