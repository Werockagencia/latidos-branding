// Exporta las tarjetas de WhatsApp a PNG con Chrome sin interfaz.  uso: node src/cards.js [id]
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
global.window = { LAT: { logo: () => '' } };
const only = process.argv[2];
const list = JSON.parse(execFileSync('node', ['-e', `
  global.window={LAT:{logo:()=>''}};global.document={};
  require(${JSON.stringify(path.join(ROOT, 'comercial/data.js'))});require(${JSON.stringify(path.join(ROOT, 'comercial/cards.js'))});
  console.log(JSON.stringify(window.LATIDOS_CARDS.map(c=>({id:c.id,group:c.group}))));`], { encoding: 'utf8' }));
const OUT = { av: path.join(ROOT, 'descargas/comercial/ayudaventas'), cat: path.join(ROOT, 'descargas/comercial/catalogo') };
for (const d of Object.values(OUT)) fs.mkdirSync(d, { recursive: true });
for (const c of list) {
  if (only && c.id !== only) continue;
  const [W, H] = c.group === 'av' ? [1080, 1350] : [1080, 1080];
  const file = path.join(OUT[c.group], `Latidos_${c.id.replace(/^(av|cat)-/, '')}.png`);
  const jpg = file.replace(/.png$/, '.jpg');
  execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=8000', `--window-size=${W},${H}`, `--screenshot=${file}`, `http://localhost:8766/comercial/render.html?c=${c.id}`], { stdio: 'ignore' });
  execFileSync('node', ['-e', `require('sharp')(${JSON.stringify(file)}).jpeg({quality:88,mozjpeg:true}).toFile(${JSON.stringify(jpg)}).then(()=>require('fs').unlinkSync(${JSON.stringify(file)}))`], { cwd: __dirname });
  process.stdout.write('.');
}
console.log('\nok', list.length);
