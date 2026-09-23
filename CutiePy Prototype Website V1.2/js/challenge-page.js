const challengeProgressKey = 'cutiepy-progress';
const challengeSessionKey = 'cutiepy-session';
const params = new URLSearchParams(window.location.search);
const lessonId = Number(params.get('lesson')) || 1;
let questionIndex = 0;
let progress = { completedQuestions: {} };
let challengeButtonMode = 'submit'; // 'submit' | 'next-question' | 'next-challenge'
let buttonStateTimeout = null;

function getProgressKey(user) {
    return user?.email ? `${challengeProgressKey}:${user.email.trim().toLowerCase()}` : null;
}

function normalizeCompletedQuestions(completed, questionCount) {
    if (!Array.isArray(completed)) return [];
    const indexes = [...new Set(completed.map(Number).filter(index => Number.isInteger(index)))];
    const isLegacyOneBased = indexes.length > 0
        && !indexes.includes(0)
        && indexes.every(index => index >= 1 && index <= questionCount);
    return indexes
        .map(index => isLegacyOneBased ? index - 1 : index)
        .filter(index => index >= 0 && index < questionCount)
        .sort((first, second) => first - second);
}

function loadProgress() {
    const user = JSON.parse(localStorage.getItem(challengeSessionKey) || sessionStorage.getItem(challengeSessionKey) || 'null');
    const key = getProgressKey(user);
    if (!key) {
        CutiePyPageProgress.navigate('auth-form.html');
        return false;
    }
    try {
        progress = JSON.parse(localStorage.getItem(key) || '{"completedQuestions":{}}');
        if (!progress || typeof progress.completedQuestions !== 'object') progress = { completedQuestions: {} };
    } catch {
        progress = { completedQuestions: {} };
    }

    for (const [id, lesson] of Object.entries(lessonsData)) {
        progress.completedQuestions[id] = normalizeCompletedQuestions(progress.completedQuestions[id], lesson.challenges.length);
    }
    return true;
}

function saveProgress() {
    const user = JSON.parse(localStorage.getItem(challengeSessionKey) || sessionStorage.getItem(challengeSessionKey) || 'null');
    const key = getProgressKey(user);
    if (key) localStorage.setItem(key, JSON.stringify(progress));
}

function completedQuestionIndexes() {
    return normalizeCompletedQuestions(progress.completedQuestions[String(lessonId)], lessonsData[lessonId].challenges.length);
}

function completedLessonCount() {
    let count = 0;
    for (const id of Object.keys(lessonsData)) {
        const completed = normalizeCompletedQuestions(progress.completedQuestions[id], lessonsData[id].challenges.length);
        if (completed.length < lessonsData[id].challenges.length) break;
        count++;
    }
    return count;
}

function isQuestionUnlocked(index) {
    return index === 0 || completedQuestionIndexes().includes(index - 1);
}

function renderTabs() {
    const questions = lessonsData[lessonId].challenges;
    const completed = completedQuestionIndexes();
    document.getElementById('challenge-question-tabs').innerHTML = questions.map((item, index) => {
        const isComplete = completed.includes(index);
        const unlocked = isQuestionUnlocked(index);
        const isCurrent = index === questionIndex;
        let classes = '';
        if (isComplete) {
            classes = isCurrent
                ? 'bg-green-600 text-white border-green-600 ring-2 ring-black ring-offset-2'
                : 'bg-green-600 text-white border-green-600 hover:bg-green-700';
        } else if (unlocked) {
            classes = isCurrent
                ? 'bg-white text-gray-900 border-2 border-black ring-2 ring-black ring-offset-2'
                : 'bg-white text-gray-800 border-gray-400 hover:bg-gray-50';
        } else {
            classes = 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed';
        }
        return `<button type="button" onclick="selectChallengeQuestion(${index})" ${unlocked ? '' : 'disabled'} class="h-11 rounded-lg border text-sm font-semibold transition-all ${classes}" aria-label="Question ${index + 1}">${isComplete ? 'Done' : index + 1}</button>`;
    }).join('');
}

function resetButtonToSubmit() {
    if (buttonStateTimeout) {
        clearTimeout(buttonStateTimeout);
        buttonStateTimeout = null;
    }
    challengeButtonMode = 'submit';
    const button = document.getElementById('challenge-run-btn');
    if (button) {
        button.textContent = 'Submit Answer';
        button.className = 'apple-btn w-full bg-black px-8 py-3 font-medium text-white hover:bg-gray-800';
        button.classList.remove('status-success', 'status-failure');
        button.disabled = false;
    }
}

function resetChallengeBunny() {
    const stage = document.getElementById('challenge-bunny-stage');
    const speech = document.getElementById('challenge-bunny-speech');
    const score = document.getElementById('challenge-bunny-score');
    if (stage) {
        stage.classList.remove('is-complete', 'bunny-route-1', 'bunny-route-2', 'bunny-route-3', 'bunny-route-4', 'bunny-route-5');
        stage.classList.add(`bunny-route-${questionIndex + 1}`);
    }
    if (speech) speech.textContent = 'Help me find the carrot.';
    if (score) score.classList.remove('is-visible');
}

function celebrateChallengeBunny(output) {
    const stage = document.getElementById('challenge-bunny-stage');
    const speech = document.getElementById('challenge-bunny-speech');
    if (!stage || !speech) return;
    speech.textContent = output;
    stage.classList.remove('is-complete');
    void stage.offsetWidth;
    stage.classList.add('is-complete');
    const score = document.getElementById('challenge-bunny-score');
    if (score) score.classList.add('is-visible');
}

function renderChallenge() {
    const lesson = lessonsData[lessonId];
    const questions = lesson.challenges;
    const completed = completedQuestionIndexes();
    const question = questions[questionIndex];
    document.getElementById('challenge-breadcrumb').textContent = `Lesson ${lessonId} Challenge`;
    document.getElementById('challenge-page-title').textContent = lesson.title.replace(/^Lesson \d+: /, '');
    document.getElementById('challenge-page-subtitle').textContent = 'Complete all five questions to unlock the next level.';
    document.getElementById('challenge-progress-label').textContent = `${completed.length} of ${questions.length} complete`;
    const questionProgressBar = document.getElementById('challenge-question-progress-bar');
    if (questionProgressBar) questionProgressBar.style.width = `${Math.round((completed.length / questions.length) * 100)}%`;
    document.getElementById('challenge-question-label').textContent = `Question ${questionIndex + 1} of ${questions.length}`;
    document.getElementById('challenge-task-title').textContent = question.title;
    document.getElementById('challenge-task-desc').textContent = question.task;
    document.getElementById('challenge-hint-text').textContent = question.hint;
    document.getElementById('review-lesson-link').href = `index.html?lesson=${lessonId}`;
    document.getElementById('challenge-output-container').classList.add('hidden');
    setCodeValue('challenge-code', '');
    resetChallengeBunny();
    resetButtonToSubmit();
    if (completed.length === questions.length) {
        challengeButtonMode = 'next-challenge';
        const nextButton = document.getElementById('challenge-run-btn');
        nextButton.textContent = 'Next Lesson';
        nextButton.className = 'apple-btn w-full bg-black px-8 py-3 font-medium text-white hover:bg-gray-800';
    }
    renderTabs();
}

function selectChallengeQuestion(index) {
    if (!isQuestionUnlocked(index)) return;
    questionIndex = index;
    renderChallenge();
}

function handleChallengeButtonClick() {
    const questions = lessonsData[lessonId].challenges;

    if (challengeButtonMode === 'next-question') {
        if (questionIndex < questions.length - 1) {
            questionIndex++;
            renderChallenge();
        }
        return;
    }

    if (challengeButtonMode === 'next-challenge') {
        const nextLessonId = lessonId + 1;
        if (lessonsData[nextLessonId]) {
            CutiePyPageProgress.navigate(`index.html?lesson=${nextLessonId}`);
        } else {
            CutiePyPageProgress.navigate('index.html#challenge');
        }
        return;
    }

    executePageChallenge();
}

function executePageChallenge() {
    const codeInput = document.getElementById('challenge-code');
    const outputContainer = document.getElementById('challenge-output-container');
    const outputText = document.getElementById('challenge-output');
    const button = document.getElementById('challenge-run-btn');
    const questions = lessonsData[lessonId].challenges;
    const question = questions[questionIndex];
    if (!codeInput.value.trim()) return showButtonState('Please write some code', 'bg-red-600');

    button.disabled = true;
    button.textContent = 'Checking...';
    button.className = 'apple-btn w-full bg-black px-8 py-3 font-medium text-white hover:bg-gray-800';
    outputContainer.classList.remove('hidden');
    outputText.replaceChildren(CutiePyLoader.createDots('loading-dots--output'));
    window.setTimeout(() => {
        const result = mockPythonInterpreter(codeInput.value);
        outputContainer.classList.remove('hidden');
        outputContainer.classList.remove('execution-output-reveal');
        void outputContainer.offsetWidth;
        outputContainer.classList.add('execution-output-reveal');
        outputText.textContent = result;
        if (/^(SyntaxError|NameError):/.test(result)) {
            button.classList.add('status-failure');
            showButtonState('Code Error', 'bg-red-600');
            return;
        }
        if (String(result).trim() !== question.expectedResult.trim()) {
            button.classList.add('status-failure');
            showButtonState('Try Again', 'bg-red-600');
            return;
        }
        celebrateChallengeBunny(result);
        const completed = completedQuestionIndexes();
        if (!completed.includes(questionIndex)) {
            progress.completedQuestions[String(lessonId)] = [...completed, questionIndex].sort((first, second) => first - second);
            saveProgress();
        }
        
        const isLastQuestion = questionIndex === questions.length - 1;
        const allCompleted = completedQuestionIndexes().length === questions.length;

        document.getElementById('challenge-progress-label').textContent = `${completedQuestionIndexes().length} of ${questions.length} complete`;
        renderTabs();

        if (isLastQuestion || allCompleted) {
            challengeButtonMode = 'next-challenge';
            button.textContent = 'Next Lesson';
        } else {
            challengeButtonMode = 'next-question';
            button.textContent = 'Next Question';
        }
        button.className = 'apple-btn w-full bg-green-600 px-8 py-3 font-medium text-white hover:bg-green-700';
        button.classList.add('status-success');
        button.disabled = false;
    }, 500);
}

function showButtonState(label, colorClass) {
    const button = document.getElementById('challenge-run-btn');
    if (buttonStateTimeout) clearTimeout(buttonStateTimeout);
    button.textContent = label;
    button.className = `apple-btn w-full ${colorClass} px-8 py-3 font-medium text-white`;
    button.disabled = true;
    buttonStateTimeout = window.setTimeout(() => {
        resetButtonToSubmit();
    }, 1600);
}

document.addEventListener('DOMContentLoaded', () => {
    if (!lessonsData[lessonId] || !loadProgress()) return;
    if (lessonId > completedLessonCount() + 1) {
        const nextAvailableLesson = completedLessonCount() + 1;
        CutiePyPageProgress.navigate(`challenge.html?lesson=${nextAvailableLesson}`, true);
        return;
    }
    const questions = lessonsData[lessonId].challenges;
    const completed = completedQuestionIndexes();
    const firstIncompleteQuestion = questions.findIndex((_, index) => !completed.includes(index));
    questionIndex = firstIncompleteQuestion === -1 ? questions.length - 1 : firstIncompleteQuestion;
    setupCodeHighlighting();
    document.getElementById('challenge-run-btn').addEventListener('click', handleChallengeButtonClick);
    renderChallenge();
});
