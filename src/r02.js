// Ruta 02 · Conexión — logotipo "Latidos" dibujado sobre la referencia aprobada (coordenadas en px de ref/1.webp).
// Medido sobre retícula: palo seco geométrico de peso alto, esquinas exteriores concéntricas en L y t,
// a y d de bowl elíptico, o elíptica con contraste óptico, s de terminales casi horizontales.
// Igual que en la referencia, la i se dibuja sin punto.
const n = (v) => +v.toFixed(2);

// arco elíptico (ángulos en grados, sentido de pantalla) como curvas cúbicas, sin el punto inicial
function arc(cx, cy, rx, ry, a0, a1) {
  const segs = Math.ceil(Math.abs(a1 - a0) / 90);
  const da = (a1 - a0) / segs;
  let d = '';
  for (let i = 0; i < segs; i++) {
    const t0 = ((a0 + i * da) * Math.PI) / 180, t1 = ((a0 + (i + 1) * da) * Math.PI) / 180;
    const k = (4 / 3) * Math.tan((t1 - t0) / 4);
    const p0 = [cx + rx * Math.cos(t0), cy + ry * Math.sin(t0)], p1 = [cx + rx * Math.cos(t1), cy + ry * Math.sin(t1)];
    const c1 = [p0[0] - k * rx * Math.sin(t0), p0[1] + k * ry * Math.cos(t0)];
    const c2 = [p1[0] + k * rx * Math.sin(t1), p1[1] - k * ry * Math.cos(t1)];
    d += `C${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(p1[0])} ${n(p1[1])}`;
  }
  return d;
}
const ellipse = (cx, cy, rx, ry, ccw) => `M${n(cx + rx)} ${n(cy)}` + arc(cx, cy, rx, ry, 0, ccw ? -360 : 360) + 'Z';
// rectángulo de esquinas suaves (r pequeño, como los remates de la referencia)
const rr = (x0, y0, x1, y1, r = 2.5) => `M${x0} ${y0 + r}Q${x0} ${y0} ${x0 + r} ${y0}L${x1 - r} ${y0}Q${x1} ${y0} ${x1} ${y0 + r}L${x1} ${y1 - r}Q${x1} ${y1} ${x1 - r} ${y1}L${x0 + r} ${y1}Q${x0} ${y1} ${x0} ${y1 - r}Z`;

// letra de bowl + asta (a y d): el asta está a la derecha y su borde izquierdo coincide con el borde del contrabowl
function bowlStem(stemL, stemR, top, base, cx, cy, rx, ry, crx, cry) {
  const ca = (Math.acos((stemL - cx) / rx) * 180) / Math.PI; // ángulo del cruce con el asta
  const yb = cy + ry * Math.sin((ca * Math.PI) / 180);
  const r = 2.5;
  const outer = `M${stemL} ${top + r}Q${stemL} ${top} ${stemL + r} ${top}L${stemR - r} ${top}Q${stemR} ${top} ${stemR} ${top + r}`
    + `L${stemR} ${base - r}Q${stemR} ${base} ${stemR - r} ${base}L${stemL + r} ${base}Q${stemL} ${base} ${stemL} ${base - r}`
    + `L${stemL} ${n(yb)}` + arc(cx, cy, rx, ry, ca, 360 - ca) + 'Z';
  return outer + ellipse(cx, cy + 0.3, crx, cry, true);
}

const L = 'M303 594.5Q303 592 305.5 592L334.5 592Q337 592 337 594.5L337 700C337 721 354 738 375 738L429.5 738Q432 738 432 740.5'
  + 'L432 769.5Q432 772 429.5 772L375 772C335.2 772 303 739.8 303 700Z';
const a = bowlStem(557, 595.6, 626.5, 771.7, 511, 699.3, 80, 73, 43.5, 40.5);
const t = 'M609 595Q609 592.5 611.5 592.5L641 592.5Q643.5 592.5 643.5 595L643.5 626.5L686 626.5Q688.5 626.5 688.5 629L688.5 655Q688.5 657.5 686 657.5'
  + 'L643.5 657.5L643.5 700C643.5 720.4 660 737.5 680.5 737.5L685.5 737.5Q688 737.5 688 740L688 769.5Q688 772 685.5 772L681 772C641.2 772 609 739.8 609 700Z';
const i = rr(698.3, 626.7, 732.3, 771.7);
const d = bowlStem(870.7, 909.3, 577.3, 771.7, 825.8, 698.5, 82.3, 75.8, 44.8, 42.8);
const o = ellipse(1007, 698.75, 83, 76.25) + ellipse(1007, 698.25, 44.5, 43.25, true);
const s = 'M1234 668L1200 671.6C1192 660 1180 654.4 1165 654.4C1146 654.4 1133 661 1133 670C1133 681 1152 684 1190 690.5C1220 696 1235 707 1235 724'
  + 'C1235 754 1203 772 1165 772C1132 772 1107 760 1097.4 730L1129 727C1135 738 1148 744 1165 744C1186 744 1199 738 1199 728.5'
  + 'C1199 718 1186 714.5 1160 710C1128 704.5 1098 695 1098 670C1098 643 1128 626.4 1165 626.4C1200 626.4 1226 640 1234 668Z';

module.exports = { word: L + a + t + i + d + o + s };

// Ruta 03 · Personas en movimiento — logotipo "Latidos" medido sobre ref/2.webp (misma familia, otras proporciones, i con punto)
const L3 = 'M251.25 473.5Q251.25 471.25 253.5 471.25L275.25 471.25Q277.5 471.25 277.5 473.5L277.5 550C277.5 562.4 287.6 572.5 300 572.5L339 572.5Q341.25 572.5 341.25 574.75'
  + 'L341.25 593.5Q341.25 595.75 339 595.75L300 595.75C273.1 595.75 251.25 574.2 251.25 550Z';
const a3 = bowlStem(428, 452.5, 497.5, 595.75, 396.5, 546.6, 54, 50.4, 29.5, 28.9);
const t3 = 'M463.25 475.25Q463.25 473 465.5 473L485.25 473Q487.5 473 487.5 475.25L487.5 497.5L514.5 497.5Q516.75 497.5 516.75 499.75L516.75 516.5Q516.75 518.75 514.5 518.75'
  + 'L487.5 518.75L487.5 550C487.5 562.4 495.3 572.5 505 572.5L514.5 572.5Q516.75 572.5 516.75 574.75L516.75 593.5Q516.75 595.75 514.5 595.75L505 595.75C482 595.75 463.25 575.3 463.25 550Z';
const i3 = rr(529.5, 497.5, 552.5, 595.75) + ellipse(541, 480.75, 12.5, 12.5);
const d3 = bowlStem(647, 671.75, 463, 595.75, 616.5, 546.6, 53.5, 50.4, 29.1, 29);
const o3 = ellipse(736.25, 546.9, 54.25, 50.6) + ellipse(736.6, 547.1, 29.6, 29.1, true);
const s3 = 'M885 516.25L862.5 522C857 516.5 849 515 840 515C828 515 820 519.5 820 526.25C820 533 832 535.5 856 539.5C876 543 887.5 549 887.5 560'
  + 'C887.5 583 865 597.5 837.5 597.5C815 597.5 802 588 797.5 572.5L818.75 568C823 574 830 577.5 840 577.5C855 577.5 863.75 573 863.75 566'
  + 'C863.75 559 855 556.5 838 553.5C815 549.5 797 543 797 525C797 506 816 496.25 842.5 496.25C863 496.25 879 504 885 516.25Z';
module.exports.word3 = L3 + a3 + t3 + i3 + d3 + o3 + s3;
