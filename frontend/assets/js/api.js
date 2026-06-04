const API_BASE = '/api';

const api = {
  async get(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (res.status === 401) {
      window.location.href = '/index.html';
      return;
    }
    return res.json();
  },

  async post(endpoint, data) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.status === 401 && endpoint !== '/auth/login') {
      window.location.href = '/index.html';
      return;
    }
    return res.json();
  },

  async delete(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, { method: 'DELETE' });
    if (res.status === 401) {
      window.location.href = '/index.html';
      return;
    }
    return res.json();
  }
};
