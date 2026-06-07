const crypto = require('crypto');

module.exports = function(options, context) {
    const title = options.title || options.titulo || options.imagen || '';
    
    // Parse title to extract image path and parameters
    // Syntax: path.png {key1: val1, key2: val2}
    let imagePath = '';
    let paramsStr = '';
    const match = title.trim().match(/^(.*?)(?:\s*\{([^}]+)\})?$/);
    if (match) {
        imagePath = match[1].trim();
        paramsStr = match[2] || '';
    }

    if (!imagePath) {
        return `
            <div style="border: 2px dashed #ef4444; padding: 15px; border-radius: 8px; background-color: #fef2f2; color: #b91c1c; margin: 20px 0; font-family: 'Atkinson-Hyperlegible', sans-serif;">
                <div style="font-weight: bold; margin-bottom: 5px; display: flex; align-items: center; gap: 8px;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    <span>Error: Componente #imagen</span>
                </div>
                <div style="font-size: 13px;">No se ha especificado la ruta de la imagen. Sintaxis correcta: <code>#imagen ruta.png {ancho: 600}</code></div>
            </div>
        `;
    }

    // Parse parameters
    const attrs = {};
    if (paramsStr) {
        const pairs = paramsStr.split(',');
        for (const pair of pairs) {
            const eqIdx = pair.indexOf(':');
            if (eqIdx !== -1) {
                const k = pair.substring(0, eqIdx).trim().toLowerCase();
                const v = pair.substring(eqIdx + 1).trim();
                attrs[k] = v;
            }
        }
    }

    // Get parameters
    const width = options.ancho || options.width || attrs.ancho || attrs.width || '';
    const height = options.alto || options.height || attrs.alto || attrs.height || '';
    const align = options.alineacion || options.alineación || options.align || attrs.alineacion || attrs.alineación || attrs.align || 'centro';
    const caption = options.pie || options.caption || attrs.pie || attrs.caption || '';
    const hasBorder = options.borde === 'si' || options.borde === 'yes' || options.border === 'si' || options.border === 'yes' || attrs.borde === 'si' || attrs.borde === 'yes' || attrs.border === 'si' || attrs.border === 'yes';
    const hasShadow = options.sombra === 'si' || options.sombra === 'yes' || options.shadow === 'si' || options.shadow === 'yes' || attrs.sombra === 'si' || attrs.sombra === 'yes' || attrs.shadow === 'si' || attrs.shadow === 'yes';
    const customClass = options.clase || options.class || attrs.clase || attrs.class || '';

    // Build container wrapper styles
    let wrapperStyles = 'display: inline-block; max-width: 100%; position: relative; border-radius: 8px; overflow: hidden;';
    if (hasBorder) {
        wrapperStyles += ' border: 1px solid #e2e8f0;';
    }
    if (hasShadow) {
        wrapperStyles += ' box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04);';
    }

    // Alignment and flex layout for outer figure
    let figureStyle = 'margin: 24px 0; display: flex; flex-direction: column; width: 100%;';
    if (align === 'izquierda' || align === 'left') {
        figureStyle += ' align-items: flex-start; text-align: left;';
    } else if (align === 'derecha' || align === 'right') {
        figureStyle += ' align-items: flex-end; text-align: right;';
    } else {
        figureStyle += ' align-items: center; text-align: center;';
    }

    // Image dimensions
    let imgStyles = 'display: block; max-width: 100%; height: auto; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);';
    if (width) {
        const wVal = /^\d+$/.test(width) ? `${width}px` : width;
        imgStyles += ` width: ${wVal};`;
    }
    if (height) {
        const hVal = /^\d+$/.test(height) ? `${height}px` : height;
        imgStyles += ` height: ${hVal};`;
    }

    // Generate unique class/identifier based on a stable hash of the title to avoid conflicts
    const hash = crypto.createHash('md5').update(title).digest('hex').substring(0, 8);
    const uniqueId = 'img_' + hash;

    // Render caption
    let captionHtml = '';
    if (caption) {
        captionHtml = `<figcaption style="margin-top: 10px; font-size: 0.88em; color: #64748b; font-style: italic; font-family: 'Atkinson-Hyperlegible', 'Montserrat', sans-serif; line-height: 1.4;">${caption}</figcaption>`;
    }

    // Hover box shadow transition
    const hoverShadowStyle = hasShadow ? 'box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);' : '';

    return `
        <style>
            .${uniqueId}-wrap {
                ${wrapperStyles}
                transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }
            .${uniqueId}-wrap:hover {
                transform: translateY(-4px);
                ${hoverShadowStyle}
            }
            .${uniqueId}-wrap:hover img {
                transform: scale(1.02);
            }
        </style>
        <figure class="escola-image-figure ${customClass}" style="${figureStyle}">
            <div class="${uniqueId}-wrap">
                <img src="${imagePath}" alt="${caption || 'Imagen'}" style="${imgStyles}" />
            </div>
            ${captionHtml}
        </figure>
    `;
};
