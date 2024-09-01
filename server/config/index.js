const { Client } = require("pg");
require("dotenv").config();
const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "markat_db",
  password: process.env.DB_PASSWORD || "123456",
  port: process.env.DB_PORT || 5432,
});
async function connect() {
  try {
    await client.connect();
    console.log("Connected successfully");
  } catch (err) {
    console.log("Connect DB fail with error:", err);
  }
}

module.exports = {
  connect,
  query: (text, params) => client.query(text, params),
  end: () => client.end(),
};
