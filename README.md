# Latidos · Manual de marca

Manual de marca de **Latidos · Experiencias corporativas**, elaborado por **We Rock Agencia**.

- `index.html` — el manual (31 páginas, también imprimible)
- `descargas/Latidos_Manual_de_Marca.pdf` — el manual en PDF
- `descargas/Latidos_Logos.zip` — todas las versiones del logo (SVG + PDF) y el manual
- `descargas/svg/` — logo principal, horizontal, ícono y nombre, a color, en claro y a una tinta

## Desarrollo
- `cd src && npm i`
- `node build.js` — genera `assets/logos.js` y `descargas/svg/` desde `src/vector/latidos.svg` (exportado de 01.ai)
- `node serve.js` — sitio local en http://localhost:8766
- `node manualpdf.js` — imprime el manual a PDF
- `node pack.js` — favicon, PDF de logos y ZIP de entrega

Las rondas de propuestas quedan en las etiquetas de git `ronda-01` y `ronda-02`.
Tipografías: Sora y Manrope (licencia libre, Google Fonts).
