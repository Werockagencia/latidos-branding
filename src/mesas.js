// Ronda 02 · las tres mesas de trabajo de We Rock (01.ai → src/vector/mesaN.svg), usadas tal cual.
const fs = require('fs');
const path = require('path');

function paths(n) {
  const svg = fs.readFileSync(path.join(__dirname, `vector/mesa${n}.svg`), 'utf8');
  return [...svg.matchAll(/<path[^>]*d="([^"]+)"/g)].map((m) => m[1].trim().replace(/\s+/g, ' '));
}

// Mesa 01 · A curva. Orden: 0 d · 1 o · 2 s · 3 t · 4 onda · 5 cinta · 6 asta L · 7 i · 8 punto · 9-10 rellenos blancos (se omiten)
const p1 = paths(1);
const mesa1 = { stem: p1[6], wave: p1[4], ribbon: p1[5], letters: p1[3] + p1[7] + p1[0] + p1[1] + p1[2], dot: p1[8] };

// Mesa 02 · A de vértice. Orden: 0 d · 1 o · 2 s · 3 onda · 4 t · 5 asta L · 6 i · 7 punto · 8 cinta
const p2 = paths(2);
const mesa2 = { stem: p2[5], wave: p2[3], ribbon: p2[8], letters: p2[4] + p2[6] + p2[0] + p2[1] + p2[2], dot: p2[7] };

// Mesa 03 · sello. Hay dos copias superpuestas (azul abajo, ciruela arriba): se usa la de arriba (10-19).
// 10 círculo con la A calada · 15 cinta · 19 L clara · 11-14, 16-18 letras
const p3 = paths(3);
const mesa3 = { circle: p3[10], ribbon: p3[15], ell: p3[19], letters: [11, 12, 13, 14, 16, 17, 18].map((i) => p3[i]).join('') };

module.exports = { mesa1, mesa2, mesa3 };
