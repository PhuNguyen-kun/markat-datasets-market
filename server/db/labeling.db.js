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
          'image.ID_part': id_part.toString() // Filter by part ID
        }
      },
      {
        $project: {
          base64Image: '$image.base64Image',
          labels: '$labels',
          label: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: '$image.labeled',
                        as: 'label',
                        cond: { $eq: ['$$label.labeler', id_user.toString()] }
                      }
                    }
                  },
                  0
                ]
              },
              then: {
                $arrayElemAt: [
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: '$image.labeled',
                          as: 'label',
                          cond: { $eq: ['$$label.labeler', id_user.toString()] }
                        }
                      },
                      as: 'userLabel',
                      in: '$$userLabel.label' // Get the specific label assigned by the user
                    }
                  },
                  -1
                ]
              },
              else: null // Return null if no labels have been assigned by the user
            }
          },
          labelingTime: {
            $cond: {
              if: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: '$image.labeled',
                        as: 'label',
                        cond: { $eq: ['$$label.labeler', id_user.toString()] }
                      }
                    }
                  },
                  0
                ]
              },
              then: {
                $arrayElemAt: [
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: '$image.labeled',
                          as: 'label',
                          cond: { $eq: ['$$label.labeler', id_user.toString()] }
                        }
                      },
                      as: 'userLabel',
                      in: '$$userLabel.labeling_time'
                    }
                  },
                  -1
                ]
              },
              else: null // Return null for unlabeled images
            }
          }
        }
      },
      {
        $addFields: {
          isNullLabelingTime: { $cond: { if: { $eq: ['$labelingTime', null] }, then: 1, else: 0 } } // Add field to indicate null labelingTime
        }
      },
      {
        $sort: {
          isNullLabelingTime: 1, // Sort by whether labelingTime is null (non-null first)
          labelingTime: 1 // Sort by labeling time in ascending order
        }
      },
      {
        $project: {
          base64Image: 1,
          labels: 1,
          label: 1, // Include the label field in the final output
          labelingTime: 1 // Exclude isNullLabelingTime from the final output
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