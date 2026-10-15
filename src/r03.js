// Ruta 03 · Personas en movimiento — símbolo redibujado con pocos nodos sobre la silueta aprobada
// (coordenadas en px de ref/2.webp). Extremos con tiradores horizontales/verticales y tangentes continuas.

// Forma 1, parte superior (principal): asta con hoja superior; termina en el punto de encuentro M (513, 341)
const formA = 'M412 248C412 196 420 162 486 128C492 125 498 126 498 134L498 300C498 322 504 334 513 341C470 338 425 300 412 248Z';

// Forma 1, segmento de transformación (acento): su borde superior queda oculto bajo la parte principal
const formAcc = 'M412 248L412 320C412 385 460 423 512 423C550 423 575 405 588 393C594 387.5 599.5 379.5 593 380'
  + 'C560 383 530 368 513 341C470 336 425 298 412 248Z';

// Forma 2: llega en curva y se encuentra con la primera en M
const formB = 'M513 341C530 312 575 262 628 262C680 262 716 302 716 347C716 386 692 410 674 420C668 423.3 662.6 421 661 415'
  + 'C650 375 625 342 588 341L513 341Z';

module.exports = { formA, formAcc, formB };
