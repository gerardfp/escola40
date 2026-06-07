module.exports = function(options, context) {
    const children = options.children || [];
    const items = [];
    let currentItem = null;
    let pendingLines = [];

    function flushPendingLines() {
        if (currentItem && pendingLines.length > 0) {
            const rawContent = pendingLines.join('\n');
            if (typeof context.compileMarkdown === 'function') {
                currentItem.html += context.compileMarkdown(rawContent);
            } else {
                currentItem.html += rawContent;
            }
            pendingLines = [];
        }
    }

    for (const child of children) {
        if (child.type === 'directive' && child.name === 'item') {
            flushPendingLines();
            currentItem = {
                title: child.title || '',
                html: ''
            };
            items.push(currentItem);
        } else if (child.type === 'text') {
            for (const line of child.content || []) {
                const trimmed = line.trim();
                const match = trimmed.match(/^%\s+(.+)$/);
                if (match) {
                    flushPendingLines();
                    currentItem = {
                        title: match[1].trim(),
                        html: ''
                    };
                    items.push(currentItem);
                } else {
                    if (trimmed === '' && !currentItem) {
                        continue;
                    }
                    if (!currentItem) {
                        currentItem = {
                            title: 'Introducción',
                            html: ''
                        };
                        items.push(currentItem);
                    }
                    pendingLines.push(line);
                }
            }
        } else {
            flushPendingLines();
            if (!currentItem) {
                currentItem = {
                    title: 'Introducción',
                    html: ''
                };
                items.push(currentItem);
            }
            if (typeof context.compileBlock === 'function') {
                currentItem.html += context.compileBlock(child) + '\n';
            }
        }
    }
    flushPendingLines();

    let html = `<div class="exe-fx exe-tabs" style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); margin: 15px 0;">\n`;
    for (const item of items) {
        html += `  <h2 style="font-family: 'Montserrat', sans-serif; font-weight: 600;">${item.title}</h2>\n`;
        html += `  <div style="padding: 20px; line-height: 1.6;">\n${item.html}\n  </div>\n`;
    }
    html += `</div>\n`;
    return html;
};
