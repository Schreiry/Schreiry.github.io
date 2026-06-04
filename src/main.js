/* =============================================================================
 *  main.js  —  orchestrator (classic script, runs last)
 *  Hydrates the static shell from window.CV.config, renders data-driven
 *  sections, then boots shader / cursor / interactions / animations / github.
 * ========================================================================== */

(function () {
  const CV = window.CV || {};
  const config = CV.config;

  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const getPath = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
  const hostOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (_) { return ""; } };

  /* ---- bindings ------------------------------------------------------- */
  function hydrateBindings() {
    $$("[data-bind]").forEach((el) => {
      const val = getPath(config, el.dataset.bind);
      if (val != null) el.textContent = val;
    });
    $$("[data-href]").forEach((el) => {
      const val = getPath(config, el.dataset.href);
      if (val) el.setAttribute("href", val);
    });
    $$("[data-mailto]").forEach((el) => el.setAttribute("href", "mailto:" + config.links.email));
    const img = $("[data-photo]");
    if (img) { img.src = config.identity.photo; img.alt = config.identity.photoAlt; }
    $$("[data-cv]").forEach((el) => { el.setAttribute("href", config.identity.cv); el.setAttribute("download", ""); });
  }

  /* ---- capability matrix --------------------------------------------- */
  const ACCENTS = ["primary", "secondary", "tertiary"];
  function renderSkills() {
    const host = $("#skill-matrix");
    if (!host) return;
    host.setAttribute("data-stagger", "");
    host.innerHTML = config.skills.map((s, i) => {
      const accent = s.title.indexOf("AI") >= 0 ? "expressive" : ACCENTS[i % ACCENTS.length];
      const idx = String(i + 1).padStart(2, "0");
      return `
      <article class="skill glass glass-spec morph tilt reveal" data-accent="${accent}">
        <span class="spec" aria-hidden="true"></span>
        <div class="skill__head">
          <span class="skill__glyph" aria-hidden="true">${ICO(s.icon)}</span>
          <h3 class="skill__title lume">${esc(s.title)}</h3>
        </div>
        <p class="skill__desc">${esc(s.desc)}</p>
        <div class="tags">${s.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <div class="skill__foot" aria-hidden="true">
          <span class="skill__status"><span class="led"></span>active</span>
          <span class="measure measure--tick">module / ${idx}</span>
        </div>
      </article>`;
    }).join("");
  }

  /* ---- about: profile rows, languages, focus areas ------------------- */
  function renderProfile() {
    const rows = $("#profile-rows");
    if (rows) {
      rows.innerHTML = config.profileRows.map((r) => `
        <div class="profile-row">
          <span class="profile-row__key">${esc(r.key)}</span>
          <span class="profile-row__val">${esc(r.value)}</span>
        </div>`).join("");
    }
    const langs = $("#lang-list");
    if (langs) {
      langs.innerHTML = config.languages.map((l) => `
        <div class="lang">
          <div class="lang__head">
            <span class="lang__name">${esc(l.name)}</span>
            <span class="lang__level">${esc(l.level)}</span>
          </div>
          <div class="lang__track"><span class="lang__fill" data-value="${Number(l.value) || 0}"></span></div>
        </div>`).join("");
    }
    const focus = $("#focus-areas");
    if (focus && config.identity.focusAreas) {
      focus.setAttribute("data-stagger", "");
      focus.innerHTML = config.identity.focusAreas.map((f) => `
        <div class="focus glass glass-spec reveal">
          <span class="spec" aria-hidden="true"></span>
          <span class="focus__k mono">${esc(f.k)}</span>
          <p class="focus__v">${esc(f.v)}</p>
        </div>`).join("");
    }
  }

  function renderFacets() {
    const host = $("#design-facets");
    if (host) host.innerHTML = config.design.facets.map((f) => `<span class="facet">${esc(f)}</span>`).join("");
  }
  function renderKV(sel, items) {
    const host = $(sel);
    if (host) host.innerHTML = items.map((it) =>
      `<div class="kv"><span class="kv__k">${esc(it.k)}</span><span class="kv__v">${esc(it.v)}</span></div>`).join("");
  }

  /* ---- contact: social link cards ------------------------------------ */
  function renderSocial() {
    const host = $("#social-links");
    if (!host) return;
    host.innerHTML = (config.social || []).filter((s) => s.url).map((s) => `
      <a class="social-card glass glass-spec" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">
        <span class="spec" aria-hidden="true"></span>
        <span class="social-card__glyph">${s.icon ? ICO(s.icon) : esc(s.glyph)}</span>
        <span class="social-card__body">
          <span class="social-card__label">${esc(s.label)}</span>
          <span class="social-card__host mono">${esc(hostOf(s.url))}</span>
        </span>
        <span class="social-card__arrow" aria-hidden="true">${ICO("arrowRt")}</span>
      </a>`).join("");
  }

  /* ---- dock ----------------------------------------------------------- */
  const ICO = (name) => (CV.icon ? CV.icon(name) : "");
  function renderDock() {
    const host = $("#dock");
    if (!host) return;
    host.innerHTML = config.dock.map((item) => {
      const inner = item.text != null ? esc(item.text) : ICO(item.icon);
      const glyph = `<span class="dock-item__glyph" aria-hidden="true">${inner}</span>`;
      const tip = `<span class="dock-item__tip">${esc(item.label)}</span>`;
      if (item.id === "cv") {
        return `<a class="dock-item" data-magnetic data-cv href="${esc(config.identity.cv)}" download
                   aria-label="${esc(item.label)}">${glyph}${tip}</a>`;
      }
      if (item.type === "mailto") {
        return `<a class="dock-item" data-magnetic data-mailto href="mailto:${esc(config.links.email)}"
                   aria-label="${esc(item.label)}">${glyph}${tip}</a>`;
      }
      if (item.type === "link") {
        return `<a class="dock-item" data-magnetic href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"
                   aria-label="${esc(item.label)}">${glyph}${tip}</a>`;
      }
      return `<button class="dock-item" type="button" data-magnetic data-action="${esc(item.action)}"
                 aria-label="${esc(item.label)}">${glyph}${tip}</button>`;
    }).join("");
  }

  /* ---- inline SVG icons (static shell: buttons, topbar mark) ---------- */
  function renderIcons() {
    if (!CV.icon) return;
    $$("[data-ico]").forEach((el) => {
      if (el.dataset.icoDone) return;
      el.innerHTML = CV.icon(el.dataset.ico);
      el.dataset.icoDone = "1";
    });
  }

  /* ---- boot ----------------------------------------------------------- */
  function boot() {
    if (!config) { console.error("[main] CV.config missing"); return; }
    document.documentElement.classList.add("js");
    if (CV.applyStoredTheme) CV.applyStoredTheme();

    hydrateBindings();
    renderIcons();
    renderSkills();
    renderProfile();
    renderFacets();
    renderKV("#hardware-list", config.hardware.items);
    renderKV("#ai-list", config.ai.principles);
    renderSocial();
    renderDock();
    if (CV.renderProjects) CV.renderProjects($("#project-grid"), config.projects);

    // every large glass card gets the smooth hover shape-morph
    $$(".about__lead, .about__panel, .panel, .gh-stat, .focus, .social-card").forEach((el) => el.classList.add("morph"));

    if (CV.initShader) CV.initShader($("#bg-shader"));
    if (CV.initCursor) CV.initCursor();
    if (CV.initInteractions) CV.initInteractions(config);
    if (CV.initAnimations) CV.initAnimations();
    if (CV.initGitHub) CV.initGitHub(config);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
