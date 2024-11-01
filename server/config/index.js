const { Client } = require("pg");
const mongoose = require('mongoose');
require("dotenv").config();
const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "markat_db",
  password: process.env.DB_PASSWORD || "123456",
  port: process.env.DB_PORT || 5432,
});
async function connectPostgresDb() {
  try {
    await client.connect();
    console.log("Connected to Postgres database");
  } catch (err) {
    console.log("Connect Postgres database fail with error:", err);
  }
}

async function connectMongoDb() {
    try {
      mongoose.set('strictQuery', true); // Hoặc false tùy theo mục đích
      mongoose.connect(process.env.MONGOURI, { useNewUrlParser: true });
      mongoose.connection.on('error', (error) => console.log(error));
      mongoose.connection.on('open', () => {
          console.log('Connected to MongoDB database.');
      });
    } catch (err) {
        console.log('Connect MongoDB database fail with error:', err);
    }
}

module.exports = {
  connectPostgresDb,
  connectMongoDb,
  query: (text, params) => client.query(text, params),
  end: () => client.end(),
};
