// uso: node mobile.js pagina.html desde hasta → traced/m-<pagina>-<desde>.png con tramos de 375×812 en fila
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');
const [page, from = 0, to = 6400] = process.argv.slice(2);
const ys = []; for (let y = +from; y < +to; y += 800) ys.push(y);
const html = `<!doctype html><body style="margin:0;background:#888;display:flex;gap:8px;padding:8px">${ys.map((y) => `<iframe src="/${page}?shot&y=${y}" width="375" height="812" style="border:0;flex:none;background:#fff"></iframe>`).join('')}</body>`;
fs.writeFileSync(path.join(__dirname, '..', '_mobile.html'), html);
const W = ys.length * 383 + 8;
execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=10000', `--window-size=${W},830`, `--screenshot=${path.join(__dirname, 'traced', `m-${page.replace('.html', '').split('/').join('_')}-${from}.png`)}`, 'http://localhost:8766/_mobile.html'], { stdio: 'ignore' });
fs.unlinkSync(path.join(__dirname, '..', '_mobile.html'));
console.log(ys.length, 'tramos');
