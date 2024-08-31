const client = require("../config");

const getUserByIdDb = async (id) => {
    const { rows: user } = await client.query(
      "SELECT First_name,Last_name,Email,Birth_date,Join_date,Current_location,Current_company,Primary_language,Phone_number,Desired_Payrate,Available_time_per_week FROM Users WHERE ID_User = $1",
      [id]
    );
    return user[0];
};

const getUserByEmailDb = async (email) => {
  const { rows: user } = await client.query(
    "SELECT First_name,Last_name,Email,Birth_date,Join_date,Current_location,Current_company,Primary_language,Phone_number,Desired_Payrate,Available_time_per_week FROM Users WHERE email = $1",
    [email]
  );
  return user[0];
};

const getUserByUsernameDb = async (username) => {
  const { rows: user } = await client.query(
    "SELECT First_name,Last_name,Email,Birth_date,Join_date,Current_location,Current_company,Primary_language,Phone_number,Desired_Payrate,Available_time_per_week FROM Users WHERE username = $1",
    [username]
  );
  return user[0];
};
const changeUserPasswordDb = async (password, email) => {
    return await client.query("UPDATE users SET password = $1 WHERE email = $2", [
      password,
      email,
    ]);
};
const createUserDb = async (email,password,username) => {
  const {rows : user} = await client.query(
    "Them user moi tu data returning ", [
      email,password,username
  ]);
}
module.exports = {
    // getAllUsersDb,
    getUserByIdDb,
    getUserByEmailDb,
    getUserByUsernameDb,
    changeUserPasswordDb,
    createUserDb,
}