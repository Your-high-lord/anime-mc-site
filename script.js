document.addEventListener("DOMContentLoaded", () => {
  // ===== FX CANVAS (HIGH-DPI SAFE) =====
  function initFxCanvas() {
    const canvas = document.getElementById("fx-canvas");
    if (!canvas) return null;

    const dpr = Math.max(window.devicePixelRatio || 1, 1);
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return { canvas, ctx, dpr };
  }

  let fx = initFxCanvas();
  window.__FX = fx;

  window.addEventListener("resize", () => {
    fx = initFxCanvas();
    window.__FX = fx;
  });

  // ===== OPENING SEQUENCE =====
  const INTRO_KEY = "mc_intro_seen_v1";

  function easeOutCubic(t) {
    const p = t - 1;
    return p * p * p + 1;
  }

  function drawIntroFx(progress, fxObj) {
    if (!fxObj || !fxObj.ctx) return;
    const { canvas, ctx } = fxObj;
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const alpha = 0.18 + 0.3 * (1 - progress);
    ctx.fillStyle = `rgba(15, 23, 42, ${alpha})`;
    ctx.fillRect(0, 0, w, h);

    const maxR = Math.max(w, h) * 0.5;
    const r = maxR * easeOutCubic(progress);
    const cx = w / 2;
    const cy = h / 2;

    const grd = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
    grd.addColorStop(0, "rgba(148, 163, 184, 0.0)");
    grd.addColorStop(0.3, "rgba(56, 189, 248, 0.6)");
    grd.addColorStop(0.7, "rgba(15, 23, 42, 0.0)");

    ctx.globalCompositeOperation = "screen";
    ctx.beginPath();
    ctx.fillStyle = grd;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = "soft-light";
    ctx.fillStyle = `rgba(248, 250, 252, ${0.05 + Math.random() * 0.08})`;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "source-over";
  }

  function runIntro(overlay, duration) {
    let t0 = null;
    let frameId;

    function frame(ts) {
      if (!t0) t0 = ts;
      const elapsed = ts - t0;
      const p = Math.min(elapsed / duration, 1);
      drawIntroFx(p, window.__FX);

      if (elapsed < duration) {
        frameId = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(frameId);
        overlay.classList.add("is-hidden");
        try {
          localStorage.setItem(INTRO_KEY, "1");
        } catch (_) {}
      }
    }

    frameId = requestAnimationFrame(frame);

    overlay.addEventListener(
      "click",
      () => {
        cancelAnimationFrame(frameId);
        overlay.classList.add("is-hidden");
        try {
          localStorage.setItem(INTRO_KEY, "1");
        } catch (_) {}
      },
      { once: true }
    );
  }

  function playIntroIfNeeded() {
    const overlay = document.getElementById("intro-overlay");
    if (!overlay) return;

    const seen = localStorage.getItem(INTRO_KEY);
    const isLowMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen && isLowMotion) {
      overlay.classList.add("is-hidden");
      return;
    }

    if (seen) {
      runIntro(overlay, 1200);
    } else {
      runIntro(overlay, 2600);
    }
  }

  playIntroIfNeeded();

  // ===== WORLD PRESSURE / FIGHT STATE =====
  const FIGHT_KEY = "mc_world_pressure_v1";
  const pressureLabel = document.getElementById("world-pressure-indicator");

  function loadPressure() {
    try {
      const v = parseInt(localStorage.getItem(FIGHT_KEY), 10);
      const val = Number.isFinite(v) ? Math.min(Math.max(v, 0), 100) : 0;
      if (pressureLabel) {
        pressureLabel.textContent = `World Pressure: ${val}%`;
      }
      return val;
    } catch (_) {
      if (pressureLabel) {
        pressureLabel.textContent = "World Pressure: 0%";
      }
      return 0;
    }
  }

  function savePressure(v) {
    const clamped = Math.min(Math.max(v, 0), 100);
    try {
      localStorage.setItem(FIGHT_KEY, String(clamped));
    } catch (_) {}
    if (pressureLabel) {
      pressureLabel.textContent = `World Pressure: ${clamped}%`;
    }
    return clamped;
  }

  let worldPressure = loadPressure();

  // ===== JIKAN CLIENT (COVERS + MC ARCHIVE) =====
  const JIKAN_BASE = "https://api.jikan.moe/v4";

  async function cachedFetch(key, url, maxAgeMs) {
    const now = Date.now();
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const cached = JSON.parse(raw);
        if (now - cached.time < maxAgeMs) {
          return cached.data;
        }
      }
    } catch (_) {}

    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const json = await res.json();

    try {
      localStorage.setItem(
        key,
        JSON.stringify({ time: now, data: json })
      );
    } catch (_) {}

    return json;
  }

  async function fetchAnimeWithCharacters(animeId) {
    const [anime, chars] = await Promise.all([
      cachedFetch(
        `jikan-anime-${animeId}`,
        `${JIKAN_BASE}/anime/${animeId}`,
        1000 * 60 * 60 * 12
      ),
      cachedFetch(
        `jikan-anime-${animeId}-characters`,
        `${JIKAN_BASE}/anime/${animeId}/characters`,
        1000 * 60 * 60 * 12
      )
    ]);

    const animeData = anime.data;
    const charList = Array.isArray(chars.data) ? chars.data : [];

    return {
      id: animeData.mal_id,
      title: animeData.title,
      imageUrl:
        animeData.images?.jpg?.large_image_url ||
        animeData.images?.jpg?.image_url ||
        null,
      characters: charList.slice(0, 10).map((c) => ({
        id: c.character?.mal_id,
        name: c.character?.name,
        imageUrl: c.character?.images?.jpg?.image_url || null,
        role: c.role
      }))
    };
  }

  const FEATURED_ANIME_IDS = [20, 1735, 5114, 11061]; // Naruto, Shippuuden, FMA:B, HxH

  function createSilhouetteElement(label) {
    const div = document.createElement("div");
    div.className = "mc-card-silhouette";
    div.textContent = label || "SHADOW";
    return div;
  }

  function createMcCardFromAnime(anime) {
    const card = document.createElement("article");
    card.className = "mc-card";
    card.dataset.animeId = anime.id;

    const imgWrap = document.createElement("div");
    imgWrap.className = "mc-card-img-wrap";

    if (anime.imageUrl) {
      const img = document.createElement("img");
      img.className = "mc-card-img";
      img.src = anime.imageUrl;
      img.alt = anime.title;
      img.loading = "lazy";
      img.decoding = "async";

      img.addEventListener("error", () => {
        img.remove();
        imgWrap.appendChild(createSilhouetteElement("ANIME"));
      });

      imgWrap.appendChild(img);
    } else {
      imgWrap.appendChild(createSilhouetteElement("ANIME"));
    }

    const title = document.createElement("h3");
    title.textContent = anime.title;

    const meta = document.createElement("p");
    meta.className = "mc-meta";
    meta.textContent = `Primary characters: ${anime.characters.length}`;

    card.appendChild(imgWrap);
    card.appendChild(title);
    card.appendChild(meta);

    card.addEventListener("mouseenter", (e) => {
      if (window.AttackFX?.cardHoverStart) {
        window.AttackFX.cardHoverStart(e.currentTarget);
      }
    });

    card.addEventListener("mouseleave", (e) => {
      if (window.AttackFX?.cardHoverEnd) {
        window.AttackFX.cardHoverEnd(e.currentTarget);
      }
    });

    card.addEventListener("click", () => {
      if (window.AttackFX?.triggerAttack) {
        window.AttackFX.triggerAttack(anime);
      }
    });

    return card;
  }

  function renderFallbackSilhouettes(container) {
    container.innerHTML = "";
    for (let i = 0; i < 4; i++) {
      const card = document.createElement("article");
      card.className = "mc-card";

      const wrap = document.createElement("div");
      wrap.className = "mc-card-img-wrap";
      wrap.appendChild(createSilhouetteElement("REDACATED"));

      const title = document.createElement("h3");
      title.textContent = "Obscured Presence";

      const meta = document.createElement("p");
      meta.className = "mc-meta";
      meta.textContent = "Data jammed. System running on instinct.";

      card.appendChild(wrap);
      card.appendChild(title);
      card.appendChild(meta);

      container.appendChild(card);
    }
  }

  async function renderMcArchive() {
    const listEl = document.getElementById("mc-list");
    const statusEl = document.getElementById("mc-status");
    if (!listEl || !statusEl) return;

    statusEl.textContent = "Scanning anime dimensions...";
    listEl.innerHTML = "";

    try {
      const animePayloads = await Promise.all(
        FEATURED_ANIME_IDS.map((id) =>
          fetchAnimeWithCharacters(id)
        )
      );

      animePayloads.forEach((anime) => {
        const card = createMcCardFromAnime(anime);
        listEl.appendChild(card);
      });

      statusEl.textContent =
        "Linked to Jikan · Tap any card to provoke the system.";
    } catch (err) {
      console.error("Jikan error", err);
      statusEl.textContent =
        "Connection disrupted. Switching to shadow forms.";
      renderFallbackSilhouettes(listEl);
    }
  }

  renderMcArchive();

  // ===== ATTACK + HOVER AURA (FIGHT VISUALS) =====
  window.AttackFX = (function () {
    let hoverCard = null;
    let hoverFrameId = null;
    let attackFrameId = null;

    function getFx() {
      return window.__FX;
    }

    function cardHoverStart(cardEl) {
      hoverCard = cardEl;
      cancelAnimationFrame(hoverFrameId);
      let t0 = null;

      function loop(ts) {
        if (!hoverCard) return;
        if (!t0) t0 = ts;
        const p = ((ts - t0) % 1200) / 1200;
        drawHoverAura(p, hoverCard);
        hoverFrameId = requestAnimationFrame(loop);
      }

      hoverFrameId = requestAnimationFrame(loop);
    }

    function cardHoverEnd() {
      hoverCard = null;
      cancelAnimationFrame(hoverFrameId);
      const fxObj = getFx();
      if (fxObj && fxObj.ctx) {
        const { canvas, ctx } = fxObj;
        ctx.fillStyle = "rgba(15, 23, 42, 0.35)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    function drawHoverAura(progress, cardEl) {
      const fxObj = getFx();
      if (!fxObj || !fxObj.ctx || !cardEl) return;
      const { canvas, ctx, dpr } = fxObj;

      const rect = cardEl.getBoundingClientRect();
      const cx = (rect.left + rect.width / 2) * dpr;
      const cy = (rect.top + rect.height / 2) * dpr;

      const maxR = Math.max(rect.width, rect.height) * 1.7 * dpr;
      const r = maxR * (0.35 + 0.65 * progress);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grd = ctx.createRadialGradient(
        cx,
        cy,
        r * 0.15,
        cx,
        cy,
        r
      );
      grd.addColorStop(0, "rgba(248, 250, 252, 0.28)");
      grd.addColorStop(0.4, "rgba(56, 189, 248, 0.6)");
      grd.addColorStop(1, "rgba(15, 23, 42, 0.0)");

      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      ctx.fillStyle = grd;
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    function triggerAttack(anime) {
      cancelAnimationFrame(attackFrameId);
      const fxObj = getFx();
      if (!fxObj || !fxObj.ctx) return;

      const impact =
        10 +
        Math.min(
          20,
          Math.round(Math.random() * anime.characters.length * 2)
        );
      worldPressure = savePressure(worldPressure + impact);

      let t0 = null;
      const duration = 900;

      function loop(ts) {
        if (!t0) t0 = ts;
        const p = Math.min((ts - t0) / duration, 1);
        drawAttackFrame(p, worldPressure);
        if (p < 1) {
          attackFrameId = requestAnimationFrame(loop);
        }
      }

      attackFrameId = requestAnimationFrame(loop);
    }

    function drawAttackFrame(progress, pressure) {
      const fxObj = getFx();
      if (!fxObj || !fxObj.ctx) return;
      const { canvas, ctx } = fxObj;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
      ctx.fillRect(0, 0, w, h);

      const layers = 4;
      for (let i = 0; i < layers; i++) {
        const t = progress * (1 + i * 0.25);
        const y = h * (0.2 + 0.15 * i + 0.25 * easeOutCubic(t));
        const alpha = (1 - t) * 0.6;
        const thickness = 18 + pressure * 0.4;

        const grd = ctx.createLinearGradient(0, y, w, y);
        grd.addColorStop(0, "rgba(56, 189, 248, 0.0)");
        grd.addColorStop(
          0.5,
          `rgba(248, 250, 252, ${alpha})`
        );
        grd.addColorStop(1, "rgba(56, 189, 248, 0.0)");

        ctx.fillStyle = grd;
        ctx.fillRect(0, y - thickness / 2, w, thickness);
      }

      const beamStrength = 0.5 + pressure / 100;
      const centerY = h * 0.5;

      const beamGrad = ctx.createLinearGradient(0, centerY, w, centerY);
      beamGrad.addColorStop(0, "rgba(56, 189, 248, 0.0)");
      beamGrad.addColorStop(
        0.15,
        `rgba(56, 189, 248, ${0.3 * beamStrength})`
      );
      beamGrad.addColorStop(
        0.5,
        `rgba(248, 250, 252, ${0.9 * beamStrength})`
      );
      beamGrad.addColorStop(
        0.85,
        `rgba(56, 189, 248, ${0.3 * beamStrength})`
      );
      beamGrad.addColorStop(1, "rgba(56, 189, 248, 0.0)");

      const beamHeight = 70 + pressure * 0.6;
      const wobble = Math.sin(progress * Math.PI * 3) * 8;

      ctx.save();
      ctx.translate(0, wobble);
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, centerY - beamHeight / 2, w, beamHeight);
      ctx.restore();

      const cx = w / 2;
      const cy = centerY;
      const orbR = 26 + pressure * 0.25;
      const orbGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orbR);
      orbGrad.addColorStop(0, "rgba(248, 250, 252, 0.95)");
      orbGrad.addColorStop(0.4, "rgba(56, 189, 248, 0.9)");
      orbGrad.addColorStop(1, "rgba(15, 23, 42, 0.0)");

      ctx.beginPath();
      ctx.fillStyle = orbGrad;
      ctx.arc(cx, cy, orbR, 0, Math.PI * 2);
      ctx.fill();

      const vignette = ctx.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) / 2,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.8
      );
      vignette.addColorStop(0, "rgba(0, 0, 0, 0.0)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.55)");
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, w, h);
    }

    return {
      cardHoverStart,
      cardHoverEnd,
      triggerAttack
    };
  })();

  // ===== GUESS THE MC (existing game, hooked into fight FX) =====
  const hintsPool = [
    {
      hint: "He once stole a legendary scroll and painted graffiti on faces.",
      answer: "naruto"
    },
    {
      hint: "He turned Super Saiyan watching his best friend die.",
      answer: "goku"
    },
    {
      hint: "He writes names to play god with a black notebook.",
      answer: "light"
    },
    {
      hint: "He commands knights with a single eye's power.",
      answer: "lelouch"
    }
  ];

  const hintEl = document.getElementById("quiz-hint");
  const streakEl = document.getElementById("quiz-streak");
  const newHintBtn = document.getElementById("new-hint-btn");
  const powerBurst = document.getElementById("power-burst");
  const optionButtons = Array.from(
    document.querySelectorAll(".quiz-option")
  );

  let currentAnswer = null;
  let streak = 0;

  function triggerPowerBurst() {
    if (!powerBurst) return;
    powerBurst.classList.remove("active");
    void powerBurst.offsetWidth;
    powerBurst.classList.add("active");

    worldPressure = savePressure(worldPressure + 3);
  }

  function pickNewHint() {
    const idx = Math.floor(Math.random() * hintsPool.length);
    const { hint, answer } = hintsPool[idx];
    currentAnswer = answer;
    if (hintEl) hintEl.textContent = hint;
    optionButtons.forEach((btn) => {
      btn.classList.remove("correct", "wrong");
    });
  }

  if (newHintBtn && hintEl && streakEl && optionButtons.length) {
    newHintBtn.addEventListener("click", pickNewHint);
    optionButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosen = btn.dataset.answer;
        if (!currentAnswer) return;
        optionButtons.forEach((b) =>
          b.classList.remove("correct", "wrong")
        );
        if (chosen === currentAnswer) {
          streak += 1;
          btn.classList.add("correct");
          triggerPowerBurst();
        } else {
          streak = 0;
          btn.classList.add("wrong");
        }
        streakEl.textContent = `Streak: ${streak}`;
      });
    });
    pickNewHint();
  }

  // ===== FATE SPINNER (existing game, still redirects) =====
  const spinBtn = document.getElementById("spin-btn");
  const spinDisplay = document.getElementById("spin-display");
  const arenaGoku = document.querySelector(".arena-goku");
  const arenaBaki = document.querySelector(".arena-baki");

  const mcs = [
    { name: "Son Goku", url: "dragon-ball.html" },
    { name: "Naruto Uzumaki", url: "naruto.html" },
    { name: "Light Yagami", url: "light.html" },
    { name: "Alucard", url: "alucard.html" },
    { name: "Lelouch vi Britannia", url: "lelouch.html" }
  ];

  function setArenaMode(mode) {
    if (!arenaGoku || !arenaBaki) return;
    if (mode === "goku") {
      arenaGoku.classList.add("active");
      arenaBaki.classList.remove("active");
    } else if (mode === "baki") {
      arenaBaki.classList.add("active");
      arenaGoku.classList.remove("active");
    } else {
      arenaGoku.classList.remove("active");
      arenaBaki.classList.remove("active");
    }
  }

  if (spinBtn && spinDisplay) {
    spinBtn.addEventListener("click", () => {
      if (spinBtn.disabled) return;
      spinBtn.disabled = true;
      let ticks = 0;
      const maxTicks = 18 + Math.floor(Math.random() * 6);
      setArenaMode("goku");

      const interval = setInterval(() => {
        const random = mcs[Math.floor(Math.random() * mcs.length)];
        spinDisplay.textContent = `Focusing on: ${random.name}`;
        ticks++;

        if (ticks === Math.floor(maxTicks / 2)) {
          setArenaMode("baki");
        }

        if (ticks >= maxTicks) {
          clearInterval(interval);
          spinBtn.disabled = false;
          setArenaMode(null);

          worldPressure = savePressure(worldPressure + 5);

          window.location.href = random.url;
        }
      }, 100);
    });
  }

  const startAwakeningBtn = document.getElementById(
    "start-awakening-btn"
  );
  if (startAwakeningBtn) {
    startAwakeningBtn.addEventListener("click", () => {
      triggerPowerBurst();
      if (window.AttackFX?.triggerAttack) {
        window.AttackFX.triggerAttack({
          title: "Awakening",
          characters: []
        });
      }
    });
  }

  // ===== PARALLAX (kept lightweight, translate only) =====
  const parallaxSections = Array.from(
    document.querySelectorAll(".parallax-section")
  );

  function onScroll() {
    parallaxSections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const offset = (rect.top / window.innerHeight) * 4;
      sec.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
});
