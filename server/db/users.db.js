const client = require("../config");

const getUserByIdDb = async (id) => {
  const { rows: users } = await client.query(
    "SELECT Full_name,Email,Birth_date,Join_date,Current_location,Current_company,Primary_language,Phone_number,Desired_Payrate,Available_time_per_week FROM Users WHERE ID_User = $1",
    [id]
  );
  return users[0];
};

const getUserByEmailDb = async (email) => {
  const { rows: users } = await client.query(
    "SELECT ID_user,Password,Email FROM Users WHERE email = $1",
    [email]
  );
  return users[0];
};

const changeUserPasswordDb = async (password, email) => {
  const { rows: users } = await client.query(
    "UPDATE users SET password = $1 WHERE email = $2",
    [password, email]
  );
  return users[0];
};

const createUserDb = async (email, password, full_name) => {
  const { rows: users } = await client.query(
    `INSERT INTO Users (Full_name, Password, Reliability, Kat, Email, Join_date, ID_Status)
      VALUES ($1, $2, $3, $4, $5, NOW(), 1)
      RETURNING ID_user, Full_name, Email`,
    [full_name, password, 100, 0, email]
  );
  return users[0];
};

const getUserReliabilitybyIdDb = async (ID_user) => {
  const { rows: reliability } = await client.query(
    "SELECT Reliability FROM Users WHERE ID_user = $1",
    [ID_user]
  );
  return reliability[0];
};

const getKatByIdUserDb = async (ID_user) => {
  const { rows: kat } = await client.query(
    `
    SELECT Kat FROM Users WHERE ID_user = $1
    `,
    [ID_user]
  );
  return kat[0];
}
module.exports = {
  getUserByIdDb,
  getUserByEmailDb,
  changeUserPasswordDb,
  createUserDb,
  getUserReliabilitybyIdDb,
  getKatByIdUserDb,
};
