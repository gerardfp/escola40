module.exports = function (options, context) {
    const metadata = context.metadata || {};
    const titleOrImg = options.title || options.titulo || "";
    const isImage = (str) => typeof str === 'string' && /\.(png|jpe?g|gif|svg|webp)$/i.test(str);

    const titulo = (!isImage(options.titulo) && options.titulo) || (!isImage(options.title) && options.title) || metadata.titulo || metadata.title || "Título de la situación de aprendizaje";
    const etapa = metadata.etapa || options.etapa || "Primaria";
    const nivel = metadata.nivel || options.nivel || "Nivel";
    const area = metadata.area || options.area || "Área";
    const tipo = metadata.tipo || options.tipo || "Desenchufada";
    const sesiones = metadata.sesiones || options.sesiones || "3";
    const imagen = isImage(titleOrImg) ? titleOrImg : (options.imagen || "portada.png");

    // Determine active category
    const activeTipo = (tipo || "").toLowerCase();
    const isDesenchufada = activeTipo.includes("desenchufada") || activeTipo.includes("desendollada");
    const isProgramacion = activeTipo.includes("programación") || activeTipo.includes("programacion") || activeTipo.includes("programació");
    const isRobotica = activeTipo.includes("robótica") || activeTipo.includes("robotica");

    // Dynamic paths for icons and banner
    const iconDesenchufada = `{REL_PREFIX}theme/img/desendollada.svg`;
    const iconProgramacion = `{REL_PREFIX}theme/img/programacio.svg`;
    const iconRobotica = `{REL_PREFIX}theme/img/robotica.svg`;
    const iconFlor = `{REL_PREFIX}theme/img/flor.svg`;
    const bannerUrl = `{REL_PREFIX}theme/img/banner_portada.png`;

    return `
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Plantilla Escola 4.0</title>

<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    background:#white;
    font-family:'Montserrat', sans-serif;
    color:#222;
}

.portada-page{
    width:100%;
    max-width:100%;
    aspect-ratio:16 / 9;
    margin:auto;
    position:relative;
    overflow:hidden;
    background: white;
    container-type:size;
}

/* =========================
   DECORACIÓN SUPERIOR
========================= */

.portada-top-left-shape{
    position:absolute;
    top: 0;
    left: 0;
    width:9.38cqw;
    height:9.38cqw;
    z-index: 100;
}

.portada-top-left-shape img{
    width:100%;
    height:100%;
    object-fit:contain;
}

.portada-header{
    position:absolute;
    top:2.96%;
    left:5.73%;
    right:0;
    height:10.93%;
    background:#1f6898;
    display:flex;
    align-items:center;
    padding-left:2.86cqw;
}

.portada-header h1{
    color:white;
    font-size:3.33cqw;
    font-weight:800;
    margin: 0;
    padding-inline-start: 0.8em;
}

/* =========================
   SIDEBAR
========================= */

.portada-sidebar{
    position:absolute;
    left:2.34%;
    top:17.59%;
    width:24.48%;
}

.portada-info-box{
    background:#e9e9e9;
    border-radius:1.15cqw;
    padding:0.94cqw 1.15cqw;
    margin-bottom:1.77cqw;
}

.portada-info-box h3{
    text-align:center;
    font-size:1.25cqw;
    font-weight:700;
    margin-bottom:0.52cqw;
}

.portada-info-box .portada-value{
    background: white;
    border-radius:0.83cqw;
    /* height:5.93cqh; */
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:1.25cqw;
    text-align: center;
    padding: 0.5cqw;
}

/* =========================
   CATEGORÍAS
========================= */

.portada-categories{
    margin-top:1.04cqw;
    margin-left:4.17cqw;
}

.portada-category{
    display:flex;
    align-items:center;
    gap:0.94cqw;
    margin-bottom:1.56cqw;
    font-size:1.46cqw;
    color:#888;
}

.portada-category.active{
    color:#ff531f;
    font-weight:700;
}

.portada-icon{
    width:2.29cqw;
    height:2.29cqw;
    border-radius:50%;
    background:#aaa;
    color:white;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:1.04cqw;
    overflow:hidden;
}

.portada-category.active .portada-icon{
    background:#ff531f;
}

.portada-icon img {
    width:100%;
    height:100%;
    object-fit:cover;
}

/* =========================
   SESIONES
========================= */

.portada-sessions{
    margin-top:2.08cqw;
    background:#e9e9e9;
    border-radius:1.15cqw;
    padding:0.94cqw 1.35cqw;
    display:flex;
    align-items:center;
    justify-content:space-between;
}

.portada-sessions span{
    font-size:1.25cqw;
    font-weight:700;
}

.portada-sessions .portada-number{
    width:10.42cqw;
    height:5cqh;
    background: white;
    border-radius:999px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:1.35cqw;
}

/* =========================
   CONTENIDO CENTRAL
========================= */

.portada-main-image{
    position:absolute;
    top:17.59%;
    left:30.21%;
    width:66%;
    aspect-ratio:1210 / 680;
    overflow:hidden;
    border:0.1cqw solid #d2d2d2;
}

.portada-main-image img{
    width:100%;
    height:100%;
    object-fit:cover;
}

.portada-blue-line{
    position:absolute;
    left:30.21%;
    top:87.5%;
    width:66%;
    height:1.48%;
    background:#1f6898;
}

/* =========================
   FOOTER
========================= */

.portada-footer{
    position:absolute;
    bottom:1%;
    text-align:center;
    left: 30.21%;
    width: 66%;
}

.portada-logos{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:3.13cqw;
    margin-top:0.94cqw;
    width:100%;
}

.portada-logos img{
    max-height:8.4cqh;
    width:auto;
    max-width:100%;
    object-fit:contain;
}

.portada-footer p{
    color:#4c7bb2;
    font-size:0.94cqw;
    letter-spacing:0.05cqw;
}

/* =========================
   LICENCIA
========================= */

.portada-cc{
    position:absolute;
    bottom:0.8%;
    left:1.04%;
    display:flex;
    gap:0.31cqw;
}

</style>
</head>

<body>

<div class="portada-page">

    <div class="portada-top-left-shape">
        <img src="${iconFlor}" alt="Decoración">
    </div>

    <div class="portada-header">
        <h1>${titulo}</h1>
    </div>

    <aside class="portada-sidebar">

        <div class="portada-info-box">
            <h3>Etapa</h3>
            <div class="portada-value">${etapa}</div>
        </div>

        <div class="portada-info-box">
            <h3>Nivel</h3>
            <div class="portada-value">${nivel}</div>
        </div>

        <div class="portada-info-box">
            <h3>Área</h3>
            <div class="portada-value">${area}</div>
        </div>

        <div class="portada-categories">

            <div class="portada-category ${isDesenchufada ? 'active' : ''}">
                <div class="portada-icon" style="${isDesenchufada ? 'background:#ff531f;' : 'background:#aaa; filter:grayscale(1);'}">
                    <img src="${iconDesenchufada}" alt="Desenchufada">
                </div>
                <span>Desenchufada</span>
            </div>

            <div class="portada-category ${isProgramacion ? 'active' : ''}">
                <div class="portada-icon" style="${isProgramacion ? 'background:#ff531f;' : 'background:#aaa; filter:grayscale(1);'}">
                    <img src="${iconProgramacion}" alt="Programación">
                </div>
                <span>Programación</span>
            </div>

            <div class="portada-category ${isRobotica ? 'active' : ''}">
                <div class="portada-icon" style="${isRobotica ? 'background:#ff531f;' : 'background:#aaa; filter:grayscale(1);'}">
                    <img src="${iconRobotica}" alt="Robótica">
                </div>
                <span>Robótica</span>
            </div>

        </div>

        <div class="portada-sessions">
            <span>Sesiones</span>
            <div class="portada-number">${sesiones}</div>
        </div>

    </aside>

    <section class="portada-main-image">
        <img src="${imagen}" alt="${titulo}">
    </section>

    <div class="portada-blue-line"></div>

    <footer class="portada-footer">

        <div class="portada-logos">
            <img src="${bannerUrl}" alt="Logos">
        </div>
    </footer>

    <div class="portada-cc">
        <img src="{REL_PREFIX}theme/img/ccbysa.svg" alt="CC BY-SA" style="height: 18px; width: auto;" />
    </div>

</div>

</body>
</html>
    `;
};