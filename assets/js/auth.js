/**
 * auth.js - Authentication & Security Management
 * Handles login, session, and rate limiting.
 */

const Auth = (() => {
    const LOCK_TIME = 5 * 60 * 1000; // 5 minutes
    const MAX_ATTEMPTS = 5;

    const _getSession = () => JSON.parse(sessionStorage.getItem('kuromi_session'));
    const _getRememberToken = () => localStorage.getItem('kuromi_remember_token');

    /**
     * Create a default admin if no users exist (for first-time setup)
     */
    const ensureAdmin = async () => {
        const users = DB.users.getAll();
        if (users.length === 0) {
            const hash = await Utils.hashPassword('admin123'); // Default password
            DB.users.add({
                username: 'admin',
                passwordHash: hash,
                role: 'admin'
            });
            console.log('Default admin created: admin / admin123');
        }
    };

    /**
     * Login logic
     */
    const login = async (username, password, rememberMe = false) => {
        // Rate limiting check
        const attempts = JSON.parse(localStorage.getItem('login_attempts') || '{"count":0, "lockedUntil":0}');
        if (Date.now() < attempts.lockedUntil) {
            const remaining = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
            throw new Error(`Account locked. Try again in ${remaining} minutes.`);
        }

        const user = DB.users.getByUsername(username);
        const inputHash = await Utils.hashPassword(password);

        if (user && user.passwordHash === inputHash) {
            // Success
            const session = {
                userId: user.id,
                username: user.username,
                token: btoa(Math.random().toString()),
                expiry: Date.now() + (24 * 60 * 60 * 1000) // 24h
            };
            sessionStorage.setItem('kuromi_session', JSON.stringify(session));
            
            if (rememberMe) {
                localStorage.setItem('kuromi_remember_token', session.token);
            }

            localStorage.setItem('login_attempts', JSON.stringify({count: 0, lockedUntil: 0}));
            return true;
        } else {
            // Fail
            attempts.count++;
            if (attempts.count >= MAX_ATTEMPTS) {
                attempts.lockedUntil = Date.now() + LOCK_TIME;
            }
            localStorage.setItem('login_attempts', JSON.stringify(attempts));
            throw new Error('Incorrect username or password.');
        }
    };

    const logout = () => {
        sessionStorage.removeItem('kuromi_session');
        localStorage.removeItem('kuromi_remember_token');
        window.location.href = 'index.html';
    };

    const checkSession = () => {
        const session = _getSession();
        if (!session) {
            const token = _getRememberToken();
            if (token && window.location.pathname.includes('index.html')) {
                // Potential auto-login logic could go here if token validation existed
            }
            
            if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
                window.location.href = 'index.html';
            }
        } else if (Date.now() > session.expiry) {
            logout();
        }
    };

    return {
        login,
        logout,
        checkSession,
        ensureAdmin
    };
})();

window.Auth = Auth;
Auth.ensureAdmin(); // Run on load
