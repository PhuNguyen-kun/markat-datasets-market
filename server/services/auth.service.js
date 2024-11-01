const {
  getUserByEmailDb,
  createUserDb,
  changeUserPasswordDb,
} = require("../db/users.db.js");
const validateUser = require("../helpers/validateUser");
const { ErrorHandler } = require("../helpers/error");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

class AuthService {
  async signUp(user) {
    try {
      const { email, password, full_name } = user;
      if (!email || !password || !full_name) {
        throw new ErrorHandler(401, "all fields required");
      }

      if (validateUser(email, password)) {
        const userByEmail = await getUserByEmailDb(email);
        if (userByEmail) {
          throw new ErrorHandler(401, "email taken already");
        }
        const newUser = await createUserDb(email, password, full_name);
        return {
          user: {
            id_user: newUser.id_user,
            full_name: newUser.full_name,
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

  // async login(email, password) {
  //   try {
  //     const user = await getUserByEmailDb(email);
  //     const { id_user, email: dbEmail, password: dbPassword } = user;
  //     if (password != dbPassword || email != dbEmail) {
  //       throw new ErrorHandler(403, "Email or password incorrect.");
  //     }
  //     return {
  //       user: {
  //         id_user,
  //         password,
  //       },
  //     };
  //   } catch (error) {
  //     throw new ErrorHandler(error.statusCode, error.message);
  //   }
  // }

  async login(email, password) {
    try {
      const user = await getUserByEmailDb(email);
      const { user_id, full_name, email: dbEmail, password: dbPassword } = user;

      if (password !== dbPassword || email !== dbEmail) {
        throw new ErrorHandler(403, "Email or password incorrect.");
      }

      const token = jwt.sign({ userId: user_id }, SECRET_KEY, {
        expiresIn: "1h",
      });

      return {
        user: {
          user_id,
          full_name,
          email,
        },
        token,
      };
    } catch (error) {
      throw new ErrorHandler(error.statusCode, error.message);
    }
  }

  // async forgotPassword(email) {
  //   const user = await getUserByEmailDb(email);
  //   if (user) {
  //     try {
  //       await mail.forgotPasswordMail(fpSalt, email);
  //     } catch (error) {
  //       throw new ErrorHandler(error.statusCode, error.message);
  //     }
  //   } else {
  //     throw new ErrorHandler(400, "Email not found");
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
      const user = await getUserByEmailDb(email);
      if (!user) {
        throw new ErrorHandler(403, "Email incorrect.");
      }
      await changeUserPasswordDb(password, email);
    } catch (error) {
      if (error instanceof ErrorHandler) {
        throw error;
      } else {
        throw new ErrorHandler(500, "Internal Server Error");
      }
    }
  }
}

module.exports = new AuthService();
