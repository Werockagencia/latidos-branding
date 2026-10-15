// hoja de contacto de los maestros → traced/sheet-<ruta>.png
const fs = require('fs'), sharp = require('sharp'), path = require('path');
const dir = path.join(__dirname, '../descargas/svg');
(async () => {
  for (const r of ['Ruta01', 'Ruta02', 'Ruta03']) {
    const files = fs.readdirSync(dir).filter((f) => f.includes(r) && f.endsWith('.svg')).sort();
    const tiles = await Promise.all(files.map((f) => sharp(path.join(dir, f), { density: 150 }).resize(560, 300, { fit: 'contain', background: '#e6e6e6' }).flatten({ background: '#e6e6e6' }).png().toBuffer()));
    const cols = 4, W = 580, H = 320;
    const rows = Math.ceil(tiles.length / cols);
    await sharp({ create: { width: cols * W, height: rows * H, channels: 3, background: '#d0d0d0' } })
      .composite(tiles.map((t, i) => ({ input: t, left: (i % cols) * W + 10, top: Math.floor(i / cols) * H + 10 }))).png().toFile(path.join(__dirname, `traced/sheet-${r}.png`));
  }
})();
