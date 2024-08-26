const {Client} = require('pg');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'markat_db',
    password: 'admin',
    port: 5432,
});
async function connect() {
    try {
        await client.connect();
        console.log("Connected successfully");
    } catch (err) {
        console.log('Connect DB fail with error:',err)
    }
}

module.exports = { 
    connect,
    query: (text, params) => client.query(text, params),
    end: () => client.end(),
};