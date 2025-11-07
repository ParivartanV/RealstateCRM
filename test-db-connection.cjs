// test-db-connection.cjs
const { Client } = require('pg');
require('dotenv').config();


console.log('DATABASE_URL:', process.env.DATABASE_URL);
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => {
    console.log('✅ Connected to the database!');
    return client.end();
  })
  .catch((err) => {
    console.error('❌ Connection error:', err);
  });
