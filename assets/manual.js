/* Latidos · Manual de marca (versión final · We Rock Agencia) */
(function () {
  'use strict';
  const { logo, M, contrast } = window.LAT;
  const L = window.LATIDOS_LOGOS.r1;
  const R = 'r1';
  const C = { navy: '#0B1B3B', lime: '#C6FF3D', ivory: '#F8F5F0', steel: '#A7B0BA', navy2: '#13244A' };
  const light = { w: C.navy, a: C.lime, d: C.navy };
  const dark = { w: C.ivory, a: C.lime, d: C.ivory };
  const mono = (m) => ({ m });
  const f = (n) => +n.toFixed(2);
  const shadow = '0 1px 2px rgba(0,0,0,.15), 0 18px 36px -12px rgba(0,0,0,.35)';

  // ---------------------------------------------------------------- utilidades
  function bbox(ds) {
    const nums = ds.join(' ').match(/-?\d*\.?\d+(?:e-?\d+)?/gi).map(Number);
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i + 1 < nums.length; i += 2) { x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]); y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]); }
    return [x0, y0, x1 - x0, y1 - y0];
  }
  const layer = (v, id) => L[v].layers.find((l) => l.id === id);
  const rgb = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  // valores CMYK de imprenta (los mismos de los archivos para impresión)
  const CMYK = { '#0B1B3B': '100 · 85 · 40 · 45', '#C6FF3D': '25 · 0 · 90 · 0', '#F8F5F0': '2 · 3 · 6 · 0', '#A7B0BA': '35 · 22 · 18 · 0' };
  const cmyk = (h) => CMYK[h.toUpperCase()] || '';
  const on = (hex) => (hex === C.navy || hex === C.navy2 ? C.ivory : C.navy);

  // ---------------------------------------------------------------- páginas (se numeran al final)
  const pages = [];
  const toc = [];
  const pg = (cls, title, body, o = {}) => { pages.push({ cls, title, body, o }); if (toc.length && title) toc[toc.length - 1][2].push([title, pages.length]); };
  const sec = (name) => toc.push([name, pages.length + 1, []]);

  // patrón de ondas: la cinta de la marca convertida en textura
  function waves(bg, fg, acc, n = 7, sw = 16) {
    let p = '';
    for (let i = 0; i < n; i++) {
      const y = 30 + i * 46, hi = i === Math.floor(n / 3);
      p += `<path d="M-40 ${y + 30} C 120 ${y + 30}, 160 ${y - 20}, 300 ${y - 20} S 480 ${y + 30}, 640 ${y + 30} S 820 ${y - 20}, 980 ${y - 20}" fill="none" stroke="${hi ? acc : fg}" stroke-width="${sw}" stroke-linecap="round" opacity="${hi ? 1 : 0.2}"/>`;
    }
    return `<svg viewBox="0 0 940 340" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true"><rect width="940" height="340" fill="${bg}"/>${p}</svg>`;
  }

  // ---------------------------------------------------------------- maquetas propias
  const MK = {
    card: () => `<div class="abs" style="inset:0;background:#D9D4CA"></div>
      <img class="abs" src="descargas/papeleria/Digital_RGB/Latidos_Tarjeta_Frente.png" alt="" style="left:7%;top:14%;width:50%;transform:rotate(-8deg);border-radius:3px;box-shadow:${shadow}">
      <img class="abs" src="descargas/papeleria/Digital_RGB/Latidos_Tarjeta_Reverso.png" alt="" style="right:6%;bottom:11%;width:50%;transform:rotate(5deg);border-radius:3px;box-shadow:${shadow}">`,
    // hoja carta: logo, datos en columna, cuerpo con fecha y saludo, ícono de agua y pie con onda
    // hoja carta: es la misma imagen del archivo final
    sheet: (rot = 0) => `<img src="descargas/papeleria/Digital_RGB/Latidos_Membrete.png" alt="" style="position:absolute;inset:0;width:100%;height:100%;transform:rotate(${rot}deg);box-shadow:${shadow}">`,
    envelope: () => `<div style="position:absolute;inset:0;background:${C.navy};box-shadow:${shadow};overflow:hidden;container-type:inline-size">
        <div class="abs" style="left:6%;top:12%;width:30%">${logo(R, 'primary', dark)}</div>
        <div class="abs" style="left:0;right:0;bottom:0;height:34%;opacity:.7">${waves(C.navy, C.ivory, C.lime, 5, 12)}</div>
        <div class="abs" style="right:7%;top:12%;font-size:1.8cqw;color:${C.ivory};opacity:.7;text-align:right;line-height:1.6">latidos.jhe.sas@hotmail.com</div>
      </div>`,
    letter: () => `<div class="abs" style="inset:0;background:#D9D4CA"></div>
      <div class="abs" style="left:17%;right:17%;top:7%;aspect-ratio:216/279">${MK.sheet(-2)}</div>`,
    // digital
    laptop: () => `<div class="abs" style="inset:0;background:linear-gradient(160deg,#E7E3DC,#CFC9BE)"></div>
      <div class="abs" style="left:8%;width:min(60%,calc(66cqh * 1.6));top:14%;display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 18px 24px rgba(0,0,0,.28))">
        <div style="width:100%;aspect-ratio:16/10;background:#111;border-radius:1.6cqw 1.6cqw 0 0;padding:1.6%">
          <div style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:.4cqw;background:${C.ivory};container-type:inline-size">${webScreen()}</div>
        </div>
        <div style="width:116%;height:2.4cqw;background:linear-gradient(180deg,#d4d7dc,#8d9198);border-radius:0 0 2cqw 2cqw"></div>
      </div>
      <div class="abs" style="right:9%;bottom:7%;height:80%;aspect-ratio:9/19;background:#111;border-radius:3.4cqw;padding:.9%;box-shadow:${shadow}">
        <div style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:2.6cqw;background:${C.navy};container-type:inline-size">${phoneScreen()}</div>
      </div>`,
    feed: () => `<div class="abs" style="inset:0;background:#E7E3DC"></div>
      <div class="abs" style="left:50%;top:7%;bottom:7%;aspect-ratio:9/19;transform:translateX(-50%);background:#111;border-radius:5cqw;padding:1.6%;box-shadow:${shadow}">
        <div style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:4cqw;background:#fff;color:#111;container-type:inline-size;display:flex;flex-direction:column">
          <div style="display:flex;justify-content:space-between;padding:10cqw 7cqw 3cqw;font-size:5cqw;font-weight:700">latidos<span>···</span></div>
          <div style="display:flex;align-items:center;gap:6cqw;padding:0 7cqw">
            <div style="width:24cqw;aspect-ratio:1;border-radius:50%;background:${C.navy};display:grid;place-items:center;padding:4cqw;box-shadow:0 0 0 1.2cqw #fff,0 0 0 2.2cqw ${C.lime}">${logo(R, 'symbol', dark)}</div>
            <div style="flex:1;display:flex;justify-content:space-around;text-align:center;font-size:3.6cqw;line-height:1.2"><div><b style="font-size:4.6cqw">86</b><br>posts</div><div><b style="font-size:4.6cqw">3,2 mil</b><br>seguidores</div></div>
          </div>
          <div style="padding:3cqw 7cqw;font-size:3.6cqw;line-height:1.35"><b>Latidos · Experiencias corporativas</b><br>Encuentros con pulso propio ✦</div>
          <div style="flex:1;display:grid;grid-template-columns:repeat(3,1fr);grid-auto-rows:33cqw;gap:.6cqw">
            ${[[C.navy, 'w'], [C.lime, 't'], ['ph1', ''], [C.ivory, 's'], ['wave', ''], [C.navy, 'q'], ['ph2', ''], [C.lime, 's2'], [C.navy, 'w']].map(([bg, k]) => {
              const ph = { ph1: 'linear-gradient(140deg,#c9a77c,#7a5b46 55%,#2b2320)', ph2: 'radial-gradient(70% 70% at 30% 30%,#ffd58a,#9c4a2d 50%,#1b1022)' };
              if (bg === 'wave') return `<div style="position:relative;overflow:hidden">${waves(C.navy, C.ivory, C.lime, 5, 18)}</div>`;
              if (ph[bg]) return `<div style="background:${ph[bg]};position:relative"><div style="position:absolute;left:8%;bottom:8%;width:46%">${logo(R, 'wordmark', dark)}</div></div>`;
              const fg = bg === C.navy ? C.ivory : C.navy;
              const inner = k === 'w' ? `<div style="width:70%">${logo(R, 'symbol', bg === C.navy ? dark : light)}</div>`
                : k === 't' ? `<div style="font-family:Sora;font-weight:600;font-size:5cqw;line-height:1;color:${fg};padding:10%">Pulso<br>propio.</div>`
                  : k === 'q' ? `<div style="font-family:Sora;font-weight:300;font-size:9cqw;color:${C.lime}">+1.200</div>`
                    : `<div style="width:78%">${logo(R, 'wordmark', bg === C.navy ? dark : k === 's2' ? mono(C.navy) : light)}</div>`;
              return `<div style="background:${bg};display:grid;place-items:center">${inner}</div>`;
            }).join('')}
          </div>
        </div>
      </div>`,
    linkedin: () => `<div class="abs" style="inset:0;background:#E7E3DC"></div>
      <div class="abs" style="left:6%;right:6%;top:14%;bottom:14%;background:#fff;border-radius:1.6cqw;box-shadow:${shadow};overflow:hidden">
        <div style="position:relative;height:46%;overflow:hidden">${waves(C.navy, C.ivory, C.lime, 6, 14)}<div style="position:absolute;right:5%;top:50%;transform:translateY(-50%);width:34%">${logo(R, 'horizontal', dark)}</div></div>
        <div class="abs" style="left:5%;top:30%;width:15%;aspect-ratio:1;border-radius:1.2cqw;background:${C.navy};border:.6cqw solid #fff;display:grid;place-items:center;padding:2.4%">${logo(R, 'symbol', dark)}</div>
        <div style="padding:9% 5% 0;color:#111"><div style="font-family:Sora;font-weight:600;font-size:clamp(9px,3cqw,18px)">Latidos · Experiencias corporativas</div><div style="font-size:clamp(6px,1.8cqw,11px);opacity:.6;margin-top:1%">Diseñamos encuentros que conectan personas y dejan huella</div></div>
      </div>`,
    newsletter: () => `<div class="abs" style="inset:0;background:${C.lime}"></div>
      <div class="abs" style="left:18%;right:18%;top:8%;bottom:-4%;background:#fff;border-radius:1.2cqw 1.2cqw 0 0;box-shadow:${shadow};overflow:hidden;color:${C.navy};container-type:inline-size">
        <div style="background:${C.navy};padding:7cqw 8cqw 6cqw"><div style="width:52%">${logo(R, 'primary', dark)}</div></div>
        <div style="height:24cqw;position:relative;overflow:hidden;background:radial-gradient(70% 70% at 30% 30%,#ffd58a,#9c4a2d 50%,#1b1022)"></div>
        <div style="padding:6cqw 8cqw;display:grid;gap:3cqw"><div style="font-family:Sora;font-weight:600;font-size:7cqw;line-height:1.05;letter-spacing:-.03em">Así se vivió el Encuentro 2026</div>${[96, 88, 70].map((w) => `<i style="display:block;height:1.6cqw;border-radius:1cqw;background:${C.navy};opacity:.12;width:${w}%"></i>`).join('')}<span style="justify-self:start;background:${C.lime};padding:2.4cqw 5cqw;border-radius:99px;font-weight:700;font-size:3.4cqw">Ver la galería</span></div>
      </div>`,
    email: () => `<div class="abs" style="inset:0;background:#E7E3DC"></div>
      <div class="abs" style="left:7%;right:7%;top:16%;bottom:14%;background:#fff;border-radius:10px;box-shadow:${shadow};padding:5% 6%;color:${C.navy};display:flex;flex-direction:column;gap:6%">
        <div style="display:grid;gap:5px">${[80, 96, 64].map((w) => `<i style="display:block;height:5px;border-radius:3px;background:${C.navy};opacity:.12;width:${w}%"></i>`).join('')}</div>
        <div style="display:flex;align-items:center;gap:5%;border-top:1px solid rgba(11,27,59,.12);padding-top:6%">
          <div style="width:28%">${logo(R, 'primary', light)}</div>
          <div style="border-left:2px solid ${C.lime};padding-left:5%;font-size:clamp(6px,1.7cqw,11px);line-height:1.5"><b style="font-family:Sora">Nombre Apellido</b><br><span style="opacity:.65">latidos.jhe.sas@hotmail.com · 318 986 0324</span></div>
        </div>
      </div>`,
    tote: () => `<div class="abs" style="inset:0;background:#D9D4CA"></div>
      <svg class="abs" viewBox="0 0 400 320" style="inset:0;width:100%;height:100%" aria-hidden="true"><path d="M160 110 C 160 40, 240 40, 240 110" fill="none" stroke="#e9e2d2" stroke-width="10"/><rect x="118" y="105" width="164" height="190" fill="rgba(0,0,0,.2)" transform="translate(5 7)" style="filter:blur(6px)"/><rect x="118" y="105" width="164" height="190" fill="#EFE8D8"/></svg>
      <div class="abs" style="left:34%;top:52%;width:32%">${logo(R, 'primary', light)}</div>`,
    post: () => `<div class="abs" style="inset:0;background:${C.navy}"></div>${waves(C.navy, C.ivory, C.lime)}
      <div class="abs" style="left:8%;right:8%;bottom:10%;color:${C.ivory}"><div style="font-family:Sora;font-weight:500;font-size:clamp(14px,7cqw,40px);line-height:1;letter-spacing:-.03em">Encuentros con pulso propio.</div><div style="margin-top:4%;width:30%">${logo(R, 'wordmark', dark)}</div></div>`,
    story: () => `<div class="abs" style="inset:0;background:#D9D4CA"></div>
      <div class="abs" style="left:18%;right:18%;top:8%;bottom:8%;border-radius:14px;overflow:hidden;background:${C.lime};box-shadow:${shadow};display:flex;flex-direction:column;justify-content:space-between;padding:10% 8%;color:${C.navy}">
        <div style="width:60%">${logo(R, 'wordmark', mono(C.navy))}</div>
        <div><div style="font-size:clamp(5px,2.2cqw,10px);letter-spacing:.18em;text-transform:uppercase;font-weight:700">Próximo encuentro</div><div style="font-family:Sora;font-weight:600;font-size:clamp(11px,6cqw,28px);line-height:1;letter-spacing:-.03em;margin-top:6%">Un día que el equipo no olvidará</div></div>
        <div style="background:${C.navy};color:${C.ivory};text-align:center;padding:5%;border-radius:99px;font-size:clamp(5px,2.2cqw,10px);font-weight:700">Desliza para conocerlo</div>
      </div>`,
    deck: () => `<div class="abs" style="inset:0;background:#DCD7CD"></div>
      <div class="abs" style="left:50%;top:50%;height:78%;width:min(84%,calc(78cqh * 16 / 9));transform:translate(-50%,-50%);background:${C.navy};border-radius:6px;box-shadow:${shadow};overflow:hidden;color:${C.ivory}">
        <div class="abs" style="left:6%;top:9%;width:26%">${logo(R, 'horizontal', dark)}</div>
        <div class="abs" style="left:6%;bottom:12%;width:55%;font-family:Sora;font-weight:500;font-size:clamp(12px,4.4cqw,40px);line-height:1;letter-spacing:-.03em">Encuentros con pulso propio</div>
        <div class="abs" style="right:-6%;top:14%;width:40%">${logo(R, 'symbol', dark)}</div>
      </div>`,
    web: () => `<div class="abs" style="inset:0;background:#DCD7CD"></div>
      <div class="abs" style="left:6%;right:6%;top:10%;bottom:-4%;border-radius:10px 10px 0 0;background:${C.ivory};box-shadow:${shadow};overflow:hidden;color:${C.navy}">
        <div style="height:7%;background:#e7e3dc;display:flex;align-items:center;gap:5px;padding:0 2%"><i style="width:7px;height:7px;border-radius:50%;background:#ff5f57"></i><i style="width:7px;height:7px;border-radius:50%;background:#febc2e"></i><i style="width:7px;height:7px;border-radius:50%;background:#28c840"></i></div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:2.4% 5%;font-size:clamp(5px,1.2cqw,10px);letter-spacing:.12em;text-transform:uppercase;font-weight:600"><div style="width:16%">${logo(R, 'wordmark', light)}</div><div style="display:flex;gap:2.4em">Experiencias<span>Clientes</span><span>Contacto</span></div></div>
        <div style="display:grid;grid-template-columns:1.1fr 1fr;height:80%">
          <div style="padding:5%;display:flex;flex-direction:column;justify-content:center;gap:5%"><div style="font-family:Sora;font-weight:500;font-size:clamp(14px,4.6cqw,44px);line-height:1;letter-spacing:-.035em">Encuentros con pulso propio.</div><div style="font-size:clamp(6px,1.3cqw,12px);opacity:.7;max-width:34ch">Diseñamos experiencias corporativas que conectan personas y dejan huella.</div><div><span style="display:inline-block;background:${C.lime};padding:.9em 1.8em;border-radius:99px;font-weight:700;font-size:clamp(5px,1.2cqw,11px)">Agenda tu experiencia</span></div></div>
          <div style="position:relative;margin:0 5% 6% 0;border-radius:10px;overflow:hidden">${waves(C.navy, C.ivory, C.lime)}</div>
        </div>
      </div>`,
    photocall: () => `<div class="abs" style="inset:0;background:linear-gradient(180deg,#2a2b33,#14151b)"></div>
      <div class="abs" style="left:8%;right:8%;top:10%;bottom:16%;background:${C.navy};box-shadow:0 30px 60px -20px rgba(0,0,0,.6);display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:1fr;padding:3%;gap:3%;align-items:center;justify-items:center">
        ${Array.from({ length: 12 }, (_, i) => `<div style="width:${(Math.floor(i / 4) + i) % 2 ? 46 : 84}%">${(Math.floor(i / 4) + i) % 2 ? logo(R, 'symbol', dark) : logo(R, 'wordmark', dark)}</div>`).join('')}
      </div>
      <div class="abs" style="left:0;right:0;bottom:0;height:16%;background:#0e0f14"></div>
      <div class="abs" style="left:6%;right:6%;bottom:13%;height:4%;background:radial-gradient(50% 50% at 50% 50%,rgba(0,0,0,.6),transparent)"></div>`,
    sign: () => `<div class="abs" style="inset:0;background:#E7E2D8"></div>
      <div class="abs" style="inset:auto 0 0 0;height:16%;background:rgba(0,0,0,.08)"></div>
      <div class="abs" style="left:27%;top:9%;width:46%;bottom:12%;background:${C.navy};border-radius:6px;box-shadow:${shadow};padding:10% 9%;display:flex;flex-direction:column;gap:6%;color:${C.ivory}">
        <div>${logo(R, 'primary', dark)}</div><div style="flex:1"></div>
        ${[['←', 'Registro'], ['→', 'Auditorio'], ['↑', 'Salas'], ['↓', 'Lounge']].map(([a, n]) => `<div style="display:flex;align-items:center;gap:9%;border-top:1px solid rgba(255,255,255,.2);padding-top:6%;font-family:Sora;font-weight:500;font-size:clamp(8px,3.5cqw,17px)"><span style="flex:none;display:grid;place-items:center;width:1.7em;height:1.7em;border-radius:50%;background:${C.lime};color:${C.navy};font-size:.85em;font-weight:700">${a}</span>${n}</div>`).join('')}
      </div>`,
    shirt: () => `<div class="abs" style="inset:0;background:#E7E3DC"></div>
      <svg class="abs" viewBox="0 0 400 320" style="inset:0;width:100%;height:100%" aria-hidden="true">
        <path d="M140 40 L170 30 C 185 48, 215 48, 230 30 L260 40 L320 80 L295 120 L265 105 L265 300 L135 300 L135 105 L105 120 L80 80 Z" fill="rgba(0,0,0,.18)" transform="translate(5 7)" style="filter:blur(5px)"/>
        <path d="M140 40 L170 30 C 185 48, 215 48, 230 30 L260 40 L320 80 L295 120 L265 105 L265 300 L135 300 L135 105 L105 120 L80 80 Z" fill="${C.navy}"/>
      </svg>
      <div class="abs" style="left:41%;top:34%;width:18%">${logo(R, 'symbol', dark)}</div>`,
    bottle: () => `<div class="abs" style="inset:0;background:${C.lime}"></div>
      <div class="abs" style="left:43%;top:12%;width:14%;height:9%;background:#C7CCD2;border-radius:6px 6px 2px 2px"></div>
      <div class="abs" style="left:39%;top:20%;width:22%;bottom:8%;background:${C.navy};border-radius:18px;box-shadow:inset -10px 0 18px rgba(0,0,0,.35), ${shadow};display:grid;place-items:center"><div style="width:70%;transform:rotate(-90deg)">${logo(R, 'wordmark', dark)}</div></div>`,
    cap: () => `<div class="abs" style="inset:0;background:#D9D4CA"></div>
      <svg class="abs" viewBox="0 0 400 320" style="inset:0;width:100%;height:100%" aria-hidden="true">
        <ellipse cx="205" cy="232" rx="150" ry="22" fill="rgba(0,0,0,.18)"/>
        <path d="M95 210 C 95 120, 150 80, 205 80 C 260 80, 315 120, 315 210 Z" fill="${C.navy}"/>
        <path d="M95 210 C 150 196, 260 196, 315 210 C 330 214, 365 226, 360 236 C 300 228, 140 226, 95 222 Z" fill="#0a1630"/>
        <circle cx="205" cy="82" r="7" fill="${C.lime}"/>
      </svg>
      <div class="abs" style="left:42%;top:43%;width:16%">${logo(R, 'symbol', dark)}</div>`,
    gift: () => `<div class="abs" style="inset:0;background:#E7E3DC"></div>
      <div class="abs" style="left:24%;top:24%;width:52%;aspect-ratio:1.3;transform:rotate(-6deg);background:${C.navy};border-radius:4px;box-shadow:${shadow};overflow:hidden">
        <div class="abs" style="left:0;right:0;top:44%;height:12%;background:${C.lime}"></div>
        <div class="abs" style="left:50%;top:50%;width:38%;aspect-ratio:1;transform:translate(-50%,-50%);border-radius:50%;background:${C.ivory};display:grid;place-items:center;padding:7%">${logo(R, 'symbol', light)}</div>
      </div>`,
  };

  // pantallas para las maquetas de dispositivos (miden en unidades del contenedor)
  function webScreen() {
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:2.6cqw 5cqw;font-size:1.3cqw;letter-spacing:.12em;text-transform:uppercase;font-weight:600;color:${C.navy}"><div style="width:15cqw">${logo(R, 'wordmark', light)}</div><div style="display:flex;gap:3cqw">Experiencias<span>Clientes</span><span>Contacto</span><span style="background:${C.navy};color:${C.ivory};padding:.8cqw 2cqw;border-radius:99px">Cotizar</span></div></div>
      <div style="position:absolute;left:0;right:0;top:9cqw;bottom:0;display:grid;grid-template-columns:1.05fr 1fr;color:${C.navy}">
        <div style="padding:4cqw 3cqw 0 5cqw;display:flex;flex-direction:column;gap:2.4cqw"><div style="font-size:1.2cqw;letter-spacing:.2em;text-transform:uppercase;font-weight:700;opacity:.6">Experiencias corporativas</div><div style="font-family:Sora;font-weight:500;font-size:5.6cqw;line-height:.98;letter-spacing:-.04em">Encuentros con pulso propio.</div><div style="font-size:1.6cqw;line-height:1.5;opacity:.7">Lanzamientos, convenciones e integraciones que tu equipo va a recordar.</div><div><span style="display:inline-block;background:${C.lime};padding:1.2cqw 2.6cqw;border-radius:99px;font-weight:700;font-size:1.5cqw">Agenda tu experiencia</span></div></div>
        <div style="position:relative;margin:2cqw 4cqw 4cqw 0;border-radius:1.4cqw;overflow:hidden">${waves(C.navy, C.ivory, C.lime, 6, 16)}<div style="position:absolute;right:8%;bottom:10%;width:38%">${logo(R, 'symbol', dark)}</div></div>
      </div>`;
  }
  function phoneScreen() {
    return `<div style="position:absolute;inset:0;opacity:.8">${waves(C.navy, C.ivory, C.lime, 7, 22)}</div>
      <div style="position:absolute;left:10cqw;top:16cqw;width:56cqw">${logo(R, 'wordmark', dark)}</div>
      <div style="position:absolute;left:10cqw;right:10cqw;bottom:16cqw;color:${C.ivory}"><div style="font-family:Sora;font-weight:600;font-size:11cqw;line-height:1;letter-spacing:-.03em">Tu próximo encuentro empieza aquí</div><div style="margin-top:7cqw;background:${C.lime};color:${C.navy};text-align:center;padding:4cqw;border-radius:99px;font-weight:700;font-size:5cqw">Cotizar</div></div>`;
  }

  // ---------------------------------------------------------------- contenido
  // portada
  pg('navy cover', '', `<div style="position:absolute;inset:auto 0 0 0;height:42%;opacity:.55">${waves(C.navy, C.ivory, C.lime, 6, 12)}</div>
    <div style="position:relative;flex:1;display:grid;place-items:center;padding:4% 8% 10%"><div style="width:min(720px,100%)">${logo(R, 'primary', dark)}</div></div>
    <div style="position:relative;display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;border-top:1px solid rgba(248,245,240,.2);padding-top:18px">
      <div><div style="font-family:Sora;font-weight:500;font-size:clamp(28px,3.4vw,46px);letter-spacing:-.03em;line-height:1">Manual de marca</div><div style="opacity:.65;font-size:13px;margin-top:8px">Versión 1.0 · Octubre 2026</div></div>
      <div style="text-align:right;font-size:12px;letter-spacing:.16em;text-transform:uppercase;font-weight:600;opacity:.75">Diseñado por<br><b style="color:${C.lime}">We Rock Agencia</b></div>
    </div>`, { noHead: true, noFoot: true });

  pg('', 'Contenido', '__TOC__');

  // 01 · la marca
  sec('La marca');
  pg('', 'Bienvenida', `<div class="cols c2"><div><span class="kicker">01 · La marca</span><h2>Bienvenidos a Latidos</h2>
      <p>Este manual reúne todo lo necesario para que la marca se vea y se sienta igual en cada lugar donde aparezca: una presentación, una credencial, una pantalla de escenario o una publicación en redes.</p>
      <p>Una marca se vuelve memorable cuando se repite con coherencia. Cuidarla es cuidar la primera impresión que dejamos en cada cliente y en cada invitado.</p>
      <p class="muted">Úsenlo como guía para el equipo, para proveedores, imprentas, diseñadores y aliados.</p></div>
    <div class="box" style="background:${C.navy}">${logo(R, 'symbol', dark)}</div></div>`);
  pg('navy', 'Quiénes somos', `<div class="cols c2"><div><span class="kicker" style="color:${C.lime}">Nuestra esencia</span><h2 style="font-size:clamp(34px,4.6vw,64px)">Diseñamos experiencias corporativas que dejan huella.</h2></div>
    <div style="display:grid;gap:22px;align-content:center">
      <div><h3>Propósito</h3><p>Conectar personas, despertar emociones y crear vínculos auténticos dentro de las empresas.</p></div>
      <div><h3>Lo que hacemos</h3><p>Transformamos encuentros empresariales —lanzamientos, convenciones, integraciones, celebraciones— en experiencias que la gente recuerda y quiere contar.</p></div>
      <div><h3>Nuestra promesa</h3><p>Cada evento tiene un pulso: la expectativa al llegar, el momento cumbre y el recuerdo que queda. Diseñamos ese ritmo, en cada detalle.</p></div>
    </div></div>`);
  const PERS = [['Cercana', 'Hablamos como personas, no como corporación. Escuchamos antes de proponer.'], ['Creativa', 'Cada experiencia es única: nunca copiamos fórmulas.'], ['Confiable', 'Cumplimos lo que prometemos, en tiempo y en detalle.'], ['Enérgica', 'Ponemos ritmo, movimiento y emoción en cada encuentro.']];
  pg('', 'Personalidad', `<span class="kicker">Personalidad</span><h2>Así es Latidos</h2><p class="muted">Cuatro rasgos que guían cómo se ve, cómo habla y cómo se siente la marca.</p>
    <div class="cols c4" style="margin-top:auto">${PERS.map(([t, d], i) => `<div class="trait" style="background:${i === 3 ? C.lime : i === 0 ? C.navy : '#fff'};color:${i === 0 ? C.ivory : C.navy}"><div class="num" style="font-size:44px">0${i + 1}</div><div><h3>${t}</h3><p style="margin:0;opacity:.75">${d}</p></div></div>`).join('')}</div>`);

  // 02 · logo
  sec('El logo');
  pg('', 'La idea', `<div class="cols c2"><div><span class="kicker">02 · El logo</span><h2>La idea detrás del logo</h2>
      <p>Un latido es un impulso que sube y baja. En Latidos ese pulso vive dentro del nombre: la L se estira en una onda que asciende y dibuja la A.</p>
      <p>Es una sola línea con tres momentos —la expectativa, el punto más alto y el recuerdo—, la misma emoción que vive alguien en una experiencia bien diseñada.</p>
      <p>La cinta verde corre por debajo como una segunda capa de energía: la chispa que convierte un encuentro de trabajo en algo que la gente quiere contar.</p></div>
    <div class="box" style="background:${C.navy};padding:12%">${pulseSvg()}</div></div>`);
  pg('', 'El logo', `<div class="hero-logo">${logo(R, 'primary', light)}</div>
    <div class="cols c3" style="flex:0 0 auto;margin-top:18px"><div><h3>El nombre</h3><p class="muted">“Latidos”, con la L y la A unidas por la onda.</p></div><div><h3>La cinta y el punto</h3><p class="muted">El verde lima: la energía que hace memorable cada experiencia.</p></div><div><h3>La frase</h3><p class="muted">“Experiencias corporativas”: lo que hacemos, en claro.</p></div></div>`);
  const anat = [['1', 'La L', 'Firme y vertical: la base, la organización que convoca.'], ['2', 'La onda que forma la A', 'Sube y baja como un pulso: el ritmo del encuentro.'], ['3', 'La cinta verde', 'La energía que hace memorable cada experiencia.'], ['4', 'El punto de la i', 'Repite el verde y cierra el nombre con un golpe de color.'], ['5', 'La frase', '“Experiencias corporativas”: lo que hacemos, en claro.']];
  pg('', 'Anatomía', `<h2>Anatomía del logo</h2>
    <div class="cols c21"><div class="box edge" style="background:${C.ivory}">${anatomySvg()}</div>
    <div style="display:grid;gap:12px;align-content:center">${anat.map(([n, t, d]) => `<div style="display:grid;grid-template-columns:30px 1fr;gap:10px"><b class="pin">${n}</b><div><h3 style="font-size:16px">${t}</h3><p class="muted" style="margin:0;font-size:14px">${d}</p></div></div>`).join('')}</div></div>`);
  pg('', 'Construcción', `<h2>Construcción</h2><div class="box edge" style="background:#fff;padding:3% 4%;flex:1;margin:4px 0 14px">${gridSvg()}</div>
    <div class="cols c3" style="flex:0 0 auto"><p>El logo se apoya en pocas líneas guía: la base de las letras, su altura y la altura de la L y la d.</p><p>La unidad de medida de la marca es <b>x</b>, el diámetro del punto de la i. Con ella se definen el espacio libre y la distancia a otros elementos.</p><p class="muted">El logo nunca se redibuja ni se recompone: siempre se usan los archivos originales.</p></div>`);
  const V = [['primary', 'Principal', 'La versión preferida. Úsenla siempre que haya espacio.', C.ivory, light], ['horizontal', 'Horizontal', 'Para espacios anchos y bajos: encabezados, banners, firmas.', C.ivory, light], ['symbol', 'Ícono', 'La L con la onda. Foto de perfil, sellos y piezas cuadradas.', C.navy, dark], ['wordmark', 'Solo el nombre', 'Cuando la frase no se alcanza a leer o el espacio es angosto.', C.ivory, light]];
  pg('', 'Versiones', `<h2>Versiones</h2><p class="muted">Cuatro formas del mismo logo para que siempre haya una que encaje.</p><div class="cols c4" style="margin-top:6px">${V.map(([v, n, d, bg, c]) => `<div style="display:flex;flex-direction:column"><div class="box edge" style="background:${bg};flex:1;padding:14%">${logo(R, v, c)}</div><span class="cap">${n}</span><span class="sub">${d}</span></div>`).join('')}</div>`);
  pg('', 'Espacio libre', `<div class="cols c21"><div class="box edge" style="background:${C.ivory};padding:4%">${clearSvg('primary')}</div>
    <div style="align-self:center"><h2>Espacio libre</h2><p>El logo necesita aire. Alrededor de él se deja un espacio vacío igual a <b>x</b>, el diámetro del punto de la i.</p><p>Ningún texto, foto, borde u otro logo debe entrar en ese espacio.</p>
    <div style="display:flex;gap:14px;margin-top:18px"><div class="box edge" style="background:${C.navy};flex:1;min-height:110px;padding:6%">${clearSvg('symbol', true)}</div></div><span class="cap">Ícono · mismo espacio libre</span></div></div>`);
  const MIN = [['primary', 190, 'Logo con frase', 'Desde 3,5 cm impreso · 160 px en pantalla'], ['horizontal', 210, 'Horizontal', 'Desde 4,5 cm · 200 px'], ['wordmark', 120, 'Solo el nombre', 'Desde 2,2 cm · 100 px'], ['symbol', 42, 'Ícono', 'Desde 0,8 cm · 32 px']];
  pg('', 'Tamaño mínimo', `<h2>Tamaño mínimo</h2><p class="muted">Por debajo de estas medidas el logo pierde detalle. En espacios más pequeños se usa la versión sin frase o el ícono.</p>
    <div class="cols c4" style="margin-top:auto;align-items:end">${MIN.map(([v, w, n, d]) => `<div><div style="height:130px;display:flex;align-items:flex-end;border-bottom:1px dashed var(--line);padding-bottom:12px"><div style="width:${w}px;max-width:100%">${logo(R, v, light)}</div></div><span class="cap">${n}</span><span class="sub">${d}</span></div>`).join('')}</div>`);

  // 03 · color
  sec('Color');
  const PAL = [['Azul profundo', 'Principal', C.navy, 'El color de la marca: logo, títulos y fondos.', 40], ['Lima vibrante', 'Acento', C.lime, 'La chispa: detalles, botones y momentos destacados.', 10], ['Marfil cálido', 'Fondo', C.ivory, 'Fondo cálido en lugar del blanco puro.', 40], ['Gris acero', 'Apoyo', C.steel, 'Líneas, datos y elementos secundarios.', 10]];
  pg('', 'Colores', `<span class="kicker">03 · Color</span><h2>Colores</h2><p class="muted">HEX y RGB son para pantallas; CMYK, para impresión. Antes de imprimir grandes cantidades, pidan una prueba de color a la imprenta.</p>
    <div class="cols c4" style="margin-top:10px">${PAL.map(([n, r, hex, u]) => `<div class="sw"><div class="chip" style="background:${hex};color:${on(hex)}"><i>${r}</i><b>${n}</b></div><dl><dt>HEX</dt><dd>${hex}</dd><dt>RGB</dt><dd>${rgb(hex).join(' · ')}</dd><dt>CMYK</dt><dd>${cmyk(hex)}</dd></dl><div class="use">${u}</div></div>`).join('')}</div>`);
  pg('', 'Proporción', `<div class="cols c12"><div><h2>Cuánto se usa cada color</h2><p>El azul y el marfil hacen el trabajo pesado; el verde aparece poco y por eso brilla. Si todo es verde, nada destaca.</p><p class="muted">Una pieza bien equilibrada se ve como la barra de la derecha.</p></div>
    <div style="display:grid;gap:14px;align-content:center">
      <div class="ratio">${PAL.map(([n, , hex, , s]) => `<div style="flex:${s};background:${hex};color:${on(hex)}"><b>${s}%</b><span>${n}</span></div>`).join('')}</div>
      <div class="cols c3" style="flex:0 0 auto">${[[C.ivory, light, 'Pieza clara'], [C.navy, dark, 'Pieza oscura'], [C.lime, mono(C.navy), 'Pieza de impacto']].map(([bg, c, n]) => `<div><div class="box edge" style="background:${bg};min-height:110px;padding:14%">${logo(R, bg === C.lime ? 'primaryM' : 'primary', c)}</div><span class="cap">${n}</span></div>`).join('')}</div>
    </div></div>`);
  const PAIRS = [[C.navy, C.ivory, 'Azul sobre marfil', 'Textos y títulos'], [C.ivory, C.navy, 'Marfil sobre azul', 'Fondos oscuros'], [C.navy, C.lime, 'Azul sobre lima', 'Botones y destacados'], [C.lime, C.navy, 'Lima sobre azul', 'Títulos y cifras'], [C.navy, C.steel, 'Azul sobre gris', 'Solo textos grandes'], [C.lime, C.ivory, 'Lima sobre marfil', 'Nunca para texto']];
  pg('', 'Combinaciones', `<h2>Combinaciones de color</h2><p class="muted">Para que todo se lea bien, estas son las combinaciones de texto y fondo permitidas.</p>
    <div class="cols c3" style="margin-top:10px">${PAIRS.map(([fg, bg, n, u]) => { const k = contrast(fg, bg), ok = k >= 3; return `<div class="pair ${ok ? '' : 'bad'}" style="background:${bg};color:${fg}"><b>Aa</b><div><span class="cap" style="margin:0;color:inherit">${n}</span><span style="font-size:13px;opacity:.8">${u}</span></div><i class="${ok ? 'ok' : 'no'}"></i></div>`; }).join('')}</div>`);
  const VC = [['primary', 'A color', C.ivory, light, 'La versión principal.'], ['primary', 'En claro', C.navy, dark, 'Sobre el azul de la marca.'], ['primaryM', 'Un solo color', C.ivory, mono(C.navy), 'Sellos, documentos, impresión sencilla.'], ['primaryM', 'Un color sobre oscuro', C.navy, mono(C.ivory), 'Grabados, bordados, vinilos.'], ['primaryM', 'Sobre el verde', C.lime, mono(C.navy), 'Piezas de alto impacto.'], ['primaryM', 'Negro', '#FFFFFF', mono('#111111'), 'Cuando solo hay tinta negra.']];
  pg('', 'Versiones de color', `<h2>Versiones de color</h2><div class="cols c3" style="margin-top:6px">${VC.map(([v, n, bg, c, d]) => `<div style="display:flex;flex-direction:column"><div class="box edge" style="background:${bg};flex:1;min-height:110px;padding:8% 12%">${logo(R, v, c)}</div><span class="cap">${n}</span><span class="sub">${d}</span></div>`).join('')}</div>`);

  // 04 · uso
  sec('Uso correcto');
  const BG = [[C.ivory, light, 'primary', true, 'Marfil cálido'], [C.navy, dark, 'primary', true, 'Azul profundo'], [C.lime, mono(C.navy), 'primaryM', true, 'Lima, a un color'], [C.steel, light, 'primary', false, 'Gris: la cinta se pierde']];
  pg('', 'Fondos', `<span class="kicker">04 · Uso correcto</span><h2>Sobre qué fondos va</h2><p class="muted">El logo luce mejor sobre los colores de la marca. Sobre fotos, úsenlo en una zona tranquila y con buen contraste.</p>
    <div class="cols c4" style="margin-top:10px">${BG.map(([bg, c, v, ok, n]) => `<div style="display:flex;flex-direction:column"><div class="box ${ok ? 'ok' : 'no'} edge" style="background:${bg};flex:1;padding:12%">${logo(R, v, c)}</div><span class="cap">${n}</span></div>`).join('')}</div>
    <div class="cols c2" style="margin-top:12px;flex:0 0 auto">
      <div><div class="box ok" style="min-height:120px;background:linear-gradient(135deg,#2a3b5c,#14213d 60%,#0b1325);padding:9% 22%">${logo(R, 'primary', dark)}</div><span class="cap">Foto oscura y tranquila</span></div>
      <div><div class="box no" style="min-height:120px;background:repeating-linear-gradient(45deg,#c9a46b 0 14px,#3d6b8a 14px 28px,#e8e1d0 28px 42px);padding:9% 22%">${logo(R, 'primary', light)}</div><span class="cap">Foto con mucho detalle</span></div>
    </div>`);
  const D = [['Deformar', 'transform:scaleX(1.4) scaleY(.8)', light], ['Inclinar', 'transform:rotate(-14deg)', light], ['Cambiar colores', '', { w: '#7B2CBF', a: '#FF8A00', d: '#7B2CBF' }], ['Agregar sombras', 'filter:drop-shadow(5px 7px 0 rgba(0,0,0,.35))', light], ['Poco contraste', '', mono('#C9CFD6'), '#E6E9ED'], ['Desarmar', '', null]];
  pg('', 'Lo que no se debe hacer', `<h2>Lo que no se debe hacer</h2><div class="cols c3" style="margin-top:6px">${D.map(([n, st, c, bg]) => `<div style="display:flex;flex-direction:column"><div class="box no" style="background:${bg || '#EFEBE3'};flex:1;min-height:110px;padding:10% 14%">${c ? logo(R, n === 'Poco contraste' ? 'primaryM' : 'primary', c, { style: st }) : `<div style="display:grid;gap:8%;justify-items:center;width:100%"><div style="width:28%;transform:rotate(14deg)">${logo(R, 'symbol', light)}</div><div style="width:78%">${logo(R, 'wordmark', light)}</div></div>`}</div><span class="cap">${n}</span></div>`).join('')}</div>
    <p class="muted" style="margin-top:12px">Tampoco se debe cambiar la tipografía de la frase, ponerle contorno, ni recrear el logo a mano.</p>`);
  pg('', 'Co-branding', `<div class="cols c12"><div><h2>Junto a otras marcas</h2><p>En eventos, Latidos aparece al lado de clientes y aliados. Para que ambas marcas convivan con respeto:</p>
      <ul class="rules"><li>Los logos van a la <b>misma altura visual</b>.</li><li>Se separan con una línea fina y un espacio de <b>2x</b> a cada lado.</li><li>Latidos va a la derecha cuando el cliente es el anfitrión del evento.</li></ul></div>
    <div style="display:grid;gap:14px;align-content:center">
      <div class="box edge" style="background:#fff;min-height:150px;padding:6% 8%"><div class="cob"><div class="client">Logo<br>cliente</div><i></i><div style="width:44%">${logo(R, 'wordmark', light)}</div></div></div>
      <div class="box edge" style="background:${C.navy};min-height:150px;padding:6% 8%"><div class="cob"><div class="client" style="border-color:rgba(248,245,240,.4);color:rgba(248,245,240,.7)">Logo<br>aliado</div><i style="background:rgba(248,245,240,.3)"></i><div style="width:44%">${logo(R, 'wordmark', dark)}</div></div></div>
    </div></div>`);

  // 05 · tipografía
  sec('Tipografía');
  pg('', 'Tipografía', `<span class="kicker">05 · Tipografía</span><h2>Tipografía</h2><p class="muted">Dos familias gratuitas, disponibles en Google Fonts, para todas las piezas de la marca. El logo no se escribe con ellas: siempre se usa el archivo original.</p>
    <div class="cols c2" style="margin-top:10px">
      <div class="spec"><span class="cap" style="margin:0 0 8px">Para títulos</span><div style="font-family:Sora;font-weight:500;font-size:clamp(70px,8.5vw,124px);line-height:.9;letter-spacing:-.04em">Aa</div><div class="abc" style="font-family:Sora">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br>abcdefghijklmnñopqrstuvwxyz 0123456789</div><div class="weights" style="font-family:Sora"><span style="font-weight:300">Light</span><span>Regular</span><span style="font-weight:500">Medium</span><span style="font-weight:600">SemiBold</span></div><p style="margin:10px 0 0"><b>Sora</b> · moderna, clara y con personalidad</p></div>
      <div class="spec"><span class="cap" style="margin:0 0 8px">Para textos</span><div style="font-family:Manrope;font-weight:500;font-size:clamp(70px,8.5vw,124px);line-height:.9;letter-spacing:-.03em">Aa</div><div class="abc" style="font-family:Manrope">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br>abcdefghijklmnñopqrstuvwxyz 0123456789</div><div class="weights" style="font-family:Manrope"><span>Regular</span><span style="font-weight:500">Medium</span><span style="font-weight:600">SemiBold</span><span style="font-weight:700">Bold</span></div><p style="margin:10px 0 0"><b>Manrope</b> · cómoda de leer en cualquier pantalla o papel</p></div>
    </div>`);
  pg('', 'Jerarquía de textos', `<h2>Jerarquía de textos</h2><div class="hier">
    <div class="row"><span class="t">Título · Sora Medium</span><div style="font-family:Sora;font-weight:500;font-size:clamp(30px,4vw,52px);line-height:1;letter-spacing:-.035em">Encuentros con pulso propio.</div></div>
    <div class="row"><span class="t">Subtítulo · Sora Regular</span><div style="font-family:Sora;font-size:clamp(18px,2vw,24px);line-height:1.25;letter-spacing:-.015em">Diseñamos experiencias que conectan personas.</div></div>
    <div class="row"><span class="t">Texto · Manrope Regular</span><div style="max-width:62ch;font-size:15px">Cada encuentro empieza con una pregunta: ¿qué queremos que la gente sienta al salir? Desde ahí diseñamos el formato, el lugar, el ritmo y los detalles.</div></div>
    <div class="row"><span class="t">Etiqueta · Manrope SemiBold</span><div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600">Experiencias corporativas · 2026</div></div>
    <div class="row"><span class="t">Cifra destacada · Sora Light</span><div style="font-family:Sora;font-weight:300;font-size:clamp(34px,4vw,54px);line-height:1;letter-spacing:-.04em">+1.200 <span style="font-size:.35em;font-weight:500;letter-spacing:0">invitados conectados</span></div></div>
    <div class="row"><span class="t">Botón</span><div><span style="display:inline-block;background:${C.lime};color:${C.navy};padding:10px 20px;border-radius:99px;font-weight:700;font-size:14px">Agenda tu experiencia</span></div></div>
  </div>`);

  // 06 · elementos gráficos
  sec('Elementos gráficos');
  pg('navy', 'La onda', `<div class="cols c12"><div><span class="kicker" style="color:${C.lime}">06 · Elementos gráficos</span><h2>La onda</h2><p>La cinta del logo se convierte en un recurso gráfico: ondas que acompañan las piezas y les dan ritmo.</p><p style="opacity:.75">Úsenla como fondo o como línea de apoyo, siempre detrás del contenido. Solo una onda va en verde; las demás, suaves.</p></div>
    <div style="position:relative;border-radius:10px;overflow:hidden;min-height:220px">${waves(C.navy, C.ivory, C.lime)}</div></div>
    <div class="cols c3" style="margin-top:16px;flex:0 0 auto">${[[C.ivory, C.navy, C.lime, 'Sobre marfil'], [C.lime, C.navy, C.navy, 'Sobre lima'], [C.navy2, C.ivory, C.lime, 'Sobre azul']].map(([bg, fg, ac, n]) => `<div><div style="position:relative;border-radius:10px;overflow:hidden;height:90px">${waves(bg, fg, ac, 5)}</div><span class="cap" style="opacity:.7">${n}</span></div>`).join('')}</div>`);
  pg('', 'El ícono como recurso', `<div class="cols c2"><div><h2>El ícono como recurso</h2><p>La L con la onda puede usarse en gran tamaño y recortada por el borde de la pieza, como un sello que acompaña al contenido.</p>
      <ul class="rules"><li>Siempre en un color de la paleta y con buen contraste.</li><li>Nunca reemplaza al logo completo en la misma pieza: lo acompaña.</li><li>Puede ir más grande que el resto, pero sin tapar textos importantes.</li></ul></div>
    <div class="cols c2" style="flex:0 0 auto;align-self:center">
      <div class="crop" style="background:${C.navy}"><div style="position:absolute;right:-22%;bottom:-24%;width:118%">${logo(R, 'symbol', dark)}</div><div style="position:absolute;left:10%;top:10%;width:46%">${logo(R, 'wordmark', dark)}</div></div>
      <div class="crop" style="background:${C.lime}"><div style="position:absolute;right:-38%;top:-8%;width:118%">${logo(R, 'symbolM', mono(C.navy))}</div><div style="position:absolute;left:10%;bottom:10%;font-family:Sora;font-weight:600;font-size:clamp(14px,1.8vw,22px);color:${C.navy};letter-spacing:-.02em">Pulso propio.</div></div>
    </div></div>`);
  const PH = [['Personas reales', 'Equipos compartiendo, riendo, celebrando. Momentos auténticos, no poses.', 'linear-gradient(140deg,#c9a77c,#7a5b46 55%,#2b2320)'], ['Luz y ambiente', 'Escenarios con luz cálida o luces de evento. Profundidad y movimiento.', 'radial-gradient(70% 70% at 30% 30%,#ffd58a,#9c4a2d 50%,#1b1022)'], ['Detalles', 'La credencial, la mesa, el regalo: los detalles que hacen la diferencia.', 'linear-gradient(160deg,#e7e1d6,#b9b2a6 60%,#6c665e)']];
  pg('', 'Fotografía', `<h2>Fotografía</h2><p class="muted">Las fotos cuentan la experiencia. Buscamos emoción real, luz cálida y personas en movimiento.</p>
    <div class="cols c3" style="margin-top:10px">${PH.map(([t, d, g]) => `<div style="display:flex;flex-direction:column"><div style="flex:1;min-height:150px;border-radius:10px;background:${g};position:relative;overflow:hidden"><div style="position:absolute;left:10px;bottom:10px;width:30%">${logo(R, 'wordmark', dark)}</div></div><span class="cap">${t}</span><span class="sub">${d}</span></div>`).join('')}</div>
    <p class="muted" style="margin-top:12px">Eviten fotos de banco de imágenes genéricas, apretones de mano posados y filtros exagerados.</p>`);
  pg('', 'Cómo hablamos', `<div class="cols c2"><div><h2>Cómo hablamos</h2><p>Latidos habla como un buen anfitrión: cercano, seguro y con energía. Frases cortas, verbos de acción y cero palabras rebuscadas.</p>
      <ul class="rules"><li>Hablamos de personas y emociones, no solo de logística.</li><li>Tuteamos con respeto en redes; en propuestas, “ustedes”.</li><li>Prometemos lo que vamos a cumplir.</li></ul></div>
    <div class="say" style="align-content:center"><span class="cap">Así sí</span><div class="y">Diseñamos el día que tu equipo va a recordar.</div><div class="y">Cada encuentro tiene su propio pulso.</div><span class="cap" style="margin-top:10px">Así no</span><div class="n">Ofrecemos soluciones integrales de logística para eventos corporativos.</div><div class="n">¡¡¡El mejor evento de la historia!!!</div></div></div>`);

  // 07 · aplicaciones
  sec('Aplicaciones');
  const T = { r: R, pri: C.navy, acc: C.lime, bg: C.ivory, bg2: '#EFEBE3', ink: C.navy, dk: C.navy, c: light, ci: dark, surf: '#DCD7CD', stageW: 62, accC: mono(C.navy), badgeLogoW: 92, badgeV: 'wordmark', strap: C.lime };
  const mk = (cls, lbl, html, lc) => `<div class="mk ${cls}" style="--mlbl:${lc || 'rgba(11,27,59,.55)'}"><span class="lbl">${lbl}</span>${html}</div>`;
  pg('', 'Papelería', `<span class="kicker">07 · Aplicaciones</span><h2>Papelería</h2><div class="grid-mk">${mk('wide', 'Tarjetas de presentación', MK.card())}${mk('tall port', 'Hoja membretada', MK.letter())}${mk('', 'Firma de correo', MK.email())}${mk('', 'Bolsa', MK.tote())}</div>`);
  pg('', 'Hoja membretada', `<div class="cols c12"><div><h2>Hoja membretada y sobre</h2><p>Para cartas, propuestas y cotizaciones. El logo va arriba a la izquierda, los datos de contacto a la derecha y la onda cierra la hoja en el pie.</p>
      <ul class="rules"><li>Tamaño carta (21,6 × 27,9 cm) o A4.</li><li>Textos en Manrope Regular, 10–11 pt, en azul profundo.</li><li>Márgenes amplios: el aire también es parte de la marca.</li><li>El ícono de fondo va muy suave, casi imperceptible.</li></ul><p class="note-dl">La tarjeta y el membrete están listos para la imprenta y en versión digital (incluye membrete para Word). Descárguenlos en <a href="#descargas">Descargas · Papelería</a>.</p></div>
    <div class="letter-stage"><div class="lt-sheet">${MK.sheet(0)}</div><div class="lt-env">${MK.envelope()}</div></div></div>`);
  pg('', 'Digital', `<h2>Digital</h2><div class="grid-mk">${mk('', 'Publicación', MK.post(), 'rgba(248,245,240,.65)')}${mk('', 'Foto de perfil', M.avatar(T))}${mk('tall port', 'Historia', MK.story())}${mk('wide', 'Página web', MK.web())}</div>`);
  pg('', 'Digital en pantalla', `<h2>En pantalla</h2><div class="grid-mk">${mk('wide', 'Página web y móvil', MK.laptop())}${mk('tall port', 'Perfil de Instagram', MK.feed())}${mk('', 'Portada de LinkedIn', MK.linkedin())}${mk('', 'Boletín por correo', MK.newsletter())}</div>`);
  pg('', 'Presentaciones', `<div class="cols c12"><div><h2>Presentaciones</h2><p>La portada lleva el logo horizontal arriba a la izquierda, un título corto en Sora y el ícono grande como recurso.</p><ul class="rules"><li>Fondo azul para portadas y cierres.</li><li>Fondo marfil para el contenido.</li><li>Una sola idea por diapositiva.</li></ul></div>${mk('', 'Portada de presentación', MK.deck())}</div>`);
  pg('', 'Eventos', `<h2>Eventos</h2><div class="grid-mk">${mk('wide', 'Pantalla de escenario', M.stage(T), 'rgba(255,255,255,.6)')}${mk('tall port', 'Credencial', M.badge(T))}${mk('', 'Photocall', MK.photocall(), 'rgba(255,255,255,.6)')}${mk('', 'Señalización', MK.sign())}</div>`);
  pg('', 'Regalos de marca', `<h2>Regalos de marca</h2><div class="grid-mk">${mk('', 'Camiseta', MK.shirt())}${mk('', 'Gorra', MK.cap())}${mk('tall port', 'Termo', MK.bottle())}${mk('wide', 'Caja de regalo', MK.gift())}</div>`);

  // cierre
  sec('Descargas');
  const BASE = 'https://werockagencia.github.io/latidos-branding/';
  const DLS = [
    ['Kit de marca completo', 'Todo en un solo archivo, ordenado en carpetas: logos PNG y vector, tipografías, papelería lista para imprimir y digital, patrones y este manual.', 'descargas/Latidos_Kit_de_Marca.zip', 'ZIP · todo', true],
    ['Logos en PNG', '16 versiones con fondo transparente. Para Word, PowerPoint, redes sociales y uso diario.', 'descargas/Latidos_Logos_PNG.zip', 'ZIP · PNG'],
    ['Logos en vector', '16 versiones en SVG + PDF. Para diseñadores, imprentas, vallas, corte y bordado.', 'descargas/Latidos_Logos_Vector.zip', 'ZIP · SVG + PDF'],
    ['Papelería', 'Tarjeta y membrete listos para imprenta (CMYK, sangrado y marcas de corte) y versión digital (RGB, PNG y membrete para Word).', 'descargas/Latidos_Papeleria.zip', 'ZIP · CMYK + RGB'],
    ['Patrones de ondas', 'Las ondas de la marca en azul, marfil y lima, para fondos, redes y piezas impresas.', 'descargas/Latidos_Patrones.zip', 'ZIP · SVG + PNG + PDF'],
    ['Tipografías', 'Sora y Manrope, listas para instalar. Gratuitas y de uso comercial libre.', 'descargas/Latidos_Tipografias.zip', 'ZIP · TTF'],
    ['Manual de marca', 'Este manual en PDF, para compartir o imprimir.', 'descargas/Latidos_Manual_de_Marca.pdf', 'PDF'],
  ];
  pg('navy', 'Descargas', `<span id="descargas"></span><span class="kicker">08 · Descargas</span><h2>Descargas</h2><p style="opacity:.8">Todo lo necesario para usar la marca, a un clic. Si no saben cuál elegir, descarguen el <b style="color:${C.lime}">kit completo</b>.</p>
    <div class="dlgrid">${DLS.map(([t, d, href, tag, main]) => `<a class="dl ${main ? 'main' : ''}" href="${href}" ${href.endsWith('.pdf') ? 'target="_blank" rel="noopener"' : 'download'}><span class="tag2">${tag}</span><b>${t}</b><span class="d">${d}</span><span class="go">Descargar ↓</span><span class="url">${BASE}${href}</span></a>`).join('')}</div>
    <p style="opacity:.6;font-size:13px;margin-top:14px">PNG y RGB: para pantallas, correos y documentos · Vector y CMYK: para imprenta, en cualquier tamaño sin perder calidad · “Negativo”: versión para fondos oscuros · Membrete para Word: ábranlo y escriban encima.</p>`);
  pg('navy', 'Contacto', `<div style="flex:1;display:grid;place-items:center;align-content:center;gap:30px;text-align:center"><div style="width:min(560px,80%)">${logo(R, 'primary', dark)}</div><p style="opacity:.75;margin:0">¿Dudas sobre el uso de la marca o necesitan otra versión del logo?<br>Escríbannos: <b>We Rock Agencia</b> · werock.space</p><div class="noprint"><a class="btn" href="descargas/Latidos_Kit_de_Marca.zip" download style="background:${C.lime};border-color:${C.lime};color:${C.navy}">Descargar el kit de marca</a></div></div>`);

  // ---------------------------------------------------------------- render con numeración
  const TOTAL = pages.length;
  const tocHtml = `<span class="kicker">Índice</span><h2>Contenido</h2><div class="toc2">${toc.map(([n, p, subs], i) => `<div><a class="th" href="#p${p}"><b>0${i + 1}</b>${n}</a>${subs.map(([t, q]) => `<a href="#p${q}"><span>${t}</span><i>${String(q).padStart(2, '0')}</i></a>`).join('')}</div>`).join('')}</div>`;
  document.getElementById('doc').innerHTML = pages.map((p, i) => {
    const n = i + 1;
    return `<section class="pg ${p.cls}" id="p${n}">
      ${p.o.noHead ? '' : `<div class="hd"><span>${p.title}</span><span>Latidos · Manual de marca</span></div>`}
      ${p.body === '__TOC__' ? tocHtml : p.body}
      ${p.o.noFoot ? '' : `<div class="ft"><span>Latidos · Experiencias corporativas</span><span>${String(n).padStart(2, '0')} / ${TOTAL}</span></div>`}
    </section>`;
  }).join('');
  window.LAT.wireCommon();

  // ---------------------------------------------------------------- diagramas
  function strokeW(W) { return f(W / 900); }
  function useLogo(v, W, H, c = light) { return `<g style="--l-w:${c.w};--l-a:${c.a};--l-d:${c.d};--l-m:${c.m || c.w}"><use href="#${R}-${v}" width="${W}" height="${H}"/></g>`; }
  function dotX() { return bbox([layer('primary', 'punto-i').d])[3]; }
  function clearSvg(v, onDark) {
    const [, , W, H] = L[v].box;
    const X = v === 'primary' ? dotX() : dotX() * (L.symbol.box[3] / bbox([layer('primary', 'asta-l').d, layer('primary', 'cinta').d])[3]);
    const m = X * 1.6, g = onDark ? 'rgba(248,245,240,.5)' : '#7d8796';
    return `<svg class="lg" viewBox="${f(-m)} ${f(-m)} ${f(W + 2 * m)} ${f(H + 2 * m)}" aria-label="Espacio libre">
      <rect x="${f(-X)}" y="${f(-X)}" width="${f(W + 2 * X)}" height="${f(H + 2 * X)}" fill="rgba(198,255,61,${onDark ? 0.12 : 0.18})" stroke="${g}" stroke-width="${f(Math.max(W, H) / 700)}" stroke-dasharray="${f(Math.max(W, H) / 120)} ${f(Math.max(W, H) / 160)}"/>
      <rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${g}" stroke-width="${f(Math.max(W, H) / 1000)}"/>
      ${useLogo(v, W, H, onDark ? dark : light)}
      ${[[-X, -X], [W, -X], [-X, H], [W, H]].map(([a, b]) => `<circle cx="${f(a + X / 2)}" cy="${f(b + X / 2)}" r="${f(X / 2)}" fill="${C.lime}"/><text x="${f(a + X / 2)}" y="${f(b + X * 0.68)}" text-anchor="middle" font-size="${f(X * 0.5)}" font-family="Sora" font-weight="600" fill="${C.navy}">x</text>`).join('')}
    </svg>`;
  }
  function anatomySvg() {
    const [, , W, H] = L.primary.box;
    const pts = [
      ['1', bbox([layer('primary', 'asta-l').d]), [0.5, 0.12], 'up'],
      ['2', bbox([layer('primary', 'onda-a').d]), [0.55, 0.06], 'up'],
      ['3', bbox([layer('primary', 'cinta').d]), [0.3, 0.92], 'down'],
      ['4', bbox([layer('primary', 'punto-i').d]), [0.5, 0.5], 'up'],
      ['5', bbox(L.primary.layers.filter((l) => l.g === 'descriptor').map((l) => l.d)), [0.5, 0.9], 'down'],
    ];
    const R0 = W * 0.022, m = R0 * 3.4, sw = strokeW(W);
    return `<svg class="lg" viewBox="${f(-m)} ${f(-m)} ${f(W + 2 * m)} ${f(H + 2 * m)}" aria-label="Partes del logo">${useLogo('primary', W, H)}
      ${pts.map(([n, b, [fx, fy], dir]) => {
        const cx = b[0] + b[2] * fx, cy = b[1] + b[3] * fy;
        const oy = dir === 'up' ? b[1] - R0 * 2.2 : b[1] + b[3] + R0 * 2.2;
        return `<line x1="${f(cx)}" y1="${f(cy)}" x2="${f(cx)}" y2="${f(oy)}" stroke="${C.navy}" stroke-width="${sw}"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${f(R0 * 0.22)}" fill="${C.navy}"/><circle cx="${f(cx)}" cy="${f(oy)}" r="${f(R0)}" fill="${C.lime}" stroke="${C.navy}" stroke-width="${sw}"/><text x="${f(cx)}" y="${f(oy + R0 * 0.38)}" text-anchor="middle" font-size="${f(R0 * 1.05)}" font-family="Sora" font-weight="700" fill="${C.navy}">${n}</text>`;
      }).join('')}</svg>`;
  }
  function gridSvg() {
    const [, , W, H] = L.primary.box;
    const lt = bbox([layer('primary', 'letras').d]);
    const st = bbox([layer('primary', 'asta-l').d]);
    const ds = bbox(L.primary.layers.filter((l) => l.g === 'descriptor').map((l) => l.d));
    // altura de las letras bajas: cima de la "o" (subtrazado más ancho que alto, a la derecha del centro)
    const subs = layer('primary', 'letras').d.split(/(?=M)/).map((d) => bbox([d]));
    const tops = subs.filter((b) => b[2] > W * 0.05 && b[1] > st[1] + (lt[3] * 0.18)).map((b) => b[1]).sort((a, b) => a - b);
    const xh = tops.length ? tops[Math.floor(tops.length / 2)] : lt[1] + lt[3] * 0.3;
    const base = lt[1] + lt[3];
    const X = dotX();
    const m = X * 2.4, sw = strokeW(W), g = '#8a93a3';
    const lines = [[st[1], 'Altura de la L y la d'], [xh, 'Altura de las letras'], [base, 'Base'], [ds[1] + ds[3], 'Frase']];
    let grid = '';
    for (let x = 0; x <= W + 0.1; x += X) grid += `<line x1="${f(x)}" y1="${f(-m * 0.4)}" x2="${f(x)}" y2="${f(H + m * 0.4)}" stroke="${C.navy}" stroke-opacity=".06" stroke-width="${sw}"/>`;
    return `<svg class="lg" viewBox="${f(-m * 0.4)} ${f(-m * 0.6)} ${f(W + m * 3.4)} ${f(H + m * 1.2)}" aria-label="Construcción">${grid}
      ${lines.map(([y, t]) => `<line x1="${f(-m * 0.4)}" y1="${f(y)}" x2="${f(W + m * 0.4)}" y2="${f(y)}" stroke="${g}" stroke-width="${sw * 1.2}" stroke-dasharray="${f(W / 160)} ${f(W / 220)}"/><text x="${f(W + m * 0.6)}" y="${f(y + X * 0.18)}" font-size="${f(X * 0.42)}" font-family="Manrope" font-weight="600" fill="${g}">${t}</text>`).join('')}
      ${useLogo('primary', W, H)}
      <rect x="${f(lt[0] - X * 1.2)}" y="${f(xh)}" width="${f(X * 0.5)}" height="${f(base - xh)}" fill="${C.lime}"/>
    </svg>`;
  }
  function pulseSvg() {
    // el gesto como pulso: la onda del logo con sus tres momentos
    const [, , W, H] = L.symbol.box;
    const m = W * 0.08;
    return `<svg class="lg" viewBox="${f(-m)} ${f(-m * 1.6)} ${f(W + 2 * m)} ${f(H + m * 2.6)}" aria-label="La idea del logo">${useLogo('symbol', W, H, dark)}
      ${[['Expectativa', 0.2, 0.98], ['Momento cumbre', 0.6, -0.02], ['Recuerdo', 0.92, 1.0]].map(([t, fx, fy]) => `<text x="${f(W * fx)}" y="${f(fy < 0.5 ? -m * 0.6 : H + m * 0.9)}" text-anchor="middle" font-size="${f(W * 0.045)}" font-family="Manrope" font-weight="600" fill="${C.lime}" letter-spacing="${f(W * 0.004)}">${t.toUpperCase()}</text>`).join('')}
    </svg>`;
  }
})();
