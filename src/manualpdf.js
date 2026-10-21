// Imprime el manual a PDF y arma hojas de revisión: node src/manualpdf.js
const { execFileSync } = require('child_process');
const path = require('path'), fs = require('fs');
const sharp = require('sharp');
const out = path.resolve(__dirname, '../descargas/Latidos_Manual_de_Marca.pdf');
execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', '--virtual-time-budget=12000', '--print-to-pdf=' + out, 'http://localhost:8766/manual.html'], { stdio: 'ignore' });
const T = path.join(__dirname, 'traced');
fs.readdirSync(T).filter((f) => f.startsWith('man-')).forEach((f) => fs.unlinkSync(path.join(T, f)));
execFileSync('pdftoppm', ['-png', '-r', '40', out, path.join(T, 'man')]);
(async () => {
  const fsx = fs.readdirSync(T).filter((f) => f.startsWith('man-')).sort();
  const m = await sharp(path.join(T, fsx[0])).metadata();
  for (let s = 0; s < fsx.length; s += 6) {
    const g = fsx.slice(s, s + 6);
    await sharp({ create: { width: m.width * 2 + 10, height: Math.ceil(g.length / 2) * (m.height + 6), channels: 3, background: '#666' } })
      .composite(g.map((f, i) => ({ input: path.join(T, f), left: (i % 2) * (m.width + 10), top: Math.floor(i / 2) * (m.height + 6) }))).png().toFile(path.join(T, `mansheet${s / 6}.png`));
  }
  console.log(fsx.length, 'páginas');
})();
