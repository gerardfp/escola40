module.exports = {
    transformLine: (line) => {
        // Mapear > Título a #seccion Título
        const mSec = line.match(/^>\s+(.+)$/);
        if (mSec && !line.trim().startsWith('>>')) {
            return `#seccion ${mSec[1]}`;
        }

        // Mapear @pagina o @page Título a #pagina Título
        const mPage = line.match(/^@(pagina|page)\s+(.+)$/);
        if (mPage) {
            return `#pagina ${mPage[2]}`;
        }

        // Mapear % Título a #item Título
        const mElem = line.match(/^%\s+(.+)$/);
        if (mElem) {
            return `#item ${mElem[1]}`;
        }

        return line;
    }
};
