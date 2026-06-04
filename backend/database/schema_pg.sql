-- Users table
CREATE TABLE IF NOT EXISTS users (
  id           SERIAL PRIMARY KEY,
  username     TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role         TEXT DEFAULT 'user',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login   TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER REFERENCES users(id),
  app_name      TEXT NOT NULL,
  category      TEXT NOT NULL,
  selling_price REAL DEFAULT 0,
  cost_price    REAL DEFAULT 0,
  quantity      INTEGER DEFAULT 1,
  note          TEXT,
  date          DATE NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: Profit in Postgres is better calculated in a VIEW or during SELECT
-- since VIRTUAL columns syntax is slightly different.

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER UNIQUE REFERENCES users(id),
  shop_name   TEXT DEFAULT 'My Shop',
  currency    TEXT DEFAULT 'THB',
  theme       TEXT DEFAULT 'kuromi',
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
