const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

let db;

if (process.env.DATABASE_URL) {
  console.log('Connecting to PostgreSQL (Supabase)...');
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  // Query helper to normalize ? to $1, $2 for Postgres
  const normalize = (sql, params) => {
    let index = 1;
    return sql.replace(/\?/g, () => `$${index++}`);
  };

  db.getPromise = async (sql, params = []) => {
    const res = await db.query(normalize(sql, params), params);
    return res.rows[0];
  };

  db.allPromise = async (sql, params = []) => {
    const res = await db.query(normalize(sql, params), params);
    return res.rows;
  };

  db.preparePromise = async (sql, params = []) => {
    const res = await db.query(normalize(sql, params), params);
    return { 
        lastID: res.rows[0]?.id || (res.rows[0] ? Object.values(res.rows[0])[0] : null), 
        changes: res.rowCount 
    };
  };

  db.execPromise = async (sql) => {
    await db.query(sql);
  };

} else {
  console.log('Connecting to local SQLite...');
  const dbPath = path.join(__dirname, '../database/shop.db');
  const sqliteDb = new sqlite3.Database(dbPath);

  db = {
    getPromise: (sql, params = []) => new Promise((resolve, reject) => {
      sqliteDb.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
    }),
    allPromise: (sql, params = []) => new Promise((resolve, reject) => {
      sqliteDb.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
    }),
    preparePromise: (sql, params = []) => new Promise((resolve, reject) => {
      sqliteDb.run(sql, params, function(err) {
        err ? reject(err) : resolve({ lastID: this.lastID, changes: this.changes });
      });
    }),
    execPromise: (sql) => new Promise((resolve, reject) => {
      sqliteDb.exec(sql, (err) => err ? reject(err) : resolve());
    })
  };
}

module.exports = db;
