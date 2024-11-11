const client = require("../config");
const mongoose = require('mongoose');
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
                      in: '$$userLabel.label'
                    }
                  },
                  -1
                ]
              },
              else: null
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
              else: null
            }
          }
        }
      },
      {
        $addFields: {
          isNullLabelingTime: { $cond: { if: { $eq: ['$labelingTime', null] }, then: 1, else: 0 } }
        }
      },
      {
        $sort: {
          isNullLabelingTime: 1,
          labelingTime: 1
        }
      },
      {
        $project: {
          base64Image: 1,
          labels: 1,
          label: 1,
          labelingTime: 1
        }
      }
    ]);

    return labeledData;
  } catch (error) {
    console.error('Error retrieving labeled data:', error);
    throw error;
  }
};

const getRandomTimeBetween = (start, end) => {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const randomTime = new Date(startDate + Math.random() * (endDate - startDate));
  return randomTime.toISOString().replace('T', ' ').substring(0, 19);
};

async function labelDataDb(id_data, id_labeler, label) {
  try {
    const objectId = mongoose.Types.ObjectId(id_data);
    const data = await Data.findOne({ _id: objectId });

    if (data && data.image) {
      data.image.labeled.push({
        labeler : id_labeler,
        label : label,
        labeling_time: getRandomTimeBetween('2024-07-10 01:56:57', '2024-07-11 21:37:19'),
        // labeling_time: new Date().toISOString(), // Lấy thời gian hiện tại
      });
      //console.log(data);

      await data.save();
      return { message: 'Label added successfully' };
    }
  } catch (error) {
    console.error('Error', error);
    throw error;
  }
}

module.exports = {
  getVersionPartsDetailDb,
  getDatasDb,
  labelDataDb
}