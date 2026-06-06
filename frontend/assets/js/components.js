/**
 * components.js - Reusable UI Components
 * Updated for Kuromi & My Melody Dual Theme
 */

const Components = (() => {
    const injectLayout = () => {
        const appContainer = document.querySelector('.app-container');
        if (!appContainer) return;

        const session = JSON.parse(sessionStorage.getItem('kuromi_session'));
        const settings = DB.settings.get();
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        const currentTheme = ThemeEngine.getCurrent();

        // 1. Sidebar
        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        sidebar.innerHTML = `
            <div class="sidebar-header">
                ${Icons.logo}
                <div style="margin-left: 10px;">
                    <h3>${settings.shopName}</h3>
                    <p style="font-size: 0.65rem; color: var(--primary);">SYSTEM ONLINE</p>
                </div>
            </div>
            <ul class="nav-links">
                <li class="nav-item">
                    <a href="dashboard.html" class="nav-link ${currentPage === 'dashboard.html' ? 'active' : ''}">
                        <span class="icon-svg">${currentTheme === 'kuromi' ? Icons.kuromi : Icons.melody}</span> 
                        <span>แดชบอร์ด</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="transactions.html" class="nav-link ${currentPage === 'transactions.html' ? 'active' : ''}">
                        <span class="icon-svg">${Icons.paw}</span> 
                        <span>รายการธุรกรรม</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="reports.html" class="nav-link ${currentPage === 'reports.html' ? 'active' : ''}">
                        <span class="icon-svg">${Icons.star}</span> 
                        <span>รายงานสรุป</span>
                    </a>
                </li>
                <li class="nav-item">
                    <a href="settings.html" class="nav-link ${currentPage === 'settings.html' ? 'active' : ''}">
                        <span class="icon-svg">⚙️</span> 
                        <span>ตั้งค่า</span>
                    </a>
                </li>
            </ul>
        `;

        // 2. Top Nav
        const mainContent = document.querySelector('.main-content');
        const topNav = document.createElement('nav');
        topNav.className = 'top-nav';
        topNav.innerHTML = `
            <div class="page-info">
                <h2 id="page-title">${getPageTitle(currentPage)}</h2>
                <p style="font-size: 0.8rem; color: var(--text-muted);">${Utils.formatDate(new Date(), { dateStyle: 'full' })}</p>
            </div>
            <div class="top-nav-actions">
                <button class="theme-switch" id="global-theme-toggle" title="สลับโหมด">
                    <div class="switch-dot"></div>
                    <span class="switch-label">${currentTheme === 'kuromi' ? '🖤' : '🩷'}</span>
                </button>
                
                <div class="user-control">
                    <div class="user-profile">
                        <div class="user-info">
                            <p class="user-name">${session?.username || 'Admin'}</p>
                            <p class="user-role">ผู้ดูแลระบบ</p>
                        </div>
                        <div class="avatar">${(session?.username?.[0] || 'A').toUpperCase()}</div>
                    </div>
                    <button onclick="Auth.logout()" class="logout-btn" title="ออกจากระบบ">
                        ${Icons.logout || '🚪'}
                    </button>
                </div>
            </div>
        `;

        // 3. Mobile Nav
        const mobileNav = document.createElement('nav');
        mobileNav.className = 'mobile-nav';
        mobileNav.innerHTML = `
            <a href="dashboard.html" class="mobile-nav-item ${currentPage === 'dashboard.html' ? 'active' : ''}">
                <div>🏠</div><div>Home</div>
            </a>
            <a href="transactions.html" class="mobile-nav-item ${currentPage === 'transactions.html' ? 'active' : ''}">
                <div>📝</div><div>Trans.</div>
            </a>
            <a href="reports.html" class="mobile-nav-item ${currentPage === 'reports.html' ? 'active' : ''}">
                <div>📊</div><div>Reports</div>
            </a>
            <a href="settings.html" class="mobile-nav-item ${currentPage === 'settings.html' ? 'active' : ''}">
                <div>⚙️</div><div>Settings</div>
            </a>
        `;

        appContainer.prepend(sidebar);
        mainContent.prepend(topNav);
        document.body.appendChild(mobileNav);

        // FAB for quick add
        if (currentPage !== 'transactions.html') {
            const fab = document.createElement('div');
            fab.className = 'fab';
            fab.innerHTML = '+';
            fab.onclick = () => window.location.href = 'transactions.html';
            document.body.appendChild(fab);
        }

        // Theme Toggle Event
        document.getElementById('global-theme-toggle').onclick = () => {
            const next = ThemeEngine.toggle();
            Utils.toast(`สลับเป็น ${next === 'kuromi' ? 'Kuromi' : 'My Melody'} Mode สำเร็จ!`, 'success');
            setTimeout(() => location.reload(), 500); // Reload to refresh all themed components
        };
    };

    const getPageTitle = (page) => {
        switch(page) {
            case 'dashboard.html': return 'ภาพรวมร้านค้า';
            case 'transactions.html': return 'บันทึกรายรับ-รายจ่าย';
            case 'reports.html': return 'รายงานสรุปผล';
            case 'settings.html': return 'ตั้งค่าระบบ';
            default: return 'หน้าหลัก';
        }
    };

    return {
        injectLayout
    };
})();

window.Components = Components;
