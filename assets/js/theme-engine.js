/**
 * theme-engine.js - Logic for Kuromi & My Melody Dual Theme
 */

const ThemeEngine = (() => {
    const THEME_KEY = "kuromi_melody_theme";

    const init = () => {
        const savedTheme = localStorage.getItem(THEME_KEY) || "kuromi";
        setTheme(savedTheme);
    };

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_KEY, theme);
        
        // Sync with DB if possible
        if (window.DB) {
            DB.settings.update({ currentTheme: theme });
        }
        
        // Trigger event for components to re-render if needed
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    };

    const toggle = () => {
        const current = document.documentElement.getAttribute('data-theme') || "kuromi";
        const next = current === "kuromi" ? "melody" : "kuromi";
        setTheme(next);
        return next;
    };

    const getCurrent = () => document.documentElement.getAttribute('data-theme') || "kuromi";

    return {
        init,
        setTheme,
        toggle,
        getCurrent
    };
})();

// Initialize immediately
ThemeEngine.init();
window.ThemeEngine = ThemeEngine;
