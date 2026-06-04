/* =============================================================================
 *  shader.js  —  lightweight WebGL light field (classic script, no libraries)
 * -----------------------------------------------------------------------------
 *  A single full-screen quad runs a domain-warped fbm fragment shader painting
 *  slow, glassy color flow in the site's accent colors. Subtle, cheap, polite
 *  (pauses when hidden, honors reduced-motion, simplifies on weak devices) and
 *  safe (falls back to the CSS aurora field if WebGL is unavailable).
 *  Colors are read from CSS custom properties; re-reads on "themechange".
 *
 *  Attaches: window.CV.initShader(canvas)
 * ========================================================================== */

window.CV = window.CV || {};

(function () {
  const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_pointer;
uniform vec3  u_cA, u_cB, u_cC, u_cD;
uniform float u_intensity;
uniform float u_octaves;

float hash(vec2 p){
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++){
    if (float(i) >= u_octaves) break;
    v += a * noise(p);
    p *= 2.02; a *= 0.5;
  }
  return v;
}
void main(){
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;
  float t = u_time * 0.045;
  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 - t + 5.2));
  vec2 r = vec2(
    fbm(p * 1.5 + q * 1.8 + vec2(1.7, 9.2) + 0.15 * t),
    fbm(p * 1.5 + q * 1.8 + vec2(8.3, 2.8) - 0.12 * t));
  float f = fbm(p * 1.4 + r * 2.0);
  vec2 mp = (u_pointer - 0.5);
  float pg = smoothstep(0.7, 0.0, length(p - mp * 1.2));
  vec3 col = mix(u_cA, u_cB, clamp(f * 1.4, 0.0, 1.0));
  col = mix(col, u_cC, clamp(length(r) * 0.9, 0.0, 1.0));
  col = mix(col, u_cD, pow(clamp(pg, 0.0, 1.0), 2.2) * 0.55);
  float vig = smoothstep(1.35, 0.15, length(p));
  col *= vig;
  float alpha = (0.10 + 0.55 * f) * u_intensity * vig;
  gl_FragColor = vec4(col, alpha);
}`;

  const VERT = `
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`;

  function readVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  const num = (v) => parseFloat(v) || 0;

  function hslVarToRgb(prefix) {
    const h = num(readVar(`${prefix}-h`));
    const s = num(readVar(`${prefix}-s`)) / 100;
    const l = num(readVar(`${prefix}-l`)) / 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return [f(0), f(8), f(4)];
  }

  function compile(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn("[shader] compile failed:", gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  window.CV.initShader = function (canvas) {
    if (!canvas) return null;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const lowCores = (navigator.hardwareConcurrency || 8) <= 4;
    const lite = coarse || lowCores || document.documentElement.classList.contains("perf-lite");

    let gl = null;
    try {
      gl = canvas.getContext("webgl", { antialias: false, alpha: true, premultipliedAlpha: false, powerPreference: "low-power" })
        || canvas.getContext("experimental-webgl");
    } catch (_) { gl = null; }
    if (!gl) { canvas.style.display = "none"; return { destroy() {} }; }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.style.display = "none"; return { destroy() {} }; }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = "none"; return { destroy() {} }; }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const U = {
      res: gl.getUniformLocation(prog, "u_res"),
      time: gl.getUniformLocation(prog, "u_time"),
      pointer: gl.getUniformLocation(prog, "u_pointer"),
      cA: gl.getUniformLocation(prog, "u_cA"),
      cB: gl.getUniformLocation(prog, "u_cB"),
      cC: gl.getUniformLocation(prog, "u_cC"),
      cD: gl.getUniformLocation(prog, "u_cD"),
      intensity: gl.getUniformLocation(prog, "u_intensity"),
      octaves: gl.getUniformLocation(prog, "u_octaves"),
    };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const scale = lite ? 0.5 : 0.75;
    const dprCap = lite ? 1 : 1.5;
    function pushColors() {
      gl.uniform3fv(U.cA, hslVarToRgb("--c-primary"));
      gl.uniform3fv(U.cB, hslVarToRgb("--c-secondary"));
      gl.uniform3fv(U.cC, hslVarToRgb("--c-tertiary"));
      gl.uniform3fv(U.cD, hslVarToRgb("--c-expressive"));
    }
    pushColors();
    gl.uniform1f(U.intensity, lite ? 0.7 : 1.0);
    gl.uniform1f(U.octaves, lite ? 3 : 5);

    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr * scale));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w; canvas.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(U.res, w, h);
      }
    }
    resize();

    let raf = 0, start = performance.now(), running = false;
    function frame(now) {
      if (!running) return;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      gl.uniform1f(U.time, (now - start) / 1000);
      gl.uniform2f(U.pointer, pointer.x, pointer.y);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }
    function drawOnce() {
      gl.uniform1f(U.time, 12.0);
      gl.uniform2f(U.pointer, 0.5, 0.4);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function play() { if (running) return; running = true; start = performance.now() - 1000; raf = requestAnimationFrame(frame); }
    function pause() { running = false; cancelAnimationFrame(raf); }

    const onResize = () => { resize(); if (!running && reduceMotion) drawOnce(); };
    const onPointer = (e) => { pointer.tx = e.clientX / window.innerWidth; pointer.ty = 1 - e.clientY / window.innerHeight; };
    const onVisibility = () => { if (document.hidden) pause(); else if (!reduceMotion) play(); };
    const onTheme = () => { pushColors(); if (!running) drawOnce(); };

    window.addEventListener("resize", onResize, { passive: true });
    if (!coarse) window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("themechange", onTheme);

    if (reduceMotion) drawOnce(); else play();

    return {
      destroy() {
        pause();
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointer);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("themechange", onTheme);
      },
    };
  };
})();
