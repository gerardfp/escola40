const crypto = require('crypto');

function getLicenseHtml(license) {
    const lic = (license || '').toLowerCase();
    if (lic.includes('by-sa')) {
        return `<a href="https://creativecommons.org/licenses/by-sa/4.0/" rel="license" class="cc cc-by-sa"><span></span>Creative Commons BY-SA 4.0</a>`;
    }
    if (lic.includes('by-nc-sa')) {
        return `<a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="license" class="cc cc-by-nc-sa"><span></span>Creative Commons BY-NC-SA 4.0</a>`;
    }
    if (lic.includes('by-nc-nd')) {
        return `<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/" rel="license" class="cc cc-by-nc-nd"><span></span>Creative Commons BY-NC-ND 4.0</a>`;
    }
    if (lic.includes('by-nc')) {
        return `<a href="https://creativecommons.org/licenses/by-nc/4.0/" rel="license" class="cc cc-by-nc"><span></span>Creative Commons BY-NC 4.0</a>`;
    }
    if (lic.includes('by-nd')) {
        return `<a href="https://creativecommons.org/licenses/by-nd/4.0/" rel="license" class="cc cc-by-nd"><span></span>Creative Commons BY-ND 4.0</a>`;
    }
    if (lic.includes('by') && !lic.includes('nc') && !lic.includes('sa') && !lic.includes('nd')) {
        return `<a href="https://creativecommons.org/licenses/by/4.0/" rel="license" class="cc cc-by"><span></span>Creative Commons BY 4.0</a>`;
    }
    if (lic.includes('public domain') || lic.includes('cc0')) {
        return `<a href="https://creativecommons.org/publicdomain/zero/1.0/" rel="license" class="cc cc-zero"><span></span>CC0 1.0 Universal / Public Domain</a>`;
    }
    // fallback
    return `<span>${license || 'Creative Commons BY-SA 4.0'}</span>`;
}

module.exports = function(options, context) {
    const metadata = context.metadata || {};
    const isCatalan = !!(metadata.idioma && /catal|valenci/i.test(metadata.idioma));

    const title = metadata.titulo || metadata.title || options.titulo || options.title || (isCatalan ? "Títol del REA" : "Título del REA");
    const description = metadata.descripcion || metadata.description || options.descripcion || options.description || (isCatalan ? "Plantilla de creació de REA en eXeLearning per al projecte Escola 4.0" : "Plantilla creación de REA en eXeLearning para el proyecto Escola 4.0");
    const owner = metadata.propietario || options.propietario || "Conselleria de Educación, Cultura y Universidades de la Generalitat Valenciana";
    const author = metadata.autoria || metadata.author || options.autoria || options.author || (isCatalan ? "Autor del recurs" : "Autor del recurso");
    const licenseVal = metadata.licencia || metadata.license || options.licencia || options.license || "Creative Commons BY-SA 4.0";
    const licenseHtml = getLicenseHtml(licenseVal);

    const texts = {
        caption: isCatalan ? "Informació general sobre aquest recurs educatiu" : "Información general sobre este recurso educativo",
        title: isCatalan ? "Títol" : "Título",
        description: isCatalan ? "Descripció" : "Descripción",
        owner: isCatalan ? "Propietari" : "Propietario",
        author: isCatalan ? "Autoria" : "Autoría",
        license: isCatalan ? "Llicència" : "Licencia",
        credit: isCatalan 
            ? "Aquest contingut ha estat creat amb eXeLearning, el vostre editor de codi obert i gratuït per a crear recursos educatius."
            : "Este contenido ha sido creado con eXeLearning, vuestro editor de código abierto y gratuito para crear recursos educativos.",
        btnText: isCatalan ? "Baixa el fitxer .elp" : "Descarga el fichero .elp",
        warningTitle: isCatalan
            ? "Mode local: a causa de la política de seguretat del navegador, hauràs de seleccionar la carpeta des de la qual has obert aquest fitxer. En un servidor web això no serà necessari."
            : "Modo local: debido a la seguridad del navegador, tendrás que seleccionar la carpeta desde la que abriste este archivo. En un servidor web esto no será necesario."
    };

    // Generate unique 20-character digits string as eXeLearning standard ID
    const hash = crypto.createHash('md5').update(title + author).digest('hex').substring(0, 7);
    const digits = parseInt(hash, 16).toString().padStart(7, '0');
    const uniqueId = Date.now().toString() + digits + 'XW';

    return `
    <div id="${uniqueId}" class="idevice_node download-source-file" data-idevice-path="{REL_PREFIX}idevices/download-source-file/" data-idevice-type="download-source-file">
        <div class="exe-download-package-instructions">
            <table class="exe-table exe-package-info" style="width: 100%; height: 189px;">
                <caption>${texts.caption}</caption>
                <tbody>
                    <tr style="height: 42px;">
                        <th style="width: 15%; height: 42px;">${texts.title}</th>
                        <td><span class="exe-prop-title">${title}</span></td>
                    </tr>
                    <tr style="height: 65px;">
                        <th style="width: 15%; height: 65px;">${texts.description}</th>
                        <td><span class="exe-prop-description">${description}</span></td>
                    </tr>
                    <tr>
                        <th style="width: 15%;">${texts.owner}</th>
                        <td>${owner}</td>
                    </tr>
                    <tr style="height: 41px;">
                        <th style="width: 15%; height: 41px;">${texts.author}</th>
                        <td><span class="exe-prop-author">${author}</span></td>
                    </tr>
                    <tr style="height: 41px;">
                        <th style="width: 15%; height: 41px;">${texts.license}</th>
                        <td><span class="exe-prop-license">${licenseHtml}</span></td>
                    </tr>
                </tbody>
            </table>
            <p style="text-align: center;">${texts.credit}</p>
        </div>
        <p class="exe-download-package-link">
            <a download="${title}.elpx" href="#" onclick="if(typeof downloadElpx==='function')downloadElpx();return false;" style="background-color:#107275;color:#ffffff;" title="${texts.warningTitle}" data-file-protocol-warning="true">${texts.btnText}</a>
            <span class="exe-file-protocol-warning" data-bs-toggle="tooltip" data-bs-placement="right" style="cursor: help; font-size: 0.9em; margin-left: 0.3em;" data-bs-original-title="${texts.warningTitle}"> ⚠️</span>
        </p>
    </div>
    `;
};
