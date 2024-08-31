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
    "SELECT ID_User,First_name,Last_name,Username,Password,Email,Birth_date,Join_date,Current_location,Current_company,Primary_language,Phone_number,Desired_Payrate,Available_time_per_week FROM Users WHERE email = $1",
    [email]
  );
  return user[0];
};

const getUserByPhoneNumberDb = async (phone_number) => {
  const { rows: user } = await client.query(
    "SELECT ID_User,First_name,Last_name,Username,Password,Email,Birth_date,Join_date,Current_location,Current_company,Primary_language,Phone_number,Desired_Payrate,Available_time_per_week FROM Users WHERE phone_number = $1",
    [phone_number]
  );
  return user[0];
};
const changeUserPasswordDb = async (password, email) => {
    return await client.query("UPDATE users SET password = $1 WHERE email = $2", [
      password,
      email,
    ]);
};

module.exports = {
    // getAllUsersDb,
    getUserByIdDb,
    getUserByEmailDb,
    getUserByPhoneNumberDb,
    changeUserPasswordDb,
}