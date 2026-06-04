/* =============================================================================
 *  icons.js  —  inline SVG icon set (classic script)
 * -----------------------------------------------------------------------------
 *  One small, coherent line-art / tactical-HUD icon family used across the
 *  whole interface (dock, buttons, capability modules, social channels).
 *  Geometric, 24×24, square caps — built to sit next to mono labels.
 *
 *  Brand marks (github / linkedin / instagram / facebook) are drawn as filled
 *  silhouettes so they stay recognisable; UI glyphs are stroked.
 *
 *  Usage:  window.CV.icon("download")  →  "<svg …>…</svg>"
 * ========================================================================== */

window.CV = window.CV || {};

(function () {
  // b = inner markup; f = true → filled silhouette (brand) instead of stroked
  const I = {
    /* --- UI / action glyphs (stroked) --------------------------------- */
    download: { b: '<path d="M12 3v11"/><path d="M7.5 10.5 12 15l4.5-4.5"/><path d="M4 20h16"/>' },
    external: { b: '<path d="M8 6h10v10"/><path d="M18 6 7 17"/>' },
    arrowUp:  { b: '<path d="M12 20V5"/><path d="m6 11 6-6 6 6"/>' },
    arrowRt:  { b: '<path d="M5 12h13"/><path d="m12 6 6 6-6 6"/>' },
    mail:     { b: '<rect x="3" y="5.5" width="18" height="13" rx="1"/><path d="m4 7 8 6 8-6"/>' },
    copy:     { b: '<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="1"/><path d="M5 15.5V5a1 1 0 0 1 1-1h9.5"/>' },
    theme:    { b: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" stroke="none"/>' },
    globe:    { b: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16"/><path d="M12 4c2.4 2.2 2.4 13.8 0 16M12 4c-2.4 2.2-2.4 13.8 0 16"/>' },
    plus:     { b: '<path d="M12 6v12"/><path d="M6 12h12"/>' },
    expand:   { b: '<path d="M4 9V4h5"/><path d="M20 9V4h-5"/><path d="M4 15v5h5"/><path d="M20 15v5h-5"/>' },
    close:    { b: '<path d="m6 6 12 12"/><path d="M18 6 6 18"/>' },
    chevL:    { b: '<path d="m15 5-7 7 7 7"/>' },
    chevR:    { b: '<path d="m9 5 7 7-7 7"/>' },
    signal:   { b: '<path d="M5 19v-3M10 19v-7M15 19v-10M20 19V6"/>' },
    node:     { b: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/>' },

    /* --- capability-matrix module glyphs (stroked) -------------------- */
    code:     { b: '<path d="m9 8-4 4 4 4"/><path d="m15 8 4 4-4 4"/>' },
    layers:   { b: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>' },
    cpu:      { b: '<rect x="6" y="6" width="12" height="12" rx="1"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2"/>' },
    sigma:    { b: '<path d="M17 5H7l6 7-6 7h10"/>' },
    database: { b: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>' },
    spark:    { b: '<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z"/><path d="m18.5 15 .7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7Z"/>' },
    terminal: { b: '<rect x="3" y="4.5" width="18" height="15" rx="1"/><path d="m7 9.5 3 2.5-3 2.5"/><path d="M13 15h4"/>' },
    hardware: { b: '<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M10 3v2M14 3v2M10 19v2M14 19v2M3 10h2M3 14h2M19 10h2M19 14h2"/>' },

    /* --- brand marks (filled silhouettes) ----------------------------- */
    github:   { f: true, b: '<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.69.92.69 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/>' },
    linkedin: { f: true, b: '<path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5ZM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.76-2.05C21.4 8.65 22 11 22 14.2V21h-4v-6c0-1.43-.03-3.27-2-3.27-2 0-2.3 1.56-2.3 3.17V21h-4z"/>' },
    instagram:{ b: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/>' },
    facebook: { f: true, b: '<path d="M14 9V7c0-.9.5-1.2 1-1.2h2V2.5h-2.6C11.4 2.5 10 4.3 10 6.7V9H8v3.2h2V21h4v-8.8h2.6l.4-3.2z"/>' },
  };

  window.CV.icon = function (name, cls) {
    const it = I[name] || I.node;
    const klass = cls || "svg-ico";
    if (it.f) {
      return `<svg class="${klass}" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true" focusable="false">${it.b}</svg>`;
    }
    return `<svg class="${klass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square" stroke-linejoin="round" aria-hidden="true" focusable="false">${it.b}</svg>`;
  };

  window.CV.hasIcon = function (name) { return Object.prototype.hasOwnProperty.call(I, name); };
})();
