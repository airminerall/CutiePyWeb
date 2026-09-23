const learningPathKey = 'cutiepy-learning-path';

function updateLearningPathProgress(steps) {
    const completed = steps.filter(step => step.checked).length;
    const percentage = Math.round((completed / steps.length) * 100);
    document.getElementById('path-progress-label').textContent = `${completed} of ${steps.length} steps complete`;
    document.getElementById('path-progress-percent').textContent = `${percentage}%`;
    document.getElementById('path-progress-bar').style.width = `${percentage}%`;
    steps.forEach(step => step.closest('.learning-path-step').classList.toggle('is-complete', step.checked));
}

document.addEventListener('DOMContentLoaded', () => {
    const steps = [...document.querySelectorAll('.learning-path-check input')];
    let savedSteps = [];
    try { savedSteps = JSON.parse(localStorage.getItem(learningPathKey) || '[]'); } catch { savedSteps = []; }
    steps.forEach((step, index) => {
        step.checked = Boolean(savedSteps[index]);
        step.addEventListener('change', () => {
            localStorage.setItem(learningPathKey, JSON.stringify(steps.map(item => item.checked)));
            updateLearningPathProgress(steps);
        });
    });
    updateLearningPathProgress(steps);
});
