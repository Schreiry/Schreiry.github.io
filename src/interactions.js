/* =============================================================================
 *  interactions.js  —  the tactile layer (classic script)
 * -----------------------------------------------------------------------------
 *  • cursor-following light (global + per-glass refraction via --mx/--my)
 *  • Steam-style card tilt
 *  • magnetic buttons / dock items
 *  • screenshot lightbox (gallery)
 *  • action dispatcher: copy email, toggle theme, download CV, scroll-top,
 *    language, project details, open screenshot
 *
 *  Attaches: window.CV.initInteractions(config), window.CV.applyStoredTheme()
 * ========================================================================== */

window.CV = window.CV || {};

(function () {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const fine = !coarse && !reduceMotion;

  function rafThrottle(fn) {
    let ticking = false, lastArgs = null;
    return (...args) => {
      lastArgs = args;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; fn(...lastArgs); });
    };
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* 1 — global cursor light ---------------------------------------------- */
  function initCursorLight() {
    if (!fine) return;
    const root = document.documentElement.style;
    const move = rafThrottle((x, y) => {
      root.setProperty("--cursor-x", x + "px");
      root.setProperty("--cursor-y", y + "px");
    });
    window.addEventListener("pointermove", (e) => move(e.clientX, e.clientY), { passive: true });
  }

  /* 2 — per-element refraction (--mx/--my) ------------------------------- */
  const TRACK = ".glass, .portrait, .btn, .lume, .skill, .workstation, .panel, .facet, .tag, .dock-item, .gh-stat, .shot";
  function initGlassTracking() {
    if (!fine) return;
    const update = rafThrottle((el, x, y) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", clamp(((x - r.left) / r.width) * 100, 0, 100) + "%");
      el.style.setProperty("--my", clamp(((y - r.top) / r.height) * 100, 0, 100) + "%");
    });
    document.addEventListener("pointermove", (e) => {
      const el = e.target.closest && e.target.closest(TRACK);
      if (el) update(el, e.clientX, e.clientY);
    }, { passive: true });
  }

  /* 3 — card tilt -------------------------------------------------------- */
  function initTilt() {
    if (!fine) return;
    const MAX = 5;
    document.querySelectorAll(".tilt").forEach((card) => {
      const move = rafThrottle((x, y) => {
        const r = card.getBoundingClientRect();
        const px = (x - r.left) / r.width - 0.5;
        const py = (y - r.top) / r.height - 0.5;
        card.style.setProperty("--ry", (px * MAX * 2).toFixed(2) + "deg");
        card.style.setProperty("--rx", (-py * MAX * 2).toFixed(2) + "deg");
      });
      card.addEventListener("pointerenter", () => card.classList.add("is-tilting"));
      card.addEventListener("pointermove", (e) => move(e.clientX, e.clientY), { passive: true });
      card.addEventListener("pointerleave", () => {
        card.classList.remove("is-tilting");
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* 4 — magnetic elements ------------------------------------------------ */
  function initMagnetic() {
    if (!fine) return;
    const STRENGTH = 0.4, RADIUS = 70;
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const move = rafThrottle((x, y) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = x - cx, dy = y - cy;
        const dist = Math.hypot(dx, dy);
        const pull = clamp(1 - dist / (Math.max(r.width, r.height) + RADIUS), 0, 1);
        el.style.setProperty("--magnet-x", (dx * STRENGTH * pull).toFixed(1) + "px");
        el.style.setProperty("--magnet-y", (dy * STRENGTH * pull).toFixed(1) + "px");
      });
      el.addEventListener("pointermove", (e) => move(e.clientX, e.clientY), { passive: true });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--magnet-x", "0px");
        el.style.setProperty("--magnet-y", "0px");
      });
    });
  }

  /* 5 — toast ------------------------------------------------------------ */
  let toastTimer = 0;
  function toast(msg) {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast glass glass--strong mono";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2200);
  }

  /* 6 — theme ------------------------------------------------------------ */
  const THEME_KEY = "portfolio.os.theme";
  function applyStoredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") document.documentElement.setAttribute("data-theme", saved);
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = cur === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem(THEME_KEY, next); } catch (_) {}
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
    toast("theme: " + next);
  }

  /* 7 — lightbox --------------------------------------------------------- */
  const lb = { box: null, img: null, cap: null, set: [], idx: 0, lastFocus: null };
  function buildLightbox() {
    if (lb.box) return;
    const box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Screenshot viewer");
    box.innerHTML = `
      <button class="lightbox__close" type="button" aria-label="Close">✕</button>
      <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Previous">‹</button>
      <figure class="lightbox__stage glass glass--strong">
        <img class="lightbox__img" alt="" />
        <figcaption class="lightbox__cap mono"></figcaption>
      </figure>
      <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Next">›</button>`;
    document.body.appendChild(box);
    lb.box = box;
    lb.img = box.querySelector(".lightbox__img");
    lb.cap = box.querySelector(".lightbox__cap");
    box.querySelector(".lightbox__close").addEventListener("click", closeLightbox);
    box.querySelector(".lightbox__nav--prev").addEventListener("click", () => step(-1));
    box.querySelector(".lightbox__nav--next").addEventListener("click", () => step(1));
    box.addEventListener("click", (e) => { if (e.target === box) closeLightbox(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.box.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    });
  }
  function show() {
    const item = lb.set[lb.idx];
    if (!item) return;
    lb.img.src = item.src;
    lb.img.alt = item.label || "Screenshot";
    lb.cap.textContent = (lb.idx + 1) + " / " + lb.set.length + (item.label ? "  ·  " + item.label : "");
    const hasMany = lb.set.length > 1;
    lb.box.querySelector(".lightbox__nav--prev").style.display = hasMany ? "" : "none";
    lb.box.querySelector(".lightbox__nav--next").style.display = hasMany ? "" : "none";
  }
  function step(d) { lb.idx = (lb.idx + d + lb.set.length) % lb.set.length; show(); }
  function openLightbox(set, idx) {
    buildLightbox();
    lb.set = set; lb.idx = idx || 0;
    lb.lastFocus = document.activeElement;
    show();
    lb.box.classList.add("is-open");
    document.documentElement.classList.add("lb-open");
    lb.box.querySelector(".lightbox__close").focus();
  }
  function closeLightbox() {
    if (!lb.box) return;
    lb.box.classList.remove("is-open");
    document.documentElement.classList.remove("lb-open");
    if (lb.lastFocus && lb.lastFocus.focus) lb.lastFocus.focus();
  }

  /* 8 — action dispatcher ------------------------------------------------ */
  function initActions(config) {
    const langs = config.languagesUI || ["EN"];
    let langIdx = 0;

    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-action]");
      if (!trigger) return;
      const action = trigger.dataset.action;

      switch (action) {
        case "copy-email": {
          e.preventDefault();
          const email = config.links.email;
          const done = () => toast("copied · " + email);
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).then(done).catch(() => fallbackCopy(email, done));
          } else fallbackCopy(email, done);
          break;
        }
        case "download-cv": {
          if (trigger.tagName !== "A") {
            const a = document.createElement("a");
            a.href = config.identity.cv; a.download = "";
            document.body.appendChild(a); a.click(); a.remove();
          }
          break;
        }
        case "toggle-theme": e.preventDefault(); toggleTheme(); break;
        case "scroll-top":
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
          break;
        case "cycle-language": {
          e.preventDefault();
          langIdx = (langIdx + 1) % langs.length;
          const code = langs[langIdx];
          const label = trigger.querySelector(".dock-item__glyph") || trigger;
          if (label) label.textContent = code;
          toast(code === "EN" ? "language: EN (active)" : "language: " + code + " — coming soon");
          break;
        }
        case "toggle-details": {
          e.preventDefault();
          const ws = trigger.closest(".workstation");
          if (!ws) break;
          const open = ws.classList.toggle("is-open");
          trigger.setAttribute("aria-expanded", String(open));
          const lbl = trigger.querySelector("[data-label]") || trigger;
          if (lbl) lbl.textContent = open ? "Close details" : "Open details";
          break;
        }
        case "open-shot": {
          e.preventDefault();
          const gallery = trigger.closest("[data-gallery]");
          const shots = gallery ? [...gallery.querySelectorAll("[data-action='open-shot']")] : [trigger];
          const set = shots.map((s) => ({ src: s.dataset.src, label: s.dataset.label }));
          openLightbox(set, shots.indexOf(trigger));
          break;
        }
      }
    });
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); done && done(); }
    catch (_) { toast("copy failed — " + text); }
    ta.remove();
  }

  /* boot ----------------------------------------------------------------- */
  window.CV.applyStoredTheme = applyStoredTheme;
  window.CV.initInteractions = function (config) {
    initCursorLight();
    initGlassTracking();
    initTilt();
    initMagnetic();
    initActions(config);
  };
})();
