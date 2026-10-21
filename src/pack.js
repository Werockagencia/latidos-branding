// Latidos · favicon, PDF con todas las versiones del logo y paquete ZIP de entrega.
// uso: node src/pack.js   (el PDF del manual se genera aparte con src/manualpdf.js)
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..');
global.window = {};
require(path.join(ROOT, 'assets/logos.js'));
const L = window.LATIDOS_LOGOS.r1;

// favicon: ícono en claro sobre el azul de la marca
const s = L.symbol, [, , w, h] = s.box, S = Math.max(w, h) * 1.42;
const fill = { w: '#F8F5F0', a: '#C6FF3D' };
fs.writeFileSync(path.join(ROOT, 'assets/favicon.svg'), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S.toFixed(1)} ${S.toFixed(1)}"><rect width="${S.toFixed(1)}" height="${S.toFixed(1)}" rx="${(S * 0.22).toFixed(1)}" fill="#0B1B3B"/><g transform="translate(${((S - w) / 2).toFixed(1)} ${((S - h) / 2).toFixed(1)})">${s.layers.map((l) => `<path fill="${fill[l.role]}" d="${l.d}"/>`).join('')}</g></svg>`);

// PDF vectorial: una versión por página
const svgDir = path.join(ROOT, 'descargas/svg');
const order = ['Principal', 'Horizontal', 'Icono', 'Nombre'], vord = ['Color.', 'Color-Negativo', 'Una-tinta.', 'Una-tinta-Negativo'];
const files = fs.readdirSync(svgDir).filter((f) => f.endsWith('.svg'))
  .sort((a, b) => order.findIndex((o) => a.includes(`_${o}_`)) - order.findIndex((o) => b.includes(`_${o}_`)) || vord.findIndex((o) => a.includes(o)) - vord.findIndex((o) => b.includes(o)));
const pages = files.map((f) => {
  const svg = fs.readFileSync(path.join(svgDir, f), 'utf8').replace(/<\?xml[^>]*>\s*/, '').replace(/<!--[\s\S]*?-->\s*/, '').replace(/ width="[^"]+" height="[^"]+"/, '');
  const label = f.replace('Latidos_', '').replace('.svg', '').replace(/_/g, ' · ').replace(/-/g, ' ');
  return `<section><div class="art">${svg}</div><footer><b>Latidos</b> · ${label}<span>We Rock Agencia</span></footer></section>`;
}).join('');
const html = `<!doctype html><meta charset="utf-8"><style>@page{size:297mm 210mm;margin:0}*{box-sizing:border-box}body{margin:0;font:9pt/1.4 Arial,sans-serif;color:#555}section{width:297mm;height:210mm;page-break-after:always;position:relative;display:grid;place-items:center;padding:28mm 40mm 34mm}section .art{width:100%;height:100%;display:grid;place-items:center}section svg{width:100%;height:100%}footer{position:absolute;left:14mm;right:14mm;bottom:10mm;display:flex;justify-content:space-between;border-top:.3mm solid #ddd;padding-top:3mm}</style>${pages}`;
const tmp = path.join(__dirname, 'traced');
fs.mkdirSync(tmp, { recursive: true });
const hp = path.join(tmp, 'logos-pdf.html');
fs.writeFileSync(hp, html);
const pdf = path.join(ROOT, 'descargas/Latidos_Logos.pdf');
execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdf}`, require('url').pathToFileURL(hp).href], { stdio: 'ignore' });

// ZIP: SVG + PDF de logos + manual
const zip = path.join(ROOT, 'descargas/Latidos_Logos.zip');
const ps = `$d='${path.join(ROOT, 'descargas')}'; Remove-Item -ErrorAction SilentlyContinue "$d\\Latidos_Logos.zip"; Compress-Archive -Path "$d\\svg\\*.svg", "$d\\Latidos_Logos.pdf", "$d\\Latidos_Manual_de_Marca.pdf" -DestinationPath "${zip}" -Force`;
execFileSync('powershell', ['-NoProfile', '-Command', ps], { stdio: 'inherit' });
console.log('ok', files.length, 'versiones · favicon · PDF · ZIP');
