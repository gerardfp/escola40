module.exports = function(options, context) {
    const metadata = context.metadata || {};

    const titulo = metadata.titulo || metadata.title || 'No especificado';
    const materia = metadata.area || metadata.materia || 'No especificado';
    const nivel = metadata.nivel || metadata.level || 'No especificado';
    const sesiones = metadata.sesiones || metadata.num_sesiones || 'No especificado';
    const descripcion = metadata.descripcion || metadata.description || 'No especificado';
    const contextoVal = metadata.contexto || metadata.context || 'No especificado';

    // Premium styling options
    const cardStyle = `
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
        border: 1px solid #e2e8f0;
        background: #ffffff;
        margin: 20px 0;
        font-family: 'Atkinson-Hyperlegible', 'Montserrat', Arial, sans-serif;
    `;

    const headerStyle = `
        background: linear-gradient(135deg, #1f628e, #1f2853);
        color: #ffffff;
        padding: 15px 20px;
        font-size: 1.25em;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 10px;
    `;

    const tableStyle = `
        width: 100%;
        border-collapse: collapse;
        margin: 0;
        font-size: 0.95em;
    `;

    const rowStyle = (index) => `
        background-color: ${index % 2 === 0 ? '#ffffff' : '#f8fafc'};
        border-bottom: 1px solid #f1f5f9;
    `;

    const cellLabelStyle = `
        padding: 14px 20px;
        font-weight: 700;
        color: #1f2853;
        width: 25%;
        text-align: left;
        vertical-align: top;
        border-right: 1px solid #f1f5f9;
        font-size: 0.85em;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    `;

    const cellValueStyle = `
        padding: 14px 20px;
        color: #334155;
        vertical-align: top;
        line-height: 1.6;
    `;

    // Markdown compiler helper that strips <p> tags for inline/single-line values
    const compile = (val) => {
        if (!val || val === 'No especificado') return val;
        if (typeof context.compileMarkdown === 'function') {
            let html = context.compileMarkdown(val).trim();
            // Strip surrounding <p> and </p> if it is a single paragraph to keep inline look clean in tables
            if (html.startsWith('<p>') && html.endsWith('</p>')) {
                const inner = html.substring(3, html.length - 4);
                if (!inner.includes('<p>')) {
                    html = inner;
                }
            }
            return html;
        }
        return val;
    };

    const tituloHtml = compile(titulo);
    const materiaHtml = compile(materia);
    const nivelHtml = compile(nivel);
    const sesionesHtml = compile(sesiones.toString().includes('sesiones') ? sesiones : `${sesiones} sesiones`);
    const descHtml = compile(descripcion);
    const contextHtml = compile(contextoVal);

    return `
        <div style="${cardStyle}">
            <table border="1" class="exe-table" style="width: 100%; border-collapse: collapse; border-color: #cbd5e1; margin: 0; font-size: 0.95em;">
                <tbody>
                    <tr style="height: 21px;">
                        <th style="width: 8.40509%; height: 10px; background-color: #e5f9f9; padding: 12px; border: 1px solid #cbd5e1; text-align: left; font-weight: bold; color: #1f2853; font-family: 'Atkinson-Hyperlegible', 'Montserrat', Arial, sans-serif;">Título</th>
                        <td colspan="5" style="height: 10px; width: 60.7427%; background-color: #ffffff; padding: 12px; border: 1px solid #cbd5e1; color: #334155; line-height: 1.6; vertical-align: top; font-family: 'Atkinson-Hyperlegible', 'Montserrat', Arial, sans-serif;">${tituloHtml}</td>
                    </tr>
                    <tr style="height: 21px;">
                        <th style="width: 8.40509%; height: 21px; background-color: #e5f9f9; padding: 12px; border: 1px solid #cbd5e1; text-align: left; font-weight: bold; color: #1f2853; font-family: 'Atkinson-Hyperlegible', 'Montserrat', Arial, sans-serif;">Área / Materia</th>
                        <td style="width: 25.9996%; height: 21px; background-color: #ffffff; padding: 12px; border: 1px solid #cbd5e1; color: #334155; line-height: 1.6; vertical-align: top; font-family: 'Atkinson-Hyperlegible', 'Montserrat', Arial, sans-serif;">${materiaHtml}</td>
                        <th style="width: 8.47137%; height: 21px; background-color: #e5f9f9; padding: 12px; border: 1px solid #cbd5e1; text-align: left; font-weight: bold; color: #1f2853; font-family: 'Atkinson-Hyperlegible', 'Montserrat', Arial, sans-serif;">Nivel y grupo</th>
                        <td style="width: 11.6904%; background-color: #ffffff; height: 21px; padding: 12px; border: 1px solid #cbd5e1; color: #334155; line-height: 1.6; vertical-align: top; font-family: 'Atkinson-Hyperlegible', 'Montserrat', Arial, sans-serif;">${nivelHtml}</td>
                        <th style="width: 9.4595%; background-color: #e5f9f9; height: 21px; padding: 12px; border: 1px solid #cbd5e1; text-align: left; font-weight: bold; color: #1f2853; font-family: 'Atkinson-Hyperlegible', 'Montserrat', Arial, sans-serif;">Número de sesiones</th>
                        <td style="width: 5.12184%; background-color: #ffffff; height: 21px; padding: 12px; border: 1px solid #cbd5e1; color: #334155; line-height: 1.6; vertical-align: top; font-family: 'Atkinson-Hyperlegible', 'Montserrat', Arial, sans-serif;">${sesionesHtml}</td>
                    </tr>
                    <tr style="height: 24px;">
                        <th style="width: 8.40509%; background-color: #e5f9f9; height: 24px; padding: 12px; border: 1px solid #cbd5e1; text-align: left; font-weight: bold; color: #1f2853; font-family: 'Atkinson-Hyperlegible', 'Montserrat', Arial, sans-serif;">Descripción y justificación</th>
                        <td colspan="5" style="background-color: #ffffff; height: 24px; padding: 12px; border: 1px solid #cbd5e1; color: #334155; line-height: 1.6; vertical-align: top; font-family: 'Atkinson-Hyperlegible', 'Montserrat', Arial, sans-serif;">
                            ${descHtml}
                        </td>
                    </tr>
                    <tr style="height: 24px;">
                        <th style="width: 8.40509%; background-color: #e5f9f9; height: 24px; padding: 12px; border: 1px solid #cbd5e1; text-align: left; font-weight: bold; color: #1f2853; font-family: 'Atkinson-Hyperlegible', 'Montserrat', Arial, sans-serif;">Contexto</th>
                        <td colspan="5" style="background-color: #ffffff; height: 24px; padding: 12px; border: 1px solid #cbd5e1; color: #334155; line-height: 1.6; vertical-align: top; font-family: 'Atkinson-Hyperlegible', 'Montserrat', Arial, sans-serif;">${contextHtml}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
};
