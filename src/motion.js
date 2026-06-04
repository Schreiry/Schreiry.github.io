/* =============================================================================
 *  motion.js  —  guided smooth scroll (classic script)
 * -----------------------------------------------------------------------------
 *  Wraps the vendored Lenis (src/lenis.min.js) into a buttery, "leading" scroll:
 *    • inertial wheel/touch scrolling
 *    • smooth in-page anchor jumps offset under the seamless topbar
 *    • a shared CV.scrollTo() so the dock / buttons feel the same
 *  Fully progressive: if Lenis is missing or the user prefers reduced motion,
 *  the site falls back to native scrolling untouched.
 *
 *  Attaches: window.CV.initMotion(), window.CV.lenis, window.CV.scrollTo(target)
 * ========================================================================== */

window.CV = window.CV || {};

(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const headerOffset = () => {
    const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--topbar-h")) || 56;
    return -(h + 14);
  };

  // fallback scroller used when Lenis is unavailable / reduced-motion
  function nativeScrollTo(target) {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (el === 0 || el === "#top") { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); return; }
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY + headerOffset();
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }

  window.CV.scrollTo = nativeScrollTo; // replaced below if Lenis boots

  window.CV.initMotion = function () {
    if (reduce || typeof window.Lenis !== "function") return;

    let lenis;
    try {
      lenis = new window.Lenis({
        duration: 1.05,
        easing: (t) => 1 - Math.pow(1 - t, 3),   // gentle ease-out, no overshoot
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      });
    } catch (_) { return; }                       // never let scroll break boot
    window.CV.lenis = lenis;

    window.CV.scrollTo = function (target) {
      if (target === 0 || target === "#top") { lenis.scrollTo(0); return; }
      const el = typeof target === "string" ? document.querySelector(target) : target;
      if (el) lenis.scrollTo(el, { offset: headerOffset() });
    };

    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // route in-page anchor links through Lenis (header-aware, a11y focus)
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: headerOffset() });
      target.setAttribute("tabindex", "-1");
      setTimeout(() => target.focus({ preventScroll: true }), 650);
      if (history.replaceState) history.replaceState(null, "", href);
    });
  };
})();
