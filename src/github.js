/* =============================================================================
 *  github.js  —  live stats from the GitHub REST API (classic script)
 * -----------------------------------------------------------------------------
 *  Pulls public profile + repositories for config.identity.githubUser and
 *  renders: repo count, total stars, followers, following, a language
 *  breakdown, and per-project live star badges.
 *
 *  • One profile call + one repos call (per_page=100) = 2 requests.
 *  • Cached in localStorage for 6h (unauthenticated rate limit is 60/h).
 *  • Falls back to config.githubFallback if the API is offline/limited
 *    (e.g. when opened via file:// where fetch may be blocked).
 *
 *  Attaches: window.CV.initGitHub(config)
 * ========================================================================== */

window.CV = window.CV || {};

(function () {
  const CACHE_KEY = "cv.gh.v1";
  const TTL = 6 * 60 * 60 * 1000; // 6 hours
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  function loadCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const o = JSON.parse(raw);
      if (Date.now() - o.t > TTL) return null;
      return o.data;
    } catch (_) { return null; }
  }
  function saveCache(data) {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data })); } catch (_) {}
  }

  async function fetchLive(user) {
    const headers = { Accept: "application/vnd.github+json" };
    const [uRes, rRes] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, { headers }),
      fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`, { headers }),
    ]);
    if (!uRes.ok || !rRes.ok) throw new Error("github api " + uRes.status + "/" + rRes.status);
    const u = await uRes.json();
    const repos = await rRes.json();

    const langCount = {};
    let stars = 0;
    const byName = {};
    repos.forEach((r) => {
      stars += r.stargazers_count || 0;
      byName[(r.name || "").toLowerCase()] = {
        stars: r.stargazers_count || 0,
        language: r.language || null,
        url: r.html_url,
      };
      if (!r.fork && r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
    });
    const languages = Object.entries(langCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return {
      repos: u.public_repos ?? repos.length,
      stars,
      followers: u.followers ?? 0,
      following: u.following ?? 0,
      avatar: u.avatar_url || null,
      languages,
      byName,
      live: true,
    };
  }

  function normalizeFallback(fb) {
    return {
      repos: fb.repos, stars: fb.stars, followers: fb.followers, following: fb.following,
      languages: fb.languages || [], byName: {}, live: false,
    };
  }

  /* count-up animation */
  function countUp(el, to) {
    if (!el) return;
    if (reduceMotion) { el.textContent = String(to); return; }
    const dur = 900, start = performance.now(), from = 0;
    function step(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(from + (to - from) * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderStats(data, weights) {
    const tiles = {
      repos: $("[data-gh='repos']"),
      stars: $("[data-gh='stars']"),
      followers: $("[data-gh='followers']"),
      following: $("[data-gh='following']"),
    };
    // count up when the panel scrolls into view
    const panel = $("#gh-panel");
    const run = () => {
      countUp(tiles.repos, data.repos);
      countUp(tiles.stars, data.stars);
      countUp(tiles.followers, data.followers);
      countUp(tiles.following, data.following);
    };
    if (panel && "IntersectionObserver" in window && !reduceMotion) {
      const io = new IntersectionObserver((ents) => {
        ents.forEach((e) => { if (e.isIntersecting) { run(); io.disconnect(); } });
      }, { threshold: 0.3 });
      io.observe(panel);
    } else { run(); }

    // source note
    const note = $("#gh-source");
    if (note) note.textContent = data.live ? "source: github.com · live" : "source: cached snapshot";

    // language bars — prefer authoritative manual weights; else derive from API
    const host = $("#gh-langs");
    let langs = null;
    if (weights && weights.length) {
      langs = weights.slice(0, 6).map((w) => ({ name: w.name, pct: Math.round(w.value) }));
    } else if (data.languages && data.languages.length) {
      const total = data.languages.reduce((s, l) => s + l.count, 0) || 1;
      langs = data.languages.slice(0, 6).map((l) => ({ name: l.name, pct: Math.round((l.count / total) * 100) }));
    }
    if (host && langs) {
      host.innerHTML = langs
        .map((l, i) => `
          <div class="gh-lang" style="--i:${i}">
            <div class="gh-lang__head">
              <span class="gh-lang__name">${l.name}</span>
              <span class="gh-lang__pct mono">${l.pct}%</span>
            </div>
            <div class="gh-lang__track"><span class="gh-lang__fill" data-w="${l.pct}"></span></div>
          </div>`)
        .join("");
      requestAnimationFrame(() => {
        $$(".gh-lang__fill", host).forEach((el) => { el.style.width = el.dataset.w + "%"; });
      });
    }
  }

  function renderProjectStars(data) {
    $$("[data-gh-star]").forEach((el) => {
      const name = (el.dataset.ghStar || "").toLowerCase();
      const info = data.byName[name];
      if (info && typeof info.stars === "number") {
        el.textContent = "★ " + info.stars;
        el.hidden = false;
      } else {
        el.hidden = true;
      }
    });
  }

  window.CV.initGitHub = async function (config) {
    const user = config.identity.githubUser;
    const weights = config.languageWeights;
    const fb = normalizeFallback(config.githubFallback || {});

    // paint fallback immediately so numbers are never blank
    renderStats(fb, weights);

    if (!user || typeof fetch !== "function") { renderProjectStars(fb); return; }

    let data = loadCache();
    if (!data) {
      try { data = await fetchLive(user); saveCache(data); }
      catch (_) { data = null; }
    }
    if (data) { renderStats(data, weights); renderProjectStars(data); }
    else { renderProjectStars(fb); }
  };
})();
