const {
    getUserByEmailDb,
    getUserByPhoneNumberDb,
} = require("../db/users.db.js");
const { ErrorHandler } = require("../helpers/error");
class AuthService {
  async login(phone_number, password) {
      try {
        //const user = await getUserByPhoneNumberDb(phone_number);
        const user = await getUserByPhoneNumberDb("123-456-7890");
        console.log(phone_number);
        const {
          id_user,
          username,
        } = user;
        return {
          user: {
            id_user,
            username,
          },
        };
      } catch (error) {
        throw new ErrorHandler(error.statusCode, error.message);
      }
    }
}
module.exports = new AuthService();