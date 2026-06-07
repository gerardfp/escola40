const DIMENSION_KEYS = [
    {
        key: 'Descomposición',
        tagClass: 'tag-descomposicion',
        regex: /^(descomposici[oó]n|descomposici[oó]):?\s*$/i
    },
    {
        key: 'Reconocimiento de patrones',
        tagClass: 'tag-patrones',
        regex: /^(reconocimiento\s+de\s+patrones|reconeixement\s+de\s+patrons):?\s*$/i
    },
    {
        key: 'Abstracción',
        tagClass: 'tag-abstraccion',
        regex: /^(abstracci[oó]n|abstracci[oó]):?\s*$/i
    },
    {
        key: 'Diseño algorítmico',
        tagClass: 'tag-algoritmico',
        regex: /^(dise[nñ]o\s+algor[ií]tmit?co|disseny\s+algor[ií]smic):?\s*$/i
    },
    {
        key: 'Evaluación',
        tagClass: 'tag-evaluacion',
        regex: /^(evaluaci[oó]n|avaluaci[oó]):?\s*$/i
    }
];

module.exports = function(options, context) {
    const metadata = context.metadata || {};
    const isCatalan = !!(metadata.idioma && /catal|valenci/i.test(metadata.idioma));

    const langTitles = {
        'Descomposición': isCatalan ? 'Descomposició' : 'Descomposición',
        'Reconocimiento de patrones': isCatalan ? 'Reconeixement de patrons' : 'Reconocimiento de patrones',
        'Abstracción': isCatalan ? 'Abstracció' : 'Abstracción',
        'Diseño algorítmico': isCatalan ? 'Disseny algorísmic' : 'Diseño algorítmico',
        'Evaluación': isCatalan ? 'Avaluació' : 'Evaluación'
    };

    const colHeaderDim = isCatalan ? 'DIMENSIÓ DEL PC' : 'DIMENSIÓN DEL PC';
    const colHeaderAction = isCatalan ? "ACCIÓ A L'AULA (Com s'activa?)" : "ACCIÓN EN EL AULA (¿Cómo se activa?)";

    // 1. Get raw text from children blocks
    const textBlocks = (options.children || []).filter(c => c.type === 'text');
    const rawText = textBlocks.map(c => (c.content || []).join('\n')).join('\n');

    // 2. Parse dimensions
    const lines = rawText.split(/\r?\n/);
    const dimensions = {
        'Descomposición': [],
        'Reconocimiento de patrones': [],
        'Abstracción': [],
        'Diseño algorítmico': [],
        'Evaluación': []
    };

    let currentKey = null;

    for (const line of lines) {
        const trimmed = line.trim();
        let matched = false;
        for (const dim of DIMENSION_KEYS) {
            if (dim.regex.test(trimmed)) {
                currentKey = dim.key;
                matched = true;
                break;
            }
        }
        if (matched) {
            continue;
        }
        if (currentKey) {
            dimensions[currentKey].push(line);
        }
    }

    // 3. Build HTML table rows
    let rowsHtml = '';
    for (const dim of DIMENSION_KEYS) {
        const key = dim.key;
        const rawContent = dimensions[key].join('\n').trim();
        const compiledHtml = rawContent ? context.compileMarkdown(rawContent) : '';

        rowsHtml += `
        <tr>
            <td style="width: 25%; min-width: 150px;">
                <span class="pc-dim-tag ${dim.tagClass}">${langTitles[key]}</span>
            </td>
            <td>
                <div class="pc-action-content">
                    ${compiledHtml || '<p style="color: #94a3b8; font-style: italic;">Sin especificar</p>'}
                </div>
            </td>
        </tr>
        `;
    }

    return `
    <style>
    .pc-table-container {
        margin: 24px 0;
        overflow-x: auto;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        border: 1px solid #e2e8f0;
    }
    .pc-table {
        width: 100%;
        border-collapse: collapse;
        font-family: 'Atkinson-Hyperlegible', 'Montserrat', sans-serif;
        background: #ffffff;
    }
    .pc-table th {
        background: linear-gradient(135deg, #1f628e 0%, #1f2853 100%);
        color: #ffffff;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.85em;
        letter-spacing: 0.05em;
        padding: 16px 20px;
        text-align: left;
    }
    .pc-table td {
        padding: 18px 20px;
        border-bottom: 1px solid #e2e8f0;
        vertical-align: top;
        line-height: 1.6;
    }
    .pc-table tr:last-child td {
        border-bottom: none;
    }
    .pc-dim-tag {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.9em;
        font-weight: 700;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
    }
    .tag-descomposicion { background: #f3f0ff; color: #6b21a8; border: 1px solid #e9d5ff; }
    .tag-patrones { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    .tag-abstraccion { background: #fef3c7; color: #d97706; border: 1px solid #fde68a; }
    .tag-algoritmico { background: #e0e7ff; color: #4338ca; border: 1px solid #c7d2fe; }
    .tag-evaluacion { background: #fce7f3; color: #db2777; border: 1px solid #fbcfe8; }

    .pc-action-content {
        font-size: 0.95em;
        color: #334155;
    }
    .pc-action-content p {
        margin: 0 0 10px 0;
    }
    .pc-action-content p:last-child {
        margin-bottom: 0;
    }
    .pc-action-content ul, .pc-action-content ol {
        margin: 8px 0;
        padding-left: 20px;
    }
    .pc-action-content li {
        margin-bottom: 6px;
    }
    </style>
    <div class="pc-table-container">
        <table class="pc-table">
            <thead>
                <tr>
                    <th>${colHeaderDim}</th>
                    <th>${colHeaderAction}</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
        </table>
    </div>
    `;
};
