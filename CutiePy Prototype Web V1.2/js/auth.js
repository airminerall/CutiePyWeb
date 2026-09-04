const accountStorageKey = 'cutiepy-account';
const sessionStorageKey = 'cutiepy-session';
const progressStorageKey = 'cutiepy-progress';
let registeredAccount = JSON.parse(localStorage.getItem(accountStorageKey) || 'null');

function openAuthModal(mode) {
    if (authState.isLoggedIn) {
        if (confirm("Do you want to sign out?")) {
            authState.isLoggedIn = false;
            authState.user = null;
            localStorage.removeItem(sessionStorageKey);
            updateAuthUI();
        }
        return;
    }
    document.getElementById('auth-modal').classList.remove('hidden');
    if (mode) switchAuthTab(mode);
}

function openAuthPage(mode) {
    window.location.href = mode ? `auth-form.html?mode=${mode}` : 'auth.html';
}

function showAuthDetails() {
    const portal = document.getElementById('auth-gate-portal');
    const details = document.getElementById('auth-gate-details');
    if (!portal || !details) return;
    portal.classList.remove('is-visible');
    details.classList.add('is-visible');
    details.setAttribute('aria-hidden', 'false');
    portal.setAttribute('aria-hidden', 'true');
    document.getElementById('portal-email').focus();
}

function showAuthPortal() {
    const portal = document.getElementById('auth-gate-portal');
    const details = document.getElementById('auth-gate-details');
    if (!portal || !details) return;
    details.classList.remove('is-visible');
    portal.classList.add('is-visible');
    details.setAttribute('aria-hidden', 'true');
    portal.setAttribute('aria-hidden', 'false');
}

function handlePortalContinue(event) {
    event.preventDefault();
    const email = document.getElementById('portal-email').value.trim();
    const error = document.getElementById('portal-error');
    if (!email.includes('@') && !/^\+?[\d\s-]{7,}$/.test(email)) {
        error.innerText = 'Please enter a valid email address or phone number.';
        return;
    }
    error.innerText = '';
    openAuthPage('login');
}

function openAccountPage() {
    if (!authState.isLoggedIn) {
        openAuthPage('login');
        return;
    }
    renderAccountPage();
    navigateTo('account');
}

function renderAccountPage() {
    const user = authState.user || {};
    const completedCount = Number(localStorage.getItem(progressStorageKey) || completedLessonsCount);
    completedLessonsCount = Math.min(completedCount, Object.keys(lessonsData).length);
    const totalChallenges = Object.keys(lessonsData).length;
    const percentage = Math.round((completedLessonsCount / totalChallenges) * 100);
    const nameDisplay = document.getElementById('account-name-display');
    const emailDisplay = document.getElementById('account-email-display');
    const nameInput = document.getElementById('account-name-input');
    const countDisplay = document.getElementById('account-progress-count');
    const totalDisplay = document.getElementById('account-progress-total');
    const percentDisplay = document.getElementById('account-progress-percent');
    const progressBar = document.getElementById('account-progress-bar');
    if (!nameDisplay) return;
    nameDisplay.innerText = user.name || 'Student';
    emailDisplay.innerText = user.email || 'student@example.com';
    nameInput.value = user.name || '';
    countDisplay.innerText = completedLessonsCount;
    totalDisplay.innerText = totalChallenges;
    percentDisplay.innerText = `${percentage}%`;
    progressBar.style.width = `${percentage}%`;

    document.querySelectorAll('.achievement-step').forEach(step => {
        const unlocked = completedLessonsCount >= Number(step.dataset.requirement);
        step.classList.toggle('is-unlocked', unlocked);
        step.querySelector('span').innerText = unlocked ? 'Unlocked' : 'Locked';
    });
}

function setupAccountForm() {
    const form = document.getElementById('account-name-form');
    if (!form) return;
    form.addEventListener('submit', event => {
        event.preventDefault();
        const newName = document.getElementById('account-name-input').value.trim();
        if (!newName || !authState.user) return;
        authState.user.name = newName;
        localStorage.setItem(sessionStorageKey, JSON.stringify(authState.user));
        if (registeredAccount) {
            registeredAccount.name = newName;
            localStorage.setItem(accountStorageKey, JSON.stringify(registeredAccount));
        }
        updateAuthUI();
        renderAccountPage();
    });
}

function enterWebsite() {
    document.getElementById('auth-gate').classList.add('hidden');
    document.getElementById('global-nav').classList.remove('hidden');
    document.getElementById('view-home').classList.remove('hidden');
    document.getElementById('view-home').classList.add('block');
}

function restoreSession() {
    const savedUser = JSON.parse(localStorage.getItem(sessionStorageKey) || 'null');
    if (savedUser) {
        authState.isLoggedIn = true;
        authState.user = savedUser;
        updateAuthUI();
    }
}

function showAuthGate() {
    document.getElementById('auth-gate').classList.remove('hidden');
    document.getElementById('global-nav').classList.add('hidden');
    document.querySelectorAll('.view-section').forEach(view => view.classList.add('hidden'));
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
    document.getElementById('auth-error').classList.add('hidden');
}

function switchAuthTab(mode) {
    authState.currentMode = mode;
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const nameContainer = document.getElementById('name-field-container');
    const submitButton = document.getElementById('auth-submit-btn');
    const googleButtonText = document.getElementById('google-btn-text');

    if (mode === 'login') {
        tabLogin.className = "flex-1 pb-3 text-sm font-semibold text-black border-b-2 border-black transition-colors";
        tabSignup.className = "flex-1 pb-3 text-sm font-medium text-gray-400 border-b-2 border-transparent transition-colors";
        nameContainer.classList.add('hidden');
        submitButton.innerText = "Sign In";
        googleButtonText.innerText = "Sign in with Google";
    } else {
        tabSignup.className = "flex-1 pb-3 text-sm font-semibold text-black border-b-2 border-black transition-colors";
        tabLogin.className = "flex-1 pb-3 text-sm font-medium text-gray-400 border-b-2 border-transparent transition-colors";
        nameContainer.classList.remove('hidden');
        submitButton.innerText = "Create Account";
        googleButtonText.innerText = "Sign up with Google";
    }
}

function handleAuthSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const name = document.getElementById('auth-name').value;
    const errorElement = document.getElementById('auth-error');

    if (!email.includes('@')) {
        errorElement.innerText = "Please enter a valid email address.";
        errorElement.className = "text-xs text-red-500";
        return;
    }

    if (password.length < 6) {
        errorElement.innerText = "Password must be at least 6 characters long.";
        errorElement.className = "text-xs text-red-500";
        return;
    }

    if (authState.currentMode === 'signup') {
        if (!name.trim()) {
            errorElement.innerText = "Please enter your name.";
            errorElement.className = "text-xs text-red-500";
            return;
        }

        if (registeredAccount && registeredAccount.email === email) {
            errorElement.innerText = "An account with this email already exists.";
            errorElement.className = "text-xs text-red-500";
            return;
        }

        registeredAccount = { email, password, name: name.trim() };
        localStorage.setItem(accountStorageKey, JSON.stringify(registeredAccount));
        document.getElementById('auth-password').value = '';
        errorElement.innerText = "Account created. Please sign in to continue.";
        errorElement.className = "text-xs text-green-600";
        switchAuthTab('login');
        return;
    }

    if (!registeredAccount) {
        errorElement.innerText = "No account found. Please create an account first.";
        errorElement.className = "text-xs text-red-500";
        return;
    }

    if (registeredAccount.email !== email || registeredAccount.password !== password) {
        errorElement.innerText = "Incorrect email or password.";
        errorElement.className = "text-xs text-red-500";
        return;
    }

    errorElement.classList.add('hidden');
    authState.isLoggedIn = true;
    authState.user = { name: registeredAccount.name, email };
    localStorage.setItem(sessionStorageKey, JSON.stringify(authState.user));
    updateAuthUI();
    closeAuthModal();
    enterWebsite();
}

function simulateGoogleAuth() {
    authState.isLoggedIn = true;
    authState.user = { name: "Google User", email: "user@gmail.com" };
    updateAuthUI();
    closeAuthModal();
    enterWebsite();
}

function updateAuthUI() {
    const usernameElement = document.getElementById('nav-username');
    if (usernameElement) {
        usernameElement.innerText = authState.isLoggedIn && authState.user ? authState.user.name : "Sign In";
    }
}
