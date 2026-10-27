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

// PNG con fondo transparente (alta resolución) de cada versión, y paquetes ZIP organizados por carpetas
const sharp = require('sharp');
const DL = path.join(ROOT, 'descargas');
const pngDir = path.join(DL, 'png');
fs.rmSync(pngDir, { recursive: true, force: true });
fs.mkdirSync(pngDir, { recursive: true });
const zipOf = (zipName, folder) => execFileSync('powershell', ['-NoProfile', '-Command',
  `Remove-Item -ErrorAction SilentlyContinue '${path.join(DL, zipName)}'; Compress-Archive -Path '${folder}\\*' -DestinationPath '${path.join(DL, zipName)}' -Force`], { stdio: 'inherit' });

(async () => {
  for (const f of files) {
    const svg = fs.readFileSync(path.join(svgDir, f), 'utf8').replace(/\s*<rect id="Fondo"[^>]*\/>/, '');
    const width = f.includes('_Icono_') ? 2000 : 3000;
    await sharp(Buffer.from(svg), { density: 600 }).resize({ width }).png().toFile(path.join(pngDir, f.replace('.svg', '.png')));
  }

  // carpeta de entrega
  const ST = path.join(tmp, 'entrega');
  fs.rmSync(ST, { recursive: true, force: true });
  const dir = (p) => { fs.mkdirSync(p, { recursive: true }); return p; };
  const cp = (src, dst) => fs.copyFileSync(src, dst);
  const pngs = fs.readdirSync(pngDir);
  const svgs = files;
  const fonts = fs.readdirSync(path.join(__dirname, 'fonts'));
  const fontNote = `Tipografías de Latidos\r\n\r\nSora (títulos) y Manrope (textos).\r\nAmbas son gratuitas y de uso comercial libre (licencia SIL Open Font License).\r\n\r\nCómo instalarlas: abran cada archivo .ttf y pulsen "Instalar".\r\nTambién se pueden descargar o usar en web desde Google Fonts:\r\n  https://fonts.google.com/specimen/Sora\r\n  https://fonts.google.com/specimen/Manrope\r\n`;
  const readme = `LATIDOS · KIT DE MARCA\r\n\r\n01_Logos_PNG     → para Word, PowerPoint, redes y uso diario (fondo transparente)\r\n02_Logos_Vector  → para diseñadores, imprenta, vallas, corte y bordado (SVG y PDF)\r\n03_Tipografias   → Sora y Manrope, listas para instalar\r\n04_Manual        → Manual de marca en PDF\r\n05_Papeleria     → Impresion_CMYK: tarjeta y membrete para la imprenta (sangrado y marcas de corte)\r\n                   Digital_RGB: tarjeta y membrete para pantalla, correo y Word\r\n06_Patrones      → ondas de la marca en azul, marfil y lima (SVG, PNG y PDF)\r\n\r\nVersiones: Principal · Horizontal · Icono · Nombre\r\nColores:   Color · Color-Negativo (para fondos oscuros) · Una-tinta · Una-tinta-Negativo\r\n\r\nWe Rock Agencia · werock.space\r\n`;

  // paquetes individuales
  const pP = dir(path.join(ST, 'png')); pngs.forEach((f) => cp(path.join(pngDir, f), path.join(pP, f)));
  const pV = dir(path.join(ST, 'vector')); svgs.forEach((f) => cp(path.join(svgDir, f), path.join(pV, f))); cp(path.join(DL, 'Latidos_Logos.pdf'), path.join(pV, 'Latidos_Logos_todas-las-versiones.pdf'));
  const pT = dir(path.join(ST, 'tipos')); fonts.forEach((f) => cp(path.join(__dirname, 'fonts', f), path.join(pT, f))); fs.writeFileSync(path.join(pT, 'LEEME.txt'), fontNote);
  // kit completo
  const K = dir(path.join(ST, 'kit'));
  fs.writeFileSync(path.join(K, 'LEEME.txt'), readme);
  const k1 = dir(path.join(K, '01_Logos_PNG')); pngs.forEach((f) => cp(path.join(pngDir, f), path.join(k1, f)));
  const k2 = dir(path.join(K, '02_Logos_Vector')); fs.readdirSync(pV).forEach((f) => cp(path.join(pV, f), path.join(k2, f)));
  const k3 = dir(path.join(K, '03_Tipografias')); fs.readdirSync(pT).forEach((f) => cp(path.join(pT, f), path.join(k3, f)));
  const k4 = dir(path.join(K, '04_Manual')); cp(path.join(DL, 'Latidos_Manual_de_Marca.pdf'), path.join(k4, 'Latidos_Manual_de_Marca.pdf'));
  fs.cpSync(path.join(DL, 'papeleria'), path.join(K, '05_Papeleria'), { recursive: true });
  fs.cpSync(path.join(DL, 'patrones'), path.join(K, '06_Patrones'), { recursive: true });

  for (const old of fs.readdirSync(DL).filter((f) => f.endsWith('.zip'))) fs.unlinkSync(path.join(DL, old));
  zipOf('Latidos_Logos_PNG.zip', pP);
  zipOf('Latidos_Logos_Vector.zip', pV);
  zipOf('Latidos_Tipografias.zip', pT);
  zipOf('Latidos_Papeleria.zip', path.join(DL, 'papeleria'));
  zipOf('Latidos_Patrones.zip', path.join(DL, 'patrones'));
  zipOf('Latidos_Kit_de_Marca.zip', K);
  console.log('ok', files.length, 'SVG ·', pngs.length, 'PNG · tipografías · 4 ZIP');
})();
