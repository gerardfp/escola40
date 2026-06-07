module.exports = function(options, context) {
    const titulo = options.titulo || "Tabla de Datos";
    const datos = options.datos || [];
    
    let html = `
    <div class="custom-ataula-container" style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); border-radius: 16px; padding: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); border: 1px solid rgba(255, 255, 255, 0.3); font-family: system-ui, -apple-system, sans-serif; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #1e293b; font-size: 1.25rem; font-weight: 700; margin-bottom: 15px; border-left: 4px solid #3b82f6; padding-left: 10px;">${titulo}</h3>
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr style="border-bottom: 2px solid #e2e8f0;">
                        <th style="padding: 10px; color: #64748b; font-size: 0.85rem; text-transform: uppercase; font-weight: 600;">Nombre</th>
                        <th style="padding: 10px; color: #64748b; font-size: 0.85rem; text-transform: uppercase; font-weight: 600;">Rol</th>
                        <th style="padding: 10px; color: #64748b; font-size: 0.85rem; text-transform: uppercase; font-weight: 600;">Estado</th>
                    </tr>
                </thead>
                <tbody>
    `;

    datos.forEach((item, index) => {
        const bg = index % 2 === 0 ? "rgba(248, 250, 252, 0.6)" : "transparent";
        const statusColor = item.estado === "Activo" ? "#10b981" : "#f59e0b";
        const statusBg = item.estado === "Activo" ? "#ecfdf5" : "#fffbeb";
        
        html += `
                    <tr style="background: ${bg}; border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 12px 10px; color: #0f172a; font-weight: 500;">${item.nombre}</td>
                        <td style="padding: 12px 10px; color: #475569;">${item.rol}</td>
                        <td style="padding: 12px 10px;">
                            <span style="display: inline-block; padding: 4px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 600; color: ${statusColor}; background: ${statusBg};">${item.estado}</span>
                        </td>
                    </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
        <div style="margin-top: 15px; font-size: 0.8rem; color: #94a3b8; display: flex; justify-content: space-between;">
            <span>Total: ${datos.length} filas</span>
            <span>Compilado por edu2elpx</span>
        </div>
    </div>
    `;

    return html;
};
