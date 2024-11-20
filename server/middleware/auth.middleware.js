const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY;
console.log("SECRET_KEY:", SECRET_KEY);

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  console.log("Authorization Header:", req.headers["authorization"]);

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized." });
    }
    req.userId = decoded.id_user;
    next();
  });
};

module.exports = verifyToken;
