const client = require("../config");
const Data = require('../models/dataset');
const fs = require('fs').promises;
const path = require('path');
const getAllYourWorkVersionsByUserIdDb = async (id_user) => {
  try {
    // SQL query to get version details
    const { rows: versions } = await client.query(
      `WITH VersionData AS (
         SELECT
           d.Name_dataset AS Dataset_name,
           d.ID_Dataset,
           v.ID_version AS ID_version,
           v.Create_Date,
           v.Data_sending_time_duration,
           v.Labeling_time_duration,
           v.Valuation_time_duration,
           ROW_NUMBER() OVER (PARTITION BY d.ID_Dataset ORDER BY v.Create_Date) AS Version_number
         FROM
           User_Version_Participation uvp
         JOIN
           Version v ON uvp.ID_version = v.ID_version
         JOIN
           Dataset d ON v.ID_Dataset = d.ID_Dataset
         WHERE
           uvp.id_user = $1
       )
       SELECT *
       FROM VersionData`,
      [id_user]
    );

    for (let version of versions) {
      const recentActivity = await Data.aggregate([
        {
          $match: {
            'image.ID_version': version.id_version.toString(),
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
      const { rows: valuationRows } = await client.query(
        `SELECT MAX(Time_valuation) AS latestValuation
        FROM Valuation
        WHERE ID_user = $1 AND ID_version = $2`,
        [id_user, version.id_version]
      );
      const latestValuation = valuationRows[0]?.latestvaluation;
      const mongoRecent = recentActivity.length > 0 ? recentActivity[0].recentlyUpdated : null;
      version.recently_updated = [mongoRecent, latestValuation].filter(Boolean).sort().pop() || null;
    }


    const uniqueVersions = Object.values(
      versions.reduce((acc, version) => {
        const key = `${version.id_dataset}-${version.id_version}`;
        if (!acc[key]) {
          acc[key] = version;
        }
        return acc;
      }, {})
    );

    return { items: uniqueVersions };
  } catch (error) {
    console.error('Error retrieving unique work versions:', error);
    throw error;
  }
};

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
          labelers: {
            $addToSet: {
              $reduce: {
                input: '$image.labeled.labeler',
                initialValue: [],
                in: { $setUnion: ['$$value', ['$$this']] }
              }
            }
          },
          totalImageSizeMB: {
            $sum: {
              $divide: [{ $multiply: [{ $strLenBytes: '$image.base64Image' }, 3 / 4] }, (1024 * 1024)]
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
          // senders: 1,
          // labelers: { $reduce: { input: '$labelers', initialValue: [], in: { $setUnion: ['$$value', '$$this'] } } },
          totalImageSizeMB: 1,
          userLabeledCount: 1,
          userSentCount: 1,
          totalSenders: { $size: '$senders' },
          totalLabelers: { $size: { $reduce: { input: '$labelers', initialValue: [], in: { $setUnion: ['$$value', '$$this'] } } } }
        }
      }
    ]);

    return { items: versionStats };
  } catch (error) {
    console.error('Error retrieving version statistics from MongoDB:', error);
    throw error;
  }
};




const getAllCollectionsByUserIdDb = async (id_user) => {
  try {
    // SQL query to get collections and total amount received from transactions
    const { rows: collections } = await client.query(
      `SELECT
        d.Avatar AS avatar,
        d.Name_dataset AS dataset_name,
        d.ID_Dataset AS id_dataset,
        COALESCE(SUM(td.amount_earned), 0) AS total_amount_received
      FROM
        Dataset d
      JOIN
        Version v ON d.ID_Dataset = v.ID_Dataset
      LEFT JOIN
        TransactionDetails td ON v.ID_version = td.ID_version AND td.ID_user = $1
      WHERE
        d.ID_Dataset IN (
          SELECT DISTINCT d2.ID_Dataset
          FROM Dataset d2
          JOIN Version v2 ON d2.ID_Dataset = v2.ID_Dataset
          JOIN User_Version_Participation uvp ON v2.ID_version = uvp.ID_version
          WHERE uvp.ID_user = $1
        )
      GROUP BY
        d.Avatar, d.Name_dataset, d.ID_Dataset`,
      [id_user]
    );

    // Query MongoDB for collections owned by the user through sending or labeling
    const mongoCollections = await Dataset.aggregate([
      {
        $match: {
          $or: [
            { 'image.sender': id_user.toString() },
            { 'image.labeled.labeler': id_user.toString() }
          ]
        }
      },
      {
        $group: {
          _id: '$ID_dataset',
          dataset_name: { $first: '$labels' },
          avatar: { $first: '$image.base64Image' }
        }
      }
    ]);

    // Merge MongoDB data with Postgres data
    const mergedCollections = collections.map((collection) => {
      const mongoMatch = mongoCollections.find(m => m._id === collection.id_dataset);
      if (mongoMatch) {
        collection.avatar = mongoMatch.avatar || collection.avatar;
        collection.dataset_name = mongoMatch.dataset_name || collection.dataset_name;
      }
      return collection;
    });

    const processAvatar = async (collections) => {
      return Promise.all(collections.map(async (collection) => {
        if (collection.avatar && !collection.avatar.startsWith('data:image')) {
          const imagePath = path.join(__dirname, '..', 'Package/Datasets/Avatar', collection.avatar);
          const imageBuffer = await fs.readFile(imagePath);
          collection.avatar = imageBuffer.toString('base64');
        }
        return collection;
      }));
    };

    const collectionsWithAvatar = await processAvatar(mergedCollections);
    return { items: collectionsWithAvatar };
  } catch (error) {
    console.error('Error retrieving collections by user:', error);
    throw error;
  }
};

const getCollectionDetailDb = async (id_user, id_dataset) => {
  try {
    const { rows: versionDetails } = await client.query(
      `WITH VersionOrder AS (
         SELECT
           v.ID_version AS id_version,
           v.ID_Dataset,
           ROW_NUMBER() OVER (PARTITION BY v.ID_Dataset ORDER BY v.ID_version ASC) AS version_number
         FROM
           Version v
       )
       SELECT
         vo.id_version,
         vo.version_number,
         td.transaction_date,
         td.amount_earned AS amount_received,
         td.role AS role
       FROM
         VersionOrder vo
       LEFT JOIN
         TransactionDetails td ON vo.id_version = td.ID_version AND td.ID_user = $1
       WHERE
         vo.ID_Dataset = $2
       AND
         td.amount_earned IS NOT NULL
       ORDER BY
         vo.version_number ASC, td.transaction_date ASC`,
      [id_user, id_dataset]
    );
    return { items: versionDetails };
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

