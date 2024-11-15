const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const {
  getUserByEmailDb,
  createUserDb,
  changeUserPasswordDb,
} = require("../db/users.db.js");
const validateUser = require("../helpers/validateUser");
const { ErrorHandler } = require("../helpers/error");

const SECRET_KEY = process.env.SECRET_KEY;

class AuthService {
  async signUp(user) {
    const { email, password, full_name } = user;

    if (!email || !password || !full_name) {
      throw new ErrorHandler(400, "All fields are required.");
    }

    if (!validateUser(email, password)) {
      throw new ErrorHandler(400, "Invalid email or password format.");
    }

    try {
      const userByEmail = await getUserByEmailDb(email);

      if (userByEmail) {
        throw new ErrorHandler(409, "Email is already registered.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await createUserDb(email, hashedPassword, full_name);

      return {
        user: {
          id_user: newUser.id_user,
          full_name: newUser.full_name,
          email: newUser.email,
        },
      };
    } catch (error) {
      console.error("Sign-up error:", error);
      throw new ErrorHandler(error.statusCode || 500, error.message || "Internal server error.");
    }
  }

  async login(email, password) {
    if (!email || !password) {
      throw new ErrorHandler(400, "Email and password are required.");
    }

    try {
      const user = await getUserByEmailDb(email);

      if (!user) {
        throw new ErrorHandler(404, "User not found.");
      }

      //const isPasswordValid = await bcrypt.compare(password, user.password);
      const isPasswordValid = (password == user.password)

      if (!isPasswordValid) {
        throw new ErrorHandler(401, "Invalid email or password.");
      }

      const token = jwt.sign(
        { id_user: user.id_user, full_name: user.full_name, email: user.email },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      return {
        user: {
          id_user: user.id_user,
          full_name: user.full_name,
          email: user.email,
        },
        token,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw new ErrorHandler(error.statusCode || 500, error.message || "Internal server error.");
    }
  }

  async resetPassword(password, password2, email) {
  if (!email || !password || !password2) {
    throw new ErrorHandler(400, "Email, password, and confirmation are required.");
  }

  if (password !== password2) {
    throw new ErrorHandler(400, "Passwords do not match.");
  }

  const isValidPassword = typeof password === "string" && password.trim().length >= 6;

  if (!isValidPassword) {
    throw new ErrorHandler(400, "Password must be at least 6 characters long.");
  }

  try {
    const user = await getUserByEmailDb(email);
    if (!user) {
      throw new ErrorHandler(404, "User not found.");
    }

    const updated = await changeUserPasswordDb(password, email);
    if (!updated) {
      throw new ErrorHandler(500, "Failed to update password.");
    }

    return true;
  } catch (error) {
    console.error("Error in resetPassword service:", error);
    throw new ErrorHandler(error.statusCode || 500, error.message || "Password reset failed.");
  }
}


}

module.exports = new AuthService();
