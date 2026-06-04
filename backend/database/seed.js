const db = require('../config/db');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

async function seed() {
  console.log('Starting database seeding...');

  // Read and execute schema
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);

  // Check if admin exists
  const admin = db.prepare('SELECT * FROM users WHERE username = ?').get('admin');

  if (!admin) {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash('admin1234', saltRounds);

    const insertUser = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)');
    const info = insertUser.run('admin', passwordHash, 'admin');
    const userId = info.lastInsertRowid;

    // Create default settings for admin
    const insertSettings = db.prepare('INSERT INTO settings (user_id) VALUES (?)');
    insertSettings.run(userId);

    console.log('Admin user created: admin / admin1234');
  } else {
    console.log('Admin user already exists.');
  }

  console.log('Seeding completed.');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
