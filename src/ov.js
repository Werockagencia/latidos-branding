// uso: node ov.js r01 → superpone la reconstrucción sobre la referencia
const fs = require('fs'), sharp = require('sharp');
(async () => {
  const r = require('./r01'); const L = r.letters(+process.argv[2] || 680);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1774 887" width="1774" height="887"><g opacity=".55"><path d="${r.ribbon}" fill="#ff00aa"/><path d="${r.stem}" fill="#00a0ff"/><path d="${r.wave}" fill="#00a0ff"/><path d="${L.d}" fill="#f00"/></g></svg>`;
  const ov = await sharp(Buffer.from(svg)).resize(1774, 887).png().toBuffer();
  const full = await sharp('ref/3.webp').composite([{ input: ov }]).png().toBuffer();
  await sharp(full).extract({ left: 220, top: 270, width: 1360, height: 320 }).png().toFile('traced/r01-overlay.png');
})();
