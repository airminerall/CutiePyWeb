function animateExecutionOutput(container, outputElement, result) {
    container.classList.remove('execution-output-reveal');
    void container.offsetWidth;
    container.classList.add('execution-output-reveal');
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        outputElement.innerText = result;
        return;
    }
    outputElement.innerText = '';
    let index = 0;
    const typeTimer = setInterval(() => {
        outputElement.innerText += result[index++];
        if (index >= result.length) clearInterval(typeTimer);
    }, 12);
}

function executeCode(context) {
    const codeInput = document.getElementById(`${context}-code`).value;
    const outputContainer = document.getElementById(`${context}-output-container`);
    const outputText = document.getElementById(`${context}-output`);
    const button = document.getElementById(`${context}-run-btn`);
    const originalText = button.innerText;
    button.disabled = true;
    button.innerText = "Running...";
    button.classList.add('opacity-75');
    outputContainer.classList.remove('hidden');
    outputText.replaceChildren(CutiePyLoader.createDots('loading-dots--output'));

    setTimeout(() => {
        const result = mockPythonInterpreter(codeInput);
        outputContainer.classList.remove('hidden');
        animateExecutionOutput(outputContainer, outputText, result);
        const hasError = /^(SyntaxError|NameError):/.test(result);
        button.innerText = hasError ? "Code Error" : "Code Executed";
        button.classList.remove('opacity-75');
        button.classList.remove('status-success', 'status-failure');
        button.classList.add(hasError ? 'status-failure' : 'status-success');
        button.classList.replace('bg-black', hasError ? 'bg-red-600' : 'bg-green-600');
        setTimeout(() => {
            button.innerText = originalText;
            button.classList.replace(hasError ? 'bg-red-600' : 'bg-green-600', 'bg-black');
            button.classList.remove('status-success', 'status-failure');
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
    outputContainer.classList.remove('hidden');
    outputText.replaceChildren(CutiePyLoader.createDots('loading-dots--output'));
    setTimeout(() => {
        const result = mockPythonInterpreter(codeInput);
        outputContainer.classList.remove('hidden');
        animateExecutionOutput(outputContainer, outputText, result);

        if (/^(SyntaxError|NameError):/.test(result)) {
            button.innerText = "Code Error";
            button.classList.replace('bg-black', 'bg-red-600');
            button.classList.remove('status-success');
            button.classList.add('status-failure');
            setTimeout(() => {
                button.innerText = "Submit Answer";
                button.classList.replace('bg-red-600', 'bg-black');
                button.classList.remove('status-failure');
                button.disabled = false;
            }, 2000);
            return;
        }

        const expectedResult = lessonsData[challengeLessonId].expectedResult;
        if (result.toString().trim() === expectedResult.trim()) {
            button.innerText = "Challenge Passed!";
            button.classList.replace('bg-black', 'bg-green-600');
            button.classList.remove('status-failure');
            button.classList.add('status-success');
            if (challengeLessonId > completedLessonsCount) {
                completedLessonsCount = Math.max(completedLessonsCount, challengeLessonId);
                const activeProgress = getActiveProgress();
                activeProgress.completedQuestions[String(challengeLessonId)] = lessonsData[challengeLessonId].challenges.map((_, index) => index);
                saveActiveProgress(activeProgress);
                updateChallengeBubbles();
            }
            button.disabled = false;
        } else {
            button.innerText = "Try Again";
            button.classList.replace('bg-black', 'bg-red-600');
            button.classList.remove('status-success');
            button.classList.add('status-failure');
            setTimeout(() => {
                button.innerText = "Submit Answer";
                button.classList.replace('bg-red-600', 'bg-black');
                button.classList.remove('status-failure');
                button.disabled = false;
            }, 2000);
        }
    }, 800);
}
