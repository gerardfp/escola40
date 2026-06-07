module.exports = function(options, context) {
    const level = options.level || 1;
    const title = options.title || options.titulo || '';
    const hTag = `h${level}`;
    
    // Escaping special characters for HTML safety
    const escapedTitle = title
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
        
    return `<${hTag}>${escapedTitle}</${hTag}>\n`;
};
