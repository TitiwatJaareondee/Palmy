const db = require('../config/db');

const getTransactions = (req, res) => {
  const userId = req.user.id;
  const { date } = req.query; // Optional date filter

  try {
    let query = 'SELECT * FROM transactions WHERE user_id = ?';
    const params = [userId];

    if (date) {
      query += ' AND date = ?';
      params.push(date);
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const transactions = db.prepare(query).all(...params);
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const createTransaction = (req, res) => {
  const userId = req.user.id;
  const { app_name, category, selling_price, cost_price, quantity, note, date } = req.body;

  if (!app_name || !category || !date) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const insert = db.prepare(`
      INSERT INTO transactions (user_id, app_name, category, selling_price, cost_price, quantity, note, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(userId, app_name, category, selling_price || 0, cost_price || 0, quantity || 1, note || '', date);
    res.status(201).json({ message: 'Transaction created' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTransaction = (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const result = db.prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?').run(id, userId);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTransactions, createTransaction, deleteTransaction };
