// Genera los maestros de las tres rutas de Latidos:
//  - assets/logos.js  → versiones con roles de color (p principal · a acento · w wordmark · d descriptor · m monotinta)
//  - descargas/*.svg  → archivos maestros con tintas planas, agrupados por capas para Illustrator
// uso: node build.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const potrace = require('potrace');
const { xform, bbox, setText, font, contours, ser, n2 } = require('./geom');
const r01 = require('./r01');
const r03 = require('./r03');
const r02w = require('./r02');
const drawnWord = (d) => ({ layers: [{ id: 'logotipo', role: 'w', d }], box: unionBox([d]) });

const ROOT = path.join(__dirname, '..');
const DESC = 'EXPERIENCIAS CORPORATIVAS';

// ------------------------------------------------------------------ utilidades
const unionBox = (ds) => {
  const bs = ds.map(bbox);
  const x0 = Math.min(...bs.map((b) => b[0])), y0 = Math.min(...bs.map((b) => b[1]));
  const x1 = Math.max(...bs.map((b) => b[0] + b[2])), y1 = Math.max(...bs.map((b) => b[1] + b[3]));
  return [x0, y0, x1 - x0, y1 - y0];
};
// coloca un componente (capas) dentro de un alto dado con su esquina sup-izq en (x,y)
function place(comp, x, y, { h, w }) {
  const b = comp.box;
  const s = h ? h / b[3] : w / b[2];
  return {
    layers: comp.layers.map((l) => ({ ...l, d: xform(l.d, s, x - b[0] * s, y - b[1] * s) })),
    box: [x, y, b[2] * s, b[3] * s],
    s,
  };
}
const circle = (cx, cy, r) => {
  const k = 0.5523 * r;
  return `M${n2(cx - r)} ${n2(cy)}C${n2(cx - r)} ${n2(cy - k)} ${n2(cx - k)} ${n2(cy - r)} ${n2(cx)} ${n2(cy - r)}C${n2(cx + k)} ${n2(cy - r)} ${n2(cx + r)} ${n2(cy - k)} ${n2(cx + r)} ${n2(cy)}C${n2(cx + r)} ${n2(cy + k)} ${n2(cx + k)} ${n2(cy + r)} ${n2(cx)} ${n2(cy + r)}C${n2(cx - k)} ${n2(cy + r)} ${n2(cx - r)} ${n2(cy + k)} ${n2(cx - r)} ${n2(cy)}Z`;
};

/** Descriptor justificado a un ancho exacto (Manrope Medium, contornos). */
function descriptor(width, capH, fontName = 'manrope-500') {
  const f = font(fontName);
  const capRatio = (f.tables.os2.sCapHeight || 0.72 * f.unitsPerEm) / f.unitsPerEm;
  const size = capH / capRatio;
  const w0 = setText(fontName, DESC, size, 0, 0).width;
  const track = ((width - w0) / (DESC.length - 1) / size) * 1000;
  const t = setText(fontName, DESC, size, 0, capH, { track });
  return { layers: [{ id: 'descriptor', role: 'd', d: t.d }], box: [0, 0, width, capH] };
}

/** Versión monotinta: el acento se separa de la forma principal con una línea de aire. */
async function monoFrom(mainDs, accDs, gapRatio = 0.012) {
  const b = unionBox([...mainDs, ...accDs]);
  const PX = 5200, sc = PX / b[2], H = Math.round(b[3] * sc) + 40, W = PX + 40;
  const svg = (ds) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${b[0] - 20 / sc} ${b[1] - 20 / sc} ${W / sc} ${H / sc}"><rect x="-1e5" y="-1e5" width="2e5" height="2e5" fill="#fff"/>${ds.map((d) => `<path d="${d}" fill="#000"/>`).join('')}</svg>`);
  const gray = async (buf, sigma = 0) => {
    let im = sharp(buf).flatten({ background: '#fff' }).greyscale();
    if (sigma) im = im.blur(sigma);
    return im.extractChannel(0).raw().toBuffer();
  };
  // la forma principal se conserva vectorial exacta; solo el acento se recorta con una línea de aire de ancho constante
  const gapU = (gapRatio * PX) / sc; // en unidades del dibujo
  const stroked = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${b[0] - 20 / sc} ${b[1] - 20 / sc} ${W / sc} ${H / sc}"><rect x="-1e5" y="-1e5" width="2e5" height="2e5" fill="#fff"/>${mainDs.map((d) => `<path d="${d}" fill="#000" stroke="#000" stroke-width="${gapU * 2}" stroke-linejoin="round"/>`).join('')}</svg>`);
  const mainFat = await gray(stroked);
  const acc = await gray(svg(accDs));
  const out = Buffer.alloc(W * H);
  for (let i = 0; i < out.length; i++) out[i] = acc[i] < 128 && mainFat[i] >= 128 ? 0 : 255;
  const png = await sharp(out, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer();
  const d = await new Promise((ok, ko) => {
    const t = new potrace.Potrace({ turdSize: 400, alphaMax: 1.0, optCurve: true, optTolerance: 0.25 });
    t.loadImage(png, (e) => (e ? ko(e) : ok(t.getPathTag().match(/ d="([^"]+)"/)[1])));
  });
  return mainDs.join('') + xform(d, 1 / sc, b[0] - 20 / sc, b[1] - 20 / sc);
}

// ------------------------------------------------------------------ ruta 01 · Pulso creativo
async function ruta01() {
  // maestro vectorizado por We Rock en Illustrator (ver r01.js); el punto de la i va en acento
  const letters = r01.tidos;
  const dot = r01.dotPath;

  const gesture = [r01.ribbon, r01.stem, r01.wave];
  // el vector de We Rock ya trae la separación entre cinta y trazo: a una tinta se usan sus formas tal cual
  const gestureMono = r01.stem + r01.wave + r01.ribbon;

  const word = { layers: [
    { id: 'gesto-acento', role: 'a', d: r01.ribbon },
    { id: 'gesto-asta', role: 'w', d: r01.stem },
    { id: 'gesto-onda', role: 'w', d: r01.wave },
    { id: 'letras', role: 'w', d: letters },
    { id: 'punto-i', role: 'a', d: dot },
  ] };
  word.box = unionBox(word.layers.map((l) => l.d));
  const wordMono = { layers: [
    { id: 'gesto', role: 'm', d: gestureMono },
    { id: 'letras', role: 'm', d: letters },
    { id: 'punto-i', role: 'm', d: dot },
  ], box: word.box };
  const sym = { layers: word.layers.slice(0, 3), box: unionBox(gesture) };
  const symMono = { layers: [wordMono.layers[0]], box: sym.box };
  return { word, wordMono, sym, symMono, kind: 'wordmark' };
}

// ------------------------------------------------------------------ rutas 02 y 03 (símbolo trazado + wordmark Sora)
function traced(ref) {
  const j = JSON.parse(fs.readFileSync(path.join(__dirname, `traced/${ref}.json`), 'utf8'));
  return j;
}
function wordSora(fontName, track, pairs = {}) {
  const t = setText(fontName, 'Latidos', 1000, 0, 0, { track, pairs });
  const comp = { layers: [{ id: 'logotipo', role: 'w', d: t.d }] };
  comp.box = unionBox([t.d]);
  return comp;
}
function symbolComp(ref) {
  const j = traced(ref);
  const sym = { layers: [{ id: 'simbolo', role: 'p', d: j.union }, { id: 'simbolo-acento', role: 'a', d: j.acc }] };
  sym.box = unionBox([j.union]);
  const symMono = { layers: [{ id: 'simbolo', role: 'm', d: j.mono }], box: sym.box };
  return { sym, symMono };
}

// ------------------------------------------------------------------ lockups
const mono = (comp) => ({ ...comp, layers: comp.layers.map((l) => ({ ...l, role: 'm' })) });

function stacked(sym, word, P) {
  // vertical: símbolo centrado sobre wordmark + descriptor justificado
  const W = 1000;
  const w = place(word, 0, 0, { w: W });
  const s = place(sym, 0, 0, { h: P.symH * W });
  const sx = (W - s.box[2]) / 2 + (P.symDx || 0) * W;
  const S = place(sym, sx, 0, { h: P.symH * W });
  const wy = S.box[3] + P.gap * W;
  const Wd = place(word, 0, wy, { w: W });
  const dw = W * (P.descW || 1), dx = (W - dw) / 2 + (P.descDx || 0) * W;
  const D = place(P.desc(dw), dx, wy + Wd.box[3] + P.descGap * W, { w: dw });
  return group([['simbolo', S], ['logotipo', Wd], ['descriptor', D]]);
}
function horizontal(sym, word, P) {
  const W = 1000;
  const Wd = place(word, 0, 0, { w: W });
  const D = place(P.desc(W), 0, Wd.box[3] + P.descGap * W, { w: W });
  const textH = D.box[1] + D.box[3];
  const sh = textH * P.hSym;
  const S = place(sym, 0, 0, { h: sh });
  const gx = S.box[2] + P.hGap * sh;
  const ty = (sh - textH) / 2 + (P.hDy || 0) * sh;
  const Wd2 = place(word, gx, ty, { w: W });
  const D2 = place(P.desc(W), gx, ty + Wd.box[3] + P.descGap * W, { w: W });
  return group([['simbolo', S], ['logotipo', Wd2], ['descriptor', D2]]);
}
function wordOnly(word, P, withDesc = true) {
  const W = 1000;
  const Wd = place(word, 0, 0, { w: W });
  if (!withDesc) return group([['logotipo', Wd]]);
  const dw = W * (P.descW || 1), dx = (W - dw) / 2 + (P.descDx || 0) * W;
  const D = place(P.desc(dw), dx, Wd.box[3] + P.descGap * W, { w: dw });
  return group([['logotipo', Wd], ['descriptor', D]]);
}
function wordH(word, P) {
  // Ruta 01 horizontal: wordmark · filete · descriptor en dos líneas
  const W = 1000;
  const Wd = place(word, 0, 0, { w: W });
  const h = Wd.box[3];
  const capH = h * 0.12;
  const f = font('manrope-600');
  const size = capH / ((f.tables.os2.sCapHeight || 1440) / f.unitsPerEm);
  const l1 = setText('manrope-600', 'EXPERIENCIAS', size, 0, 0, { track: 180 });
  const l2 = setText('manrope-600', 'CORPORATIVAS', size, 0, 0, { track: 180 });
  const x = W + h * 0.22, rule = 2.2;
  const tx = x + h * 0.2;
  const lead = capH * 1.9;
  const y1 = h / 2 - lead / 2 + capH / 2 - capH * 0.15, y2 = y1 + lead;
  const r = `M${n2(x)} ${n2(h * 0.18)}L${n2(x + rule)} ${n2(h * 0.18)}L${n2(x + rule)} ${n2(h * 0.94)}L${n2(x)} ${n2(h * 0.94)}Z`;
  const t1 = setText('manrope-600', 'EXPERIENCIAS', size, tx, y1 + capH / 2 + capH * 0.5, { track: 180 });
  const t2 = setText('manrope-600', 'CORPORATIVAS', size, tx, y2 + capH / 2 + capH * 0.5, { track: 180 });
  void l1; void l2;
  const D = { layers: [{ id: 'filete', role: 'd', d: r }, { id: 'descriptor', role: 'd', d: t1.d + t2.d }] };
  return group([['logotipo', Wd], ['descriptor', D]]);
}
function group(entries) {
  const layers = [];
  for (const [g, c] of entries) for (const l of c.layers) layers.push({ ...l, g });
  return { layers, box: unionBox(layers.map((l) => l.d)) };
}
const normalize = (v) => {
  // origen en 0,0
  const b = v.box;
  return { box: [0, 0, n2(b[2]), n2(b[3])], layers: v.layers.map((l) => ({ ...l, d: xform(l.d, 1, -b[0], -b[1]) })) };
};

// ------------------------------------------------------------------ SVG maestros
const NAMES = { simbolo: 'Simbolo', logotipo: 'Logotipo', descriptor: 'Descriptor' };
function masterSvg(v, colors, title, pad = 0.08) {
  const b = v.box, m = Math.max(b[2], b[3]) * pad;
  const groups = {};
  for (const l of v.layers) (groups[l.g || 'logotipo'] ||= []).push(l);
  const body = Object.entries(groups).map(([g, ls]) => `  <g id="${NAMES[g] || g}">\n${ls.map((l) => `    <path id="${l.id}" fill="${colors[l.role]}" fill-rule="${l.eo ? 'evenodd' : 'nonzero'}" d="${l.d}"/>`).join('\n')}\n  </g>`).join('\n');
  const vb = [b[0] - m, b[1] - m, b[2] + 2 * m, b[3] + 2 * m].map(n2);
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Latidos · ${title} · We Rock Agencia · Propuesta de identidad (no constituye registro de marca) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${n2(vb[2])}" height="${n2(vb[3])}">
  <title>Latidos — ${title}</title>
${colors.bg ? `  <rect id="Fondo" x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${colors.bg}"/>\n` : ''}${body}
</svg>
`;
}

// ------------------------------------------------------------------ main · ronda 02 (tres mesas de trabajo de We Rock)
const { mesa1, mesa2, mesa3 } = require('./mesas');

/** Calado a una tinta: base menos huecos, con una línea de aire entre huecos vecinos. */
async function knockout(baseDs, holeDs, gapRatio = 0.006) {
  const b = unionBox(baseDs);
  const PX = 4000, sc = PX / b[2], H = Math.round(b[3] * sc) + 40, W = PX + 40;
  const vb = `${b[0] - 20 / sc} ${b[1] - 20 / sc} ${W / sc} ${H / sc}`;
  const gapU = (gapRatio * PX) / sc;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="${vb}"><rect x="-1e5" y="-1e5" width="2e5" height="2e5" fill="#fff"/>${baseDs.map((d) => `<path d="${d}" fill="#000"/>`).join('')}${holeDs.map((d) => `<path d="${d}" fill="#fff" stroke="#000" stroke-width="${gapU}"/>`).join('')}</svg>`;
  const png = await sharp(Buffer.from(svg)).flatten({ background: '#fff' }).greyscale().threshold(128).png().toBuffer();
  const d = await new Promise((ok, ko) => {
    const t = new potrace.Potrace({ turdSize: 300, alphaMax: 1.0, optCurve: true, optTolerance: 0.25 });
    t.loadImage(png, (e) => (e ? ko(e) : ok(t.getPathTag().match(/ d="([^"]+)"/)[1])));
  });
  return xform(d, 1 / sc, b[0] - 20 / sc, b[1] - 20 / sc);
}

/** Logotipo con la onda (mesas 01 y 02): versiones a color y a una tinta. */
function waveMark(M) {
  const word = { layers: [
    { id: 'cinta', role: 'a', d: M.ribbon },
    { id: 'asta-l', role: 'w', d: M.stem },
    { id: 'onda-a', role: 'w', d: M.wave },
    { id: 'letras', role: 'w', d: M.letters },
    { id: 'punto-i', role: 'a', d: M.dot },
  ] };
  word.box = unionBox(word.layers.map((l) => l.d));
  const wordMono = { layers: word.layers.map((l) => ({ ...l, role: 'm' })), box: word.box };
  const sym = { layers: word.layers.slice(0, 3), box: unionBox([M.ribbon, M.stem, M.wave]) };
  const symMono = { layers: wordMono.layers.slice(0, 3), box: sym.box };
  return { word, wordMono, sym, symMono };
}
function waveVersions(M, P) {
  const a = waveMark(M);
  const v = {
    primary: wordOnly(a.word, P), horizontal: wordH(a.word, P), symbol: group([['simbolo', a.sym]]), wordmark: wordOnly(a.word, P, false),
    primaryM: wordOnly(a.wordMono, P), horizontalM: wordH(a.wordMono, P), symbolM: group([['simbolo', a.symMono]]), wordmarkM: wordOnly(a.wordMono, P, false),
  };
  for (const k of ['primaryM', 'horizontalM', 'wordmarkM']) v[k].layers.forEach((l) => (l.role = 'm'));
  return v;
}

(async () => {
  const R = {};
  const P1 = { desc: (w) => descriptor(w, 22.4, 'manrope-500'), descGap: 0.03, descW: 0.82, descDx: -0.01 };
  R.r1 = waveVersions(mesa1, P1);
  R.r2 = waveVersions(mesa2, P1);

  // mesa 03 · sello sobre el nombre, en la composición original de la mesa de trabajo
  const sym3 = { layers: [
    { id: 'circulo', role: 'p', d: mesa3.circle },
    { id: 'cinta', role: 'a', d: mesa3.ribbon },
    { id: 'l', role: 'k', d: mesa3.ell },
  ] };
  sym3.box = unionBox([mesa3.circle]);
  const symMono3 = { layers: [{ id: 'sello', role: 'm', eo: 1, d: await knockout([mesa3.circle], [mesa3.ell, mesa3.ribbon], 0.012) }], box: sym3.box };
  const word3 = { layers: [{ id: 'logotipo', role: 'w', d: mesa3.letters }], box: unionBox([mesa3.letters]) };
  const stacked3 = (sym, word, desc) => {
    const wb = word.box, dw = wb[2] * 0.96;
    const D = place(desc(dw), wb[0] + (wb[2] - dw) / 2, wb[1] + wb[3] + wb[2] * 0.045, { w: dw });
    return group([['simbolo', sym], ['logotipo', word], ['descriptor', D]]);
  };
  const d3 = (w) => descriptor(w, w * 0.0225);
  const P3 = { desc: d3, descGap: 0.045, descW: 0.96, hSym: 1.15, hGap: 0.24 };
  const m = (c) => ({ ...c, layers: c.layers.map((l) => ({ ...l, role: 'm' })) });
  R.r3 = {
    primary: stacked3(sym3, word3, d3), horizontal: horizontal(sym3, word3, P3), symbol: group([['simbolo', sym3]]), wordmark: wordOnly(word3, P3),
    primaryM: stacked3(symMono3, m(word3), (w) => m(d3(w))), horizontalM: horizontal(symMono3, m(word3), { ...P3, desc: (w) => m(d3(w)) }),
    symbolM: group([['simbolo', symMono3]]), wordmarkM: wordOnly(m(word3), { ...P3, desc: (w) => m(d3(w)) }),
  };

  for (const r of Object.values(R)) for (const k of Object.keys(r)) r[k] = normalize(r[k]);
  fs.writeFileSync(path.join(ROOT, 'assets/logos.js'), `/* Latidos · logos (generado por src/build.js) */\nwindow.LATIDOS_LOGOS=${JSON.stringify(R)};\n`);

  const PAL = {
    r1: { slug: 'Propuesta01_Pulso', p: '#0B1B3B', w: '#0B1B3B', a: '#C6FF3D', d: '#0B1B3B', inv: { p: '#F8F5F0', w: '#F8F5F0', a: '#C6FF3D', d: '#F8F5F0', bg: '#0B1B3B' }, mono: '#0B1B3B', neg: '#F8F5F0', negBg: '#0B1B3B' },
    r2: { slug: 'Propuesta02_Cumbre', p: '#0B1B3B', w: '#0B1B3B', a: '#C6FF3D', d: '#0B1B3B', inv: { p: '#F8F5F0', w: '#F8F5F0', a: '#C6FF3D', d: '#F8F5F0', bg: '#0B1B3B' }, mono: '#0B1B3B', neg: '#F8F5F0', negBg: '#0B1B3B' },
    r3: { slug: 'Propuesta03_Sello', p: '#3C1C4C', k: '#F4F2F8', w: '#3C1C4C', a: '#C6FF3D', d: '#3C1C4C', inv: { p: '#F4F2F8', k: '#3C1C4C', w: '#F4F2F8', a: '#C6FF3D', d: '#F4F2F8', bg: '#3C1C4C' }, mono: '#3C1C4C', neg: '#F4F2F8', negBg: '#3C1C4C' },
  };
  const LBL = { primary: 'Principal', horizontal: 'Horizontal', symbol: 'Simbolo', wordmark: 'Logotipo' };
  const out = path.join(ROOT, 'descargas/svg');
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  const index = [];
  for (const [rk, r] of Object.entries(R)) {
    const C = PAL[rk];
    for (const v of ['primary', 'horizontal', 'symbol', 'wordmark']) {
      const files = [
        ['Color', r[v], { p: C.p, k: C.k, w: C.w, a: C.a, d: C.d }],
        ['Color-Negativo', r[v], { ...C.inv }],
        ['Monocromo', r[v + 'M'], { m: C.mono }],
        ['Monocromo-Negativo', r[v + 'M'], { m: C.neg, bg: C.negBg }],
      ];
      for (const [variant, ver, colors] of files) {
        const name = `Latidos_${C.slug}_${LBL[v]}_${variant}.svg`;
        fs.writeFileSync(path.join(out, name), masterSvg(ver, colors, `${C.slug.replace(/_/g, ' · ')} · ${LBL[v]} · ${variant}`));
        index.push(name);
      }
    }
  }
  fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify(index, null, 1));
  console.log('ok', index.length, 'svg');
})();
