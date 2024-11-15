const client = require("../config");

// Lấy thông tin người dùng theo ID
const getUserByIdDb = async (id) => {
  try {
    const { rows } = await client.query(
      `SELECT
        Full_name AS fullName,
        Email AS email,
        Birth_date AS birthDate,
        Join_date AS joinDate,
        Current_location AS currentLocation,
        Current_company AS currentCompany,
        Primary_language AS primaryLanguage,
        Phone_number AS phoneNumber,
        Desired_Payrate AS desiredPayrate,
        Available_time_per_week AS availableTimePerWeek
      FROM Users
      WHERE ID_User = $1`,
      [id]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Database error while fetching user by ID.");
  }
};

// Lấy thông tin người dùng theo Email
const getUserByEmailDb = async (email) => {
  try {
    const { rows } = await client.query(
      `SELECT
        ID_user AS idUser,
        Password AS password,
        Email AS email
      FROM Users
      WHERE email = $1`,
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Database error while fetching user by email.");
  }
};

const changeUserPasswordDb = async (password, email) => {
  try {
    const { rowCount } = await client.query(
      `UPDATE Users
       SET Password = $1
       WHERE Email = $2`,
      [password, email]
    );

    return rowCount > 0; // Returns true if the password was updated
  } catch (error) {
    console.error("Error updating user password:", error);
    throw new Error("Database error while updating user password.");
  }
};


// Tạo người dùng mới
const createUserDb = async (email, password, full_name) => {
  try {
    const { rows } = await client.query(
      `INSERT INTO Users (
        Full_name,
        Password,
        Reliability,
        Kat,
        Email,
        Join_date,
        ID_Status
      )
      VALUES ($1, $2, $3, $4, $5, NOW(), 1)
      RETURNING ID_user AS idUser, Full_name AS fullName, Email AS email`,
      [full_name, password, 100, 0, email]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Database error while creating user.");
  }
};

// Lấy độ tin cậy của người dùng theo ID
const getUserReliabilityByIdDb = async (id_user) => {
  try {
    const { rows } = await client.query(
      `SELECT
        Reliability AS reliability
      FROM Users
      WHERE ID_user = $1`,
      [id_user]
    );
    return rows[0]?.reliability || null;
  } catch (error) {
    console.error("Error fetching user reliability:", error);
    throw new Error("Database error while fetching user reliability.");
  }
};

// Lấy số Kat của người dùng theo ID
const getKatByIdUserDb = async (id_user) => {
  try {
    const { rows } = await client.query(
      `SELECT
        Kat AS kat
      FROM Users
      WHERE ID_user = $1`,
      [id_user]
    );
    return rows[0]?.kat || null;
  } catch (error) {
    console.error("Error fetching user Kat:", error);
    throw new Error("Database error while fetching user Kat.");
  }
};

module.exports = {
  getUserByIdDb,
  getUserByEmailDb,
  changeUserPasswordDb,
  createUserDb,
  getUserReliabilityByIdDb,
  getKatByIdUserDb,
};
