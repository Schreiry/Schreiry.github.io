/* =============================================================================
 *  animations.js  —  scroll reveal, stagger, lang bars, scroll-spy, clock
 *  (classic script).  Attaches: window.CV.initAnimations()
 * ========================================================================== */

window.CV = window.CV || {};

(function () {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    document.querySelectorAll("[data-stagger]").forEach((group) => {
      group.querySelectorAll(":scope > .reveal").forEach((el, i) => el.style.setProperty("--i", i));
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  }

  function initLangBars() {
    const bars = document.querySelectorAll(".lang__fill");
    if (!bars.length) return;
    const fill = (el) => { el.style.width = (el.dataset.value || 0) + "%"; };
    if (reduceMotion || !("IntersectionObserver" in window)) { bars.forEach(fill); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { fill(entry.target); io.unobserve(entry.target); } });
    }, { threshold: 0.4 });
    bars.forEach((el) => io.observe(el));
  }

  function initScrollSpy() {
    const links = [...document.querySelectorAll(".topbar__menu a[href^='#']")];
    if (!links.length || !("IntersectionObserver" in window)) return;
    const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = map.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.removeAttribute("aria-current"));
          link.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    map.forEach((_, id) => { const sec = document.getElementById(id); if (sec) io.observe(sec); });
  }

  function initClock() {
    const el = document.getElementById("clock");
    if (!el) return;
    const tick = () => {
      el.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    };
    tick();
    setInterval(tick, 15000);
  }

  window.CV.initAnimations = function () {
    initReveal();
    initLangBars();
    initScrollSpy();
    initClock();
  };
})();
