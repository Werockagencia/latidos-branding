// Favicons, PDF vectoriales de maestros (Chrome) y paquetes ZIP por ruta.
// uso: node src/pack.js  (con el servidor local corriendo no hace falta: usa file://)
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
global.window = {};
require(path.join(ROOT, 'assets/logos.js'));
const L = window.LATIDOS_LOGOS;

// favicons: símbolo en negativo sobre el color principal
const FAV = { r1: ['#0B1B3B', { a: '#C6FF3D', w: '#F8F5F0', p: '#F8F5F0' }], r2: ['#0B1B3B', { a: '#C6FF3D', w: '#F8F5F0', p: '#F8F5F0' }], r3: ['#F4F2F8', { p: '#3C1C4C', k: '#F4F2F8', a: '#C6FF3D' }] };
for (const [r, [bg, c]] of Object.entries(FAV)) {
  const s = L[r].symbol, [, , w, h] = s.box, S = Math.max(w, h) * 1.42;
  const tx = (S - w) / 2, ty = (S - h) / 2;
  fs.writeFileSync(path.join(ROOT, `assets/fav-${r}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S.toFixed(1)} ${S.toFixed(1)}"><rect width="${S.toFixed(1)}" height="${S.toFixed(1)}" rx="${(S * 0.22).toFixed(1)}" fill="${bg}"/><g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)})">${s.layers.map((l) => `<path fill="${c[l.role] || c.p}"${l.eo ? ' fill-rule="evenodd"' : ''} d="${l.d}"/>`).join('')}</g></svg>`);
}

// PDF de maestros por ruta: una versión por página, SVG en línea (vectorial)
const SLUG = { r1: 'Propuesta01_Pulso', r2: 'Propuesta02_Cumbre', r3: 'Propuesta03_Sello' };
const NAME = { r1: 'Propuesta 01 · Pulso', r2: 'Propuesta 02 · Cumbre', r3: 'Propuesta 03 · Sello' };
const svgDir = path.join(ROOT, 'descargas/svg'), pdfDir = path.join(ROOT, 'descargas/pdf');
fs.mkdirSync(pdfDir, { recursive: true });
const tmp = path.join(__dirname, 'traced');
for (const [r, slug] of Object.entries(SLUG)) {
  const files = fs.readdirSync(svgDir).filter((f) => f.includes(slug) && f.endsWith('.svg'));
  const order = ['Principal', 'Horizontal', 'Simbolo', 'Logotipo'], vord = ['Color.', 'Color-Negativo', 'Monocromo.', 'Monocromo-Negativo'];
  files.sort((a, b) => order.findIndex((o) => a.includes(`_${o}_`)) - order.findIndex((o) => b.includes(`_${o}_`)) || vord.findIndex((o) => a.includes(o)) - vord.findIndex((o) => b.includes(o)));
  const pages = files.map((f) => {
    const svg = fs.readFileSync(path.join(svgDir, f), 'utf8').replace(/<\?xml[^>]*>\s*/, '').replace(/<!--[\s\S]*?-->\s*/, '').replace(/ width="[^"]+" height="[^"]+"/, '');
    const neg = /Negativo/.test(f);
    const label = f.replace(`Latidos_${slug}_`, '').replace('.svg', '').replace(/_/g, ' · ');
    return `<section class="${neg ? 'neg' : ''}"><div class="art">${svg}</div><footer><b>Latidos</b> · ${NAME[r]} · ${label}<span>Maestro vectorial · tintas planas · We Rock Agencia</span></footer></section>`;
  }).join('');
  const html = `<!doctype html><meta charset="utf-8"><style>@page{size:297mm 210mm;margin:0}*{box-sizing:border-box}body{margin:0;font:9pt/1.4 Arial,sans-serif;color:#555}section{width:297mm;height:210mm;page-break-after:always;position:relative;display:grid;place-items:center;padding:28mm 40mm 34mm}section .art{width:100%;height:100%;display:grid;place-items:center}section svg{max-width:100%;max-height:100%;width:100%;height:100%}footer{position:absolute;left:14mm;right:14mm;bottom:10mm;display:flex;justify-content:space-between;border-top:.3mm solid #ddd;padding-top:3mm}</style>${pages}`;
  const hp = path.join(tmp, `pdf-${r}.html`);
  fs.writeFileSync(hp, html);
  execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${path.join(pdfDir, `Latidos_${slug}_Maestros.pdf`)}`, require('url').pathToFileURL(hp).href], { stdio: 'ignore' });
  console.log('pdf', slug, files.length);
}
