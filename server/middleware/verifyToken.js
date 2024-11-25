const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Token is missing." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format." });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token." });
      }
      req.id_user = { id_user: decoded.id_user };
      next();
    });
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

module.exports = verifyToken;
