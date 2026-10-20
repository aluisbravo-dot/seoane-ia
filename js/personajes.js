// ===== PERSONAJES ESTILO ANIME (originales, en SVG), con el polo de cada carrera =====
// Si pones una imagen en img/personajes/<id>.png (ej. dsi.png, quimica.png), se usa en lugar del dibujo.
// Usa solo imágenes que tengas derecho a usar.
function svgPersonaje(c) {
  const h = c.pelo, s = "#ffe0c7";
  const back = {
    corto: `<path d="M27 60Q25 16 60 14Q95 16 93 60Z" fill="${h}"/>`,
    puas: `<path d="M27 60Q25 16 60 14Q95 16 93 60Z" fill="${h}"/>`,
    largo: `<path d="M24 60Q22 14 60 12Q98 14 96 60L101 128L19 128Z" fill="${h}"/>`,
    bob: `<path d="M24 62Q22 14 60 12Q98 14 96 62L96 94Q60 102 24 94Z" fill="${h}"/>`,
    coletas: `<path d="M26 60Q24 16 60 14Q96 16 94 60Z" fill="${h}"/><circle cx="18" cy="84" r="13" fill="${h}"/><circle cx="102" cy="84" r="13" fill="${h}"/>`
  }[c.estilo] || "";
  const fringe = c.estilo === "puas"
    ? `<path d="M28 58L33 24L44 40L52 18L60 38L70 18L77 40L87 24L92 58Q74 44 60 46Q46 44 28 58Z" fill="${h}"/>`
    : `<path d="M30 58Q36 28 60 30Q84 28 90 58Q74 42 60 44Q44 42 30 58Z" fill="${h}"/>`;
  return `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Personaje de ${c.nombre}">
${back}<rect x="52" y="88" width="16" height="20" fill="${s}"/>
<path d="M16 150Q16 106 60 104Q104 106 104 150Z" fill="${c.polo}"/>
<path d="M47 104L60 120L73 104Z" fill="#fff"/><path d="M47 104L60 112L73 104Z" fill="${c.polo}" opacity=".35"/>
<rect x="72" y="122" width="28" height="14" rx="4" fill="#fff" opacity=".92"/>
<text x="86" y="132.5" font-size="8" font-weight="800" text-anchor="middle" fill="${c.polo}" font-family="Arial">${c.logo}</text>
<ellipse cx="60" cy="66" rx="30" ry="32" fill="${s}"/>${fringe}
<ellipse cx="48" cy="68" rx="6" ry="9" fill="#2b1b3d"/><ellipse cx="72" cy="68" rx="6" ry="9" fill="#2b1b3d"/>
<circle cx="50" cy="65" r="2.6" fill="#fff"/><circle cx="74" cy="65" r="2.6" fill="#fff"/>
<ellipse cx="39" cy="80" rx="5" ry="3" fill="#ff9aa8" opacity=".6"/><ellipse cx="81" cy="80" rx="5" ry="3" fill="#ff9aa8" opacity=".6"/>
<path d="M54 84Q60 90 66 84" stroke="#c0455a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<circle cx="94" cy="35" r="11" fill="#0ea5e9" stroke="#e0f2fe" stroke-width="2"/><path d="M89 35h10M94 30v10" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`;
}
// Usa el personaje anime SVG integrado para evitar solicitudes a PNG inexistentes.
// Las imágenes reales de carreras permanecen en img/carreras/ y img/plana-anime/.
function montarPersonaje(el, c) {
  if (!el || !c) return;
  el.innerHTML = svgPersonaje(c);
  el.setAttribute("aria-label", c.nombre || "Personaje anime de la carrera");
}
