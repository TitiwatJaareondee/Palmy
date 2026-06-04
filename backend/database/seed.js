const db = require('../config/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

const CATEGORIES = ['Game Top-up', 'Food & Drink', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Others'];
const APPS = ['Steam', 'Rov', 'Valorant', 'Grab', '7-Eleven', 'Netflix', 'Spotify', 'Amazon'];

async function seed() {
  console.log('Starting database seeding...');

  try {
    const isPostgres = !!process.env.DATABASE_URL;
    const schemaFile = isPostgres ? 'schema_pg.sql' : 'schema.sql';
    const schemaPath = path.join(__dirname, schemaFile);

    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      await db.execPromise(schema);
      console.log(`Schema (${schemaFile}) applied.`);
    }

    // PostgreSQL uses $1, $2, while SQLite uses ?
    // To keep it simple, I'll use a helper to normalize queries
    const q = (sql) => isPostgres ? sql.replace(/\?/g, (val, i, full) => `$${full.slice(0, i).split('?').length}`) : sql;

    // 1. Create Admin & Users
    const saltRounds = 10;
    const users = [
      { username: 'admin', role: 'admin', password: 'admin1234' },
      { username: 'user1', role: 'user', password: 'user1234' }
    ];

    const userIds = [];

    for (const userData of users) {
      const existing = await db.getPromise(q('SELECT id FROM users WHERE username = ?'), [userData.username]);
      if (!existing) {
        const hash = await bcrypt.hash(userData.password, saltRounds);
        const result = await db.preparePromise(
          q('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?) RETURNING id'),
          [userData.username, hash, userData.role]
        );
        
        const userId = isPostgres ? result.lastID : result.lastID; 
        userIds.push(userId);

        await db.preparePromise(
          q('INSERT INTO settings (user_id, shop_name) VALUES (?, ?)'),
          [userId, `${userData.username}'s Shop`]
        );
        
        console.log(`Created user: ${userData.username} (ID: ${userId})`);
      } else {
        userIds.push(existing.id);
        console.log(`User already exists: ${userData.username} (ID: ${existing.id})`);
      }
    }

    // 2. Generate Transactions
    console.log('Generating dummy transactions...');
    const now = new Date();
    
    for (const userId of userIds) {
      for (let i = 0; i < 15; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const cost = Math.floor(Math.random() * 450) + 50;
        const profit = Math.floor(Math.random() * 90) + 10;
        const selling = cost + profit;

        await db.preparePromise(
          q(`INSERT INTO transactions (user_id, app_name, category, selling_price, cost_price, quantity, date, note)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`),
          [userId, APPS[Math.floor(Math.random()*APPS.length)], CATEGORIES[Math.floor(Math.random()*CATEGORIES.length)], selling, cost, 1, dateStr, 'Seed data']
        );
      }
    }

    console.log('Seeding completed successfully.');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    process.exit(0);
  }
}

seed();
