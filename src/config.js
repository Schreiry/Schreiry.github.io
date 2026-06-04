/* =============================================================================
 *  config.js  —  SINGLE SOURCE OF TRUTH
 * -----------------------------------------------------------------------------
 *  Edit THIS file to update the whole site. No personal data is hardcoded
 *  anywhere else.
 *
 *  NOTE: this is a CLASSIC script (not an ES module) on purpose, so the site
 *  works when you simply double-click index.html (file://) AND on GitHub Pages.
 *  It attaches the data to  window.CV.config.
 *
 *  All file paths are RELATIVE so they work on GitHub Pages (user site
 *  `Schreiry.github.io` and project site `/repo/` alike).
 * ========================================================================== */

window.CV = window.CV || {};

window.CV.config = {
  /* --- core identity ----------------------------------------------------- */
  identity: {
    name: "David Greve",
    handle: "Schreiry",
    githubUser: "Schreiry",                 // used for the live GitHub API panel
    role: "Junior Software Engineer",
    descriptor:
      "Python / Rust / C++ · HPC · Simulation Systems · Backend Logic · Visual Systems",
    location: "Tbilisi, Georgia",
    education: "Computer Engineering — Georgian Technical University",
    direction: "High-performance computing · Simulation · Backend · Interface systems",
    signal: "available",

    hero:
      "I build technical software where performance, structure, and interface behavior matter. My work connects high-performance computing, simulation systems, backend logic, AI-assisted development, hardware understanding, and visual design.",

    about:
      "Computer Engineering student focused on Python, Rust, C++, high-performance computing, simulation systems, backend development, and software optimization. I work on projects that combine algorithms, performance, architecture, visual systems, and practical engineering — matrix computation engines, artificial life simulations, database-backed prototypes, hardware diagnostics, and interface design.",

    // a few sharp “focus area” cards for the About section
    focusAreas: [
      { k: "Computation", v: "Matrix engines, SIMD, multithreading, benchmarking." },
      { k: "Simulation", v: "Artificial life, genetic systems, data-oriented design." },
      { k: "Backend", v: "Flask / FastAPI, SQL Server, REST & WebSocket logic." },
      { k: "Interface", v: "Glass UI systems, motion, color, tactility." },
    ],

    // Your photo (optimized ~1100px / 87 KB). The glass frame center-crops it.
    photo: "./images/portrait.jpg",
    photoAlt: "David Greve — portrait, arms crossed in a black leather jacket",

    // Drop your real PDF at ./cv/David_Greve_CV.pdf (same name → no code change).
    cv: "./cv/David_Greve_CV.pdf",
  },

  /* --- links ------------------------------------------------------------- */
  // The contact email below is public on the site. Change it freely.
  // Add more socials to `social` (only entries with a url are shown).
  links: {
    github: "https://github.com/Schreiry",
    repositories: "https://github.com/Schreiry?tab=repositories",
    linkedin: "https://www.linkedin.com/in/schreiry/",
    instagram: "https://instagram.com/schreitory",
    facebook: "https://facebook.com/Schreitory",
    email: "gamerdg634@gmail.com",
  },

  // Contact grid + dock links. glyph = short mono label or symbol.
  // To add a link (Telegram, Discord, X, YouTube, website…) just add a row.
  social: [
    { id: "github",    label: "GitHub",    glyph: "GH", url: "https://github.com/Schreiry" },
    { id: "linkedin",  label: "LinkedIn",  glyph: "in", url: "https://www.linkedin.com/in/schreiry/" },
    { id: "instagram", label: "Instagram", glyph: "IG", url: "https://instagram.com/schreitory" },
    { id: "facebook",  label: "Facebook",  glyph: "FB", url: "https://facebook.com/Schreitory" },
  ],

  /* --- live GitHub fallback (used if the API is rate-limited/offline) ---- */
  githubFallback: {
    repos: 26,
    stars: 98,
    followers: 14,
    following: 34,
    // language distribution as repo counts; converted to % at render time
    languages: [
      { name: "C++", count: 14 },
      { name: "Python", count: 5 },
      { name: "Rust", count: 1 },
      { name: "Svelte", count: 1 },
      { name: "JavaScript", count: 1 },
      { name: "C", count: 1 },
      { name: "CSS", count: 1 },
      { name: "TeX", count: 1 },
    ],
  },

  /* --- language distribution (AUTHORITATIVE) ---------------------------- */
  // GitHub's raw breakdown counts old repos, so it over-weights C++ and
  // under-weights Rust. These hand-set percentages reflect real, current
  // proportions and are what the bars display. Edit freely (should sum ~100).
  languageWeights: [
    { name: "Rust", value: 40 },
    { name: "Python", value: 30 },
    { name: "C++", value: 20 },
    { name: "Svelte", value: 5 },
    { name: "C", value: 3 },
    { name: "TeX", value: 2 },
  ],

  /* --- about → system profile rows -------------------------------------- */
  profileRows: [
    { key: "identity", value: "David Greve · Schreiry" },
    { key: "role", value: "Junior Software Engineer" },
    { key: "education", value: "Computer Engineering — GTU" },
    { key: "location", value: "Tbilisi, Georgia" },
    { key: "focus", value: "HPC · Simulation · Backend · Interface" },
    { key: "runtime", value: "human" },
  ],

  languages: [
    { name: "Russian", level: "Native", value: 100 },
    { name: "Georgian", level: "Fluent / Native-level", value: 92 },
    { name: "English", level: "Pre-Intermediate / Intermediate", value: 58 },
  ],

  /* --- capability matrix ------------------------------------------------- */
  skills: [
    { glyph: "{ }", title: "Programming",
      desc: "Languages I read, write, and reason in across system and application layers.",
      tags: ["Python", "Rust", "C++", "C", "C#", "SQL", "JavaScript / TS", "HTML / CSS"] },
    { glyph: "//", title: "Software Engineering",
      desc: "Structuring software so it stays legible, testable, and maintainable.",
      tags: ["Architecture", "Modular design", "Code review", "Debugging", "Git / VCS", "Refactoring"] },
    { glyph: "≡", title: "HPC & Optimization",
      desc: "Making computation fit the hardware it runs on.",
      tags: ["SIMD", "AVX / SSE", "Multithreading", "Parallelism", "Memory optimization", "CPU optimization", "Data-oriented design"] },
    { glyph: "∑", title: "Algorithms & Data Structures",
      desc: "Choosing the right structure before writing the fast version.",
      tags: ["Strassen", "Matrix algorithms", "Binary search", "Pointers", "Spatial indexing", "Genetic algorithms"] },
    { glyph: "::", title: "Backend & Databases",
      desc: "Server logic and data layers behind interactive systems.",
      tags: ["Flask", "FastAPI", "SQL Server", "REST API", "WebSocket", "DB triggers"] },
    { glyph: "✦", title: "AI-Assisted Development",
      desc: "AI as an engineering amplifier — judgment stays human.",
      tags: ["Prompt engineering", "Task decomposition", "Debugging support", "Documentation", "Iteration"] },
    { glyph: "⌗", title: "Tools & Systems",
      desc: "The environment I build, profile, and ship from.",
      tags: ["Git", "Linux / Windows", "Terminal · CLI / TUI", "Ratatui", "NumPy / Numba", "Matplotlib", "Pygame"] },
    { glyph: "◐", title: "Hardware & Visual",
      desc: "From silicon to composition — the physical and visual ends of the craft.",
      tags: ["PC building", "Diagnostics", "Performance tuning", "Photography", "Color theory", "UI / UX"] },
  ],

  /* --- project workstations ---------------------------------------------- */
  // accent ∈ "primary" | "secondary" | "tertiary" | "expressive"
  // repoName matches the GitHub repo (for live stars/language).
  // shots = optional screenshot gallery (web-optimized images).
  projects: [
    {
      id: "flust", index: "01", title: "Flust",
      role: "Rust · Computation Platform & TUI",
      language: "Rust", year: "2026", status: "active", accent: "expressive",
      repo: "https://github.com/Schreiry/Flust", repoName: "Flust",
      summary:
        "Rust-based continuation and rethinking of the matrix engine idea: terminal UI, Rayon parallelism, engineering modules, performance analytics, and a cleaner computation platform — a direct successor to Fluminum.",
      ideas: ["Rust", "Rayon parallelism", "Ratatui TUI", "Matrix operations", "Thermal simulation", "GFLOPS analytics", "CSV export", "System profiling"],
      meta: [{ k: "lang", v: "Rust" }, { k: "ui", v: "tui" }, { k: "par", v: "rayon" }],
      shots: [
        { src: "./images/shots/flust-matrix.jpg", label: "Matrix compute · TUI" },
        { src: "./images/shots/flust-main.jpg", label: "Terminal interface" },
        { src: "./images/shots/flust-bench.jpg", label: "Benchmark & analytics" },
      ],
    },
    {
      id: "exsul", index: "02", title: "Exsul",
      role: "Svelte · Application Identity & Interface",
      language: "Svelte", year: "2026", status: "design", accent: "primary",
      repo: "https://github.com/Schreiry/Exsul", repoName: "Exsul",
      summary:
        "A polished desktop-class application with a full glass interface: product catalog, order pipelines, contact maps, backup/sync, and deep appearance controls — built on a Svelte front end with a strong, system-like visual language.",
      ideas: ["Svelte", "Glass UI system", "Catalog & orders", "Settings / theming", "Backup · Google Drive", "Dark high-contrast"],
      meta: [{ k: "stack", v: "svelte" }, { k: "kind", v: "app" }, { k: "ui", v: "glass" }],
      shots: [
        { src: "./images/shots/exsul-catalog.jpg", label: "Workshop Catalog" },
        { src: "./images/shots/exsul-orders.jpg", label: "Orders & Contacts" },
        { src: "./images/shots/exsul-settings.jpg", label: "Settings · Appearance" },
      ],
    },
    {
      id: "alife", index: "03", title: "Alife",
      role: "Python · Artificial Life Simulation",
      language: "Python", year: "2026", status: "active", accent: "tertiary",
      repo: "https://github.com/Schreiry/Alife", repoName: "Alife",
      summary:
        "Python artificial life simulation with a 170-gene genome, inheritance, mutation, behavior systems, vectorized data layout, spatial indexing, and browser / local visualization modes.",
      ideas: ["170-gene genome", "Genetic algorithms", "Mutation & inheritance", "Behavior systems", "NumPy SoA arrays", "Numba JIT", "Spatial index", "FastAPI + WebSocket"],
      meta: [{ k: "lang", v: "py" }, { k: "genes", v: "170" }, { k: "view", v: "web/local" }],
      shots: [
        { src: "./images/shots/alife-1.jpg", label: "Live simulation" },
        { src: "./images/shots/alife-2.jpg", label: "World & population" },
        { src: "./images/shots/alife-3.jpg", label: "Analytics" },
      ],
    },
    {
      id: "aesculapius", index: "04", title: "AESCULAPIUS",
      role: "Flask · SQL Server Prototype",
      language: "Python / SQL", year: "2026", status: "prototype", accent: "secondary",
      repo: "https://github.com/Schreiry/AESCULAPIUS", repoName: "AESCULAPIUS",
      summary:
        "Flask and SQL Server prototype for simulated bio-threat monitoring, combining database triggers, API endpoints, real-time status logic, and atmospheric interface design.",
      ideas: ["Flask", "SQL Server", "Database triggers", "API endpoints", "Real-time status", "CRT / terminal style"],
      meta: [{ k: "lang", v: "flask" }, { k: "db", v: "mssql" }, { k: "mode", v: "sim" }],
      shots: [
        { src: "./images/shots/aesculapius.jpg", label: "Monitoring console" },
      ],
    },
    {
      id: "fluminum", index: "05", title: "Fluminum",
      role: "HPC · Matrix Computation Engine",
      language: "C++", year: "2025", status: "stable", accent: "secondary",
      repo: "https://github.com/Schreiry/fluminum", repoName: "fluminum",
      summary:
        "C++ high-performance matrix computation engine focused on Strassen multiplication, SIMD-oriented acceleration, multithreading, memory estimation, benchmarking, and hardware-aware execution.",
      ideas: ["Strassen multiplication", "SIMD", "AVX / SSE", "Multithreading", "Memory estimation", "Benchmarking", "CSV logs", "Console interface"],
      meta: [{ k: "lang", v: "C++17" }, { k: "cores", v: "multi" }, { k: "out", v: "csv" }],
    },
    {
      id: "labs", index: "06", title: "Experiments & Labs",
      role: "Foundations · Graphics · Concurrency",
      language: "C++ / Python", year: "2024–2025", status: "archive", accent: "tertiary",
      repo: "https://github.com/Schreiry?tab=repositories", repoName: null,
      summary:
        "A working archive of university and self-driven experiments: thread-based matrix work, pointers and memory handling, binary search, fractals, raycasting, and graphical tools.",
      ideas: ["Thread-Matrix", "working-with-pointers", "Binary search", "FraCtalpp", "laser_vectorizer", "Wolfenstoom", "GTU C++ tasks"],
      meta: [{ k: "repos", v: "26" }, { k: "since", v: "2024" }, { k: "kind", v: "labs" }],
    },
  ],

  /* --- design / photography panel --------------------------------------- */
  design: {
    lead:
      "Code is structure, but interface is atmosphere. I care about visual hierarchy, color, tactility, composition, photography, and the emotional weight of software. A good interface should not only work; it should respond.",
    facets: ["Photography", "Composition", "Color correction", "Visual hierarchy", "UI aesthetics", "Presentation design", "Product polish"],
  },

  /* --- hardware / systems panel ----------------------------------------- */
  hardware: {
    lead:
      "I work close to the machine — assembling, diagnosing, and tuning the systems my software runs on.",
    items: [
      { k: "ASSEMBLY", v: "PC build & component selection" },
      { k: "DIAGNOSTICS", v: "Fault isolation & troubleshooting" },
      { k: "OS SETUP", v: "Windows install · drivers · config" },
      { k: "TUNING", v: "Performance & thermal tuning" },
      { k: "AWARENESS", v: "CPU / RAM / GPU behavior" },
    ],
  },

  /* --- AI-assisted development panel ------------------------------------ */
  ai: {
    lead:
      "I use AI as an engineering amplifier, not as a substitute for understanding. I rely on it for task decomposition, research structure, documentation support, debugging hypotheses, and iteration — while keeping architecture, verification, and final technical judgment under human control.",
    principles: [
      { k: "ROLE", v: "Assistant, not architect" },
      { k: "REVIEW", v: "Generated code is reviewed critically" },
      { k: "SPLIT", v: "Suggestions kept separate from decisions" },
      { k: "USE", v: "Decomposition · docs · debugging · iteration" },
    ],
  },

  /* --- dock / command center -------------------------------------------- */
  dock: [
    { id: "cv", label: "Download CV", glyph: "⬇", type: "action", action: "download-cv" },
    { id: "github", label: "GitHub", glyph: "GH", type: "link", url: "https://github.com/Schreiry" },
    { id: "linkedin", label: "LinkedIn", glyph: "in", type: "link", url: "https://www.linkedin.com/in/schreiry/" },
    { id: "email", label: "Copy email", glyph: "@", type: "action", action: "copy-email" },
    { id: "top", label: "Top", glyph: "↑", type: "action", action: "scroll-top" },
    { id: "theme", label: "Theme", glyph: "◑", type: "action", action: "toggle-theme" },
    { id: "lang", label: "EN", glyph: "EN", type: "action", action: "cycle-language" },
  ],

  /* --- decorative microcopy --------------------------------------------- */
  microcopy: {
    runtime: "runtime: human",
    stack: "stack: python/rust/c++",
    mode: "mode: portfolio.os",
    signal: "signal: available",
    focus: "focus: hpc/simulation/backend",
    build: "build: stable · glass-on-glass · v1.1",
  },

  languagesUI: ["EN", "RU", "KA"],
};
