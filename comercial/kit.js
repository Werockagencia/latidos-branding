/* Latidos · Kit comercial · barra, copiar al portapapeles y páginas de ayudaventas y catálogo */
(function () {
  'use strict';
  const { logo } = window.LAT;
  const D = window.LATIDOS_DATA;
  const page = document.body.dataset.page;
  const BASE = 'https://werockagencia.github.io/latidos-branding/';
  const dark = { w: '#F8F5F0', a: '#C6FF3D', d: '#F8F5F0' };

  // barra
  const NAV = [['index.html', 'inicio', 'Kit comercial'], ['portafolio.html', 'portafolio', 'Portafolio'], ['ayudaventas.html', 'ayudaventas', 'Ayudaventas'], ['catalogo.html', 'catalogo', 'Catálogo'], ['propuesta.html', 'propuesta', 'Propuesta']];
  document.body.insertAdjacentHTML('afterbegin', `<div class="bar"><a class="brand" href="index.html">${logo('r1', 'wordmark', dark)}<span class="lbl">· Kit comercial</span></a><nav>${NAV.map(([h, k, t]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</nav></div>`);

  // copiar
  const toast = (t) => { let el = document.querySelector('.toast'); if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); } el.textContent = t; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 1600); };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-copy]');
    if (!b) return;
    const txt = b.dataset.copy;
    const done = () => { b.classList.add('ok'); const o = b.textContent; b.textContent = 'Copiado ✓'; toast('Copiado'); setTimeout(() => { b.classList.remove('ok'); b.textContent = o; }, 1400); };
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, () => {}); else { const t = document.createElement('textarea'); t.value = txt; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); done(); }
  });
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const fileOf = (c) => `../descargas/comercial/${c.group === 'av' ? 'ayudaventas' : 'catalogo'}/Latidos_${c.id.replace(/^(av|cat)-/, '')}.jpg`;

  const list = document.getElementById('list');
  if (page === 'ayudaventas' && list) {
    list.innerHTML = window.LATIDOS_CARDS.filter((c) => c.group === 'av').map((c, i) => `<article class="item"><img src="${fileOf(c)}" alt="${esc(c.title)}" loading="lazy" width="1080" height="1350">
      <div class="bd"><span class="num">TARJETA ${String(i + 1).padStart(2, '0')}</span><h3>${c.title}</h3>
      <pre class="msg">${esc(c.msg)}</pre>
      <div class="row"><button class="btn sm" data-copy="${esc(c.msg)}">Copiar mensaje</button><a class="btn sm ghost" href="${fileOf(c)}" download>Descargar imagen</a></div></div></article>`).join('');
  }
  if (page === 'catalogo' && list) {
    list.innerHTML = window.LATIDOS_CARDS.filter((c) => c.group === 'cat').map((c) => {
      const l = c.line;
      const desc = `${l.line} ${l.desc}\n\nIncluye: ${window.latLcList(l.items)}.\nIdeal para: ${window.latLcList(l.goals)}.\n\nPrecio según número de personas, ciudad y fecha. Escríbenos para cotizar.`;
      const link = `${BASE}comercial/portafolio.html#linea-${l.id}`;
      const code = `LAT-${String(l.n).padStart(2, '0')}`;
      const fld = (k, v) => `<div class="field"><span>${k}</span><div><span>${esc(v).replace(/\n/g, '<br>')}</span><button class="copy" data-copy="${esc(v)}">Copiar</button></div></div>`;
      return `<article class="item"><img src="${fileOf(c)}" alt="${esc(l.name)}" loading="lazy" width="1080" height="1080">
        <div class="bd"><span class="num">PRODUCTO ${code}</span>
        ${fld('Nombre', l.name)}${fld('Precio', 'Dejar vacío (o “Cotizar”)')}${fld('Descripción', desc)}${fld('Enlace', link)}${fld('Código del artículo', code)}
        <a class="btn sm ghost" href="${fileOf(c)}" download>Descargar imagen</a></div></article>`;
    }).join('');
  }
  const sy = new URLSearchParams(location.search).get('y');
  if (sy && +sy) document.body.style.marginTop = -sy + 'px';
})();
