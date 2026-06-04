/* =============================================================================
 *  cursor.js  —  custom glowing cursor (classic script)
 * -----------------------------------------------------------------------------
 *  A bright dot that tracks the pointer 1:1 plus a soft trailing ring that
 *  lerps behind it and reacts to interactive elements (links/buttons fill,
 *  cards expand, press compresses). Enabled only on fine pointers without
 *  reduced-motion; otherwise the native cursor is left untouched.
 *
 *  Centering is handled in CSS via negative margins, so inline transforms only
 *  ever set translate + scale (no conflict).
 *
 *  Attaches: window.CV.initCursor()
 * ========================================================================== */

window.CV = window.CV || {};

window.CV.initCursor = function () {
  const fine = matchMedia("(pointer: fine)").matches;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduce) return; // touch / reduced-motion → keep the system cursor

  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  dot.setAttribute("aria-hidden", "true");
  ring.setAttribute("aria-hidden", "true");
  document.body.append(ring, dot);
  document.documentElement.classList.add("has-cursor");

  const LINK = "a, button, [role='button'], .tag, .dock-item, .facet, summary, label, .shot";
  const CARD = ".workstation, .skill, .panel, .id-frame, .gh-stat";

  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;
  let scale = 1, tScale = 1, press = 1;
  let shown = false;

  function setState(target) {
    const onLink = target.closest?.(LINK);
    const onCard = !onLink && target.closest?.(CARD);
    ring.classList.toggle("is-link", !!onLink);
    ring.classList.toggle("is-card", !!onCard);
    tScale = onCard ? 2.3 : onLink ? 1.5 : 1;
  }

  function onMove(e) {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(${press})`;
    if (!shown) { document.documentElement.classList.add("cursor-on"); shown = true; }
    setState(e.target);
  }
  function onDown() { press = 0.7; ring.classList.add("is-down"); }
  function onUp() { press = 1; ring.classList.remove("is-down"); }
  function onLeave() { document.documentElement.classList.remove("cursor-on"); shown = false; }

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  document.addEventListener("pointerleave", onLeave);

  (function loop() {
    rx += (mx - rx) * 0.2;
    ry += (my - ry) * 0.2;
    scale += (tScale - scale) * 0.18;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${(scale * press).toFixed(3)})`;
    requestAnimationFrame(loop);
  })();
};
