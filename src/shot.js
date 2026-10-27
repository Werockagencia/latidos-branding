// uso: node shot.js pagina.html [ancho] [alto] → traced/shot-<pagina>-N.png (cortes de 1800px)
const { execFileSync } = require('child_process');
const sharp = require('sharp'), path = require('path');
const [page, W = 1440, H = 16000] = process.argv.slice(2);
const out = path.join(__dirname, 'traced', 'full.png');
execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=9000', `--window-size=${W},${H}`, `--screenshot=${out}`, `http://localhost:8766/${page}?shot`], { stdio: 'ignore' });
(async () => {
  const meta = await sharp(out).metadata();
  const n = Math.ceil(meta.height / 1800);
  for (let i = 0; i < n; i++) {
    const h = Math.min(1800, meta.height - i * 1800);
    await sharp(out).extract({ left: 0, top: i * 1800, width: meta.width, height: h }).resize(Math.round(meta.width * 0.6)).png().toFile(path.join(__dirname, 'traced', `shot-${page.replace('.html', '').split('/').join('_')}-${i}.png`));
  }
  console.log(n, 'cortes');
})();
