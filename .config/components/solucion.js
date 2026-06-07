module.exports = function(options, context) {
    const title = options.title || options.titulo || 'Solución';
    const content = options.content || '';
    return `<div class="edumark-block solution">
<div class="block-title">${title}</div>
<div class="block-content">
${content}
</div>
</div>`;
};
