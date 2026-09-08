function escapeHtml(value) {
    return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));
}

function highlightPython(code) {
    const tokenPattern = /#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:and|as|assert|break|class|continue|def|elif|else|False|for|from|if|import|in|is|None|not|or|pass|print|return|True|while|with|yield|range)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_]\w*(?=\s*\()/g;
    let highlightedCode = '';
    let lastIndex = 0;
    let match;
    while ((match = tokenPattern.exec(code)) !== null) {
        highlightedCode += escapeHtml(code.slice(lastIndex, match.index));
        const token = match[0];
        const escapedToken = escapeHtml(token);
        if (token.startsWith('#')) highlightedCode += `<span class="syntax-comment">${escapedToken}</span>`;
        else if (token.startsWith('"') || token.startsWith("'")) highlightedCode += `<span class="syntax-string">${escapedToken}</span>`;
        else if (/^\d/.test(token)) highlightedCode += `<span class="syntax-number">${escapedToken}</span>`;
        else if (/^(and|as|assert|break|class|continue|def|elif|else|False|for|from|if|import|in|is|None|not|or|pass|print|return|True|while|with|yield|range)$/.test(token)) highlightedCode += `<span class="syntax-keyword">${escapedToken}</span>`;
        else highlightedCode += `<span class="syntax-function">${escapedToken}</span>`;
        lastIndex = tokenPattern.lastIndex;
    }
    return highlightedCode + escapeHtml(code.slice(lastIndex));
}

function updateCodeHighlight(codeInput) {
    const highlight = document.getElementById(`${codeInput.id}-highlight`);
    if (!highlight) return;
    highlight.innerHTML = highlightPython(codeInput.value) || ' ';
    highlight.scrollTop = codeInput.scrollTop;
    highlight.scrollLeft = codeInput.scrollLeft;
}

function setCodeValue(id, value) {
    const codeInput = document.getElementById(id);
    codeInput.value = value;
    updateCodeHighlight(codeInput);
}

function setupCodeHighlighting() {
    document.querySelectorAll('textarea.code-input').forEach(codeInput => {
        codeInput.addEventListener('input', () => updateCodeHighlight(codeInput));
        codeInput.addEventListener('scroll', () => updateCodeHighlight(codeInput));
        updateCodeHighlight(codeInput);
    });
}
