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

function loadProgress() {
    const user = JSON.parse(localStorage.getItem(challengeSessionKey) || sessionStorage.getItem(challengeSessionKey) || 'null');
    const key = getProgressKey(user);
    if (!key) {
        window.location.href = 'auth-form.html';
        return false;
    }
    try {
        progress = JSON.parse(localStorage.getItem(key) || '{"completedQuestions":{}}');
        if (!progress || typeof progress.completedQuestions !== 'object') progress = { completedQuestions: {} };
    } catch {
        progress = { completedQuestions: {} };
    }
    return true;
}

function saveProgress() {
    const user = JSON.parse(localStorage.getItem(challengeSessionKey) || sessionStorage.getItem(challengeSessionKey) || 'null');
    const key = getProgressKey(user);
    if (key) localStorage.setItem(key, JSON.stringify(progress));
}

function completedQuestionIndexes() {
    return progress.completedQuestions[String(lessonId)] || [];
}

function completedLessonCount() {
    let count = 0;
    for (const id of Object.keys(lessonsData)) {
        const completed = progress.completedQuestions[id] || [];
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
        button.disabled = false;
    }
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
    document.getElementById('challenge-question-label').textContent = `Question ${questionIndex + 1} of ${questions.length}`;
    document.getElementById('challenge-task-title').textContent = question.title;
    document.getElementById('challenge-task-desc').textContent = question.task;
    document.getElementById('challenge-hint-text').textContent = question.hint;
    document.getElementById('review-lesson-link').href = `index.html?lesson=${lessonId}`;
    document.getElementById('challenge-output-container').classList.add('hidden');
    setCodeValue('challenge-code', '');
    resetButtonToSubmit();
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
            window.location.href = `challenge.html?lesson=${nextLessonId}`;
        } else {
            window.location.href = 'index.html#challenge';
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
    window.setTimeout(() => {
        const result = mockPythonInterpreter(codeInput.value);
        outputContainer.classList.remove('hidden');
        outputText.textContent = result;
        if (/^(SyntaxError|NameError):/.test(result)) {
            showButtonState('Code Error', 'bg-red-600');
            return;
        }
        if (String(result).trim() !== question.expectedResult.trim()) {
            showButtonState('Try Again', 'bg-red-600');
            return;
        }
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
            button.textContent = 'Next Challenge';
        } else {
            challengeButtonMode = 'next-question';
            button.textContent = 'Next Question';
        }
        button.className = 'apple-btn w-full bg-green-600 px-8 py-3 font-medium text-white hover:bg-green-700';
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
        window.location.href = 'index.html#challenge';
        return;
    }
    setupCodeHighlighting();
    document.getElementById('challenge-run-btn').addEventListener('click', handleChallengeButtonClick);
    renderChallenge();
});
