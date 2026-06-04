/**
 * icons.js - SVG Icon Library for Pormormovi3
 * Minimal flat illustrations for Kuromi & My Melody
 */

const Icons = (() => {
    // Shared Colors (will use CSS vars where possible)
    const colors = {
        kuromi: { main: '#1A1A2E', accent: '#C9B1FF', bow: '#6A0DAD' },
        melody: { main: '#FFD6E0', accent: '#FF8FAB', hood: '#FFD6E0' }
    };

    /**
     * Dual Logo: Kuromi sitting beside My Melody
     */
    const logo = `
        <svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg" class="dual-logo-svg">
            <!-- Kuromi (Left) -->
            <path d="M15 35C15 25 25 20 30 20C35 20 45 25 45 35H15Z" fill="#1A1A2E"/>
            <path d="M15 25L10 15L20 20L15 25Z" fill="#1A1A2E"/>
            <path d="M45 25L50 15L40 20L45 25Z" fill="#1A1A2E"/>
            <circle cx="23" cy="28" r="2" fill="white"/>
            <circle cx="37" cy="28" r="2" fill="white"/>
            <path d="M30 18L26 22H34L30 18Z" fill="#6A0DAD"/> <!-- Bow -->
            
            <!-- My Melody (Right) -->
            <path d="M55 35C55 25 65 20 75 20C85 20 95 25 95 35H55Z" fill="#FFD6E0"/>
            <path d="M60 20C60 10 70 5 70 15V20H60Z" fill="#FFD6E0"/> <!-- Ear 1 -->
            <path d="M90 20C90 10 80 5 80 15V20H90Z" fill="#FFD6E0"/> <!-- Ear 2 -->
            <circle cx="68" cy="28" r="2" fill="#2D2D2D"/>
            <circle cx="82" cy="28" r="2" fill="#2D2D2D"/>
            <path d="M75 18L72 21H78L75 18Z" fill="white"/> <!-- Small flower/heart -->
            
            <!-- Heart between them -->
            <path d="M50 30C50 28 48 26 46 26C44 26 42 28 42 30C42 32 50 36 50 36C50 36 58 32 58 30C58 28 56 26 54 26C52 26 50 28 50 30Z" fill="#FF8FAB"/>
        </svg>
    `;

    const kuromi = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 18C4 14 8 12 12 12C16 12 20 14 20 18H4Z" fill="currentColor"/>
            <path d="M6 12L2 6L8 9L6 12Z" fill="currentColor"/>
            <path d="M18 12L22 6L16 9L18 12Z" fill="currentColor"/>
            <circle cx="9" cy="15" r="1" fill="white"/>
            <circle cx="15" cy="15" r="1" fill="white"/>
        </svg>
    `;

    const melody = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 18C4 14 8 12 12 12C16 12 20 14 20 18H4Z" fill="currentColor"/>
            <path d="M6 10C6 5 10 2 10 8V12H6V10Z" fill="currentColor"/>
            <path d="M18 10C18 5 14 2 14 8V12H18V10Z" fill="currentColor"/>
            <circle cx="9" cy="15" r="1.5" fill="#2D2D2D"/>
            <circle cx="15" cy="15" r="1.5" fill="#2D2D2D"/>
        </svg>
    `;

    const paw = `
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="14" r="5"/>
            <circle cx="7" cy="7" r="2.5"/>
            <circle cx="12" cy="5" r="2.5"/>
            <circle cx="17" cy="7" r="2.5"/>
        </svg>
    `;

    const star = `
        <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
    `;

    return {
        logo,
        kuromi,
        melody,
        paw,
        star
    };
})();

window.Icons = Icons;
