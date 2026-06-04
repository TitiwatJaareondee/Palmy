/**
 * utils.js - Shared Utility Functions for Pormormovi3
 * Updated for Character-Themed UX
 */

const Utils = (() => {
    /**
     * Hash string using SHA-256 via Web Crypto API
     */
    const hashPassword = async (string) => {
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(bytes => bytes.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    /**
     * Format currency (THB default)
     */
    const formatCurrency = (amount, currency = 'THB') => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: currency,
        }).format(amount);
    };

    /**
     * Format date to readable string
     */
    const formatDate = (dateString, options = { dateStyle: 'medium' }) => {
        return new Intl.DateTimeFormat('th-TH', options).format(new Date(dateString));
    };

    /**
     * Toast notification system - Character Themed
     */
    const toast = (message, type = 'success') => {
        const container = document.getElementById('toast-container') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} fade-in`;
        
        // Select mascot based on type
        const iconMarkup = type === 'success' ? Icons.melody : Icons.kuromi;
        
        toast.innerHTML = `
            <div class="toast-icon">${iconMarkup}</div>
            <span class="toast-message">${message}</span>
            <button class="toast-close" style="background:none; border:none; cursor:pointer; font-size:1.2rem; color:inherit; margin-left:auto;">&times;</button>
        `;

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(20px)';
                toast.style.transition = 'all 0.5s ease';
                setTimeout(() => toast.remove(), 500);
            }
        }, 4000);

        toast.querySelector('.toast-close').onclick = () => toast.remove();
    };

    const createToastContainer = () => {
        const container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
        return container;
    };

    return {
        hashPassword,
        formatCurrency,
        formatDate,
        toast
    };
})();

window.Utils = Utils;
