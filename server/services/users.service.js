const {
  getUserByIdDb,
  changeUserPasswordDb,
  getUserReliabilityByIdDb,
  getKatByIdUserDb,
} = require("../db/users.db.js");
const { ErrorHandler } = require("../helpers/error");

class UsersService {
  getUserById = async (userId) => {
    try {
      return await getUserByIdDb(userId);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  changeUserPassword = async (password, email) => {
    try {
      return await changeUserPasswordDb(password, email);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getUserReliabilitybyId = async (id_user) => {
    try {
      return await getUserReliabilityByIdDb(id_user);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
  getUserKatbyId = async (id_user) => {
    try {
      return await getKatByIdUserDb(id_user);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  };
}

module.exports = new UsersService();
