const { Pool } = require('pg');
const path = require('path');
const envConfig = require('dotenv').config({ override: true }).parsed || {};
const dbUrl = envConfig.DATABASE_URL || process.env.DATABASE_URL;

if (dbUrl) {
  console.log('Connecting to PostgreSQL (Supabase)...');
  db = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  const normalize = (sql) => {
    let index = 1;
    return sql.replace(/\?/g, () => `$${index++}`);
  };

  db.getPromise = async (sql, params = []) => {
    const res = await db.query(normalize(sql), params);
    return res.rows[0];
  };

  db.allPromise = async (sql, params = []) => {
    const res = await db.query(normalize(sql), params);
    return res.rows;
  };

  db.preparePromise = async (sql, params = []) => {
    // For Postgres, if we want the ID back, we usually need RETURNING id
    // I've added a check to help with this
    let finalSql = normalize(sql);
    if (finalSql.toLowerCase().startsWith('insert') && !finalSql.toLowerCase().includes('returning')) {
        finalSql += ' RETURNING id';
    }
    const res = await db.query(finalSql, params);
    return { 
        lastID: res.rows[0]?.id || (res.rows[0] ? Object.values(res.rows[0])[0] : null), 
        changes: res.rowCount 
    };
  };

  db.execPromise = async (sql) => {
    await db.query(sql);
  };

} else {
  // --- DEVELOPMENT: SQLite (Local) ---
  // We only require sqlite3 here so it doesn't break Render
  try {
    const sqlite3 = require('sqlite3').verbose();
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
  } catch (e) {
    console.error('SQLite3 not found. Please run npm install sqlite3 for local development.');
    process.exit(1);
  }
}

module.exports = db;
