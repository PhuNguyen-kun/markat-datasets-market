const {
  getUserByEmailDb,
  getUserByUsernameDb,
  createUserDb,
  changeUserPasswordDb,
} = require("../db/users.db.js");
const validateUser = require("../helpers/validateUser");
const { ErrorHandler } = require("../helpers/error");

class AuthService {
  async login(email, password) {
    try {
      const user = await getUserByEmailDb(email);
      const { id_user,email : dbEmail, password: dbPassword } = user;
      if (password != dbPassword && email != dbEmail) {
        throw new ErrorHandler(403, "Email or password incorrect.");
      }
      return {
        user: {
          id_user,
          password,
        },
      };
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  }
  async signUp(user) {
    try {
      const { email, password, username } = user;
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
  // async forgotPassword(email) {
  //   try {
  //     const user = await
  //   } catch {

  //   }
  // }
  async resetPassword(password, password2, email) {
    const isValidPassword =
      typeof password === "string" && password.trim().length >= 6;

    if (password !== password2) {
      throw new ErrorHandler(400, "Password do not match.");
    }

    if (!isValidPassword) {
      throw new ErrorHandler(
        400,
        "Password length must be at least 6 characters"
      );
    }

    try {
      await changeUserPasswordDb(password, email);
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  }
}
module.exports = new AuthService();
