const client = require("../config");
const getAllYourWorkVersionsByIdDb = async (id_user) => {
  const versions = await client.query(
    `SELECT
    d.Name_dataset AS Dataset_Name,
    v.ID_Ver AS Version_ID,
    v.Status,
    AGE(NOW(), v.Create_Date) AS Recently_Updated
    FROM
        Version v
    JOIN
        Dataset d ON v.ID_Dataset = d.ID_Dataset
    JOIN
        Valuation val ON val.ID_ver = v.ID_Ver
    WHERE
        val.ID_user = $1
    ORDER BY
        v.Create_Date DESC;
    `,
    [id_user]
  );
  return { items: versions.rows };
};

module.exports = {
  getAllYourWorkVersionsByIdDb,
};
