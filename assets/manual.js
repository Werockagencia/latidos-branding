/* Latidos · manual de marca (versión preliminar sobre la propuesta 01 · Pulso) */
(function () {
  'use strict';
  const { logo, M } = window.LAT;
  const L = window.LATIDOS_LOGOS.r1;
  const R = 'r1';
  const C = { navy: '#0B1B3B', lime: '#C6FF3D', ivory: '#F8F5F0', steel: '#A7B0BA' };
  const light = { p: C.navy, w: C.navy, a: C.lime, d: C.navy };
  const dark = { p: C.ivory, w: C.ivory, a: C.lime, d: C.ivory };
  const mono = (m) => ({ m });
  const f = (n) => +n.toFixed(2);
  let page = 0;
  const TOTAL = 23;

  function bbox(ds) {
    const nums = ds.join(' ').match(/-?\d*\.?\d+(?:e-?\d+)?/gi).map(Number);
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i + 1 < nums.length; i += 2) { x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]); y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]); }
    return [x0, y0, x1 - x0, y1 - y0];
  }
  const rgb = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  function cmyk(h) {
    const [r, g, b] = rgb(h).map((v) => v / 255); const k = 1 - Math.max(r, g, b);
    return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k].map((v) => Math.round(v * 100)).join(' · ');
  }

  const pg = (cls, title, body, opts = {}) => {
    page++;
    return `<section class="pg ${cls} rv" id="${opts.id || 'p' + page}">
      ${opts.noHead ? '' : `<div class="hd"><span>${title}</span><span>Latidos · Manual de marca</span></div>`}
      ${body}
      ${opts.noFoot ? '' : `<div class="ft"><span>We Rock Agencia · Octubre 2026</span><span>${String(page).padStart(2, '0')} / ${TOTAL}</span></div>`}
    </section>`;
  };

  // ---------------------------------------------------------------- recursos gráficos propios
  // patrón de ondas: la cinta de la marca repetida como textura
  function waves(bg, fg, acc, n = 7) {
    let p = '';
    for (let i = 0; i < n; i++) {
      const y = 30 + i * 46, col = i === 2 ? acc : fg, op = i === 2 ? 1 : 0.22;
      p += `<path d="M-40 ${y + 30} C 120 ${y + 30}, 160 ${y - 20}, 300 ${y - 20} S 480 ${y + 30}, 640 ${y + 30} S 820 ${y - 20}, 980 ${y - 20}" fill="none" stroke="${col}" stroke-width="16" stroke-linecap="round" opacity="${op}"/>`;
    }
    return `<svg viewBox="0 0 940 340" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true"><rect width="940" height="340" fill="${bg}"/>${p}</svg>`;
  }
  const shadow = '0 1px 2px rgba(0,0,0,.15), 0 18px 36px -12px rgba(0,0,0,.35)';

  // ---------------------------------------------------------------- mockups adicionales
  const MK = {
    card: () => `<div class="abs" style="inset:0;background:#D9D4CA"></div>
      <div class="abs" style="left:8%;top:16%;width:50%;aspect-ratio:1.75;transform:rotate(-8deg);background:${C.navy};border-radius:5px;box-shadow:${shadow};display:grid;place-items:center;padding:0 9%">${logo(R, 'primary', dark)}</div>
      <div class="abs" style="right:7%;bottom:12%;width:48%;aspect-ratio:1.75;transform:rotate(5deg);background:${C.ivory};border-radius:5px;box-shadow:${shadow};padding:6% 7%;display:flex;flex-direction:column;justify-content:space-between;color:${C.navy}">
        <div style="display:flex;justify-content:space-between;gap:8px"><div><div style="font-family:Sora;font-weight:600;font-size:clamp(8px,2.6cqw,16px)">Nombre Apellido</div><div style="font-size:clamp(5px,1.4cqw,9px);letter-spacing:.14em;text-transform:uppercase;opacity:.6;margin-top:2px">Director de experiencias</div></div><div style="width:20%">${logo(R, 'symbol', light)}</div></div>
        <div style="font-size:clamp(5px,1.4cqw,9.5px);line-height:1.6;opacity:.85">hola@latidos.co<br>+57 000 000 0000<br>latidos.co</div>
      </div>`,
    letter: () => `<div class="abs" style="inset:0;background:#D9D4CA"></div>
      <div class="abs" style="left:50%;top:7%;bottom:-8%;width:52%;transform:translateX(-50%) rotate(-2deg);background:#fff;box-shadow:${shadow};padding:7% 8%;color:${C.navy};display:flex;flex-direction:column;gap:6%">
        <div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="width:44%">${logo(R, 'primary', light)}</div><div style="font-size:clamp(4px,1.1cqw,7px);text-align:right;line-height:1.6;opacity:.7">latidos.co<br>Bogotá · Colombia</div></div>
        <div style="display:grid;gap:5px">${Array.from({ length: 9 }, (_, i) => `<i style="display:block;height:clamp(2px,.55cqw,4px);border-radius:2px;background:${C.navy};opacity:.14;width:${[60, 95, 92, 88, 96, 70, 94, 90, 50][i]}%"></i>`).join('')}</div>
        <div style="margin-top:auto;height:4px;background:${C.lime};width:30%;border-radius:2px"></div>
      </div>`,
    email: () => `<div class="abs" style="inset:0;background:#E7E3DC"></div>
      <div class="abs" style="left:7%;right:7%;top:14%;bottom:14%;background:#fff;border-radius:10px;box-shadow:${shadow};padding:5% 6%;color:${C.navy};display:flex;flex-direction:column;gap:5%">
        <div style="display:grid;gap:4px">${[80, 96, 64].map((w) => `<i style="display:block;height:5px;border-radius:3px;background:${C.navy};opacity:.12;width:${w}%"></i>`).join('')}</div>
        <div style="display:flex;align-items:center;gap:5%;border-top:1px solid rgba(11,27,59,.12);padding-top:5%">
          <div style="width:24%">${logo(R, 'primary', light)}</div>
          <div style="border-left:2px solid ${C.lime};padding-left:5%;font-size:clamp(6px,1.5cqw,11px);line-height:1.5"><b style="font-family:Sora">Nombre Apellido</b><br><span style="opacity:.65">Director de experiencias · +57 000 000 0000</span></div>
        </div>
      </div>`,
    post: () => `<div class="abs" style="inset:0;background:${C.navy}"></div>${waves(C.navy, C.ivory, C.lime)}
      <div class="abs" style="left:8%;right:8%;bottom:10%;color:${C.ivory}"><div style="font-family:Sora;font-weight:500;font-size:clamp(14px,7cqw,40px);line-height:1;letter-spacing:-.03em">Encuentros con pulso propio.</div><div style="margin-top:4%;width:30%">${logo(R, 'wordmark', dark)}</div></div>`,
    story: () => `<div class="abs" style="inset:0;background:#D9D4CA"></div>
      <div class="abs" style="left:18%;right:18%;top:8%;bottom:8%;border-radius:14px;overflow:hidden;background:${C.lime};box-shadow:${shadow};display:flex;flex-direction:column;justify-content:space-between;padding:10% 8%;color:${C.navy}">
        <div style="width:60%">${logo(R, 'wordmark', mono(C.navy))}</div>
        <div><div style="font-size:clamp(5px,1.6cqw,9px);letter-spacing:.18em;text-transform:uppercase;font-weight:700">Próximo encuentro</div><div style="font-family:Sora;font-weight:600;font-size:clamp(11px,4.6cqw,26px);line-height:1;letter-spacing:-.03em;margin-top:6%">Un día que el equipo no olvidará</div></div>
        <div style="background:${C.navy};color:${C.ivory};text-align:center;padding:5%;border-radius:99px;font-size:clamp(5px,1.6cqw,9px);font-weight:700">Desliza para conocerlo</div>
      </div>`,
    deck: () => `<div class="abs" style="inset:0;background:#DCD7CD"></div>
      <div class="abs" style="left:50%;top:50%;height:78%;width:min(84%,calc(78cqh * 16 / 9));transform:translate(-50%,-50%);background:${C.navy};border-radius:6px;box-shadow:${shadow};overflow:hidden;color:${C.ivory}">
        <div class="abs" style="left:6%;top:9%;width:26%">${logo(R, 'horizontal', dark)}</div>
        <div class="abs" style="left:6%;bottom:12%;width:55%;font-family:Sora;font-weight:500;font-size:clamp(12px,4.4cqw,40px);line-height:1;letter-spacing:-.03em">Encuentros con pulso propio</div>
        <div class="abs" style="right:-6%;top:14%;width:40%">${logo(R, 'symbol', dark)}</div>
      </div>`,
    shirt: () => `<div class="abs" style="inset:0;background:#E7E3DC"></div>
      <svg class="abs" viewBox="0 0 400 320" style="inset:0;width:100%;height:100%" aria-hidden="true">
        <path d="M140 40 L170 30 C 185 48, 215 48, 230 30 L260 40 L320 80 L295 120 L265 105 L265 300 L135 300 L135 105 L105 120 L80 80 Z" fill="rgba(0,0,0,.18)" transform="translate(5 7)" style="filter:blur(5px)"/>
        <path d="M140 40 L170 30 C 185 48, 215 48, 230 30 L260 40 L320 80 L295 120 L265 105 L265 300 L135 300 L135 105 L105 120 L80 80 Z" fill="${C.navy}"/>
      </svg>
      <div class="abs" style="left:41%;top:34%;width:18%">${logo(R, 'symbol', dark)}</div>`,
    tote: () => `<div class="abs" style="inset:0;background:#D9D4CA"></div>
      <svg class="abs" viewBox="0 0 400 320" style="inset:0;width:100%;height:100%" aria-hidden="true"><path d="M160 110 C 160 40, 240 40, 240 110" fill="none" stroke="#e9e2d2" stroke-width="10"/><rect x="118" y="105" width="164" height="190" fill="rgba(0,0,0,.2)" transform="translate(5 7)" style="filter:blur(6px)"/><rect x="118" y="105" width="164" height="190" fill="#EFE8D8"/></svg>
      <div class="abs" style="left:34%;top:52%;width:32%">${logo(R, 'primary', light)}</div>`,
    bottle: () => `<div class="abs" style="inset:0;background:${C.lime}"></div>
      <div class="abs" style="left:43%;top:12%;width:14%;height:9%;background:#C7CCD2;border-radius:6px 6px 2px 2px"></div>
      <div class="abs" style="left:39%;top:20%;width:22%;bottom:8%;background:${C.navy};border-radius:18px;box-shadow:inset -10px 0 18px rgba(0,0,0,.35), ${shadow};display:grid;place-items:center">
        <div style="width:70%;transform:rotate(-90deg)">${logo(R, 'wordmark', dark)}</div>
      </div>`,
  };

  // ---------------------------------------------------------------- páginas
  let h = '';

  // 1 portada
  h += pg('navy', '', `<div style="flex:1;display:grid;place-items:center;padding:6% 8%"><div style="width:min(760px,100%)">${logo(R, 'primary', dark)}</div></div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;border-top:1px solid rgba(248,245,240,.18);padding-top:18px">
      <div><div style="font-family:Sora;font-weight:500;font-size:clamp(26px,3vw,40px);letter-spacing:-.03em;line-height:1">Manual de marca</div><div style="opacity:.6;font-size:13px;margin-top:6px">Versión preliminar · Propuesta 01 · Pulso</div></div>
      <span class="tag">Se completa con la propuesta elegida</span>
    </div>`, { noHead: true, noFoot: true });

  // 2 índice
  const TOC = ['Bienvenida', 'Quiénes somos', 'Personalidad', 'El logo', 'Anatomía del logo', 'Versiones', 'Espacio libre', 'Tamaño mínimo', 'Colores', 'Versiones de color', 'Fondos', 'Lo que no se debe hacer', 'Tipografía', 'Jerarquía de textos', 'La onda', 'Fotografía', 'Cómo hablamos', 'Papelería', 'Digital', 'Eventos', 'Archivos y contacto'];
  h += pg('', 'Contenido', `<h2>Contenido</h2><ol class="toc">${TOC.map((t, i) => `<li><b>${String(i + 3).padStart(2, '0')}</b><a href="#p${i + 3}">${t}</a></li>`).join('')}</ol>`);

  // 3 bienvenida
  h += pg('', 'Bienvenida', `<div class="cols c2"><div><h2>Para qué sirve este manual</h2>
      <p>Este manual reúne las reglas para usar la marca Latidos siempre igual: en una presentación, una credencial, una pantalla de escenario o una publicación en redes.</p>
      <p>Una marca se vuelve memorable cuando se ve igual en todas partes. Cuídenla como cuidan cada detalle de una experiencia.</p>
      <p class="muted">Esta es una versión preliminar, construida sobre la propuesta 01 · Pulso. En cuanto elijan la propuesta final, actualizamos el logo y completamos el manual.</p></div>
    <div class="box" style="background:${C.navy}">${logo(R, 'symbol', dark)}</div></div>`);

  // 4 quiénes somos
  h += pg('navy', 'Quiénes somos', `<div class="cols c2"><div><div class="num">01</div><h2 style="margin-top:18px">Diseñamos experiencias corporativas que dejan huella.</h2></div>
    <div style="display:grid;gap:22px;align-content:center">
      <div><h3>Propósito</h3><p>Conectar personas, despertar emociones y crear vínculos auténticos dentro de las empresas.</p></div>
      <div><h3>Lo que hacemos</h3><p>Transformamos encuentros empresariales —lanzamientos, convenciones, integraciones, celebraciones— en experiencias que la gente recuerda y quiere contar.</p></div>
      <div><h3>Lo que nos mueve</h3><p>Cada evento tiene un pulso: la expectativa al llegar, el momento cumbre y el recuerdo que queda. Diseñamos ese ritmo.</p></div>
    </div></div>`);

  // 5 personalidad
  const PERS = [['Cercana', 'Hablamos como personas, no como corporación.'], ['Creativa', 'Cada experiencia es única: nunca copiamos fórmulas.'], ['Confiable', 'Cumplimos lo que prometemos, en tiempo y en detalle.'], ['Enérgica', 'Ponemos ritmo, movimiento y emoción en cada encuentro.']];
  h += pg('', 'Personalidad', `<h2>Así es Latidos</h2><p class="muted">Cuatro rasgos que guían cómo se ve, cómo habla y cómo se siente la marca.</p>
    <div class="cols c4" style="margin-top:18px">${PERS.map(([t, d], i) => `<div style="border-top:3px solid ${i === 3 ? C.lime : C.navy};padding-top:16px"><div class="num" style="font-size:40px">0${i + 1}</div><h3 style="margin-top:12px">${t}</h3><p class="muted">${d}</p></div>`).join('')}</div>`);

  // 6 el logo
  h += pg('', 'El logo', `<div class="cols c12"><div><h2>El logo</h2>
      <p>La palabra completa es la marca. La L se estira en una onda que sube y forma la A: un solo gesto que representa el pulso de una experiencia bien diseñada.</p>
      <p>La cinta verde corre por debajo como una segunda capa de energía, y el punto de la <i>i</i> la repite para cerrar el nombre.</p>
      <p>Debajo, la frase “Experiencias corporativas” explica lo que hacemos.</p></div>
    <div class="box edge" style="background:${C.ivory}">${logo(R, 'primary', light)}</div></div>`);

  // 7 anatomía
  const anat = [['1', 'La L', 'Firme y vertical: la base, la organización que convoca.'], ['2', 'La onda que forma la A', 'Sube y baja como un pulso: el ritmo del encuentro.'], ['3', 'La cinta verde', 'La energía que hace memorable cada experiencia.'], ['4', 'El punto de la i', 'Repite el verde y cierra el nombre con un golpe de color.'], ['5', 'La frase', '“Experiencias corporativas”: lo que hacemos, en claro.']];
  h += pg('', 'Anatomía del logo', `<h2>Anatomía del logo</h2>
    <div class="cols c21" style="margin-top:10px"><div class="box edge" style="background:${C.ivory}">${anatomySvg()}</div>
    <div style="display:grid;gap:12px;align-content:center">${anat.map(([n, t, d]) => `<div style="display:grid;grid-template-columns:30px 1fr;gap:10px"><b style="display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:${C.lime};font-size:12px">${n}</b><div><h3 style="font-size:16px">${t}</h3><p class="muted" style="margin:0;font-size:14px">${d}</p></div></div>`).join('')}</div></div>`);

  // 8 versiones
  const V = [['primary', 'Principal', 'La versión preferida. Úsenla siempre que haya espacio.', C.ivory, light], ['horizontal', 'Horizontal', 'Para espacios anchos y bajos: encabezados, banners, firmas.', C.ivory, light], ['symbol', 'Ícono', 'La L con la onda. Para foto de perfil, sellos y piezas cuadradas.', C.navy, dark], ['wordmark', 'Solo el nombre', 'Cuando la frase no se alcanza a leer o el espacio es angosto.', C.ivory, light]];
  h += pg('', 'Versiones', `<h2>Versiones</h2><div class="cols c4" style="margin-top:6px">${V.map(([v, n, d, bg, c]) => `<div style="display:flex;flex-direction:column"><div class="box edge" style="background:${bg};flex:1;padding:14%">${logo(R, v, c)}</div><span class="cap">${n}</span><span>${d}</span></div>`).join('')}</div>`);

  // 9 espacio libre
  h += pg('', 'Espacio libre', `<div class="cols c21"><div class="box edge" style="background:${C.ivory};padding:4%">${clearSvg()}</div>
    <div style="align-self:center"><h2>Espacio libre</h2><p>El logo necesita aire. Alrededor de él se deja un espacio vacío igual al tamaño del <b>punto de la i</b> (la medida <b>x</b>).</p><p>Ningún texto, foto, borde u otro logo debe entrar en ese espacio.</p><p class="muted">Así el logo se ve limpio y profesional en cualquier pieza.</p></div></div>`);

  // 10 tamaño mínimo
  const MIN = [['primary', 190, 'Logo con frase', 'Desde 3,5 cm de ancho impreso · 160 px en pantalla'], ['wordmark', 120, 'Solo el nombre', 'Desde 2,2 cm · 100 px'], ['symbol', 42, 'Ícono', 'Desde 0,8 cm · 32 px']];
  h += pg('', 'Tamaño mínimo', `<h2>Tamaño mínimo</h2><p class="muted">Por debajo de estas medidas el logo pierde detalle. En espacios más pequeños se usa la versión sin frase o el ícono.</p>
    <div class="cols c3" style="margin-top:20px;align-items:end">${MIN.map(([v, w, n, d]) => `<div><div style="height:120px;display:flex;align-items:flex-end"><div style="width:${w}px">${logo(R, v, light)}</div></div><span class="cap">${n}</span><span>${d}</span></div>`).join('')}</div>`);

  // 11 colores
  const PAL = [['Azul profundo', 'Principal', C.navy, 'El color de la marca: logo, títulos y fondos.'], ['Lima vibrante', 'Acento', C.lime, 'La chispa: detalles, botones y momentos destacados.'], ['Marfil cálido', 'Fondo', C.ivory, 'Fondo cálido en lugar del blanco puro.'], ['Gris acero', 'Apoyo', C.steel, 'Líneas, datos y elementos secundarios.']];
  const on = (hex) => (hex === C.navy ? C.ivory : C.navy);
  h += pg('', 'Colores', `<h2>Colores</h2><p class="muted">Con estos códigos se piden los colores exactos: HEX y RGB para pantallas, CMYK para impresión. Antes de imprimir grandes cantidades, pidan una prueba de color.</p>
    <div class="cols c4" style="margin-top:12px">${PAL.map(([n, r, hex, u]) => `<div class="sw"><div class="chip" style="background:${hex};color:${on(hex)}"><i>${r}</i><b>${n}</b></div><dl><dt>HEX</dt><dd>${hex}</dd><dt>RGB</dt><dd>${rgb(hex).join(' · ')}</dd><dt>CMYK</dt><dd>${cmyk(hex)}</dd></dl><div style="padding:0 16px 14px;font-size:12.5px;color:#5A6475">${u}</div></div>`).join('')}</div>
    <div style="display:flex;height:34px;border-radius:8px;overflow:hidden;margin-top:16px;box-shadow:inset 0 0 0 1px var(--line)">${[[C.navy, 40], [C.lime, 10], [C.ivory, 40], [C.steel, 10]].map(([c, s]) => `<div style="flex:${s};background:${c};color:${on(c)};font-size:10.5px;font-weight:700;display:flex;align-items:center;padding:0 10px">${s}%</div>`).join('')}</div>
    <span class="cap" style="opacity:.6">Proporción de uso en las piezas</span>`);

  // 12 versiones de color
  const VC = [['primary', 'A color', C.ivory, light, 'La versión principal.'], ['primary', 'En claro', C.navy, dark, 'Sobre el azul de la marca.'], ['primaryM', 'Un solo color', C.ivory, mono(C.navy), 'Sellos, documentos, impresión sencilla.'], ['primaryM', 'Un color sobre oscuro', C.navy, mono(C.ivory), 'Grabados, bordados, vinilos.'], ['primaryM', 'Sobre el verde', C.lime, mono(C.navy), 'Piezas de alto impacto.'], ['primaryM', 'Negro', '#FFFFFF', mono('#111111'), 'Cuando solo hay tinta negra.']];
  h += pg('', 'Versiones de color', `<h2>Versiones de color</h2><div class="cols c3" style="margin-top:6px">${VC.map(([v, n, bg, c, d]) => `<div style="display:flex;flex-direction:column"><div class="box edge" style="background:${bg};flex:1;min-height:110px;padding:8% 12%">${logo(R, v, c)}</div><span class="cap">${n}</span><span>${d}</span></div>`).join('')}</div>`);

  // 13 fondos
  const BG = [[C.ivory, light, 'primary', true, 'Marfil cálido'], [C.navy, dark, 'primary', true, 'Azul profundo'], [C.lime, mono(C.navy), 'primaryM', true, 'Lima, a un color'], [C.steel, light, 'primary', false, 'Gris: la cinta se pierde']];
  h += pg('', 'Fondos', `<h2>Sobre qué fondos va</h2><p class="muted">El logo luce mejor sobre los colores de la marca. Sobre fotos, úsenlo en una zona tranquila y con buen contraste.</p>
    <div class="cols c4" style="margin-top:14px">${BG.map(([bg, c, v, ok, n]) => `<div style="display:flex;flex-direction:column"><div class="box ${ok ? 'ok' : 'no'} edge" style="background:${bg};flex:1;padding:12%">${logo(R, v, c)}</div><span class="cap">${n}</span></div>`).join('')}
    </div>
    <div class="cols c2" style="margin-top:14px;flex:0 0 auto">
      <div style="display:flex;flex-direction:column"><div class="box ok" style="min-height:120px;background:linear-gradient(135deg,#2a3b5c,#14213d 60%,#0b1325);padding:10% 20%">${logo(R, 'primary', dark)}</div><span class="cap">Foto oscura y tranquila</span></div>
      <div style="display:flex;flex-direction:column"><div class="box no" style="min-height:120px;background:repeating-linear-gradient(45deg,#c9a46b 0 14px,#3d6b8a 14px 28px,#e8e1d0 28px 42px);padding:10% 20%">${logo(R, 'primary', light)}</div><span class="cap">Foto con mucho detalle</span></div>
    </div>`);

  // 14 incorrectos
  const D = [['Deformar', 'transform:scaleX(1.4) scaleY(.8)', light], ['Inclinar', 'transform:rotate(-14deg)', light], ['Cambiar colores', '', { w: '#7B2CBF', a: '#FF8A00', d: '#7B2CBF' }], ['Agregar sombras', 'filter:drop-shadow(5px 7px 0 rgba(0,0,0,.35))', light], ['Poco contraste', '', mono('#C9CFD6'), '#E6E9ED'], ['Contornear', 'filter:drop-shadow(0 0 0 #000)', light, null, true]];
  h += pg('', 'Lo que no se debe hacer', `<h2>Lo que no se debe hacer</h2><div class="cols c3" style="margin-top:6px">${D.map(([n, st, c, bg, outline]) => `<div style="display:flex;flex-direction:column"><div class="box no" style="background:${bg || '#EFEBE3'};flex:1;min-height:110px;padding:10% 14%">${outline ? `<svg class="lg" viewBox="0 0 ${L.primary.box[2]} ${L.primary.box[3]}"><use href="#r1-primary" style="--l-p:none;--l-w:none;--l-a:none;--l-d:none" stroke="${C.navy}" stroke-width="3"/></svg>` : logo(R, n === 'Poco contraste' ? 'primaryM' : 'primary', c, { style: st })}</div><span class="cap">${n}</span></div>`).join('')}</div>
    <p class="muted" style="margin-top:14px">Tampoco se debe cambiar la tipografía de la frase, mover sus partes ni recrear el logo a mano: usen siempre los archivos originales.</p>`);

  // 15 tipografía
  h += pg('', 'Tipografía', `<h2>Tipografía</h2><p class="muted">Dos familias gratuitas, disponibles en Google Fonts, para todas las piezas de la marca. El logo no se escribe con ellas: siempre se usa el archivo original.</p>
    <div class="cols c2" style="margin-top:12px">
      <div style="background:#fff;border-radius:10px;padding:22px;box-shadow:inset 0 0 0 1px var(--line)"><span class="cap" style="margin:0 0 8px">Para títulos</span><div style="font-family:Sora;font-weight:500;font-size:clamp(70px,9vw,130px);line-height:.9;letter-spacing:-.04em">Aa</div><div style="font-family:Sora;font-size:15px;margin-top:10px;word-break:break-all">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br>abcdefghijklmnñopqrstuvwxyz 0123456789</div><p style="margin:12px 0 0"><b>Sora</b> · Light, Regular, Medium, SemiBold</p></div>
      <div style="background:#fff;border-radius:10px;padding:22px;box-shadow:inset 0 0 0 1px var(--line)"><span class="cap" style="margin:0 0 8px">Para textos</span><div style="font-family:Manrope;font-weight:500;font-size:clamp(70px,9vw,130px);line-height:.9;letter-spacing:-.03em">Aa</div><div style="font-family:Manrope;font-size:15px;margin-top:10px;word-break:break-all">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br>abcdefghijklmnñopqrstuvwxyz 0123456789</div><p style="margin:12px 0 0"><b>Manrope</b> · Regular, Medium, SemiBold, Bold</p></div>
    </div>`);

  // 16 jerarquía
  h += pg('', 'Jerarquía de textos', `<h2>Jerarquía de textos</h2><div class="hier" style="margin-top:6px">
    <div class="row"><span class="t">Título · Sora Medium</span><div style="font-family:Sora;font-weight:500;font-size:clamp(30px,4vw,52px);line-height:1;letter-spacing:-.035em">Encuentros con pulso propio.</div></div>
    <div class="row"><span class="t">Subtítulo · Sora Regular</span><div style="font-family:Sora;font-size:clamp(18px,2vw,24px);line-height:1.25;letter-spacing:-.015em">Diseñamos experiencias que conectan personas.</div></div>
    <div class="row"><span class="t">Texto · Manrope Regular</span><div style="max-width:62ch;font-size:15px">Cada encuentro empieza con una pregunta: ¿qué queremos que la gente sienta al salir? Desde ahí diseñamos el formato, el lugar, el ritmo y los detalles.</div></div>
    <div class="row"><span class="t">Etiqueta · Manrope SemiBold</span><div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600">Experiencias corporativas · 2026</div></div>
    <div class="row"><span class="t">Botón</span><div><span style="display:inline-block;background:${C.lime};color:${C.navy};padding:10px 20px;border-radius:99px;font-weight:700;font-size:14px">Agenda tu experiencia</span></div></div>
  </div>`);

  // 17 la onda
  h += pg('navy', 'La onda', `<div class="cols c12"><div><h2>La onda</h2><p>La cinta del logo se convierte en un recurso gráfico: ondas que acompañan las piezas y les dan ritmo.</p><p class="muted">Úsenla como fondo o como línea de apoyo, siempre detrás del contenido. Solo una onda va en verde; las demás, suaves.</p></div>
    <div style="position:relative;border-radius:10px;overflow:hidden;min-height:220px">${waves(C.navy, C.ivory, C.lime)}</div></div>
    <div class="cols c3" style="margin-top:16px;flex:0 0 auto">${[[C.ivory, C.navy, C.lime], [C.lime, C.navy, C.navy], ['#13244a', C.ivory, C.lime]].map(([bg, fg, ac]) => `<div style="position:relative;border-radius:10px;overflow:hidden;height:90px">${waves(bg, fg, ac, 5)}</div>`).join('')}</div>`);

  // 18 fotografía
  const PH = [['Personas reales', 'Equipos compartiendo, riendo, celebrando. Momentos auténticos, no poses.', 'linear-gradient(140deg,#c9a77c,#7a5b46 55%,#2b2320)'], ['Luz y ambiente', 'Escenarios con luz cálida o luces de evento. Profundidad y movimiento.', 'radial-gradient(70% 70% at 30% 30%,#ffd58a,#9c4a2d 50%,#1b1022)'], ['Detalles', 'La credencial, la mesa, el regalo: los detalles que hacen la diferencia.', 'linear-gradient(160deg,#e7e1d6,#b9b2a6 60%,#6c665e)']];
  h += pg('', 'Fotografía', `<h2>Fotografía</h2><p class="muted">Las fotos cuentan la experiencia. Buscamos emoción real, luz cálida y personas en movimiento.</p>
    <div class="cols c3" style="margin-top:12px">${PH.map(([t, d, g]) => `<div style="display:flex;flex-direction:column"><div style="flex:1;min-height:150px;border-radius:10px;background:${g};position:relative;overflow:hidden"><div style="position:absolute;left:10px;bottom:10px;width:30%">${logo(R, 'wordmark', dark)}</div></div><span class="cap">${t}</span><span>${d}</span></div>`).join('')}</div>
    <p class="muted" style="margin-top:12px">Eviten fotos de banco de imágenes genéricas, apretones de mano posados y filtros exagerados.</p>`);

  // 19 cómo hablamos
  h += pg('', 'Cómo hablamos', `<div class="cols c2"><div><h2>Cómo hablamos</h2><p>Latidos habla como un anfitrión: cercano, seguro y con energía. Frases cortas, verbos de acción y cero palabras rebuscadas.</p>
      <ul class="rules"><li>Hablamos de personas y emociones, no solo de logística.</li><li>Tuteamos con respeto en redes; en propuestas, “ustedes”.</li><li>Prometemos lo que vamos a cumplir.</li></ul></div>
    <div class="say" style="align-content:center"><span class="cap">Así sí</span><div class="y">Diseñamos el día que tu equipo va a recordar.</div><div class="y">Cada encuentro tiene su propio pulso.</div><span class="cap" style="margin-top:10px">Así no</span><div class="n">Ofrecemos soluciones integrales de logística para eventos corporativos.</div><div class="n">¡¡¡El mejor evento de la historia!!!</div></div></div>`);

  // 20-22 aplicaciones
  const T = { r: R, pri: C.navy, acc: C.lime, bg: C.ivory, bg2: '#EFEBE3', ink: C.navy, dk: C.navy, c: light, ci: dark, surf: '#DCD7CD', headline: 'Encuentros con pulso propio', stageW: 62, deckLogoW: 30, wall: '#E7E2D8', accC: mono(C.navy), badgeLogoW: 92, badgeV: 'wordmark', signV: 'primary', signLogoW: 100, strap: C.lime, surf2: C.lime };
  const mk = (cls, lbl, html, lc) => `<div class="mk ${cls}" style="--mlbl:${lc || 'rgba(11,27,59,.55)'}"><span class="lbl">${lbl}</span>${html}</div>`;
  h += pg('', 'Papelería', `<h2>Papelería</h2><div class="grid-mk">${mk('wide', 'Tarjetas de presentación', MK.card())}${mk('tall port', 'Hoja membretada', MK.letter())}${mk('', 'Firma de correo', MK.email())}${mk('', 'Bolsa', MK.tote())}</div>`);
  h += pg('', 'Digital', `<h2>Digital</h2><div class="grid-mk">${mk('', 'Publicación', MK.post(), 'rgba(248,245,240,.65)')}${mk('', 'Foto de perfil', M.avatar(T))}${mk('tall port', 'Historia', MK.story())}${mk('wide', 'Presentación', MK.deck())}</div>`);
  h += pg('', 'Eventos', `<h2>Eventos</h2><div class="grid-mk">${mk('wide', 'Pantalla de escenario', M.stage(T), 'rgba(255,255,255,.6)')}${mk('tall port', 'Credencial', M.badge(T))}${mk('', 'Camiseta', MK.shirt())}${mk('', 'Termo', MK.bottle())}</div>`);

  // archivos y contacto
  h += pg('navy', 'Archivos y contacto', `<div class="cols c2"><div><h2>Archivos y contacto</h2><p>Usen siempre los archivos originales del logo. Si necesitan una versión o un formato que no esté aquí, escríbannos.</p>
      <p class="muted">Este manual es una versión preliminar sobre la propuesta 01. Se actualiza con la propuesta que elijan y se entrega con todos los archivos finales.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px"><a class="btn" href="descargas/Latidos_Propuesta01_Pulso.zip" download style="background:${C.lime};border-color:${C.lime};color:${C.navy}">Descargar logos</a><a class="btn ghost" href="index.html" style="color:${C.ivory};border-color:${C.ivory}">Ver propuestas</a></div></div>
    <div style="display:grid;place-items:center"><div style="width:80%">${logo(R, 'primary', dark)}</div><p style="margin-top:28px;text-align:center;opacity:.7">Manual elaborado por We Rock Agencia<br>werock.space</p></div></div>`, { id: 'p' + (page + 1) });

  document.getElementById('doc').innerHTML = h;
  document.querySelectorAll('.rv').forEach((el) => el.classList.add('in'));
  window.LAT.wireCommon();

  // ---------------------------------------------------------------- diagramas
  function layer(id) { return L.primary.layers.find((l) => l.id === id); }
  function clearSvg() {
    const [, , W, H] = L.primary.box;
    const db = bbox([layer('punto-i').d]);
    const X = db[3];
    const m = X * 1.6;
    const g = '#7d8796';
    return `<svg class="lg" viewBox="${f(-m)} ${f(-m)} ${f(W + 2 * m)} ${f(H + 2 * m)}" aria-label="Espacio libre">
      <rect x="${f(-X)}" y="${f(-X)}" width="${f(W + 2 * X)}" height="${f(H + 2 * X)}" fill="rgba(198,255,61,.18)" stroke="${g}" stroke-width="${f(W / 700)}" stroke-dasharray="${f(W / 120)} ${f(W / 160)}"/>
      <rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${g}" stroke-width="${f(W / 1000)}"/>
      <g style="--l-p:${C.navy};--l-w:${C.navy};--l-a:${C.lime};--l-d:${C.navy}"><use href="#r1-primary" width="${W}" height="${H}"/></g>
      ${[[-X, -X], [W, -X], [-X, H], [W, H]].map(([a, b]) => `<circle cx="${f(a + X / 2)}" cy="${f(b + X / 2)}" r="${f(X / 2)}" fill="${C.lime}"/><text x="${f(a + X / 2)}" y="${f(b + X * 0.68)}" text-anchor="middle" font-size="${f(X * 0.5)}" font-family="Sora" font-weight="600" fill="${C.navy}">x</text>`).join('')}
      <circle cx="${f(db[0] + db[2] / 2)}" cy="${f(db[1] + db[3] / 2)}" r="${f(X / 2 + W / 300)}" fill="none" stroke="${C.navy}" stroke-width="${f(W / 600)}" stroke-dasharray="${f(W / 250)} ${f(W / 300)}"/>
    </svg>`;
  }
  function anatomySvg() {
    const [, , W, H] = L.primary.box;
    const pts = [
      ['1', bbox([layer('asta-l').d]), [0.5, 0.15]],
      ['2', bbox([layer('onda-a').d]), [0.62, 0.1]],
      ['3', bbox([layer('cinta').d]), [0.3, 0.92]],
      ['4', bbox([layer('punto-i').d]), [0.5, 0.5]],
      ['5', bbox(L.primary.layers.filter((l) => l.g === 'descriptor').map((l) => l.d)), [0.5, 0.5]],
    ];
    const R0 = W * 0.022;
    const m = R0 * 3;
    return `<svg class="lg" viewBox="${f(-m)} ${f(-m)} ${f(W + 2 * m)} ${f(H + 2 * m)}" aria-label="Partes del logo">
      <g style="--l-p:${C.navy};--l-w:${C.navy};--l-a:${C.lime};--l-d:${C.navy}"><use href="#r1-primary" width="${W}" height="${H}"/></g>
      ${pts.map(([n, b, [fx, fy]], i) => {
        const cx = b[0] + b[2] * fx, cy = b[1] + b[3] * fy;
        const ox = i === 4 ? cx - b[2] * 0.56 : cx, oy = i === 4 ? cy : i === 2 ? b[1] + b[3] + R0 * 2.2 : b[1] - R0 * 2.2;
        return `<line x1="${f(cx)}" y1="${f(cy)}" x2="${f(ox)}" y2="${f(oy)}" stroke="${C.navy}" stroke-width="${f(W / 900)}"/><circle cx="${f(ox)}" cy="${f(oy)}" r="${f(R0)}" fill="${C.lime}" stroke="${C.navy}" stroke-width="${f(W / 900)}"/><text x="${f(ox)}" y="${f(oy + R0 * 0.38)}" text-anchor="middle" font-size="${f(R0 * 1.05)}" font-family="Sora" font-weight="700" fill="${C.navy}">${n}</text>`;
      }).join('')}
    </svg>`;
  }
})();
