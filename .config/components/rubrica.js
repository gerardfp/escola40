module.exports = function(options, context) {
    const title = options.title || options.titulo || 'Rúbrica';
    const content = options.content || '';
    return `<div class="edumark-block rubric">
<div class="block-title">${title}</div>
<div class="block-content">
${content}
</div>
</div>`;
};
