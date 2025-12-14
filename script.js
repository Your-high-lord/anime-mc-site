document.addEventListener("DOMContentLoaded", () => {
  // ====== 1. Anime covers via Jikan (no manual downloads) ======
  async function loadAnimeCover(animeTitle, imgId) {
    const img = document.getElementById(imgId);
    if (!img) return;

    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(
          animeTitle
        )}&limit=1&sfw=true`
      ); // Free, no key. [web:59][web:60]
      const json = await res.json();
      if (!json.data || !json.data.length) return;

      const coverUrl = json.data[0].images.jpg.image_url; // series poster. [web:54]
      img.src = coverUrl;
    } catch (err) {
      console.error("Failed to load cover for", animeTitle, err);
    }
  }

  loadAnimeCover("Naruto", "naruto-cover");
  loadAnimeCover("Dragon Ball Z", "dragonball-cover");
  loadAnimeCover("Death Note", "deathnote-cover");
  loadAnimeCover("Hellsing Ultimate", "hellsing-cover");
  loadAnimeCover(
    "Code Geass: Lelouch of the Rebellion",
    "codegeass-cover"
  );

  // ====== 2. Guess the MC game with power burst ======

  const hintsPool = [
    { hint: "He once stole a legendary scroll and painted graffiti on faces.", answer: "naruto" },
    { hint: "He turned Super Saiyan watching his best friend die.", answer: "goku" },
    { hint: "He writes names to play god with a black notebook.", answer: "light" },
    { hint: "He commands knights with a single eye's power.", answer: "lelouch" },
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

  function pickNewHint() {
    const idx = Math.floor(Math.random() * hintsPool.length);
    const { hint, answer } = hintsPool[idx];
    currentAnswer = answer;
    hintEl.textContent = hint;
    optionButtons.forEach((btn) => {
      btn.classList.remove("correct", "wrong");
    });
  }

  function triggerPowerBurst() {
    if (!powerBurst) return;
    powerBurst.classList.remove("active");
    // force reflow
    void powerBurst.offsetWidth;
    powerBurst.classList.add("active");
  }

  if (newHintBtn && hintEl && streakEl && optionButtons.length) {
    newHintBtn.addEventListener("click", pickNewHint);

    optionButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosen = btn.dataset.answer;
        if (!currentAnswer) return;

        optionButtons.forEach((b) => b.classList.remove("correct", "wrong"));

        if (chosen === currentAnswer) {
          streak += 1;
          btn.classList.add("correct");
          triggerPowerBurst(); // “Goku-style” burst when right
        } else {
          streak = 0;
          btn.classList.add("wrong");
        }

        streakEl.textContent = `Streak: ${streak}`;
      });
    });

    // First hint on load
    pickNewHint();
  }

  // ====== 3. Fate Spinner + animated arena ======

  const spinBtn = document.getElementById("spin-btn");
  const spinDisplay = document.getElementById("spin-display");
  const arenaGoku = document.querySelector(".arena-goku");
  const arenaBaki = document.querySelector(".arena-baki");

  const mcs = [
    { name: "Son Goku", url: "dragon-ball.html" },
    { name: "Naruto Uzumaki", url: "naruto.html" },
    { name: "Light Yagami", url: "light.html" },
    { name: "Alucard", url: "alucard.html" },
    { name: "Lelouch vi Britannia", url: "lelouch.html" },
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

      // Start with “Goku beam” then switch to “Baki combo”
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
          window.location.href = random.url;
        }
      }, 100);
    });
  }

  // ====== 4. Awakening button small effect ======
  const startAwakeningBtn = document.getElementById("start-awakening-btn");
  if (startAwakeningBtn && powerBurst) {
    startAwakeningBtn.addEventListener("click", () => {
      triggerPowerBurst();
    });
  }

  // ====== 5. Soft parallax for sections ======
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
