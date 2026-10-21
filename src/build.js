// Latidos · genera el logo definitivo y sus versiones desde el vector de We Rock (src/vector/latidos.svg, exportado de 01.ai).
//  - assets/logos.js → versiones con roles de color (w nombre · a acento · d frase · m una tinta)
//  - descargas/svg   → archivos finales en tintas planas, agrupados por capas (Simbolo · Logotipo · Descriptor)
// uso: node src/build.js
const fs = require('fs');
const path = require('path');
const { xform, bbox, setText, font, n2 } = require('./geom');

const ROOT = path.join(__dirname, '..');
const DESC = 'EXPERIENCIAS CORPORATIVAS';
const C = { navy: '#0B1B3B', lime: '#C6FF3D', ivory: '#F8F5F0' };

// ------------------------------------------------------------------ vector de Illustrator
// orden del archivo: 0 d · 1 o · 2 s · 3 onda (A) · 4 t · 5 asta L · 6 i · 7 punto · 8 cinta
const ps = [...fs.readFileSync(path.join(__dirname, 'vector/latidos.svg'), 'utf8').matchAll(/<path[^>]*d="([^"]+)"/g)]
  .map((m) => m[1].trim().replace(/\s+/g, ' '));
const V = { ribbon: ps[8], stem: ps[5], wave: ps[3], letters: ps[4] + ps[6] + ps[0] + ps[1] + ps[2], dot: ps[7] };

// ------------------------------------------------------------------ utilidades
const unionBox = (ds) => {
  const bs = ds.map(bbox);
  const x0 = Math.min(...bs.map((b) => b[0])), y0 = Math.min(...bs.map((b) => b[1]));
  const x1 = Math.max(...bs.map((b) => b[0] + b[2])), y1 = Math.max(...bs.map((b) => b[1] + b[3]));
  return [x0, y0, x1 - x0, y1 - y0];
};
function place(comp, x, y, { h, w }) {
  const b = comp.box, s = h ? h / b[3] : w / b[2];
  return { layers: comp.layers.map((l) => ({ ...l, d: xform(l.d, s, x - b[0] * s, y - b[1] * s) })), box: [x, y, b[2] * s, b[3] * s] };
}
function group(entries) {
  const layers = [];
  for (const [g, c] of entries) for (const l of c.layers) layers.push({ ...l, g });
  return { layers, box: unionBox(layers.map((l) => l.d)) };
}
const normalize = (v) => ({ box: [0, 0, n2(v.box[2]), n2(v.box[3])], layers: v.layers.map((l) => ({ ...l, d: xform(l.d, 1, -v.box[0], -v.box[1]) })) });
const toMono = (v) => ({ ...v, layers: v.layers.map((l) => ({ ...l, role: 'm' })) });

/** Frase justificada al ancho dado (Manrope Medium convertida a contornos). */
function descriptor(width, capH) {
  const f = font('manrope-500');
  const size = capH / ((f.tables.os2.sCapHeight || 0.72 * f.unitsPerEm) / f.unitsPerEm);
  const w0 = setText('manrope-500', DESC, size, 0, 0).width;
  const track = ((width - w0) / (DESC.length - 1) / size) * 1000;
  return { layers: [{ id: 'descriptor', role: 'd', d: setText('manrope-500', DESC, size, 0, capH, { track }).d }], box: [0, 0, width, capH] };
}

// ------------------------------------------------------------------ versiones
const word = { layers: [
  { id: 'cinta', role: 'a', d: V.ribbon },
  { id: 'asta-l', role: 'w', d: V.stem },
  { id: 'onda-a', role: 'w', d: V.wave },
  { id: 'letras', role: 'w', d: V.letters },
  { id: 'punto-i', role: 'a', d: V.dot },
] };
word.box = unionBox(word.layers.map((l) => l.d));
const sym = { layers: word.layers.slice(0, 3), box: unionBox([V.ribbon, V.stem, V.wave]) };

function primary() {
  const W = 1000, Wd = place(word, 0, 0, { w: W });
  const dw = W * 0.82, D = place(descriptor(dw, 22.4 * 0.82), (W - dw) / 2 - W * 0.01, Wd.box[3] + W * 0.03, { w: dw });
  return group([['logotipo', Wd], ['descriptor', D]]);
}
function horizontal() {
  // nombre · filete · frase en dos líneas
  const W = 1000, Wd = place(word, 0, 0, { w: W }), h = Wd.box[3];
  const capH = h * 0.12, f = font('manrope-600');
  const size = capH / ((f.tables.os2.sCapHeight || 1440) / f.unitsPerEm);
  const x = W + h * 0.22, tx = x + h * 0.2, lead = capH * 1.9;
  const y1 = h / 2 - lead / 2 + capH / 2 - capH * 0.15;
  const rule = `M${n2(x)} ${n2(h * 0.18)}L${n2(x + 2.2)} ${n2(h * 0.18)}L${n2(x + 2.2)} ${n2(h * 0.94)}L${n2(x)} ${n2(h * 0.94)}Z`;
  const t1 = setText('manrope-600', 'EXPERIENCIAS', size, tx, y1 + capH, { track: 180 });
  const t2 = setText('manrope-600', 'CORPORATIVAS', size, tx, y1 + lead + capH, { track: 180 });
  return group([['logotipo', Wd], ['descriptor', { layers: [{ id: 'filete', role: 'd', d: rule }, { id: 'descriptor', role: 'd', d: t1.d + t2.d }] }]]);
}
const R = {
  primary: primary(), horizontal: horizontal(), symbol: group([['simbolo', sym]]), wordmark: group([['logotipo', word]]),
};
for (const k of Object.keys(R)) R[k + 'M'] = toMono(R[k]);
for (const k of Object.keys(R)) R[k] = normalize(R[k]);
fs.writeFileSync(path.join(ROOT, 'assets/logos.js'), `/* Latidos · logo (generado por src/build.js) */\nwindow.LATIDOS_LOGOS={"r1":${JSON.stringify(R)}};\n`);

// ------------------------------------------------------------------ archivos finales
const NAMES = { simbolo: 'Simbolo', logotipo: 'Logotipo', descriptor: 'Descriptor' };
function svgFile(v, colors, title) {
  const b = v.box, m = Math.max(b[2], b[3]) * 0.08;
  const groups = {};
  for (const l of v.layers) (groups[l.g] ||= []).push(l);
  const body = Object.entries(groups).map(([g, ls]) => `  <g id="${NAMES[g]}">\n${ls.map((l) => `    <path id="${l.id}" fill="${colors[l.role]}" d="${l.d}"/>`).join('\n')}\n  </g>`).join('\n');
  const vb = [b[0] - m, b[1] - m, b[2] + 2 * m, b[3] + 2 * m].map(n2);
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Latidos · ${title} · We Rock Agencia -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.join(' ')}" width="${vb[2]}" height="${vb[3]}">
  <title>Latidos — ${title}</title>
${colors.bg ? `  <rect id="Fondo" x="${vb[0]}" y="${vb[1]}" width="${vb[2]}" height="${vb[3]}" fill="${colors.bg}"/>\n` : ''}${body}
</svg>
`;
}
const out = path.join(ROOT, 'descargas/svg');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const LBL = { primary: 'Principal', horizontal: 'Horizontal', symbol: 'Icono', wordmark: 'Nombre' };
const VAR = [
  ['Color', '', { w: C.navy, a: C.lime, d: C.navy }],
  ['Color-Negativo', '', { w: C.ivory, a: C.lime, d: C.ivory, bg: C.navy }],
  ['Una-tinta', 'M', { m: C.navy }],
  ['Una-tinta-Negativo', 'M', { m: C.ivory, bg: C.navy }],
];
let n = 0;
for (const v of Object.keys(LBL)) for (const [name, suf, colors] of VAR) {
  fs.writeFileSync(path.join(out, `Latidos_${LBL[v]}_${name}.svg`), svgFile(R[v + suf], colors, `${LBL[v]} · ${name.replace(/-/g, ' ')}`));
  n++;
}
console.log('ok', n, 'svg');
