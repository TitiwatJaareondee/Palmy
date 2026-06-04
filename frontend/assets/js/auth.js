/**
 * auth.js - Authentication Management (Backend-driven)
 * Communicates with the Node.js API.
 */

const Auth = (() => {
    const login = async (username, password, rememberMe = false) => {
        const response = await api.post('/auth/login', { username, password });
        
        if (response && response.user) {
            // Success - Backend sets the cookie, but we can store UI info
            sessionStorage.setItem('kuromi_session', JSON.stringify(response.user));
            return true;
        } else {
            throw new Error(response.message || 'Incorrect username or password.');
        }
    };

    const logout = async () => {
        await api.post('/auth/logout');
        sessionStorage.removeItem('kuromi_session');
        window.location.href = 'index.html';
    };

    const checkSession = async () => {
        // In backend mode, we can verify with /api/auth/me
        const response = await api.get('/auth/me');
        if (!response || !response.user) {
            if (!window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/')) {
                window.location.href = 'index.html';
            }
        } else {
            sessionStorage.setItem('kuromi_session', JSON.stringify(response.user));
            if (window.location.pathname.endsWith('index.html')) {
                window.location.href = 'dashboard.html';
            }
        }
    };

    return {
        login,
        logout,
        checkSession
    };
})();

window.Auth = Auth;
