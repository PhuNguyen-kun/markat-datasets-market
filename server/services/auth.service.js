const {
    getUserByEmailDb,
} = require("../db/users.db.js");
const validateUser = require("../helpers/validateUser");
const { ErrorHandler } = require("../helpers/error");
class AuthService {
  async login(email, password) {
      try {
        const user = await getUserByEmailDb(email);
        const {
          id_user,
          password : dbPassword,
        } = user;
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
  async signUp(user) {
    try {
      const { email,password, username } = user;
      if (!email || !password || !username) {
        throw new ErrorHandler(401, "all fields required");
      }

      if (validateUser(email, password)) {

        const userByEmail = await getUserByEmailDb(email);
        const userByUsername = await getUserByUsernameDb(username);

        if (userByEmail) {
          throw new ErrorHandler(401, "email taken already");
        }

        if (userByUsername) {
          throw new ErrorHandler(401, "username taken already");
        }

        const newUser = await createUserDb({
          email,
          password,
          username,
        });
        return {
          user: {
            user_id: newUser.user_id,
            username: newUser.username,
            email: newUser.email,
          },
        };
      } else {
        throw new ErrorHandler(401, "Input validation error");
      }
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  }
}
module.exports = new AuthService();