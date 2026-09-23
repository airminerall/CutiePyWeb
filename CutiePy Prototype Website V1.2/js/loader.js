(() => {
    const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    function createDots(extraClass = '') {
        const dots = document.createElement('span');
        dots.className = `loading-dots ${extraClass}`.trim();
        dots.setAttribute('aria-label', 'Loading');
        dots.setAttribute('role', 'status');
        dots.innerHTML = '<span></span><span></span><span></span>';
        return dots;
    }

    function setButtonLoading(button) {
        const originalContent = button.innerHTML;
        const originalLabel = button.getAttribute('aria-label');
        const wasDisabled = button.disabled;
        button.disabled = true;
        button.setAttribute('aria-label', 'Loading');
        button.replaceChildren(createDots('loading-dots--button'));
        return () => {
            button.innerHTML = originalContent;
            button.disabled = wasDisabled;
            if (originalLabel === null) button.removeAttribute('aria-label');
            else button.setAttribute('aria-label', originalLabel);
        };
    }

    function typeText(element, text) {
        if (reducedMotion()) {
            element.textContent = text;
            return Promise.resolve();
        }
        return new Promise(resolve => {
            let index = 0;
            const timer = window.setInterval(() => {
                element.textContent += text[index++];
                if (index >= text.length) {
                    window.clearInterval(timer);
                    resolve();
                }
            }, 12);
        });
    }

    function removeOnExit(loader, card) {
        const remove = event => {
            if (event.target !== card) return;
            card.removeEventListener('animationend', remove);
            loader.remove();
        };
        card.addEventListener('animationend', remove);
        loader.classList.add('is-exiting');
        if (reducedMotion()) loader.remove();
    }

    function startFullLoader(loader) {
        const card = loader.querySelector('.site-loader-terminal');
        const command = loader.querySelector('[data-loader-command]');
        const status = loader.querySelector('[data-loader-status]');
        const dots = loader.querySelector('.loading-dots');
        const wordmark = loader.querySelector('.site-loader-wordmark');
        let pageLoaded = document.readyState !== 'loading';
        let typingDone = false;
        let resolved = false;

        const resolve = () => {
            if (!pageLoaded || !typingDone || resolved) return;
            resolved = true;
            loader.classList.add('is-resolved');
            if (reducedMotion()) return removeOnExit(loader, card);
            const exit = event => {
                if (event.target !== wordmark) return;
                wordmark.removeEventListener('animationend', exit);
                removeOnExit(loader, card);
            };
            wordmark.addEventListener('animationend', exit);
        };

        window.addEventListener('DOMContentLoaded', () => {
            pageLoaded = true;
            resolve();
        }, { once: true });

        typeText(command, 'python cutiepy.py')
            .then(() => typeText(status, 'Booting playful workspace...'))
            .then(() => {
                typingDone = true;
                dots.hidden = false;
                resolve();
            });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const loader = document.getElementById('site-loader');
        if (loader?.classList.contains('site-loader--full')) startFullLoader(loader);
    });

    window.CutiePyLoader = { createDots, setButtonLoading };
})();
