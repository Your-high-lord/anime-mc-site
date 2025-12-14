document.addEventListener("DOMContentLoaded", () => {
  /* HIDDEN WORLD STATE – calm / scheming / unstable */
  (function setupWatcherState() {
    const body = document.body;
    let interactions = 0;
    const startTime = Date.now();

    function applyState() {
      const elapsed = (Date.now() - startTime) / 1000;
      let state = "state-calm";

      if (elapsed > 60 || interactions > 20) {
        state = "state-scheming";
      }
      if (elapsed > 180 || interactions > 60) {
        state = "state-unstable";
      }

      body.classList.remove("state-calm", "state-scheming", "state-unstable");
      body.classList.add(state);
    }

    const stored = localStorage.getItem("mc_world_state");
    if (stored) {
      body.classList.add(stored);
    } else {
      body.classList.add("state-calm");
    }

    window.addEventListener("pointerdown", () => {
      interactions++;
      applyState();
      const cls =
        body.className.split(" ").find((c) => c.startsWith("state-")) || "state-calm";
      localStorage.setItem("mc_world_state", cls);
    });

    setInterval(() => {
      applyState();
      const cls =
        body.className.split(" ").find((c) => c.startsWith("state-")) || "state-calm";
      localStorage.setItem("mc_world_state", cls);
    }, 15000);
  })();

  /* OBSERVER AURA – follows user slightly */
  (function setupAura() {
    const aura = document.querySelector(".observer-aura");
    if (!aura) return;

    const updateAura = (x, y) => {
      const nx = x / window.innerWidth;
      const ny = y / window.innerHeight;
      const px = Math.max(0.1, Math.min(0.9, nx));
      const py = Math.max(0.1, Math.min(0.9, ny));
      aura.style.background = `radial-gradient(circle at ${px * 100}% ${
        py * 100
      }%, rgba(148,163,255,0.22), transparent 55%)`;
    };

    window.addEventListener("pointermove", (e) => {
      updateAura(e.clientX, e.clientY);
    });

    updateAura(window.innerWidth * 0.6, window.innerHeight * 0.3);
  })();

  /* CARD INTERACTIONS: filters, spotlight, tilt, ripple */
  (function setupCards() {
    const filterButtons = document.querySelectorAll("[data-filter]");
    const cards = document.querySelectorAll(".character-card");

    if (!cards.length) return;

    if (filterButtons.length) {
      filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const filter = btn.getAttribute("data-filter");

          filterButtons.forEach((b) => b.classList.remove("active-filter"));
          btn.classList.add("active-filter");

          cards.forEach((card) => {
            const tag = card.getAttribute("data-tag");
            if (filter === "all" || tag === filter) {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
              card.style.pointerEvents = "auto";
            } else {
              card.style.opacity = "0.25";
              card.style.transform = "scale(0.97)";
              card.style.pointerEvents = "none";
            }
          });
        });
      });
    }

    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    randomCard.classList.add("spotlight");
    setTimeout(() => randomCard.classList.remove("spotlight"), 1600);

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
      });

      card.addEventListener("click", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement("span");
        ripple.classList.add("card-ripple");
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        card.appendChild(ripple);
        setTimeout(() => ripple.remove(), 450);
      });
    });
  })();

  /* CHARACTER IMAGE FALLBACK – animated silhouettes */
  (function setupSilhouettes() {
    const cards = document.querySelectorAll(".character-card");
    if (!cards.length) return;

    cards.forEach((card) => {
      const img = card.querySelector("img");
      if (!img) return;

      const activateSilhouette = () => {
        card.classList.add("silhouette");
        if (!card.querySelector(".silhouette-shape")) {
          const shape = document.createElement("div");
          shape.className = "silhouette-shape";
          img.replaceWith(shape);
        }
      };

      img.addEventListener("error", activateSilhouette);
      if (!img.complete || img.naturalWidth === 0) {
        activateSilhouette();
      }
    });
  })();

  /* GUESS THE MC: difficulty + streak */
  (function setupGuessGame() {
    const hintEl = document.getElementById("quiz-hint");
    const resultEl = document.getElementById("quiz-result");
    const newHintBtn = document.getElementById("new-hint-btn");
    const optionButtons = document.querySelectorAll(".quiz-option");

    if (!hintEl || !resultEl || !newHintBtn || optionButtons.length === 0) return;

    const hints = [
      {
        name: "Naruto",
        easy: "Dreams of becoming leader of his village and never gives up.",
        hard: "Bears a fox within and loves orange."
      },
      {
        name: "Goku",
        easy: "Loves fighting strong opponents and gets stronger every battle.",
        hard: "Was sent to Earth from a destroyed planet."
      },
      {
        name: "Baki",
        easy: "Trains to surpass the strongest creature on Earth, his own father.",
        hard: "Known for brutal underground fights."
      },
      {
        name: "Light",
        easy: "Thinks of himself as justice after finding a deadly notebook.",
        hard: "Plays mind games with a sugar-loving detective."
      },
      {
        name: "Alucard",
        easy: "An immortal vampire who works for a human organization.",
        hard: "Wears a red coat and enjoys overwhelming enemies."
      },
      {
        name: "Lelouch",
        easy: "A masked strategist leading a rebellion with a mysterious power.",
        hard: "Commands others with an eye-based ability."
      }
    ];

    let currentAnswer = null;
    let difficulty = localStorage.getItem("mc_quiz_difficulty") || "easy";
    let streak = parseInt(localStorage.getItem("mc_quiz_streak") || "0", 10);

    function updateMeta(extra = "") {
      const base = `Streak: ${streak} · Mode: ${difficulty === "easy" ? "Chill" : "Hardcore"}`;
      resultEl.textContent = extra ? `${extra} ${base}` : base;
    }

    function pickNewHint() {
      const random = hints[Math.floor(Math.random() * hints.length)];
      currentAnswer = random.name;
      const text = difficulty === "easy" ? random.easy : random.hard;
      hintEl.textContent = text;
      optionButtons.forEach((btn) => btn.classList.remove("correct", "wrong"));
      updateMeta();
    }

    newHintBtn.addEventListener("click", (event) => {
      if (event.ctrlKey) {
        difficulty = difficulty === "easy" ? "hard" : "easy";
        localStorage.setItem("mc_quiz_difficulty", difficulty);
      }
      pickNewHint();
    });

    optionButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!currentAnswer) return;

        const guess = btn.textContent.trim();
        if (guess === currentAnswer) {
          streak++;
          localStorage.setItem("mc_quiz_streak", String(streak));
          btn.classList.add("correct");
          updateMeta("Correct!");
        } else {
          streak = 0;
          localStorage.setItem("mc_quiz_streak", "0");
          btn.classList.add("wrong");
          updateMeta(`Wrong! It was ${currentAnswer}.`);
        }
      });
    });

    updateMeta();
  })();

  /* RANDOM SPIN GAME */
  (function setupSpinGame() {
    const spinBtn = document.getElementById("spin-btn");
    const spinDisplay = document.getElementById("spin-display");
    if (!spinBtn || !spinDisplay) return;

    const mcs = [
      { name: "Naruto", url: "naruto.html" },
      { name: "Goku", url: "dragon-ball.html" },
      { name: "Baki", url: "baki.html" },
      { name: "Light", url: "light.html" },
      { name: "Alucard", url: "alucard.html" },
      { name: "Lelouch", url: "lelouch.html" }
    ];

    spinBtn.addEventListener("click", () => {
      spinBtn.disabled = true;
      let ticks = 0;
      const maxTicks = 18;

      const interval = setInterval(() => {
        const random = mcs[Math.floor(Math.random() * mcs.length)];
        spinDisplay.textContent = random.name;
        ticks++;

        if (ticks >= maxTicks) {
          clearInterval(interval);
          spinBtn.disabled = false;
          window.location.href = random.url;
        }
      }, 90);
    });
  })();

  /* AWAKENING MINI-GAME – timing-based charge */
  (function setupAwakening() {
    const btn = document.getElementById("awakening-btn");
    const fill = document.querySelector(".awakening-fill");
    const status = document.getElementById("awakening-status");
    const aura = document.querySelector(".observer-aura");

    if (!btn || !fill) return;

    let charge = 0;
    let lastTap = 0;
    let streak = 0;

    function updateFill() {
      const clamped = Math.max(0, Math.min(100, charge));
      fill.style.width = `${clamped}%`;
    }

    function nudgeWorld() {
      if (!aura) return;
      const phase = Math.min(1, charge / 100);
      const intensity = 0.12 + phase * 0.22;
      aura.style.background = `radial-gradient(circle at 50% 50%, rgba(244, 244, 245, ${intensity}), transparent 58%)`;
    }

    btn.addEventListener("click", () => {
      const now = performance.now();
      const delta = now - lastTap;
      lastTap = now;

      if (delta > 0 && delta < 900 && delta > 250) {
        streak++;
        charge += 8 + streak * 0.6;
        if (status) status.textContent = streak >= 5 ? "The silence is listening." : "";
      } else {
        streak = 0;
        charge -= 5;
        if (status) status.textContent = "";
      }

      if (charge >= 100) {
        charge = 100;
        if (status) status.textContent = "Something just noticed you.";
        localStorage.setItem("mc_world_touched", "1");
      } else if (charge < 0) {
        charge = 0;
      }

      updateFill();
      nudgeWorld();
    });

    setInterval(() => {
      if (charge <= 0) return;
      charge = Math.max(0, charge - 0.7);
      updateFill();
    }, 1400);

    if (localStorage.getItem("mc_world_touched") === "1") {
      charge = 24;
      updateFill();
      nudgeWorld();
      if (status) status.textContent = "The residue of a previous attempt lingers.";
    }
  })();

  /* WHICH MC ARE YOU? QUIZ */
  (function setupPersonalityQuiz() {
    const startBtn = document.getElementById("mcq-start-btn");
    const questionEl = document.getElementById("mcq-question");
    const optionsEl = document.getElementById("mcq-options");
    const resultEl = document.getElementById("mcq-result");

    if (!startBtn || !questionEl || !optionsEl || !resultEl) return;

    const questions = [
      {
        text: "Pick your ideal vibe in a fight:",
        options: [
          { label: "Never give up, protect friends", mc: "Naruto" },
          { label: "Fight strongest, keep training", mc: "Goku" },
          { label: "Outsmart, plan ten steps ahead", mc: "Lelouch" },
          { label: "Judge criminals, rewrite the world", mc: "Light" },
          { label: "Enjoy chaos and destruction", mc: "Alucard" },
          { label: "Train alone until you break limits", mc: "Baki" }
        ]
      },
      {
        text: "How do you handle problems?",
        options: [
          { label: "Talk it out, then punch if needed", mc: "Naruto" },
          { label: "Smile and punch through it", mc: "Goku" },
          { label: "Secret plans and gambits", mc: "Lelouch" },
          { label: "Cold logic and sacrifice", mc: "Light" },
          { label: "Destroy anything in your path", mc: "Alucard" },
          { label: "Endless training and discipline", mc: "Baki" }
        ]
      },
      {
        text: "What motivates you most?",
        options: [
          { label: "Recognition and acceptance", mc: "Naruto" },
          { label: "Getting stronger and protecting Earth", mc: "Goku" },
          { label: "Creating a better world, your way", mc: "Lelouch" },
          { label: "Absolute justice on your terms", mc: "Light" },
          { label: "The thrill of battle and power", mc: "Alucard" },
          { label: "Surpassing your limits and rivals", mc: "Baki" }
        ]
      }
    ];

    let index = 0;
    const tally = {};

    function saveLastResult(mcName) {
      localStorage.setItem("mc_quiz_last_result", mcName);
    }

    function loadLastResult() {
      const last = localStorage.getItem("mc_quiz_last_result");
      if (last) {
        resultEl.textContent = `Last time, you were ${last}.`;
      }
    }

    function renderQuestion() {
      const q = questions[index];
      questionEl.textContent = q.text;
      optionsEl.innerHTML = "";
      q.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-option";
        btn.textContent = opt.label;
        btn.addEventListener("click", () => {
          tally[opt.mc] = (tally[opt.mc] || 0) + 1;
          index++;
          if (index < questions.length) {
            renderQuestion();
          } else {
            showResult();
          }
        });
        optionsEl.appendChild(btn);
      });
      resultEl.textContent = "";
    }

    function showResult() {
      let bestMC = null;
      let bestScore = -1;
      Object.entries(tally).forEach(([mc, score]) => {
        if (score > bestScore) {
          bestScore = score;
          bestMC = mc;
        }
      });
      if (bestMC) {
        resultEl.textContent = `You are most like ${bestMC}.`;
        questionEl.textContent = "The archive has filed your pattern away.";
        optionsEl.innerHTML = "";
        saveLastResult(bestMC);
      }
    }

    startBtn.addEventListener("click", () => {
      index = 0;
      for (const key in tally) delete tally[key];
      renderQuestion();
    });

    loadLastResult();
  })();

  /* SCROLL REVEAL + PARALLAX (gentle) */
  (function setupScrollEffects() {
    const revealEls = document.querySelectorAll(".reveal");
    const parallaxEls = document.querySelectorAll(".parallax-section");

    if (!revealEls.length && !parallaxEls.length) return;

    function onScroll() {
      const triggerBottom = window.innerHeight * 0.85;

      revealEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerBottom) {
          el.classList.add("visible");
        }
      });

      parallaxEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const offset = (rect.top / window.innerHeight) * 4;
        el.style.transform = `translateY(${offset}px)`;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();
});
