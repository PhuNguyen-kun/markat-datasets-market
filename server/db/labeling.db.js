const client = require("../config");
const Data = require('../models/dataset');
const getVersionPartsDetailDb = async (id_user, id_version) => {
  try {
    const partsDetails = await Data.aggregate([
      {
        $match: {
          'image.ID_version': id_version.toString() // Filter by version ID
        }
      },
      {
        $group: {
          _id: '$image.ID_part', // Group by part ID
          userLabelCount: {
            $sum: {
              $size: {
                $filter: {
                  input: '$image.labeled',
                  as: 'label',
                  cond: { $eq: ['$$label.labeler', id_user.toString()] } // Count labels by user
                }
              }
            }
          },
          uniqueLabelers: {
            $addToSet: '$image.labeled.labeler' // Collect unique labelers
          }
        }
      },
      {
        $sort: {
          _id: 1 // Sort parts by ID_part in ascending order
        }
      },
      {
        $setWindowFields: {
          sortBy: { _id: 1 },
          output: {
            part_number: { $documentNumber: {} } // Assign sequential numbers starting from 1
          }
        }
      },
      {
        $project: {
          part_number: 1,
          userLabelCount: 1,
          uniqueLabelerCount: { $size: '$uniqueLabelers' } // Count unique labelers
        }
      }
    ]);

    return { items: partsDetails };
  } catch (error) {
    console.error('Error retrieving part details from MongoDB:', error);
    throw error;
  }
};

const getDatasDb = async (id_user, id_part) => {
  try {
    const labeledData = await Data.aggregate([
      {
        $match: {
          'image.ID_part': id_part.toString(),
          $or: [
            { 'image.labeled.labeler': id_user.toString() }, // Data labeled by the user
            { 'image.labeled': { $size: 0 } } // Data not yet labeled
          ]
        }
      },
      {
        $project: {
          base64Image: '$image.base64Image',
          labels: '$labels',
          latestLabelingTime: {
            $cond: {
              if: { $gt: [{ $size: '$image.labeled' }, 0] },
              then: { $arrayElemAt: ['$image.labeled.labeling_time', -1] }, // Get the latest labeling time
              else: null
            }
          }
        }
      },
      {
        $sort: {
          latestLabelingTime: 1 // Sort by labeling time in ascending order; nulls will be sorted last (for not yet labeled)
        }
      }
    ]);

    return labeledData;
  } catch (error) {
    console.error('Error retrieving labeled data:', error);
    throw error;
  }
};

module.exports = {
    getVersionPartsDetailDb,
    getDatasDb,
}