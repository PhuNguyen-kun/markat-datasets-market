const {Client} = require('pg');
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'markat_db',
    password: '123456',
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
// const connectDb = async () => {
//     try {
//         const res = await client.query('SELECT * from Users');
//         console.log('Connected to the database successfully!', res.rows[0]);
//     } catch (err) {
//         console.error('Failed to connect to the database!', err);
//         process.exit(1);
//     }
// };
module.exports = { 
    connect,
   // connectDb,
    query: (text, params) => client.query(text, params),
    end: () => client.end(),
};
