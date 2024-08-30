const {
    getUserByEmailDb,
} = require("../db/users.db.js");
const { ErrorHandler } = require("../helpers/error");
class AuthService {
  async login(email, password) {
      try {
        //const user = await getUserByPhoneNumberDb(phone_number);
        const user = await getUserByEmailDb(email);
        const {
          id_user,
          password : dbPassword,
        } = user;
        //console.log("user",user);
        if (!user) {
          throw new ErrorHandler(403, "Email or password incorrect.");
        }
        else if (password != dbPassword) {
          throw new ErrorHandler(403, "Email or password incorrect.");
        }
        return {
          user: {
            id_user,
          },
        };
      } catch (error) {
        throw new ErrorHandler(error.statusCode, error.message);
      }
    }
  async
}
module.exports = new AuthService();