(() => {
    const progressKey = 'cutiepy-page-progress';
    let bar;
    let progress = 0;
    let progressTimer;

    function shouldTrackLink(link, event) {
        const href = link.getAttribute('href');
        return href && !href.startsWith('#') && !link.target && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    }

    function ensureBar() {
        if (bar) return bar;
        bar = document.createElement('div');
        bar.id = 'page-progress';
        bar.setAttribute('aria-hidden', 'true');
        document.body.prepend(bar);
        return bar;
    }

    function setProgress(value) {
        progress = Math.min(value, 0.92);
        ensureBar().style.transform = `scaleX(${progress})`;
    }

    function start() {
        if (progressTimer) return;
        sessionStorage.setItem(progressKey, '1');
        setProgress(0.08);
        requestAnimationFrame(() => setProgress(0.42));
        progressTimer = window.setInterval(() => setProgress(progress + (0.9 - progress) * 0.18), 180);
    }

    function finish() {
        if (!sessionStorage.getItem(progressKey)) return;
        sessionStorage.removeItem(progressKey);
        window.clearInterval(progressTimer);
        progressTimer = undefined;
        const currentBar = ensureBar();
        currentBar.classList.add('is-complete');
        currentBar.style.transform = 'scaleX(1)';
        const remove = event => {
            if (event.propertyName !== 'opacity') return;
            currentBar.removeEventListener('transitionend', remove);
            currentBar.remove();
            bar = undefined;
        };
        currentBar.addEventListener('transitionend', remove);
    }

    function navigate(url, replace = false) {
        start();
        requestAnimationFrame(() => {
            if (replace) window.location.replace(url);
            else window.location.href = url;
        });
    }

    document.addEventListener('pointerdown', event => {
        const link = event.target.closest('a[href]');
        if (link && shouldTrackLink(link, event)) start();
    });

    document.addEventListener('click', event => {
        const link = event.target.closest('a[href]');
        if (link && shouldTrackLink(link, event)) start();
    });

    document.addEventListener('DOMContentLoaded', finish, { once: true });
    window.CutiePyPageProgress = { start, navigate };
})();
