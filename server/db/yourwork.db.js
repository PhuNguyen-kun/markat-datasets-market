const client = require("../config");
const getAllYourWorkVersionsByUserIdDb = async (id_user) => {
  const versions = await client.query(
    `SELECT
    d.Name_dataset AS Dataset_name,
    d.ID_Dataset,
    v.ID_version AS ID_version,
    uvp.Participation_Type,
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
    `,
    [id_user]
  );
  return { items: versions.rows };
};

module.exports = {
  getAllYourWorkVersionsByUserIdDb,
};
