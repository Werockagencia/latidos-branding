// Ruta 01 · Pulso creativo — reconstrucción vectorial del gesto L/a sobre la referencia aprobada (coordenadas en px de ref/3.webp)
const { smoothPath, setText } = require('./geom');

// Cinta de acento (se dibuja primero; su borde superior queda oculto bajo el asta y la onda)
const ribbon = smoothPath([
  [[246, 430], [306, 430]],
  [[306, 430], [306, 470], [309, 490], [319, 506], [337, 514], [360, 519], [385, 512], [400, 503], [412, 491], [430, 469], [440, 459], [460, 443], [480, 432], [500, 424], [520, 420], [540, 420], [560, 425], [575, 431], [585, 441]],
  [[585, 441], [560, 440], [540, 447], [520, 461], [500, 482], [480, 505], [460, 525], [440, 541], [420, 553], [400, 561], [380, 565], [360, 566], [340, 564], [320, 559], [300, 551], [280, 538], [265, 520], [253, 498], [247, 470], [246, 446]],
]);

// Asta de la L con su remate curvo
const stem = smoothPath([
  [[246, 446], [246, 299]],
  [[246, 299], [270, 299]],
  [[270, 299], [285, 302], [297, 310], [305, 321], [308, 336]],
  [[308, 336], [308, 480], [311, 492], [320, 503], [338, 512]],
  [[338, 512], [320, 508], [300, 498], [280, 486], [265, 472], [253, 457], [246, 446]],
]);

// Onda: nace sobre la cinta, corona a la altura de x y baja como asta diagonal de la a
const wave = smoothPath([
  [[410, 492], [420, 477], [440, 448], [460, 422], [480, 401], [500, 386], [520, 376], [540, 370], [560, 368], [580, 370], [600, 377], [620, 390], [640, 409], [655, 432], [668, 465], [680, 497], [692, 522], [705, 540], [720, 553], [738, 563]],
  [[738, 563], [715, 563], [695, 560], [678, 555], [660, 546], [640, 528], [625, 505], [612, 482], [600, 460], [588, 445], [575, 435], [560, 429], [540, 424], [520, 424], [500, 428], [480, 436], [460, 447], [440, 463], [420, 481], [410, 492]],
]);

// "tidos" en Sora Medium: altura de x = 195 px como en la referencia; la i pierde su punto (va en acento)
function letters(x0 = 690) {
  const size = 195 / 0.539;
  const isDot = (c) => Math.max(...c.filter((k) => k.y !== undefined).map((k) => k.y)) < 563 - 195 + 4;
  const t = setText('sora-500', 'tidos', size, x0, 563, { track: -52, drop: { i: isDot } });
  const iG = t.glyphs[1];
  return { ...t, iX: iG.x };
}

module.exports = { ribbon, stem, wave, letters };
