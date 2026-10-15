// uso: node grid.js ref x0 y0 w h escala salida  → recorte de la referencia con retícula cada 10 px
const sharp = require('sharp');
const [ref, x0, y0, w, h, S, out] = process.argv.slice(2).map((v, i) => (i === 0 || i === 6 ? v : +v));
(async () => {
  let g = '';
  for (let x = Math.ceil(x0 / 10) * 10; x <= x0 + w; x += 10) g += `<line x1="${(x - x0) * S}" y1="0" x2="${(x - x0) * S}" y2="${h * S}" stroke="${x % 50 ? '#f0f' : '#f00'}" stroke-width="${x % 50 ? 0.5 : 1.4}" opacity=".55"/>` + (x % 50 ? '' : `<text x="${(x - x0) * S + 2}" y="12" font-size="12" fill="red">${x}</text>`);
  for (let y = Math.ceil(y0 / 10) * 10; y <= y0 + h; y += 10) g += `<line x1="0" y1="${(y - y0) * S}" x2="${w * S}" y2="${(y - y0) * S}" stroke="${y % 50 ? '#0af' : '#00f'}" stroke-width="${y % 50 ? 0.5 : 1.4}" opacity=".55"/>` + (y % 50 ? '' : `<text x="2" y="${(y - y0) * S - 2}" font-size="12" fill="blue">${y}</text>`);
  const base = await sharp(`ref/${ref}.webp`).extract({ left: x0, top: y0, width: w, height: h }).resize(w * S, h * S, { kernel: 'lanczos3' }).toBuffer();
  await sharp(base).composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w * S}" height="${h * S}">${g}</svg>`) }]).png().toFile(out);
})();
