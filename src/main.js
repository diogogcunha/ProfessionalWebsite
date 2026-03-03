document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.service-item');
    const panels = document.querySelectorAll('.service-content');
    const caseStudiesGrid = document.querySelector('.case-studies-grid');
    const caseStudiesPrev = document.querySelector('[data-case-nav="prev"]');
    const caseStudiesNext = document.querySelector('[data-case-nav="next"]');
    const caseStudiesDots = document.querySelector('[data-case-dots]');

    function activateTab(tab) {
        tabs.forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
            t.setAttribute('tabindex', '-1');
        });
        panels.forEach(p => {
            p.classList.remove('active');
            p.setAttribute('hidden', 'hidden');
        });

        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        tab.setAttribute('tabindex', '0');

        const targetId = tab.getAttribute('aria-controls');
        const activePanel = document.getElementById(targetId);
        if (activePanel) {
            activePanel.classList.add('active');
            activePanel.removeAttribute('hidden');
        }
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => activateTab(tab));

        tab.addEventListener('keydown', (event) => {
            if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
            event.preventDefault();

            let nextIndex = index;
            if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
            if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
            if (event.key === 'Home') nextIndex = 0;
            if (event.key === 'End') nextIndex = tabs.length - 1;

            tabs[nextIndex].focus();
            activateTab(tabs[nextIndex]);
        });
    });

    if (caseStudiesGrid && window.matchMedia('(hover: hover)').matches) {
        const edgeRatio = 0.28;
        const scrollSpeed = 0.8;
        let direction = 0;
        let rafId = null;

        const scrollStep = () => {
            if (!direction) {
                rafId = null;
                return;
            }
            caseStudiesGrid.scrollLeft += direction * scrollSpeed;
            rafId = window.requestAnimationFrame(scrollStep);
        };

        const updateDirection = (nextDirection) => {
            if (direction === nextDirection) return;
            direction = nextDirection;
            if (direction !== 0 && rafId === null) {
                rafId = window.requestAnimationFrame(scrollStep);
            }
        };

        caseStudiesGrid.addEventListener('mousemove', (event) => {
            const rect = caseStudiesGrid.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const edgeZone = rect.width * edgeRatio;

            if (x < edgeZone) {
                updateDirection(-1);
                return;
            }
            if (x > rect.width - edgeZone) {
                updateDirection(1);
                return;
            }
            updateDirection(0);
        });

        caseStudiesGrid.addEventListener('mouseleave', () => updateDirection(0));
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) updateDirection(0);
        });
        window.addEventListener('blur', () => updateDirection(0));
    }

    if (caseStudiesGrid && caseStudiesPrev && caseStudiesNext && caseStudiesDots) {
        const caseCards = Array.from(caseStudiesGrid.querySelectorAll('.case-card'));

        caseCards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'case-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Go to case study ${index + 1}`);
            dot.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
            dot.setAttribute('tabindex', index === 0 ? '0' : '-1');
            dot.dataset.caseIndex = index;
            caseStudiesDots.appendChild(dot);
        });

        const caseDots = Array.from(caseStudiesDots.querySelectorAll('.case-dot'));

        const getCardStep = () => {
            const firstCard = caseCards[0];
            if (!firstCard) return caseStudiesGrid.clientWidth;
            const computedStyles = window.getComputedStyle(caseStudiesGrid);
            const gap = Number.parseFloat(computedStyles.columnGap || computedStyles.gap || '0') || 0;
            return firstCard.getBoundingClientRect().width + gap;
        };

        const getClosestCardIndex = () => {
            let activeIndex = 0;
            let smallestDistance = Number.POSITIVE_INFINITY;

            caseCards.forEach((card, index) => {
                const distance = Math.abs(caseStudiesGrid.scrollLeft - card.offsetLeft);
                if (distance < smallestDistance) {
                    smallestDistance = distance;
                    activeIndex = index;
                }
            });

            return activeIndex;
        };

        const updateCaseStudyControls = () => {
            const maxScrollLeft = caseStudiesGrid.scrollWidth - caseStudiesGrid.clientWidth;
            caseStudiesPrev.disabled = caseStudiesGrid.scrollLeft <= 2;
            caseStudiesNext.disabled = caseStudiesGrid.scrollLeft >= maxScrollLeft - 2;

            const activeIndex = getClosestCardIndex();
            caseDots.forEach((dot, index) => {
                const isActive = index === activeIndex;
                dot.classList.toggle('active', isActive);
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
                dot.setAttribute('tabindex', isActive ? '0' : '-1');
            });
        };

        const scrollByStep = (direction) => {
            const amount = getCardStep() * direction;
            caseStudiesGrid.scrollBy({ left: amount, behavior: 'smooth' });
        };

        caseStudiesPrev.addEventListener('click', () => scrollByStep(-1));
        caseStudiesNext.addEventListener('click', () => scrollByStep(1));

        caseDots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const index = Number.parseInt(dot.dataset.caseIndex || '0', 10);
                const targetCard = caseCards[index];
                if (!targetCard) return;
                caseStudiesGrid.scrollTo({ left: targetCard.offsetLeft, behavior: 'smooth' });
            });
        });

        caseStudiesGrid.addEventListener('scroll', updateCaseStudyControls, { passive: true });
        window.addEventListener('resize', updateCaseStudyControls);
        updateCaseStudyControls();
    }

    // Analytics: track button and CTA clicks
    document.addEventListener('click', function (e) {
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
});
