// Vectoriza las referencias aprobadas: separa tintas (oscura / acento), amplía 4x y traza con potrace.
// Genera por referencia: union (silueta completa), acc (acento, levemente engordado para cubrir la junta)
// y mono (una sola tinta: acento separado de la forma principal por una línea de aire).
// uso: node trace.js  → traced/<ref>.json
const sharp = require('sharp');
const potrace = require('potrace');
const fs = require('fs');

const UP = 4;
const JOBS = [
  { ref: '1', crop: [560, 172, 420, 396], gap: 16 },  // Conexión: símbolo
  { ref: '2', crop: [395, 110, 340, 330], gap: 20 },  // Personas en movimiento: símbolo principal
  { ref: '3', crop: [230, 280, 1330, 300], gap: 14 }, // Pulso creativo: wordmark
];

const isDark = (r, g, b) => r + g + b < 300 && b >= r;
const isLime = (r, g, b) => g > 160 && r > 100 && b < 160 && g - b > 80;

async function raw(src, crop) {
  const [x, y, w, h] = crop;
  return sharp(src).extract({ left: x, top: y, width: w, height: h })
    .resize(w * UP, h * UP, { kernel: 'lanczos3' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
}
// m: Uint8 1 = forma. Suaviza (blur) y umbraliza: t<0.5 engorda, t>0.5 adelgaza
async function smooth(m, W, H, sigma, t = 0.5) {
  const g = Buffer.alloc(W * H);
  for (let i = 0; i < m.length; i++) g[i] = m[i] ? 255 : 0;
  const out = await sharp(g, { raw: { width: W, height: H, channels: 1 } }).blur(sigma).extractChannel(0).raw().toBuffer();
  const r = new Uint8Array(W * H);
  for (let i = 0; i < r.length; i++) r[i] = out[i] > 255 * t ? 1 : 0;
  return r;
}
const png = (m, W, H) => {
  const b = Buffer.alloc(W * H);
  for (let i = 0; i < m.length; i++) b[i] = m[i] ? 0 : 255;
  return sharp(b, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
};
const trace = (buf) => new Promise((ok, ko) => { if (!buf) return ok("");
  const t = new potrace.Potrace({ turdSize: 400, alphaMax: 1.15, optCurve: true, optTolerance: 0.6, threshold: 128 });
  t.loadImage(buf, (err) => (err ? ko(err) : ok((t.getPathTag().match(/ d="([^"]+)"/) || [0, ""])[1])));
});

(async () => {
  fs.mkdirSync('traced', { recursive: true });
  for (const j of JOBS) {
    const { data, info } = await raw(`ref/${j.ref}.webp`, j.crop);
    const W = info.width, H = info.height;
    const dk = new Uint8Array(W * H), li = new Uint8Array(W * H);
    for (let i = 0, p = 0; i < data.length; i += 3, p++) {
      dk[p] = isDark(data[i], data[i + 1], data[i + 2]) ? 1 : 0;
      li[p] = isLime(data[i], data[i + 1], data[i + 2]) ? 1 : 0;
    }
    const un = new Uint8Array(W * H);
    for (let i = 0; i < un.length; i++) un[i] = dk[i] | li[i];
    const unS = await smooth(un, W, H, 3.2);
    const liFat = await smooth(li, W, H, 3.2, 0.3);       // acento engordado (cubre la junta)
    const liS = new Uint8Array(W * H);
    for (let i = 0; i < liS.length; i++) liS[i] = liFat[i] & unS[i];
    const dkFat = await smooth(dk, W, H, j.gap, 0.08);    // forma principal + aire
    const mono = new Uint8Array(W * H);
    const liN = await smooth(li, W, H, 3.2);
    for (let i = 0; i < mono.length; i++) mono[i] = unS[i] && (!liN[i] || !dkFat[i]) ? 1 : 0;
    const monoS = await smooth(mono, W, H, 2.2);
    const cnt = (m) => m.reduce((a, b) => a + b, 0); console.log("px", cnt(dk), cnt(li), cnt(unS), cnt(liS), cnt(monoS));
    const res = { union: await trace(await png(unS, W, H)), acc: await trace(await png(liS, W, H)), mono: await trace(await png(monoS, W, H)) };
    fs.writeFileSync(`traced/${j.ref}.json`, JSON.stringify({ ...res, W, H }));
    const pv = (d, fill) => `<path d="${d}" fill="${fill}" fill-rule="evenodd"/>`;
    fs.writeFileSync(`traced/${j.ref}-preview.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W * 2} ${H}" width="${W / 2}"><rect width="100%" height="100%" fill="#fff"/>${pv(res.union, '#0B1B3B')}${pv(res.acc, '#C6FF3D')}<g transform="translate(${W} 0)">${pv(res.mono, '#0B1B3B')}</g></svg>`);
    await sharp(`traced/${j.ref}-preview.svg`).png().toFile(`traced/${j.ref}-preview.png`);
    console.log(j.ref, Object.values(res).map((d) => d.length));
  }
})();
