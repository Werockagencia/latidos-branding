// Ruta 01 · Pulso creativo — maestro redibujado sobre la referencia aprobada (coordenadas en px de ref/3.webp).
// v4 · medido letra por letra sobre retícula: mismo gesto, misma tipografía y mismas proporciones que el original,
// con curvas de pocos nodos (tiradores horizontales/verticales en los extremos y tangentes continuas).

// Asta de la L: esquina superior derecha redondeada; su curva interior es azul y se afina en punta sobre la cinta
const stem = 'M246 435L246 299L268 299C288 299 305 315 305 336L305 470C305 492 318 510 338.5 516'
  + 'C310 509 262 480 246 435Z';

// Cinta de acento: bajo el asta comparte la curva interior; bajo la onda queda oculta y termina en punta
const ribbon = 'M246 425L300 425L305 470C305 492 318 510 338.5 516C356 519 384 513 408.5 495'
  + 'C450 455 495 418 531 418C560 418 580 428 592 440'
  + 'C575 437 550.4 438.4 540 444.3C492.2 471.3 420 566 351 566C290 566 246 530 246 470Z';

// Onda: nace en cuña sobre la cinta, corona a la altura de x y baja como asta diagonal hasta la línea base
const wave = 'M408.5 495C445.6 428.7 491 368.5 561 368.5C600 368.5 640 412 659 450C672 476 700 545 736 562.5'
  + 'C700 561 660 548 631 510C616 490 598 456 586 446C574 436 552 425.5 531 425.5C500 425.5 445 462 408.5 495Z';

// "tidos" dibujado como en la referencia (no es una fuente): t de remate recto con brazo solo a la derecha,
// i con esquina redondeada, d con asta redondeada y bowl elíptico, o elíptica con contraste óptico, s geométrica de terminales diagonales
const t = 'M702 326L754 326L754 373L799 373L799 415L754 415L754 486C754 508 768 521 790 521L808 521L808 563L780 563C732 563 702 535 702 490Z';
const i = 'M821 373L840 373C858 373 871 387 871 405L871 563L821 563Z';
const d = 'M1040 298L1068 298C1084 298 1096 310 1096 326L1096 500C1096 530 1060 567 988 567'
  + 'C928.9 567 881 522.5 881 467.5C881 412.5 928.9 368 988 368C1010 368 1028 372 1040 380Z'
  + 'M988 410C955.4 410 929 435.3 929 466.5C929 497.7 955.4 523 988 523C1020.6 523 1047 497.7 1047 466.5C1047 435.3 1020.6 410 988 410Z';
const o = 'M1225 368.5C1287.1 368.5 1337.5 413 1337.5 468C1337.5 523 1287.1 567.5 1225 567.5C1162.9 567.5 1112.5 523 1112.5 468C1112.5 413 1162.9 368.5 1225 368.5Z'
  + 'M1225.5 411C1191.3 411 1163.5 436.3 1163.5 467.5C1163.5 498.7 1191.3 524 1225.5 524C1259.7 524 1287.5 498.7 1287.5 467.5C1287.5 436.3 1259.7 411 1225.5 411Z';
const s = 'M1540 401L1504 428C1490 413 1472 405 1450 405C1420 405 1402 416 1402 431C1404 443 1428 447 1462 453C1508 461 1541 478 1541 505'
  + 'C1541 545 1497 567.5 1440 567.5C1400 567.5 1368 553 1350 532L1384 509C1398 521 1416 527 1440 527C1470 527 1487 519 1487 507'
  + 'C1487 494 1468 491 1432 484C1386 476 1350 461 1350 430C1350 393 1392 368.5 1450 368.5C1490 368.5 1522 383 1540 401Z';

const tidos = t + i + d + o + s;
const dot = { cx: 848, cy: 323, r: 32 };

module.exports = { ribbon, stem, wave, tidos, dot };

// v5 · maestro definitivo: vector dibujado por We Rock en Illustrator (src/vector/ruta01-usuario.svg, exportado de 01.ai).
// Se usa tal cual; se omiten los dos rellenos blancos que tapaban los contrabowls (los huecos ya son transparentes).
{
  const svg = require('fs').readFileSync(require('path').join(__dirname, 'vector/ruta01-usuario.svg'), 'utf8');
  const ps = [...svg.matchAll(/<path[^>]*d="([^"]+)"/g)].map((m) => m[1].trim().replace(/\s+/g, ' '));
  // orden del archivo: 0 d · 1 o · 2 s · 3 onda · 4 cinta lima · 5 t · 6 asta L · 7 i · 8 punto lima · 9-10 rellenos blancos
  module.exports = {
    ribbon: ps[4], stem: ps[6], wave: ps[3],
    tidos: ps[5] + ps[7] + ps[0] + ps[1] + ps[2],
    dotPath: ps[8],
  };
}
