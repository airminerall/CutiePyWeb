const accountStorageKey = 'cutiepy-account';
const accountsStorageKey = 'cutiepy-accounts';
const sessionStorageKey = 'cutiepy-session';
const queryMode = new URLSearchParams(window.location.search).get('mode');
let authMode = queryMode === 'signup' ? 'signup' : 'login';

const form          = document.getElementById('auth-form');
const nameField     = document.getElementById('name-field');
const nameInput     = document.getElementById('auth-name');
const emailInput    = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const message       = document.getElementById('auth-message');
const submitButton  = document.getElementById('submit-button');
const loginTab      = document.getElementById('login-tab');
const signupTab     = document.getElementById('signup-tab');
const rememberRow   = document.getElementById('remember-row');
const rememberMe    = document.getElementById('remember-me');

function setMessage(text, type = '') {
    message.textContent = text;
    message.className = `auth-message${type ? ` is-${type}` : ''}`;
}

function getAccounts() {
    const accounts = JSON.parse(localStorage.getItem(accountsStorageKey) || '{}');
    if (Object.keys(accounts).length) return accounts;
    const legacyAccount = JSON.parse(localStorage.getItem(accountStorageKey) || 'null');
    if (!legacyAccount?.email) return accounts;
    accounts[legacyAccount.email.toLowerCase()] = legacyAccount;
    localStorage.setItem(accountsStorageKey, JSON.stringify(accounts));
    return accounts;
}

function setAuthMode(mode) {
    authMode = mode;
    const isSignup = mode === 'signup';

    nameField.classList.toggle('is-hidden', !isSignup);
    nameInput.required = isSignup;
    passwordInput.autocomplete = isSignup ? 'new-password' : 'current-password';
    submitButton.textContent = isSignup ? 'Create Account' : 'Sign In';

    // Created By 1820252173 Stanly Lukmana - 3 September 2026
    rememberRow.style.display = isSignup ? 'none' : 'flex';

    loginTab.classList.toggle('is-active', !isSignup);
    loginTab.setAttribute('aria-selected', String(!isSignup));
    signupTab.classList.toggle('is-active', isSignup);
    signupTab.setAttribute('aria-selected', String(isSignup));

    setMessage('');
}

loginTab.addEventListener('click',  () => setAuthMode('login'));
signupTab.addEventListener('click', () => setAuthMode('signup'));

// Created By 1820252173 Stanly Lukmana - 3 September 2026
[loginTab, signupTab].forEach(tab => {
    tab.addEventListener('click', () => {
        tab.animate(
            [{ transform: 'scale(1)' }, { transform: 'scale(0.94)' }, { transform: 'scale(1)' }],
            { duration: 220, easing: 'ease' }
        );
    });
});

// Created By 1820252173 Stanly Lukmana - 3 September 2026
function shakePanel() {
    const panel = document.querySelector('.auth-panel');
    panel.animate(
        [
            { transform: 'translateX(0)' },
            { transform: 'translateX(-6px)' },
            { transform: 'translateX(6px)' },
            { transform: 'translateX(-4px)' },
            { transform: 'translateX(4px)' },
            { transform: 'translateX(0)' }
        ],
        { duration: 360, easing: 'ease' }
    );
}

form.addEventListener('submit', event => {
    event.preventDefault();

    const email    = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const name     = nameInput.value.trim();
    const accounts = getAccounts();
    const account = accounts[email];
    const remember = rememberMe.checked;

    if (authMode === 'signup') {
        if (account && account.email === email) {
            setMessage('An account with this email already exists.', 'error');
            shakePanel();
            return;
        }
        accounts[email] = { email, password, name };
        localStorage.setItem(accountsStorageKey, JSON.stringify(accounts));
        passwordInput.value = '';
        setAuthMode('login');
        setMessage('Account created. Please sign in to continue.', 'success');
        return;
    }

    if (!account) {
        setMessage('No account found. Please register first.', 'error');
        shakePanel();
        return;
    }
    if (account.email !== email || account.password !== password) {
        setMessage('Incorrect email or password.', 'error');
        shakePanel();
        return;
    }

    const userData = { name: account.name, email: account.email };

    // Created By 1820252173 Stanly Lukmana - 3 September 2026
    if (remember) {
        localStorage.setItem(sessionStorageKey, JSON.stringify(userData));
    } else {
        // Created By 1820252173 Stanly Lukmana - 3 September 2026
        sessionStorage.setItem(sessionStorageKey, JSON.stringify(userData));
        localStorage.removeItem(sessionStorageKey);
    }

    // Created By 1820252173 Stanly Lukmana - 3 September 2026
    submitButton.textContent = 'Signing in…';
    submitButton.disabled = true;
    submitButton.style.background = '#34c759';

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 600);
});

// Created By 1820252173 Stanly Lukmana - 3 September 2026
(function restoreEmail() {
    const saved = JSON.parse(localStorage.getItem(sessionStorageKey) || 'null');
    if (saved && saved.email) {
        emailInput.value = saved.email;
        rememberMe.checked = true;
    }
})();

setAuthMode(authMode);
