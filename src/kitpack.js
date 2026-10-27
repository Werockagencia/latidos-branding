// Kit comercial · textos descargables y ZIP de ayudaventas y catálogo.  uso: node src/kitpack.js  (después de node src/cards.js)
const fs = require('fs'), path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.join(__dirname, '..'), OUT = path.join(ROOT, 'descargas/comercial');
global.window = { LAT: { logo: () => '' } };
require(path.join(ROOT, 'comercial/data.js')); require(path.join(ROOT, 'comercial/cards.js'));
const CARDS = window.LATIDOS_CARDS, BASE = 'https://werockagencia.github.io/latidos-branding/';
const file = (c) => `Latidos_${c.id.replace(/^(av|cat)-/, '')}.jpg`;
const nl = (s) => s.replace(/\n/g, '\r\n');

let av = 'LATIDOS · AYUDAVENTAS PARA WHATSAPP\r\nCada mensaje va con su imagen (mismo número).\r\n\r\n';
CARDS.filter((c) => c.group === 'av').forEach((c, i) => { av += `=== ${String(i + 1).padStart(2, '0')} · ${c.title} · imagen: ${file(c)} ===\r\n${nl(c.msg)}\r\n\r\n`; });
fs.writeFileSync(path.join(OUT, 'Latidos_Ayudaventas_Mensajes.txt'), '﻿' + av);

let cat = 'LATIDOS · CATÁLOGO WHATSAPP BUSINESS\r\nCopien cada campo en el artículo del catálogo. Precio: dejar vacío.\r\n\r\n';
CARDS.filter((c) => c.group === 'cat').forEach((c) => {
  const l = c.line, code = `LAT-${String(l.n).padStart(2, '0')}`;
  cat += `=== ${code} · imagen: ${file(c)} ===\r\nNombre: ${l.name}\r\nDescripción: ${l.line} ${l.desc}\r\n\r\nIncluye: ${window.latLcList(l.items)}.\r\nIdeal para: ${window.latLcList(l.goals)}.\r\n\r\nPrecio según número de personas, ciudad y fecha. Escríbenos para cotizar.\r\nEnlace: ${BASE}comercial/portafolio.html#linea-${l.id}\r\nCódigo: ${code}\r\n\r\n`;
});
fs.writeFileSync(path.join(OUT, 'Latidos_Catalogo_Fichas.txt'), '﻿' + cat);

const zip = (name, items) => execFileSync('powershell', ['-NoProfile', '-Command', `Remove-Item -ErrorAction SilentlyContinue '${path.join(OUT, name)}'; Compress-Archive -Path ${items.map((p) => `'${p}'`).join(',')} -DestinationPath '${path.join(OUT, name)}' -Force`], { stdio: 'inherit' });
zip('Latidos_Ayudaventas_WhatsApp.zip', [path.join(OUT, 'ayudaventas', '*'), path.join(OUT, 'Latidos_Ayudaventas_Mensajes.txt')]);
zip('Latidos_Catalogo_WhatsApp.zip', [path.join(OUT, 'catalogo', '*'), path.join(OUT, 'Latidos_Catalogo_Fichas.txt')]);
console.log('ok');
