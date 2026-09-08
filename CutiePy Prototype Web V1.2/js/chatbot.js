const aiTutorStorageKey = 'cutiepy-ai-tutor-messages';
const geminiModel = 'gemini-3.6-flash';

function ensureAiTutorWidget() {
    if (document.getElementById('ai-tutor')) return;
    const styles = document.createElement('style');
    styles.textContent = `.ai-tutor{position:fixed;right:24px;bottom:24px;z-index:60;display:flex;flex-direction:column;align-items:flex-end;gap:12px;font-family:Arial,sans-serif}.ai-tutor-panel{display:none;width:min(390px,calc(100vw - 32px));overflow:hidden;border:1px solid #dce3ed;border-radius:18px;background:#f7f9fc;box-shadow:0 20px 50px rgba(25,35,55,.24)}.ai-tutor.is-open .ai-tutor-panel{display:block}.ai-tutor-header{display:flex;align-items:center;justify-content:space-between;padding:17px 18px;background:#172033;color:#fff}.ai-tutor-identity{display:flex;align-items:center;gap:10px}.ai-tutor-avatar{width:48px;height:48px;object-fit:cover;border:3px solid #fff;border-radius:16px 16px 16px 8px;background:#c9f0ff}.ai-tutor-kicker{margin:0 0 2px;color:#a9b8d0;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}.ai-tutor-header h2{margin:0;font-size:18px}.ai-tutor-close{border:0;background:transparent;color:#c7d0df;font-size:25px;cursor:pointer}.ai-tutor-messages{display:flex;min-height:170px;max-height:310px;padding:16px;overflow-y:auto;flex-direction:column;gap:10px;background:#f7f9fc}.ai-tutor-message{max-width:88%;padding:10px 12px;border-radius:14px 14px 14px 4px;color:#344054;font-size:13px;line-height:1.55;white-space:pre-line}.ai-tutor-message.bot{align-self:flex-start;background:#fff;border:1px solid #e6ebf2}.ai-tutor-message.user{align-self:flex-end;border-radius:14px 14px 4px 14px;background:#2368dd;color:#fff}.ai-tutor-message h3{margin:5px 0 8px;color:#172033;font-size:15px}.ai-tutor-message pre{margin:9px 0;padding:10px;overflow-x:auto;border-radius:8px;background:#172033;color:#e8f1ff;white-space:pre}.ai-tutor-message code{padding:2px 4px;border-radius:4px;background:rgba(35,104,221,.09);font-family:monospace;font-size:12px}.ai-tutor-suggestions{display:flex;gap:6px;padding:10px 12px 0;overflow-x:auto;background:#f7f9fc}.ai-tutor-suggestions button{flex:0 0 auto;padding:6px 9px;border:1px solid #d8e1ef;border-radius:999px;background:#fff;color:#2368dd;font-size:11px;cursor:pointer}.ai-tutor-form{display:flex;gap:8px;padding:12px;background:#f7f9fc}.ai-tutor-form input{min-width:0;flex:1;padding:10px 12px;border:1px solid #dce3ed;border-radius:12px;background:#fff;font-size:13px}.ai-tutor-form button{width:40px;height:40px;border:0;border-radius:12px;background:#172033;color:#fff;cursor:pointer}.ai-tutor-disclaimer{margin:0;padding:0 14px 13px;background:#f7f9fc;color:#8b96a9;font-size:10px;line-height:1.4;text-align:center}.ai-tutor-toggle{display:flex;align-items:center;gap:8px;padding:12px 16px 12px 12px;border:0;border-radius:999px;background:#172033;box-shadow:0 12px 28px rgba(25,35,55,.22);color:#fff;font-size:13px;font-weight:700;cursor:pointer}.ai-tutor-toggle-icon{width:30px;height:30px;object-fit:cover;border:2px solid #fff;border-radius:10px 10px 10px 5px;background:#c9f0ff}@media(max-width:520px){.ai-tutor{right:16px;bottom:16px;left:16px}.ai-tutor-panel{width:100%}.ai-tutor-toggle{align-self:flex-end}}`;
    document.head.appendChild(styles);
    document.body.insertAdjacentHTML('beforeend', `
        <aside id="ai-tutor" class="ai-tutor" aria-label="Chikawa AI Tutor">
            <div id="ai-tutor-panel" class="ai-tutor-panel" role="dialog" aria-modal="false" aria-labelledby="ai-tutor-title">
                <div class="ai-tutor-header"><div class="ai-tutor-identity"><img class="ai-tutor-avatar" src="assets/chikawa.png" alt="Chikawa mascot"><div><p class="ai-tutor-kicker">CutiePy AI Tutor</p><h2 id="ai-tutor-title">Chikawa</h2></div></div><button type="button" class="ai-tutor-close" onclick="toggleAiTutor(false)" aria-label="Close Chikawa">&times;</button></div>
                <div id="ai-tutor-messages" class="ai-tutor-messages" aria-live="polite"></div>
                <div class="ai-tutor-suggestions" aria-label="Suggested questions"><button type="button" onclick="askAiTutor('Explain this lesson simply')">Explain this lesson</button><button type="button" onclick="askAiTutor('Help me debug my Python code')">Debug my code</button></div>
                <form id="ai-tutor-form" class="ai-tutor-form" onsubmit="submitAiTutor(event)"><label class="sr-only" for="ai-tutor-input">Ask Chikawa a Python question</label><input id="ai-tutor-input" type="text" autocomplete="off" placeholder="Ask anything about Python..." maxlength="500" required><button type="submit" aria-label="Send question">Send</button></form>
                <p class="ai-tutor-disclaimer">Chikawa explains concepts and reviews code. Always run and test your own code.</p>
            </div>
            <button type="button" id="ai-tutor-toggle" class="ai-tutor-toggle" onclick="toggleAiTutor()" aria-expanded="false" aria-controls="ai-tutor-panel"><img class="ai-tutor-toggle-icon" src="assets/chikawa.png" alt=""><span>Ask Chikawa</span></button>
        </aside>`);
}

const aiTutorKnowledge = [
    { keys: ['variable', 'variables', 'assignment'], answer: 'A variable is a name that refers to a value. Python creates or updates a variable when you assign a value with `=`.\n\nExample:\n`name = "CutiePy"`\n`print(name)`\n\nTry changing the value and run the code to observe the result.' },
    { keys: ['print', 'output', 'hello world'], answer: '`print()` displays a value in the console. It can show text, numbers, expressions, or several values at once.\n\nExample:\n`print("Hello, Python!")`\n`print(2 + 3)`\n\nRemember to put text inside quotation marks.' },
    { keys: ['for loop', 'while loop', 'loop', 'loops', 'range'], answer: 'Use a loop to run a block of code repeatedly. A `for` loop is useful for iterating over a sequence, while `while` repeats as long as a condition is true.\n\nExample:\n`for number in range(3):`\n`    print(number)`\n\nThis prints 0, 1, and 2. Indentation defines the loop body.' },
    { keys: ['function', 'functions', 'def', 'return'], answer: 'A function is a reusable block of code. Define it with `def`, give it parameters when needed, and call it by name.\n\nExample:\n`def greet(name):`\n`    return "Hello " + name`\n\n`print(greet("Ada"))`\n\nUse `return` when the function should give a value back to its caller.' },
    { keys: ['if', 'else', 'elif', 'condition', 'conditional'], answer: 'Use conditional statements to choose which code runs based on a condition.\n\nExample:\n`score = 80`\n`if score >= 60:`\n`    print("Pass")`\n`else:`\n`    print("Try again")`\n\nEvery branch needs a colon, and its body must be indented.' },
    { keys: ['list', 'lists', 'array', 'tuple', 'set'], answer: 'A list stores ordered, changeable values inside square brackets. Indexing starts at 0.\n\nExample:\n`colors = ["red", "blue"]`\n`colors.append("green")`\n`print(colors[0])`\n\nUse a tuple for an ordered collection that should not change, or a set for unique values.' },
    { keys: ['dictionary', 'dictionaries', 'dict', 'key value', 'key-value'], answer: 'A dictionary stores values under readable keys using curly braces.\n\nExample:\n`user = {"name": "Ada"}`\n`print(user["name"])`\n\nUse `.get("key")` when a key may be missing and you want to avoid a `KeyError`.' },
    { keys: ['class', 'object', 'oop', 'object oriented'], answer: 'A class is a blueprint for objects. It can define data as attributes and behavior as methods.\n\nExample:\n`class Dog:`\n`    def __init__(self, name):`\n`        self.name = name`\n\n`pet = Dog("Milo")`\n`print(pet.name)`' },
    { keys: ['error', 'bug', 'debug', 'syntaxerror', 'nameerror', 'typeerror', 'indexerror', 'keyerror', 'exception'], answer: 'Start debugging by reading the exception type, message, and line number.\n\n`SyntaxError`: the code structure is invalid.\n`NameError`: a name is missing or misspelled.\n`TypeError`: an operation uses incompatible types.\n`IndexError`: a sequence index is out of range.\n`KeyError`: a dictionary key does not exist.\n\nShare the error and the smallest relevant code sample, and I will walk through it line by line.' }
];

function getTutorContext() {
    const lesson = typeof lessonsData !== 'undefined' ? lessonsData[currentLessonId] : null;
    const challenge = typeof lessonsData !== 'undefined' ? lessonsData[activeChallengeLesson] : null;
    return { lesson, challenge };
}

function getGeminiApiKey() {
    let key = '';
    if (typeof window.CUTIEPY_GEMINI_API_KEY === 'string') {
        key = window.CUTIEPY_GEMINI_API_KEY.trim();
    }
    if (!key) {
        key = (localStorage.getItem('CUTIEPY_GEMINI_API_KEY') || sessionStorage.getItem('CUTIEPY_GEMINI_API_KEY') || '').trim();
    }
    if (key === 'YOUR_GEMINI_API_KEY_HERE' || key.startsWith('YOUR_')) {
        return '';
    }
    return key;
}

function buildGeminiPrompt(question) {
    const { lesson, challenge } = getTutorContext();
    return `You are Chikawa, a cute, patient, English-speaking Python tutor inside the CutiePy learning app.
Answer the user's question accurately and clearly. You can answer general questions, but prioritize Python learning when relevant.
Use short sections, concrete examples, and fenced Python code when useful. Explain why code works. For exercises, guide the student step by step and do not hide important reasoning.
If the user shares code, review it and identify the exact issue before suggesting a corrected version. If the question is ambiguous, ask one focused follow-up question.
Current lesson: ${lesson?.title || 'None'}
Current challenge: ${challenge?.challengeTask || 'None'}

User question:
${question}`;
}

async function askGemini(question) {
    const apiKey = getGeminiApiKey();
    if (!apiKey) return null;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: buildGeminiPrompt(question) }] }],
            generationConfig: { temperature: 0.35, maxOutputTokens: 900 }
        })
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const apiMessage = errorData?.error?.message || `HTTP ${response.status}`;
        throw new Error(`Gemini request failed: ${apiMessage}`);
    }
    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
    if (!answer) throw new Error('Gemini returned an empty response');
    return answer;
}

function getAiTutorAnswer(question) {
    const normalized = question.toLowerCase().trim();
    const codeMatch = question.match(/```[\s\S]*?```|(?:^|\n)\s*(?:print|def|class|if|for|while|import|[a-zA-Z_]\w*)\s*.*(?:\n|$)/);
    const { lesson, challenge } = getTutorContext();

    if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(normalized)) {
        return 'Hello! I am Chikawa, your English-speaking Python tutor. Ask me to explain a concept, review code, solve an exercise, or debug an error.';
    }
    if (/\b(thank you|thanks)\b/.test(normalized)) return 'You are welcome! Keep experimenting, and send me the next question whenever you are ready.';
    if (/\b(who are you|what can you do|help)\b/.test(normalized)) {
        return 'I am Chikawa, your Python learning assistant. I can explain concepts, provide examples, break problems into steps, review code, diagnose common errors, and give hints for the current lesson or challenge.';
    }
    if (codeMatch && (/[=():\[\]]/.test(question) || normalized.includes('code') || normalized.includes('error'))) {
        return analyzeSubmittedCode(question);
    }

    const match = aiTutorKnowledge.find(topic => topic.keys.some(key => normalized.includes(key)));
    if (match) return match.answer;
    if (/\b(challenge|exercise|task|hint)\b/.test(normalized)) {
        return `You are working on ${challenge?.title || 'a Python challenge'}. Read the task carefully, split it into input, processing, and output, then test each step with ${'`print()`'}. You can paste your attempt here and I will give you a hint without taking over.`;
    }
    if (/\b(lesson|learn|current topic)\b/.test(normalized)) {
        return `You are currently viewing ${lesson?.title || 'a Python lesson'}. Try the example, change one small part, and run it again. Ask me about any line or concept that feels unclear.`;
    }
    return `I can help with that. Tell me what you are trying to build, what you expected, and what happened instead. For the most useful answer, include your Python code or error message.\n\nI can explain the idea, suggest a solution, or guide you step by step without simply giving away an exercise answer.`;
}

function analyzeSubmittedCode(question) {
    const code = question.replace(/```python|```/gi, '').trim();
    if (/\bprint\s*\([^)]*$/.test(code)) return 'This looks like an unfinished `print()` call. Check that every opening parenthesis has a matching `)` and that text is inside quotes.\n\nExample:\n`print("Hello")`';
    if (/^\s*(if|for|while|def|class|else|elif|try|except)\b[^:\n]*$/m.test(code)) return 'A Python block statement needs a colon at the end of its header. Add `:` and indent the lines that belong to the block.\n\nExample:\n`if score >= 60:`\n`    print("Pass")`';
    if (/\bNameError\b/i.test(code)) return 'This is a `NameError`: Python cannot find the name you used. Check its spelling, make sure it was assigned before use, and verify that it is in the current scope.';
    if (/\b(TypeError|unsupported operand|can only concatenate)\b/i.test(code)) return 'This is likely a type mismatch. Inspect the values with `print(type(value))`, then convert them explicitly when appropriate, for example `int(text)` or `str(number)`.';
    if (/\b(SyntaxError|IndentationError)\b/i.test(code)) return 'This is a syntax or indentation issue. Check colons after block headers, matching brackets and quotes, and use consistent indentation, usually four spaces.';
    return `I can review this code, but I need its goal or the exact error to give a precise diagnosis.\n\nTry describing what you expected this code to do and what output you received.\n\nCode received:\n${code.slice(0, 700)}`;
}

function renderAiTutorMessage(text, sender) {
    const messages = document.getElementById('ai-tutor-messages');
    if (!messages) return;
    const message = document.createElement('div');
    message.className = `ai-tutor-message ${sender}`;
    message.innerHTML = formatTutorMarkdown(text);
    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
}

function formatTutorMarkdown(text) {
    const escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    const codeBlocks = [];
    const protectedText = escaped.replace(/```(?:python)?\s*([\s\S]*?)```/gi, (_, code) => {
        codeBlocks.push(`<pre><code>${code.trim()}</code></pre>`);
        return `\u0000CODE${codeBlocks.length - 1}\u0000`;
    });
    const formatted = protectedText
        .replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
        .replace(/^##\s+(.+)$/gm, '<h3>$1</h3>')
        .replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
        .replace(/^\s*---\s*$/gm, '<hr>')
        .replace(/`([^`\n]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br>');
    return formatted.replace(/\u0000CODE(\d+)\u0000/g, (_, index) => codeBlocks[index]);
}

function saveAiTutorMessage(text, sender) {
    const history = JSON.parse(localStorage.getItem(aiTutorStorageKey) || '[]');
    history.push({ text, sender });
    localStorage.setItem(aiTutorStorageKey, JSON.stringify(history.slice(-20)));
}

async function askAiTutor(question) {
    const input = document.getElementById('ai-tutor-input');
    if (!question || !question.trim()) return;
    const cleanQuestion = question.trim();
    renderAiTutorMessage(cleanQuestion, 'user');
    saveAiTutorMessage(cleanQuestion, 'user');
    const typingId = `ai-tutor-typing-${Date.now()}`;
    renderAiTutorMessage('Thinking...', 'bot');
    const messages = document.getElementById('ai-tutor-messages');
    const typingMessage = messages?.lastElementChild;
    if (typingMessage) typingMessage.id = typingId;
    if (input) input.value = '';

    let answer;
    try {
        answer = await askGemini(cleanQuestion);
        if (!answer) answer = getAiTutorAnswer(cleanQuestion);
    } catch (error) {
        console.warn('Gemini is unavailable. Using the local tutor fallback.', error);
        answer = `${getAiTutorAnswer(cleanQuestion)}\n\n[Gemini is unavailable: ${error.message}. This answer came from Chikawa's built-in tutor.]`;
    }
    const currentTypingMessage = document.getElementById(typingId);
    if (currentTypingMessage) currentTypingMessage.remove();
    renderAiTutorMessage(answer, 'bot');
    saveAiTutorMessage(answer, 'bot');
}

function submitAiTutor(event) {
    event.preventDefault();
    askAiTutor(document.getElementById('ai-tutor-input').value);
}

function toggleAiTutor(forceState) {
    const tutor = document.getElementById('ai-tutor');
    const toggle = document.getElementById('ai-tutor-toggle');
    if (!tutor || !toggle) return;
    const isOpen = typeof forceState === 'boolean' ? forceState : !tutor.classList.contains('is-open');
    tutor.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen) document.getElementById('ai-tutor-input')?.focus();
}

document.addEventListener('DOMContentLoaded', () => {
    ensureAiTutorWidget();
    const history = JSON.parse(localStorage.getItem(aiTutorStorageKey) || '[]').map(item => ({
        ...item,
        text: item.text.replace(/CutieBot/g, 'Chikawa')
    }));
    localStorage.setItem(aiTutorStorageKey, JSON.stringify(history));
    if (history.length) history.forEach(item => renderAiTutorMessage(item.text, item.sender));
    else renderAiTutorMessage('Hello! I am Chikawa, your English-speaking Python tutor. Ask me about a concept, share an error, or paste your code for review.', 'bot');
});