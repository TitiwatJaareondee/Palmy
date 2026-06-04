-- Users table
CREATE TABLE IF NOT EXISTS users (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  username     TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role         TEXT DEFAULT 'user',
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login   DATETIME
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER REFERENCES users(id),
  app_name      TEXT NOT NULL,
  category      TEXT NOT NULL,
  selling_price REAL DEFAULT 0,
  cost_price    REAL DEFAULT 0,
  profit        REAL GENERATED ALWAYS AS (selling_price - cost_price) VIRTUAL,
  quantity      INTEGER DEFAULT 1,
  note          TEXT,
  date          DATE NOT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER UNIQUE REFERENCES users(id),
  shop_name   TEXT DEFAULT 'My Shop',
  currency    TEXT DEFAULT 'THB',
  theme       TEXT DEFAULT 'kuromi',
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
