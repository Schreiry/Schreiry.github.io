/* =============================================================================
 *  animations.js  —  scroll reveal, stagger, lang bars, scroll-spy, clock
 *  (classic script).  Attaches: window.CV.initAnimations()
 * ========================================================================== */

window.CV = window.CV || {};

(function () {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rafThrottle(fn) {
    let ticking = false, lastArgs = null;
    return (...args) => {
      lastArgs = args;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; fn(...lastArgs); });
    };
  }

  /* seamless topbar that compacts, chases the scroll, and shows progress */
  function initTopbar() {
    const tb = document.querySelector(".topbar");
    if (!tb) return;
    const prog = tb.querySelector(".topbar__progress");
    let lastY = window.scrollY || 0;
    let hidden = false;
    const HIDE_AFTER = 160;   // px before the bar is allowed to retract
    const DELTA = 5;          // px of intent before reacting (kills jitter)

    const onScroll = rafThrottle(() => {
      const y = window.scrollY || 0;
      const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;

      tb.classList.toggle("is-scrolled", y > 6);
      if (prog) prog.style.transform = "scaleX(" + Math.max(0, Math.min(1, y / max)) + ")";

      if (!reduceMotion) {
        const dy = y - lastY;
        if (y > HIDE_AFTER && dy > DELTA && !hidden) { tb.classList.add("is-hidden"); hidden = true; }
        else if ((dy < -DELTA || y < HIDE_AFTER) && hidden) { tb.classList.remove("is-hidden"); hidden = false; }
      }
      lastY = y;
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();
  }

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
    const links = [...document.querySelectorAll(".topbar__menu a[href^='#'], .rail__item[href^='#']")];
    if (!links.length || !("IntersectionObserver" in window)) return;
    // a section id may have several links pointing at it (topbar + rail)
    const byId = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href").slice(1);
      if (!byId.has(id)) byId.set(id, []);
      byId.get(id).push(a);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.removeAttribute("aria-current"));
        (byId.get(entry.target.id) || []).forEach((l) => l.setAttribute("aria-current", "true"));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    byId.forEach((_, id) => { const sec = document.getElementById(id); if (sec) io.observe(sec); });
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
    initTopbar();
    initReveal();
    initLangBars();
    initScrollSpy();
    initClock();
  };
})();
