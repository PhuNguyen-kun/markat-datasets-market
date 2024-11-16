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
        WHEN NOW() BETWEEN v.Create_date AND v.Data_sending_due_date THEN 'Sending'
        WHEN NOW() BETWEEN v.Data_sending_due_date AND v.Data_labeling_due_date THEN 'Labeling'
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

  return { projects : projectsWithUserCounts };
};

const getProjectDetailDb = async (id_version) => {
  try {
    const { rows } = await client.query(
      `
      WITH version_ordered AS (
        SELECT
          v.id_version,
          v.id_dataset,
          ROW_NUMBER() OVER (PARTITION BY v.id_dataset ORDER BY v.id_version)::INTEGER AS version_number,
          d.request_type,
          d.Name_dataset,
          dsr.Expected_price,
          dbr.Deposit,
          dbr.Price,
          CASE
            WHEN NOW() BETWEEN v.Create_date AND v.Data_sending_due_date THEN 100 - v.Stock_percent
            ELSE v.Stock_percent
          END AS adjusted_stock_percent,
          COALESCE(dsr.Data_requirements, dbr.Data_requirements) AS Data_requirements,
          v.Reliability_minimum,
          CASE
            WHEN NOW() BETWEEN v.Create_date AND v.Data_sending_due_date THEN 'sending'
            WHEN NOW() BETWEEN v.Data_sending_due_date AND v.Data_labeling_due_date THEN 'labeling'
            ELSE 'inactive'
          END AS current_status,
          ARRAY_AGG(DISTINCT et.Expertise) AS expert_tags -- Use ARRAY_AGG with DISTINCT to avoid duplicates and return an array
        FROM
          Version v
        JOIN
          Dataset d ON v.id_dataset = d.id_dataset
        LEFT JOIN
          Data_selling_request dsr ON d.id_dataset = dsr.id_dataset
        LEFT JOIN
          Data_buying_request dbr ON d.id_dataset = dbr.id_dataset
        LEFT JOIN
          Version_sender_tag vst ON v.id_version = vst.id_version
        LEFT JOIN
          Version_labeler_tag vlt ON v.id_version = vlt.id_version
        LEFT JOIN
          Expert_Tag et ON et.id_expert_tag = COALESCE(vst.id_expert_tag, vlt.id_expert_tag)
        WHERE
          v.id_dataset = (SELECT id_dataset FROM Version WHERE id_version = $1)
        GROUP BY
          v.id_version, d.id_dataset, d.request_type, d.Name_dataset, dsr.Expected_price, dbr.Deposit, dbr.Price,
          v.Stock_percent, dsr.Data_requirements, dbr.Data_requirements, v.Reliability_minimum,
          v.Create_date, v.Data_sending_due_date, v.Data_labeling_due_date
      ),
      last_version AS (
        SELECT
          v.id_version,
          v.Price AS last_version_price
        FROM
          Version v
        WHERE
          v.id_dataset = (SELECT id_dataset FROM Version WHERE id_version = $1)
          AND v.id_version < $1
        ORDER BY
          v.id_version DESC
        LIMIT 1
      )
      SELECT
        vo.version_number,
        vo.request_type,
        vo.Name_dataset,
        vo.Expected_price,
        vo.Deposit,
        vo.Price,
        vo.adjusted_stock_percent AS Stock_percent,
        vo.Data_requirements,
        vo.Reliability_minimum,
        vo.current_status,
        vo.expert_tags,
        lv.last_version_price
      FROM
        version_ordered vo
      LEFT JOIN
        last_version lv ON lv.id_version < vo.id_version
      WHERE
        vo.id_version = $1;
      `,
      [id_version]
    );

    if (rows.length > 0) {
      const {
        version_number,
        request_type,
        name_dataset,
        expected_price,
        deposit,
        price,
        stock_percent,
        data_requirements,
        reliability_minimum,
        current_status,
        expert_tags,
        last_version_price,
      } = rows[0];

      const result = {
        version_number,
        name_dataset,
        stock_percent,
        data_requirements,
        reliability_minimum,
        expert_tags,
      };

      if (version_number == 1) {
        if (request_type === 'Selling') {
          result.request_category = 'Selling Request';
          result.expected_price = expected_price;
        } else if (request_type === 'Buying') {
          result.request_category = 'Buying Request';
          result.deposit = deposit;
          result.price = price;
        }
      } else {
        // Trả về thông tin bổ sung cho version_number != 1
        result.Last_version_price = last_version_price;
      }

      if (current_status === 'sending') {
        result.stock_percent = 100 - stock_percent; // Return adjusted stock percent for sending
      } else if (current_status === 'labeling') {
        result.stock_percent = stock_percent; // Return original stock percent for labeling
      }

      return result;
    } else {
      return null; // Trả về null nếu không tìm thấy id_version
    }
  } catch (error) {
    console.error('Error fetching project details:', error);
    throw error;
  }
};

module.exports = {
  getAllProjectsDb,
  getProjectDetailDb,
};
