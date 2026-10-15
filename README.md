# Latidos · Propuesta de identidad — Ronda 01

Presentación web de las tres rutas creativas aprobadas para **Latidos · Experiencias corporativas**, preparada por **We Rock Agencia**.

- `index.html` — portada, introducción, rutas, comparativa estratégica, recomendación, archivos y decisión
- `ruta-01-pulso-creativo.html` — Pulso creativo (azul profundo · lima)
- `ruta-02-conexion.html` — Conexión (petróleo · albaricoque)
- `ruta-03-personas-en-movimiento.html` — Personas en movimiento (cobalto · coral)
- `descargas/` — maestros SVG (16 por ruta), PDF vectoriales y paquetes ZIP

Cada ruta incluye racional, logotipo principal, horizontal, símbolo, monocromo/negativo, área de seguridad, tamaños mínimos, fondos permitidos, paleta, tipografía, usos incorrectos y aplicaciones.

## Desarrollo
- `cd src && npm i`
- `node trace.js` — vectoriza las referencias aprobadas (requiere `src/ref/`, no versionado)
- `node build.js` — genera `assets/logos.js` y `descargas/svg/*.svg`
- `node pack.js` — favicons y PDF vectoriales (Chrome)
- `node serve.js` — sitio local en http://localhost:8766

Tipografías: Sora y Manrope (SIL Open Font License 1.1). Las propuestas no constituyen registro de marca.
