# Latidos · Propuesta de identidad — Ronda 02

Presentación web de las tres rutas creativas aprobadas para **Latidos · Experiencias corporativas**, preparada por **We Rock Agencia**.

- `index.html` — portada, introducción, rutas, comparativa estratégica, recomendación, archivos y decisión
- `propuesta-01-pulso.html`, `propuesta-02-cumbre.html`, `propuesta-03-sello.html` — las tres propuestas (mesas de trabajo de 01.ai)
- `manual.html` — manual de marca preliminar sobre la propuesta 01 (PDF en `descargas/`)
- `descargas/` — maestros SVG (16 por ruta), PDF vectoriales y paquetes ZIP

Cada ruta incluye racional, logotipo principal, horizontal, símbolo, monocromo/negativo, área de seguridad, tamaños mínimos, fondos permitidos, paleta, tipografía, usos incorrectos y aplicaciones.

## Desarrollo
- `cd src && npm i`
- `node trace.js` — vectoriza las referencias aprobadas (requiere `src/ref/`, no versionado)
- `node build.js` — genera `assets/logos.js` y `descargas/svg/*.svg`
- `node pack.js` — favicons y PDF vectoriales (Chrome)
- `node serve.js` — sitio local en http://localhost:8766

Tipografías: Sora y Manrope (SIL Open Font License 1.1). Las propuestas no constituyen registro de marca.
