// Ruta 01 · Pulso creativo — reconstrucción vectorial del gesto L/a sobre la referencia aprobada (coordenadas en px de ref/3.webp)
const { smoothPath, setText } = require('./geom');

// Cinta de acento (se dibuja primero; su borde superior queda oculto bajo el asta y la onda)
// v3 · dibujo con pocos nodos (extremos con tiradores horizontales/verticales y tangentes continuas en cada unión):
//  - el interior de la L es una sola curva: asta recta → arco → fondo horizontal, sin remate en gancho
//  - la onda brota tangente al borde de la cinta (comparten exactamente la misma curva de arranque)
//  - la punta de la cinta termina oculta dentro de la onda, de modo que el lima se afina sin cortes
const ribbonV3 = 'M246 430L306 430L308 445L308 472C308 504 334 520 366 520C396 516 414 484 440 456C470 410 560 395 600 412'
  + 'C588 420 575 431 560 440C510 470 420 566 362 566C300 566 246 520 246 450Z';
const stemV3 = 'M246 446L246 299L272 299C292 299 308 315 308 335L308 474C284 472 262 462 246 446Z';
const waveV3 = 'M366 520C392 514 480 368 560 368C610 368 650 415 668 465C682 505 712 560 738 563'
  + 'C705 563 662 550 640 528C620 508 592 448 575 435C562 425 545 423 528 423C470 423 410 520 366 520Z';
const ribbonOld = smoothPath([
  [[246, 430], [306, 430]],
  [[306, 430], [308, 445], [308, 470], [310, 488], [317, 502], [330, 512], [347, 518], [366, 520], [386, 515], [401, 505], [414, 491], [428, 472], [440, 459], [460, 443], [480, 432], [500, 424], [520, 420], [540, 420], [560, 426], [580, 438], [600, 455]],
  [[600, 455], [585, 446], [570, 440], [555, 441], [540, 447], [520, 461], [500, 482], [480, 505], [460, 525], [440, 541], [420, 553], [400, 561], [380, 565], [360, 566], [340, 564], [320, 559], [300, 551], [280, 538], [265, 520], [253, 498], [247, 470], [246, 446]],
]);

// Asta de la L: su borde derecho es el mismo trazo recto de la curva interior; la junta con la cinta es una diagonal cóncava
const stemOld = smoothPath([
  [[246, 446], [246, 299]],
  [[246, 299], [270, 299]],
  [[270, 299], [285, 302], [297, 310], [305, 321], [308, 336]],
  [[308, 336], [308, 474]],
  [[308, 474], [290, 470], [273, 463], [258, 455], [246, 446]],
]);

// Onda: brota tangente al borde superior de la cinta, corona a la altura de x y baja como asta diagonal de la a
const waveOld = smoothPath([
  [[368, 520], [386, 512], [400, 500], [413, 485], [426, 467], [442, 445], [460, 422], [480, 401], [500, 386], [520, 376], [540, 370], [560, 368], [580, 370], [600, 377], [620, 390], [640, 409], [655, 432], [668, 465], [680, 497], [692, 522], [705, 540], [720, 553], [738, 563]],
  [[738, 563], [715, 563], [695, 560], [678, 555], [660, 546], [640, 528], [625, 505], [612, 482], [600, 460], [588, 445], [575, 435], [560, 429], [540, 424], [520, 424], [500, 428], [480, 436], [460, 447], [440, 461], [428, 473], [414, 492], [401, 506], [386, 516], [368, 520]],
]);

// "tidos" en Sora Medium: altura de x = 195 px como en la referencia; la i pierde su punto (va en acento)
function letters(x0 = 690) {
  const size = 195 / 0.539;
  const isDot = (c) => Math.max(...c.filter((k) => k.y !== undefined).map((k) => k.y)) < 563 - 195 + 4;
  const t = setText('sora-500', 'tidos', size, x0, 563, { track: -52, drop: { i: isDot } });
  const iG = t.glyphs[1];
  return { ...t, iX: iG.x };
}

void ribbonOld; void stemOld; void waveOld;
module.exports = { ribbon: ribbonV3, stem: stemV3, wave: waveV3, letters };
