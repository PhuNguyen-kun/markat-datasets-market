const pool = require("../config");

const getUserByIdDb = async (id) => {
    const { rows: user } = await pool.query(
      "SELECT ID_User,First_name,Last_name,Username,Password,Email,Birth_date,Join_date,Current_location,Current_company,Primary_language,Phone_number,Desired_Payrate,Available_time_per_week FROM Users WHERE ID_User = $1",
      [id]
    );
    return user[0];
};


const changeUserPasswordDb = async (password, email) => {
    return await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
      password,
      email,
    ]);
};

module.exports = {
    // getAllUsersDb,
    getUserByIdDb,
    changeUserPasswordDb,
}