const accountStorageKey = 'cutiepy-account';
const sessionStorageKey = 'cutiepy-session';
const queryMode = new URLSearchParams(window.location.search).get('mode');
let authMode = queryMode === 'signup' ? 'signup' : 'login';

const form = document.getElementById('auth-form');
const nameField = document.getElementById('name-field');
const nameInput = document.getElementById('auth-name');
const emailInput = document.getElementById('auth-email');
const passwordInput = document.getElementById('auth-password');
const message = document.getElementById('auth-message');
const submitButton = document.getElementById('submit-button');
const loginTab = document.getElementById('login-tab');
const signupTab = document.getElementById('signup-tab');

function setMessage(text, type = '') {
    message.textContent = text;
    message.className = `auth-message${type ? ` is-${type}` : ''}`;
}

function setAuthMode(mode) {
    authMode = mode;
    const isSignup = mode === 'signup';
    nameField.classList.toggle('is-hidden', !isSignup);
    nameInput.required = isSignup;
    passwordInput.autocomplete = isSignup ? 'new-password' : 'current-password';
    submitButton.textContent = isSignup ? 'Create Account' : 'Sign In';
    loginTab.classList.toggle('is-active', !isSignup);
    signupTab.classList.toggle('is-active', isSignup);
    setMessage('');
}

loginTab.addEventListener('click', () => setAuthMode('login'));
signupTab.addEventListener('click', () => setAuthMode('signup'));

form.addEventListener('submit', event => {
    event.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;
    const name = nameInput.value.trim();
    const account = JSON.parse(localStorage.getItem(accountStorageKey) || 'null');

    if (authMode === 'signup') {
        if (account && account.email === email) {
            setMessage('An account with this email already exists.', 'error');
            return;
        }
        localStorage.setItem(accountStorageKey, JSON.stringify({ email, password, name }));
        passwordInput.value = '';
        setAuthMode('login');
        setMessage('Account created. Please sign in to continue.', 'success');
        return;
    }

    if (!account) {
        setMessage('No account found. Please register first.', 'error');
        return;
    }
    if (account.email !== email || account.password !== password) {
        setMessage('Incorrect email or password.', 'error');
        return;
    }

    localStorage.setItem(sessionStorageKey, JSON.stringify({ name: account.name, email: account.email }));
    window.location.href = 'index.html';
});

setAuthMode(authMode);
