const crypto = require('crypto');

module.exports = function(options, context) {
    const title = options.title || options.titulo || 'Atención';
    const content = options.content || '';

    const hash = crypto.createHash('md5').update(title + content).digest('hex').substring(0, 8);
    const id = 'atencion_' + hash;

    return `
        <style>
            .${id}-box {
                background-color: #fef2f2;
                border: 2.5px solid #b91c1c;
                border-radius: 14px;
                padding: 16px 20px;
                margin: 24px 0;
                position: relative;
                overflow: hidden;
                box-shadow: 0 4px 10px -1px rgba(185, 28, 28, 0.05), 0 2px 4px -1px rgba(185, 28, 28, 0.02);
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                font-family: 'Atkinson-Hyperlegible', 'Montserrat', 'Segoe UI', sans-serif;
                isolation: isolate;
            }
            .${id}-box:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 20px -3px rgba(185, 28, 28, 0.1), 0 4px 6px -2px rgba(185, 28, 28, 0.05);
            }
            .${id}-layout {
                display: flex;
                align-items: flex-start;
                gap: 20px;
                position: relative;
                z-index: 2;
            }
            .${id}-icon-container {
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 60px;
                height: 60px;
                border-radius: 12px;
                background-color: rgba(185, 28, 28, 0.04);
                border: 1px dashed rgba(185, 28, 28, 0.18);
                padding: 6px;
            }
            .${id}-body {
                flex-grow: 1;
            }
            .${id}-content {
                color: #7f1d1d;
                font-size: 1.05em;
                line-height: 1.65;
            }
            .${id}-content p {
                margin-top: 0;
                margin-bottom: 12px;
            }
            .${id}-content p:last-child {
                margin-bottom: 0;
            }
            /* Custom OL List Formatting */
            .${id}-content ol {
                list-style: none;
                counter-reset: custom-counter;
                padding-left: 0;
                margin: 16px 0;
            }
            .${id}-content ol li {
                counter-increment: custom-counter;
                position: relative;
                padding-left: 36px;
                margin-bottom: 14px;
                line-height: 1.6;
            }
            .${id}-content ol li:last-child {
                margin-bottom: 0;
            }
            .${id}-content ol li::before {
                content: counter(custom-counter);
                position: absolute;
                left: 0;
                top: 2px;
                width: 24px;
                height: 24px;
                background-color: #b91c1c;
                color: #ffffff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.82em;
                font-weight: 800;
                box-shadow: 0 2px 4px rgba(185, 28, 28, 0.25);
            }
            /* Custom UL List Formatting */
            .${id}-content ul {
                list-style: none;
                padding-left: 0;
                margin: 16px 0;
            }
            .${id}-content ul li {
                position: relative;
                padding-left: 24px;
                margin-bottom: 10px;
            }
            .${id}-content ul li::before {
                content: "";
                position: absolute;
                left: 6px;
                top: 9px;
                width: 6px;
                height: 6px;
                background-color: #ef4444;
                border-radius: 50%;
            }
            .${id}-watermark {
                position: absolute;
                right: 18px;
                bottom: -40px;
                font-size: 190px;
                font-weight: 900;
                color: rgba(185, 28, 28, 0.06);
                line-height: 1;
                pointer-events: none;
                user-select: none;
                z-index: 1;
                font-family: 'Atkinson-Hyperlegible', 'Montserrat', sans-serif;
            }
        </style>
        <div class="${id}-box">
            <div class="${id}-layout">
                <div class="${id}-icon-container">
                    <svg viewBox="0 0 24 24" width="48" height="48" fill="none">
                        <defs>
                            <linearGradient id="${id}-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#ef4444" />
                                <stop offset="100%" stop-color="#b91c1c" />
                            </linearGradient>
                            
                            <mask id="${id}-mask">
                                <rect x="0" y="0" width="24" height="24" fill="white" />
                                <!-- Cutout bold exclamation mark -->
                                <text x="12" y="17" font-size="12" font-family="'Atkinson-Hyperlegible', 'Montserrat', sans-serif" font-weight="900" fill="black" text-anchor="middle">!</text>
                            </mask>
                        </defs>
                        
                        <!-- Rounded Warning Triangle with cutout exclamation mark -->
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" 
                              fill="url(#${id}-gradient)" 
                              mask="url(#${id}-mask)" />
                    </svg>
                </div>
                <div class="${id}-body">
                    <div class="${id}-content">
                        ${content}
                    </div>
                </div>
            </div>
            <div class="${id}-watermark">!</div>
        </div>
    `;
};
