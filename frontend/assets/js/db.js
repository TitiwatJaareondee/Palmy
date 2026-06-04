/**
 * db.js - Centralized Database Layer for Pormormovi3
 * Handles all localStorage interactions for Users, Transactions, and Settings.
 * 
 * ทุกการเรียกใช้ฐานข้อมูลต้องผ่านไฟล์นี้เท่านั้น
 */

const DB = (() => {
    const KEYS = {
        USERS: "kuromi_users",
        TRANSACTIONS: "kuromi_transactions",
        SETTINGS: "kuromi_settings"
    };

    // --- Helper Methods ---
    const _get = (key) => JSON.parse(localStorage.getItem(key)) || [];
    const _save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    // --- Initialization ---
    const init = () => {
        if (!localStorage.getItem(KEYS.USERS)) {
            _save(KEYS.USERS, []);
        }
        if (!localStorage.getItem(KEYS.TRANSACTIONS)) {
            _save(KEYS.TRANSACTIONS, []);
        }
        if (!localStorage.getItem(KEYS.SETTINGS)) {
            _save(KEYS.SETTINGS, {
                shopName: "Pormormovi3",
                currency: "THB",
                taxRate: 0,
                appPresets: [
                    "Prime vdo", "Monomax", "Hbo max", "Billibilli", "Iqiyi", 
                    "Disney plus hotstar", "Viu", "Wetv", "3 plus+", "OneD", 
                    "Canva", "Youku", "Capcut", "Youtube", "Bugaboo", 
                    "Gagaoolala", "Netflix", "Sportify"
                ],
                darkMode: false,
                currentTheme: "kuromi"
            });
        }
    };

    init();

    return {
        users: {
            getAll: () => _get(KEYS.USERS),
            getById: (id) => _get(KEYS.USERS).find(u => u.id === id),
            getByUsername: (username) => _get(KEYS.USERS).find(u => u.username === username),
            add: (user) => {
                const users = _get(KEYS.USERS);
                user.id = Date.now().toString();
                user.createdAt = new Date().toISOString();
                users.push(user);
                _save(KEYS.USERS, users);
                return user;
            },
            update: (id, updates) => {
                const users = _get(KEYS.USERS);
                const index = users.findIndex(u => u.id === id);
                if (index !== -1) {
                    users[index] = { ...users[index], ...updates };
                    _save(KEYS.USERS, users);
                    return true;
                }
                return false;
            }
        },
        transactions: {
            getAll: () => _get(KEYS.TRANSACTIONS),
            add: (tx) => {
                const transactions = _get(KEYS.TRANSACTIONS);
                tx.id = Date.now().toString();
                tx.profit = (tx.sellingPrice * tx.quantity) - (tx.costPrice * tx.quantity);
                tx.date = tx.date || new Date().toISOString();
                transactions.push(tx);
                _save(KEYS.TRANSACTIONS, transactions);
                return tx;
            },
            delete: (id) => {
                const transactions = _get(KEYS.TRANSACTIONS);
                const filtered = transactions.filter(t => t.id !== id);
                _save(KEYS.TRANSACTIONS, filtered);
            },
            clearAll: () => _save(KEYS.TRANSACTIONS, [])
        },
        settings: {
            get: () => JSON.parse(localStorage.getItem(KEYS.SETTINGS)),
            update: (updates) => {
                const settings = JSON.parse(localStorage.getItem(KEYS.SETTINGS));
                const newSettings = { ...settings, ...updates };
                _save(KEYS.SETTINGS, newSettings);
                return newSettings;
            }
        }
    };
})();

// Export for ES Modules or make global if not using modules
window.DB = DB;
