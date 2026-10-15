// uso: node ovw.js modulo ref x0,y0,w,h,S → contorno sobre la referencia + vista limpia
const sharp = require('sharp');
const [mod, ref, box] = process.argv.slice(2);
const m = require('./' + mod);
const [x0, y0, w, h, S] = box.split(',').map(Number);
(async () => {
  const ov = `<svg xmlns="http://www.w3.org/2000/svg" width="${w * S}" height="${h * S}" viewBox="${x0} ${y0} ${w} ${h}"><path d="${m.word}" fill="none" stroke="#ff00aa" stroke-width="${1.6 / S}"/></svg>`;
  const base = await sharp(`ref/${ref}.webp`).extract({ left: x0, top: y0, width: w, height: h }).resize(w * S, h * S).toBuffer();
  await sharp(base).composite([{ input: Buffer.from(ov) }]).png().toFile(`traced/${mod}-ov.png`);
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w * S}" height="${h * S}" viewBox="${x0} ${y0} ${w} ${h}"><rect x="0" y="0" width="5000" height="5000" fill="#fff"/><path d="${m.word}" fill="#3A1B4F"/></svg>`)).png().toFile(`traced/${mod}-clean.png`);
})();
