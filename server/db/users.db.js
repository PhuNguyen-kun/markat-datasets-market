const client = require("../config");

const getUserByIdDb = async (id) => {
  const { rows: users } = await client.query(
    "SELECT Full_name,Email,Birth_date,Join_date,Current_location,Current_company,Primary_language,Phone_number,Desired_Payrate,Available_time_per_week FROM Users WHERE ID_User = $1",
    [id]
  );
  //console.log(id);
  return users[0];
};

const getUserByEmailDb = async (email) => {
  const { rows: users } = await client.query(
    "SELECT ID_user, Full_name,Password,Email,Birth_date,Join_date,Current_location,Current_company,Primary_language,Phone_number,Desired_Payrate,Available_time_per_week FROM Users WHERE email = $1",
    [email]
  );
  return users[0];
};

const getUserByUsernameDb = async (username) => {
  const { rows: users } = await client.query(
    "SELECT Full_name,Email,Birth_date,Join_date,Current_location,Current_company,Primary_language,Phone_number,Desired_Payrate,Available_time_per_week FROM Users WHERE username = $1",
    [username]
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

const createUserDb = async (email, password, username) => {
  const { rows: users } = await client.query(
    "Them user moi tu data returning ",
    [email, password, username]
  );
  return users[0];
};

module.exports = {
  getUserByIdDb,
  getUserByEmailDb,
  getUserByUsernameDb,
  changeUserPasswordDb,
  createUserDb,
};
