function executeCode(context) {
    const codeInput = document.getElementById(`${context}-code`).value;
    const outputContainer = document.getElementById(`${context}-output-container`);
    const outputText = document.getElementById(`${context}-output`);
    const button = document.getElementById(`${context}-run-btn`);
    const originalText = button.innerText;
    button.disabled = true;
    button.innerText = "Running...";
    button.classList.add('opacity-75');

    setTimeout(() => {
        const result = mockPythonInterpreter(codeInput);
        outputContainer.classList.remove('hidden');
        outputText.innerText = result;
        const hasError = /^(SyntaxError|NameError):/.test(result);
        button.innerText = hasError ? "Code Error" : "Code Executed";
        button.classList.remove('opacity-75');
        button.classList.replace('bg-black', hasError ? 'bg-red-600' : 'bg-green-600');
        setTimeout(() => {
            button.innerText = originalText;
            button.classList.replace(hasError ? 'bg-red-600' : 'bg-green-600', 'bg-black');
            button.disabled = false;
        }, 2000);
    }, 600);
}

function executeChallenge() {
    const codeInput = document.getElementById('challenge-code').value;
    const outputContainer = document.getElementById('challenge-output-container');
    const outputText = document.getElementById('challenge-output');
    const button = document.getElementById('challenge-run-btn');
    const challengeLessonId = activeChallengeLesson;

    if (codeInput.trim() === '') {
        button.innerText = "Please write some code";
        button.classList.replace('bg-black', 'bg-red-600');
        setTimeout(() => {
            button.innerText = "Submit Answer";
            button.classList.replace('bg-red-600', 'bg-black');
        }, 2000);
        return;
    }

    button.disabled = true;
    button.innerText = "Checking...";
    setTimeout(() => {
        const result = mockPythonInterpreter(codeInput);
        outputContainer.classList.remove('hidden');
        outputText.innerText = result;

        if (/^(SyntaxError|NameError):/.test(result)) {
            button.innerText = "Code Error";
            button.classList.replace('bg-black', 'bg-red-600');
            setTimeout(() => {
                button.innerText = "Submit Answer";
                button.classList.replace('bg-red-600', 'bg-black');
                button.disabled = false;
            }, 2000);
            return;
        }

        const expectedResult = lessonsData[challengeLessonId].expectedResult;
        if (result.toString().trim() === expectedResult.trim()) {
            button.innerText = "Challenge Passed!";
            button.classList.replace('bg-black', 'bg-green-600');
            if (challengeLessonId > completedLessonsCount) {
                completedLessonsCount = Math.max(completedLessonsCount, challengeLessonId);
                localStorage.setItem(progressStorageKey, completedLessonsCount);
                updateChallengeBubbles();
            }
            button.disabled = false;
        } else {
            button.innerText = "Try Again";
            button.classList.replace('bg-black', 'bg-red-600');
            setTimeout(() => {
                button.innerText = "Submit Answer";
                button.classList.replace('bg-red-600', 'bg-black');
                button.disabled = false;
            }, 2000);
        }
    }, 800);
}
