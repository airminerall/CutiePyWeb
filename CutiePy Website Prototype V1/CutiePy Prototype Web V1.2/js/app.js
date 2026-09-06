document.addEventListener('DOMContentLoaded', () => {
    setupCodeHighlighting();
    restoreSession();
    completedLessonsCount = getCompletedLessonCount();
    renderLessonCatalog();
    renderHomeLessonCatalog();
    renderChallengeCatalog();
    updateChallengeBubbles();
    setupAccountForm();
    enterWebsite();
    const requestedLessonId = Number(new URLSearchParams(window.location.search).get('lesson'));
    if (lessonsData[requestedLessonId]) openLessonDetail(requestedLessonId);
});
