const crypto = require('crypto');

module.exports = function(options, context) {
    const title = options.title || options.titulo || 'Pregúntate';
    const content = options.content || '';

    // Generate unique ID to avoid style and asset ID collision
    const hash = crypto.createHash('md5').update(title + content).digest('hex').substring(0, 8);
    const id = 'preguntate_' + hash;

    return `
        <style>
            .${id}-box {
                background-color: #faf5ff;
                border: 2.5px solid #6b21a8;
                border-radius: 14px;
                padding: 16px 20px;
                margin: 24px 0;
                position: relative;
                overflow: hidden;
                box-shadow: 0 4px 10px -1px rgba(107, 33, 168, 0.05), 0 2px 4px -1px rgba(107, 33, 168, 0.02);
                transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                font-family: 'Atkinson-Hyperlegible', 'Montserrat', 'Segoe UI', sans-serif;
                isolation: isolate;
            }
            .${id}-box:hover {
                transform: translateY(-2px);
                box-shadow: 0 12px 20px -3px rgba(107, 33, 168, 0.1), 0 4px 6px -2px rgba(107, 33, 168, 0.05);
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
                background-color: rgba(107, 33, 168, 0.04);
                border: 1px dashed rgba(107, 33, 168, 0.18);
                padding: 6px;
            }
            .${id}-body {
                flex-grow: 1;
            }
            .${id}-content {
                color: #3b0764;
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
                background-color: #6b21a8;
                color: #ffffff;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.82em;
                font-weight: 800;
                box-shadow: 0 2px 4px rgba(107, 33, 168, 0.25);
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
                background-color: #9333ea;
                border-radius: 50%;
            }
            .${id}-watermark {
                position: absolute;
                right: 10px;
                bottom: -40px;
                font-size: 190px;
                font-weight: 900;
                color: rgba(107, 33, 168, 0.07);
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
                            <!-- Linear gradient for the cloud fill -->
                            <linearGradient id="${id}-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#a855f7" />
                                <stop offset="100%" stop-color="#6b21a8" />
                            </linearGradient>
                            
                            <!-- Mask that cuts out the question mark -->
                            <mask id="${id}-mask">
                                <!-- White background to draw the cloud -->
                                <rect x="0" y="0" width="24" height="24" fill="white" />
                                <!-- Black question mark to slice/cut it out -->
                                <text x="11.2" y="13.2" font-size="6.5" font-family="'Atkinson-Hyperlegible', 'Montserrat', sans-serif" font-weight="900" fill="black" text-anchor="middle">?</text>
                            </mask>
                        </defs>
                        
                        <!-- Small bubbles of the thought cloud with same gradient -->
                        <circle cx="5" cy="18.5" r="1.1" fill="url(#${id}-gradient)" />
                        <circle cx="8" cy="16.5" r="1.9" fill="url(#${id}-gradient)" />
                        
                        <!-- Main cloud path with gradient fill and cut-out mask -->
                        <path d="M16 8.5c.3-1.8-1-3.5-2.8-3.8-1.8-.3-3.5.7-3.8 2.5C8.3 7 7 8.3 6.8 10c-1.5.2-2.6 1.5-2.4 3 .2 1.5 1.5 2.6 3 2.4h9.2c1.7 0 3-1.3 3-3 0-1.4-1-2.6-2.4-2.9C17.3 9.1 16.8 8.7 16 8.5z" 
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
            <div class="${id}-watermark">?</div>
        </div>
    `;
};
