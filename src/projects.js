/* =============================================================================
 *  projects.js  —  render the project "workstations" (classic script)
 *  Pure view layer. Data lives in config.js.  Attaches window.CV.renderProjects
 * ========================================================================== */

window.CV = window.CV || {};

(function () {
  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  function metaRow(meta) {
    return (meta || [])
      .map((m) => `<span class="ws-meta__item">${esc(m.k)}: <b>${esc(m.v)}</b></span>`)
      .join('<span class="dotsep" aria-hidden="true"></span>');
  }
  function ideaTags(ideas) {
    return (ideas || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("");
  }
  function gallery(p) {
    if (!p.shots || !p.shots.length) return "";
    const thumbs = p.shots
      .map(
        (s, i) => `
        <button class="shot" type="button" data-action="open-shot"
                data-src="${esc(s.src)}" data-label="${esc(s.label || p.title)}"
                aria-label="Open screenshot: ${esc(s.label || p.title)}">
          <img src="${esc(s.src)}" alt="${esc(p.title)} — ${esc(s.label || "screenshot")}"
               loading="lazy" decoding="async" width="1600" height="874" />
          <span class="shot__label mono">${esc(s.label || "")}</span>
          <span class="shot__zoom" aria-hidden="true">⤢</span>
        </button>`
      )
      .join("");
    return `
      <div class="ws-gallery" data-gallery>
        <div class="ws-gallery__label mono measure--tick">screenshots · ${p.shots.length}</div>
        <div class="ws-gallery__grid">${thumbs}</div>
      </div>`;
  }
  function starBadge(p) {
    if (!p.repoName) return "";
    return `<span class="ws-star mono" data-gh-star="${esc(p.repoName)}" hidden></span>`;
  }

  function workstation(p) {
    return `
    <article class="workstation glass glass--strong glass--lg glass-spec morph tilt reveal"
             data-accent="${esc(p.accent || "primary")}" data-repo="${esc(p.repoName || "")}"
             aria-labelledby="ws-${esc(p.id)}-title">
      <span class="spec" aria-hidden="true"></span>
      <span class="measure-abs mono" aria-hidden="true">${esc(p.year || "")}</span>

      <div class="workstation__main">
        <header class="ws-head">
          <span class="ws-head__index" aria-hidden="true">${esc(p.index || "")}</span>
          <div class="ws-head__titles">
            <h3 class="ws-title lume" id="ws-${esc(p.id)}-title">${esc(p.title)}</h3>
            <span class="ws-role">${esc(p.role || "")}</span>
          </div>
        </header>

        <p class="ws-summary">${esc(p.summary || "")}</p>

        ${gallery(p)}

        <div class="ws-actions">
          <a class="btn btn--primary btn--sm" data-magnetic
             href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer">
            <span class="ico" aria-hidden="true">↗</span> View on GitHub
          </a>
          <button class="btn btn--ghost btn--sm" type="button"
                  data-action="toggle-details" aria-expanded="false"
                  aria-controls="ws-${esc(p.id)}-details">
            <span class="ico" aria-hidden="true">⊕</span>
            <span data-label>Open details</span>
          </button>
        </div>
      </div>

      <aside class="workstation__side">
        <div class="ws-side-head">
          <span class="ws-status">
            <span class="ws-status__led" aria-hidden="true"></span>status: ${esc(p.status || "active")}
          </span>
          ${starBadge(p)}
        </div>

        <div class="ws-meta" aria-label="project metadata">${metaRow(p.meta)}</div>

        <div class="ws-langbar">
          <span class="ws-langbar__dot" aria-hidden="true"></span>
          <span class="mono">${esc(p.language || "")}</span>
        </div>

        <div class="ws-details" id="ws-${esc(p.id)}-details">
          <div>
            <div class="ws-ideas-label mono measure--tick">key technical ideas</div>
            <div class="tags">${ideaTags(p.ideas)}</div>
          </div>
        </div>
      </aside>
    </article>`;
  }

  window.CV.renderProjects = function (container, projects) {
    if (!container) return;
    container.setAttribute("data-stagger", "");
    container.innerHTML = (projects || []).map(workstation).join("");
  };
})();
