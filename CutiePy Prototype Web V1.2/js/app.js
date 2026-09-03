document.addEventListener('DOMContentLoaded', () => {
    setupCodeHighlighting();
    renderLessonCatalog();
    renderHomeLessonCatalog();
    renderChallengeCatalog();
    completedLessonsCount = Number(localStorage.getItem(progressStorageKey) || 0);
    updateChallengeBubbles();
    setupAccountForm();
    restoreSession();
    if (authState.isLoggedIn) enterWebsite();
});
