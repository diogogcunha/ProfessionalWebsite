(function () {
    const storageKey = 'theme-preference';
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function getStoredPreference() {
        try {
            return localStorage.getItem(storageKey);
        } catch {
            return null;
        }
    }

    function setStoredPreference(theme) {
        try {
            localStorage.setItem(storageKey, theme);
        } catch {
            // ignore storage failures
        }
    }

    function resolveActiveTheme() {
        const explicit = root.getAttribute('data-theme');
        if (explicit === 'light' || explicit === 'dark') {
            return explicit;
        }
        return mediaQuery.matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        if (theme === 'light' || theme === 'dark') {
            root.setAttribute('data-theme', theme);
        } else {
            root.removeAttribute('data-theme');
        }

        const toggle = document.querySelector('[data-theme-toggle]');
        if (!toggle) {
            return;
        }

        const activeTheme = resolveActiveTheme();
        const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';

        toggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
        toggle.setAttribute('title', `Switch to ${nextTheme} mode`);
        toggle.setAttribute('aria-pressed', activeTheme === 'dark' ? 'true' : 'false');

        const icon = toggle.querySelector('.theme-toggle-icon');
        if (icon) {
            icon.textContent = activeTheme === 'dark' ? '🌙' : '☀️';
        }
    }

    function initializeThemeToggle() {
        const storedPreference = getStoredPreference();
        applyTheme(storedPreference);

        const toggle = document.querySelector('[data-theme-toggle]');
        if (!toggle) {
            return;
        }

        toggle.addEventListener('click', function () {
            const currentTheme = resolveActiveTheme();
            const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setStoredPreference(nextTheme);
            applyTheme(nextTheme);
        });

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', function () {
                if (!getStoredPreference()) {
                    applyTheme(null);
                }
            });
        }
    }

    function initializeAnalyticsTracking() {
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a, button');
            if (!target) return;

            const isButton = target.tagName === 'BUTTON' || target.classList.contains('btn');
            
            if (isButton && typeof gtag === 'function') {
                const buttonText = target.textContent.trim() || target.getAttribute('aria-label') || 'Unknown Button';
                const buttonUrl = target.getAttribute('href') || '';
                const buttonClasses = Array.from(target.classList).join(' ');
                
                gtag('event', 'button_click', {
                    'event_category': 'engagement',
                    'event_label': buttonText,
                    'button_url': buttonUrl,
                    'button_classes': buttonClasses
                });
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initializeThemeToggle();
            initializeAnalyticsTracking();
        });
    } else {
        initializeThemeToggle();
        initializeAnalyticsTracking();
    }
})();
