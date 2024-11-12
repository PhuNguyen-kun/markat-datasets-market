const client = require("../config");
const Data = require('../models/data');

const getAllProjectsDb = async ({ limit, offset }) => {
  const projects = await client.query(
    `
    SELECT
      v.ID_version,
      d.Name_dataset,
      v.Stock_percent,
      v.Reliability_minimum,
      TO_CHAR(
        CASE
          WHEN NOW() BETWEEN v.Create_date AND v.Data_sending_due_date THEN v.Data_sending_due_date - NOW()
          WHEN NOW() BETWEEN v.Data_sending_due_date AND v.Data_labeling_due_date THEN v.Data_labeling_due_date - NOW()
        END, 'YYYY-MM-DD HH24:MI:SS'
      ) AS Time,
      CASE
        WHEN NOW() BETWEEN v.Create_date AND v.Data_sending_due_date THEN 'sending'
        WHEN NOW() BETWEEN v.Data_sending_due_date AND v.Data_labeling_due_date THEN 'labeling'
      END AS Status
    FROM
      Version v
    JOIN
      Dataset d ON v.ID_dataset = d.ID_dataset
    WHERE
      (NOW() BETWEEN v.Create_date AND v.Data_sending_due_date)
      OR
      (NOW() BETWEEN v.Data_sending_due_date AND v.Data_labeling_due_date)
    OFFSET $1 LIMIT $2;
    `,
    [offset, limit]
  );

  const projectsWithUserCounts = await Promise.all(
      projects.rows.map(async (project) => {
      const uniqueUsersResult = await Data.aggregate([
        {
          $match: {
            "image.ID_version": project.id_version.toString(),
          }
        },
        {
          $group: {
            _id: null,
            uniqueSenders: { $addToSet: "$image.sender" },
            uniqueLabelers: { $push: "$image.labeled.labeler" }
          }
        },
        {
          $project: {
            totalUniqueUsers: {
              $size: {
                $setUnion: [
                  "$uniqueSenders",
                  { $reduce: {
                      input: "$uniqueLabelers",
                      initialValue: [],
                      in: { $concatArrays: ["$$value", "$$this"] }
                    }
                  }
                ]
              }
            }
          }
        }
      ]);

      const totalUniqueUsers = uniqueUsersResult[0]?.totalUniqueUsers || 0;
      return {
        ...project,
        usersCount: totalUniqueUsers
      };
    })
  );

  return projectsWithUserCounts;
};

module.exports = {
  getAllProjectsDb,
};
