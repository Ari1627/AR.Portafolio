# Portafolio — Ariana Capuñay

Sitio web interactivo de una sola página, construido a partir del portafolio
original (`Portafolio_Ariana.pptx`). HTML + CSS + JavaScript puro, sin
dependencias ni build.

## El planteamiento

Azul muy oscuro (`#050B16`) con acento aqua. Tipografía Syne para los titulares
y Sora para el texto. Cada proyecto ocupa **un panel a pantalla completa**, con
el número gigante de fondo y la composición alternando de lado: impar con el
texto a la izquierda, par con el texto a la derecha.

## Qué incluye

- **Aura** azul-turquesa que sigue al cursor por toda la página
- **Portada** con el nombre a gran escala: una línea sólida y otra en contorno
- **Menú de pantalla completa** que se abre en círculo desde el botón
- **Perfil** con foto sticky recortada en diagonal y disciplinas numeradas
- **Seis paneles de proyecto a pantalla completa**, con el número de fondo,
  el reto, la solución y la ficha técnica
- **Collage de piezas** superpuestas y rotadas, cada una numerada, que entran
  con un barrido y se mueven a distinta velocidad al hacer scroll (parallax)
- **Tilt 3D**: las piezas se inclinan siguiendo el cursor
- **Marquesina** con el nombre del proyecto al pie de cada panel, alternando
  de dirección
- **Rueda lateral 01–06** que marca el proyecto visible y permite saltar a otro
- **Zoom a pantalla completa** al hacer clic en una pieza, con **← →**,
  **Esc** y swipe en móvil
- **Paleta corporativa** en tarjetas que crecen al pasar el cursor;
  clic para copiar el HEX
- Responsive y con soporte para `prefers-reduced-motion`

## Estructura

```
index.html
assets/
  css/style.css      estilos
  js/projects.js     datos de los proyectos  ← edita aquí el contenido
  js/main.js         interacciones
  img/               portadas, piezas y retratos extraídos del PPTX
```

## Cómo verlo

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
```

## Publicar en GitHub Pages

1. **Settings → Pages**
2. *Source*: **Deploy from a branch**
3. Rama `main`, carpeta `/ (root)` → **Save**

## Revisar antes de publicar

- El índice del PPTX dice **“8 proyectos”** pero solo lista **6**. El sitio tiene
  los 6 que aparecen. Si faltan dos (ilustración vectorial y packaging, que se
  mencionan en “Sobre mí”), agrégalos en `assets/js/projects.js` y actualiza los
  contadores de los filtros en `index.html`.
- **Nescafé Tradición** no traía descripción propia en el PPTX; el texto del
  reto y la solución está redactado a partir de la ficha técnica y las fotos.
  Revísalo y ajústalo a lo que realmente hiciste.
- Los porcentajes de las barras en “Sobre mí” son una estimación. Cámbialos en
  el atributo `data-level` de cada `<li>` en `index.html`.
- Datos de contacto tomados del PPTX: `arianastudio@gmail.com`, `992272161`,
  `Studioariana.st`. El enlace de Instagram apunta a
  `instagram.com/studioariana.st` — confirma que el usuario sea ese.

## Agregar o editar proyectos

Todo el contenido vive en `assets/js/projects.js`:

```js
{
  id: 'nombre',
  title: 'Nombre del proyecto',
  year: '2026',
  cat: 'fotografia',          // fotografia | infografia | tridimensional | identidad
  catLabel: 'Fotografía publicitaria',
  subtitle: 'Bajada corta',
  tagline: 'Frase para la tarjeta',
  cover: 'assets/img/nombre-cover.jpg',
  gallery: ['assets/img/nombre-1.jpg', 'assets/img/nombre-2.jpg'],
  desc:     'De qué trata el proyecto.',
  problem:  'La necesidad que resolviste.',
  solution: 'Cómo la resolviste.',
  course:   'Curso · Ciclo · Año',
  tools:    ['Photoshop', 'Lightroom'],
  type:     'Tipo de pieza',
  palette:  [ { hex: '#0C3846', name: 'Azul petróleo' } ]   // opcional
}
```
