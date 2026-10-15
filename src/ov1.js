// superpone el maestro de la Ruta 01 sobre la referencia: contorno magenta + vista limpia
const r = require('./r01'), sharp = require('sharp');
(async () => {
  const [x0, y0, w, h, S] = (process.argv[2] || '230,280,1330,300,1.5').split(',').map(Number);
  const c = r.dot, dot = `M${c.cx - c.r} ${c.cy}a${c.r} ${c.r} 0 1 0 ${2 * c.r} 0a${c.r} ${c.r} 0 1 0 ${-2 * c.r} 0Z`;
  const all = [r.ribbon, r.stem, r.wave, r.tidos, dot];
  const ov = `<svg xmlns="http://www.w3.org/2000/svg" width="${w * S}" height="${h * S}" viewBox="${x0} ${y0} ${w} ${h}"><g fill="none" stroke="#ff00aa" stroke-width="1.1">${all.map((d) => `<path d="${d}"/>`).join('')}</g></svg>`;
  const base = await sharp('ref/3.webp').extract({ left: x0, top: y0, width: w, height: h }).resize(w * S, h * S).toBuffer();
  await sharp(base).composite([{ input: Buffer.from(ov) }]).png().toFile('traced/r01-ov.png');
  const clean = `<svg xmlns="http://www.w3.org/2000/svg" width="${w * S}" height="${h * S}" viewBox="${x0} ${y0} ${w} ${h}"><rect x="0" y="0" width="3000" height="3000" fill="#F8F5F0"/><path d="${r.ribbon}" fill="#C6FF3D"/><path d="${r.stem}" fill="#0B1B3B"/><path d="${r.wave}" fill="#0B1B3B"/><path d="${r.tidos}" fill="#0B1B3B"/><path d="${dot}" fill="#C6FF3D"/></svg>`;
  await sharp(Buffer.from(clean)).png().toFile('traced/r01-clean.png');
})();
