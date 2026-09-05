function navigateTo(viewId) {
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.add('hidden');
        view.classList.remove('block');
    });
    document.querySelectorAll('[data-nav-view]').forEach(link => {
        link.classList.toggle('is-active', link.dataset.navView === viewId);
    });
    const target = document.getElementById('view-' + viewId);
    if (target) {
        target.classList.remove('hidden');
        target.classList.add('block');
        window.scrollTo(0, 0);
    }
}

function toggleSearchPanel() {
    const panel = document.getElementById('site-search');
    const input = document.getElementById('site-search-input');
    if (!panel) return;
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) input.focus();
}

function searchLessons(query) {
    const results = document.getElementById('site-search-results');
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
        results.innerHTML = '';
        return;
    }
    const matches = Object.entries(lessonsData).filter(([, lesson]) =>
        `${lesson.title} ${lesson.subtitle} ${lesson.theoryTitle}`.toLowerCase().includes(normalizedQuery)
    );
    results.innerHTML = matches.length
        ? matches.map(([id, lesson]) => `<button type="button" class="site-search-result" onclick="openLessonDetail(${id}); toggleSearchPanel();"><strong>${lesson.title}</strong><br><small>${lesson.theoryTitle}</small></button>`).join('')
        : '<p class="site-search-empty">No lessons found.</p>';
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('site-search-input');
    if (input) input.addEventListener('input', event => searchLessons(event.target.value));
});

function openLessonDetail(id) {
    currentLessonId = id;
    const data = lessonsData[id];
    document.getElementById('lesson-breadcrumb').innerText = data.breadcrumb;
    document.getElementById('lesson-title').innerText = data.title;
    document.getElementById('lesson-subtitle').innerText = data.subtitle;
    document.getElementById('lesson-badge').innerText = data.badge;
    document.getElementById('lesson-theory-title').innerText = data.theoryTitle;
    document.getElementById('lesson-theory-desc').innerText = data.theoryDesc;
    document.getElementById('lesson-syntax-box').innerText = data.syntax;
    updateLessonVideo(data.videoUrl);
    setCodeValue('lesson-code', data.defaultCode);
    document.getElementById('lesson-output-container').classList.add('hidden');
    navigateTo('lesson-detail');
}

function updateLessonVideo(videoUrl) {
    const video = document.getElementById('lesson-video');
    const placeholder = document.getElementById('lesson-video-placeholder');
    if (!video || !placeholder) return;

    if (videoUrl) {
        video.src = videoUrl;
        video.hidden = false;
        placeholder.hidden = true;
    } else {
        video.removeAttribute('src');
        video.load();
        video.hidden = true;
        placeholder.hidden = false;
    }
}

function openLessonFromChallenge() { openLessonDetail(activeChallengeLesson); }

function openGroupProfile(member) {
    const profilePages = {
        christian: 'christian.html',
        stanly: 'stanly.html',
        nathanael: 'nathanael.html',
        jennifer: 'jennifer.html',
        jasselynn: 'jasselynn.html'
    };
    if (profilePages[member]) window.location.href = profilePages[member];
}

function selectChallengeLesson(id) {
    if (id > completedLessonsCount + 1) return;
    window.location.href = `challenge.html?lesson=${id}`;
}

function updateChallengeBubbles() {
    const lessonCount = Object.keys(lessonsData).length;
    const progress = getActiveProgress();
    for (let index = 1; index <= lessonCount; index++) {
        const bubble = document.getElementById('bubble-' + index);
        const badge = document.getElementById('badge-' + index);
        if (!bubble || !badge) continue;
        const completedQuestions = (progress.completedQuestions[String(index)] || []).length;
        const totalQuestions = lessonsData[index].challenges.length;
        if (index <= completedLessonsCount + 1) {
            bubble.style.opacity = "1";
            badge.innerText = index <= completedLessonsCount ? "Completed" : completedQuestions ? `${completedQuestions}/${totalQuestions} complete` : "Unlocked";
            badge.className = index <= completedLessonsCount ? "mt-4 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full" : "mt-4 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full";
        } else {
            bubble.style.opacity = "0.5";
            badge.innerText = "Locked";
            badge.className = "mt-4 px-3 py-1 bg-gray-100 text-gray-400 text-xs font-semibold rounded-full";
        }
    }
}

function renderLessonCatalog() {
    const catalog = document.getElementById('lesson-catalog');
    if (!catalog) return;
    catalog.innerHTML = Object.entries(lessonsData).map(([id, lesson]) => `
        <article onclick="openLessonDetail(${id})" class="apple-card p-8 flex flex-col justify-between cursor-pointer bg-white group hover:shadow-lg transition-all border border-gray-100">
            <div>
                <p class="text-[var(--apple-orange)] text-xs font-semibold tracking-wider mb-1 uppercase">${lesson.badge}</p>
                <h3 class="text-2xl font-bold mb-1">${lesson.title.replace(/^Lesson \d+: /, '')}</h3>
                <p class="text-gray-500 text-sm">${lesson.theoryTitle}</p>
            </div>
            <div class="my-8 flex justify-center">
                <span class="lesson-number-mark">${id}</span>
            </div>
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <span class="text-xs text-gray-500">Python 3.12</span>
                <span class="apple-btn bg-[var(--apple-blue)] text-white text-xs px-4 py-1.5 font-medium">Select</span>
            </div>
        </article>
    `).join('');
}

function renderHomeLessonCatalog() {
    const catalog = document.getElementById('home-lesson-catalog');
    if (!catalog) return;
    const lessonIcons = [
        '<path d="M4 4h16v16H4z"/><path d="m8 9 3 3-3 3m5 0h3"/>',
        '<path d="M4 7c0-2 3.6-4 8-4s8 2 8 4-3.6 4-8 4-8-2-8-4Z"/><path d="M4 7v5c0 2 3.6 4 8 4s8-2 8-4V7M4 12v5c0 2 3.6 4 8 4s8-2 8-4v-5"/>',
        '<path d="M8 9 4 13l4 4M16 9l4 4-4 4M14 5l-4 16"/>',
        '<path d="M8 6h8M8 18h8M6 6h.01M6 18h.01M12 6v12"/>',
        '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h5M8 17h8"/>',
        '<path d="M6 4v16M6 6h7a3 3 0 0 1 0 6H6m7 0 4 8"/>',
        '<path d="M5 5h14v14H5z"/><path d="M8 9h8M8 13h5M8 17h3"/>',
        '<path d="M5 6h14M5 12h14M5 18h14M8 3v18M16 3v18"/>',
        '<path d="M12 4 20 19H4L12 4Z"/><path d="M12 9v5m0 3h.01"/>',
        '<path d="M4 5h16v14H4z"/><path d="M8 9h8M8 13h5M8 17h8"/>',
        '<path d="M6 4h12v16H6z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
        '<path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="8"/>'
    ];
    catalog.innerHTML = Object.entries(lessonsData).map(([id, lesson]) => {
        const darkCard = Number(id) % 2 === 0;
        return `
            <article onclick="openLessonDetail(${id})" class="apple-card home-lesson-card flex-none w-[300px] sm:w-[350px] md:w-[400px] h-[500px] p-8 flex flex-col justify-between cursor-pointer snap-center relative overflow-hidden ${darkCard ? 'bg-black text-white' : ''}">
                <div class="z-10">
                    <p class="${darkCard ? 'text-gray-400' : 'text-[var(--apple-orange)]'} text-xs font-semibold tracking-wider mb-2 uppercase">${lesson.badge}</p>
                    <h3 class="text-2xl font-bold mb-1 ${darkCard ? 'text-white' : ''}">${lesson.title.replace(/^Lesson \d+: /, '')}</h3>
                    <p class="${darkCard ? 'text-gray-300' : 'text-gray-600'} text-sm">${lesson.subtitle}</p>
                    <p class="${darkCard ? 'text-gray-400' : 'text-gray-900'} text-sm mt-4 font-medium">Lesson ${id}</p>
                </div>
                <div class="home-lesson-number ${darkCard ? 'home-lesson-number-dark' : ''}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${lessonIcons[Number(id) - 1]}</svg>
                </div>
            </article>
        `;
    }).join('');
}

function renderChallengeCatalog() {
    const catalog = document.getElementById('challenge-catalog');
    if (!catalog) return;
    catalog.innerHTML = Object.entries(lessonsData).map(([id, lesson]) => `
        <article id="bubble-${id}" onclick="selectChallengeLesson(${id})" class="apple-card p-6 flex flex-col items-center text-center cursor-pointer border-2 ${Number(id) === 1 ? 'border-black' : 'border-transparent'}">
            <div class="w-16 h-16 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xl font-bold mb-4">${id}</div>
            <h3 class="font-bold text-lg mb-1">${lesson.title.replace(/^Lesson \d+: /, '')}</h3>
            <p class="text-xs text-gray-500">5 questions</p>
            <span id="badge-${id}" class="mt-4 px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">${Number(id) === 1 ? 'Unlocked' : 'Locked'}</span>
        </article>
    `).join('');
}
