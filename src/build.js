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
  const body = Object.entries(groups).map(([g, ls]) => `  <g id="${NAMES[g] || g}">\n${ls.map((l) => `    <path id="${l.id}" fill="${colors[l.role]}" fill-rule="nonzero" d="${l.d}"/>`).join('\n')}\n  </g>`).join('\n');
  const vb = [b[0] - m, b[1] - m, b[2] + 2 * m, b[3] + 2 * m].map(n2);
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Latidos · ${title} · We Rock Agencia · Propuesta de identidad (no constituye registro de marca) -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${n2(vb[2])}" height="${n2(vb[3])}">
  <title>Latidos — ${title}</title>
${colors.bg ? `  <rect id="Fondo" x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${colors.bg}"/>\n` : ''}${body}
</svg>
`;
}

// ------------------------------------------------------------------ main
(async () => {
  const R = {};
  // 01
  const a = await ruta01();
  const P1 = { desc: (w) => descriptor(w, 22.4, 'manrope-500'), descGap: 0.027, descW: 0.807, descDx: -0.016 };
  R.r1 = {
    primary: wordOnly(a.word, P1), horizontal: wordH(a.word, P1), symbol: group([['simbolo', a.sym]]), wordmark: wordOnly(a.word, P1, false),
    primaryM: wordOnly(a.wordMono, P1), horizontalM: wordH(a.wordMono, P1), symbolM: group([['simbolo', a.symMono]]), wordmarkM: wordOnly(a.wordMono, P1, false),
  };
  // 02
  const s2 = symbolComp('1');
  const w2 = drawnWord(r02w.word); // logotipo dibujado como en la referencia
  const P2 = { desc: (w) => descriptor(w, 29), symH: 0.399, gap: 0.03, descGap: 0.032, descW: 0.963, descDx: 0.002, hSym: 1.18, hGap: 0.30 };
  R.r2 = {
    primary: stacked(s2.sym, w2, P2), horizontal: horizontal(s2.sym, w2, P2), symbol: group([['simbolo', s2.sym]]), wordmark: wordOnly(w2, P2),
    primaryM: stacked(s2.symMono, mono(w2), { ...P2, desc: (w) => mono(descriptor(w, 29)) }), horizontalM: horizontal(s2.symMono, mono(w2), { ...P2, desc: (w) => mono(descriptor(w, 29)) }), symbolM: group([['simbolo', s2.symMono]]), wordmarkM: wordOnly(mono(w2), { ...P2, desc: (w) => mono(descriptor(w, 29)) }),
  };
  // 03
  // símbolo redibujado a mano (curvas pulidas) en lugar del trazado automático
  const s3 = { sym: { layers: [{ id: 'simbolo-acento', role: 'a', d: r03.formAcc }, { id: 'forma-1', role: 'p', d: r03.formA }, { id: 'forma-2', role: 'p', d: r03.formB }] } };
  s3.sym.box = unionBox([r03.formA, r03.formAcc, r03.formB]);
  s3.symMono = { layers: [{ id: 'simbolo', role: 'm', d: await monoFrom([r03.formA, r03.formB], [r03.formAcc], 0.012) }], box: s3.sym.box };
  const w3 = drawnWord(r02w.word3); // logotipo dibujado como en la referencia
  const P3 = { desc: (w) => descriptor(w, 21.2), symH: 0.467, gap: 0.063, descGap: 0.046, descW: 0.99, hSym: 1.15, hGap: 0.22, symDx: -0.008 };
  R.r3 = {
    primary: stacked(s3.sym, w3, P3), horizontal: horizontal(s3.sym, w3, P3), symbol: group([['simbolo', s3.sym]]), wordmark: wordOnly(w3, P3),
    primaryM: stacked(s3.symMono, mono(w3), { ...P3, desc: (w) => mono(descriptor(w, 21.2)) }), horizontalM: horizontal(s3.symMono, mono(w3), { ...P3, desc: (w) => mono(descriptor(w, 21.2)) }), symbolM: group([['simbolo', s3.symMono]]), wordmarkM: wordOnly(mono(w3), { ...P3, desc: (w) => mono(descriptor(w, 21.2)) }),
  };
  // r1 mono: descriptor también a una tinta
  for (const k of ['primaryM', 'horizontalM', 'wordmarkM']) R.r1[k].layers.forEach((l) => (l.role = 'm'));

  for (const r of Object.values(R)) for (const k of Object.keys(r)) r[k] = normalize(r[k]);
  fs.writeFileSync(path.join(ROOT, 'assets/logos.js'), `/* Latidos · maestros vectoriales (generado por src/build.js) */\nwindow.LATIDOS_LOGOS=${JSON.stringify(R)};\n`);

  // archivos maestros
  const PAL = {
    r1: { slug: 'Ruta01_PulsoCreativo', p: '#0B1B3B', w: '#0B1B3B', a: '#C6FF3D', d: '#0B1B3B', bg: '#F8F5F0', inv: { p: '#F8F5F0', w: '#F8F5F0', a: '#C6FF3D', d: '#F8F5F0', bg: '#0B1B3B' }, mono: '#0B1B3B', neg: '#F8F5F0', negBg: '#0B1B3B' },
    r2: { slug: 'Ruta02_Conexion', p: '#3A1B4F', w: '#3A1B4F', a: '#4DF0C1', d: '#3A1B4F', bg: '#F4F2F8', inv: { p: '#F4F2F8', w: '#F4F2F8', a: '#4DF0C1', d: '#F4F2F8', bg: '#3A1B4F' }, mono: '#3A1B4F', neg: '#F4F2F8', negBg: '#1C1426' },
    r3: { slug: 'Ruta03_PersonasEnMovimiento', p: '#3046C5', w: '#171923', a: '#FF6B63', d: '#171923', bg: '#F7F8FA', inv: { p: '#F7F8FA', w: '#F7F8FA', a: '#FF6B63', d: '#F7F8FA', bg: '#3046C5' }, mono: '#171923', neg: '#F7F8FA', negBg: '#171923' },
  };
  const LBL = { primary: 'Principal', horizontal: 'Horizontal', symbol: 'Simbolo', wordmark: 'Logotipo' };
  const out = path.join(ROOT, 'descargas/svg');
  fs.mkdirSync(out, { recursive: true });
  const index = [];
  for (const [rk, r] of Object.entries(R)) {
    const C = PAL[rk];
    for (const v of ['primary', 'horizontal', 'symbol', 'wordmark']) {
      const files = [
        [`Color`, r[v], { p: C.p, w: C.w, a: C.a, d: C.d }],
        [`Color-Negativo`, r[v], { ...C.inv }],
        [`Monocromo`, r[v + 'M'], { m: C.mono }],
        [`Monocromo-Negativo`, r[v + 'M'], { m: C.neg, bg: C.negBg }],
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
