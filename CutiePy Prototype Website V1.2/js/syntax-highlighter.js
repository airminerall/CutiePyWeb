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

function insertCodeText(codeInput, text, selectionEnd = codeInput.selectionEnd) {
    const start = codeInput.selectionStart;
    const value = codeInput.value;
    codeInput.value = value.slice(0, start) + text + value.slice(codeInput.selectionEnd);
    codeInput.selectionStart = selectionEnd;
    codeInput.selectionEnd = selectionEnd;
    codeInput.dispatchEvent(new Event('input'));
}

function handleCodeIndentation(event) {
    const codeInput = event.currentTarget;
    const start = codeInput.selectionStart;
    const end = codeInput.selectionEnd;
    const value = codeInput.value;

    if (event.key === 'Tab') {
        event.preventDefault();
        if (event.shiftKey) {
            const lineStart = value.lastIndexOf('\n', start - 1) + 1;
            const indentation = value.slice(lineStart, start).match(/^ {1,4}/)?.[0] || '';
            const removeCount = Math.min(4, indentation.length);
            codeInput.value = value.slice(0, lineStart) + value.slice(lineStart + removeCount);
            codeInput.selectionStart = Math.max(lineStart, start - removeCount);
            codeInput.selectionEnd = Math.max(lineStart, end - removeCount);
        } else if (start !== end && value.slice(start, end).includes('\n')) {
            const selectedLines = value.slice(start, end).split('\n');
            const lineStart = value.lastIndexOf('\n', start - 1) + 1;
            const indented = selectedLines.map(line => `    ${line}`).join('\n');
            codeInput.value = value.slice(0, lineStart) + indented + value.slice(end);
            codeInput.selectionStart = start + 4;
            codeInput.selectionEnd = end + (selectedLines.length * 4);
        } else {
            insertCodeText(codeInput, '    ', start + 4);
            return;
        }
        codeInput.dispatchEvent(new Event('input'));
        return;
    }

    if (event.key !== 'Enter' || start !== end) return;
    event.preventDefault();
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const currentLine = value.slice(lineStart, start);
    const indentation = currentLine.match(/^\s*/)?.[0] || '';
    const extraIndent = /:\s*(#.*)?$/.test(currentLine.trim()) ? '    ' : '';
    insertCodeText(codeInput, `\n${indentation}${extraIndent}`, start + 1 + indentation.length + extraIndent.length);
}

function setupCodeHighlighting() {
    document.querySelectorAll('textarea.code-input').forEach(codeInput => {
        codeInput.addEventListener('input', () => updateCodeHighlight(codeInput));
        codeInput.addEventListener('scroll', () => updateCodeHighlight(codeInput));
        codeInput.addEventListener('keydown', handleCodeIndentation);
        updateCodeHighlight(codeInput);
    });
}
