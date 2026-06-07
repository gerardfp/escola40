module.exports = function(options, context) {
    const title = options.title || options.titulo || 'Actividad';
    const content = options.content || '';
    return `<div class="edumark-block activity">
<div class="block-title">${title}</div>
<div class="block-content">
${content}
</div>
</div>`;
};
