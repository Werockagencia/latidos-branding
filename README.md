# Latidos · Manual de marca

Manual de marca de **Latidos · Experiencias corporativas**, elaborado por **We Rock Agencia**.

- `index.html` — el manual (34 páginas, también imprimible)
- `descargas/Latidos_Kit_de_Marca.zip` — todo: logos PNG y vector, tipografías y manual, en carpetas
- `descargas/Latidos_Logos_PNG.zip` · `Latidos_Logos_Vector.zip` · `Latidos_Tipografias.zip` · `Latidos_Manual_de_Marca.pdf`
- `descargas/Latidos_Papeleria.zip` — tarjeta 9×5 cm y membrete carta: Impresion_CMYK (sangrado 3 mm + marcas) y Digital_RGB (PDF, PNG, Word)
- `descargas/Latidos_Patrones.zip` — ondas de la marca (azul, marfil, lima) en SVG, PNG y PDF CMYK
- `descargas/png/` y `descargas/svg/` — las 16 versiones del logo sueltas

## Desarrollo
- `cd src && npm i`
- `node build.js` — genera `assets/logos.js` y `descargas/svg/` desde `src/vector/latidos.svg` (exportado de 01.ai)
- `node serve.js` — sitio local en http://localhost:8766
- `node manualpdf.js` — imprime el manual a PDF
- `node print.js` — papelería (CMYK y RGB, Word) y patrones; datos de contacto en `DATA`
- `node pack.js` — favicon, PNG, PDF de logos y paquetes ZIP (correr después de manualpdf.js)

Las rondas de propuestas quedan en las etiquetas de git `ronda-01` y `ronda-02`.
Tipografías: Sora y Manrope (licencia libre, Google Fonts).
