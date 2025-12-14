// Single global animation + interaction controller.
// No requestAnimationFrame loops, no scroll handlers, no layout thrash.

(function () {
  const root = document.documentElement;
  const body = document.body;

  // DOM refs
  const chargeBtn = document.getElementById("charge-btn");
  const worldPressureValue = document.getElementById("world-pressure-value");
  const worldPressureFill = document.getElementById("world-pressure-fill");
  const spinnerWheel = document.getElementById("spinner-wheel");
  const spinnerLabel = document.getElementById("spinner-label");
  const spinBtn = document.getElementById("spin-btn");
  const universeGrid = document.getElementById("universe-grid");
  const guessPrompt = document.getElementById("guess-prompt");
  const guessOptionsContainer = document.getElementById("guess-options");
  const hintBtn = document.getElementById("hint-btn");
  const streakValue = document.getElementById("streak-value");
  const guessFeedback = document.getElementById("guess-feedback");

  // Stateful bits kept minimal
  let pressure = 100;
  let chargeCooldown = false;
  let streak = 0;
  let currentPromptIndex = 0;
  let spinnerLock = false;

  const MC_PROMPTS = [
    {
      prompt:
        "He once stole a legendary scroll and painted graffiti on faces.",
      answer: "Naruto",
      hints: [
        "His nindo is louder than any jutsu.",
        "A fox watches from within.",
      ],
    },
    {
      prompt:
        "He started as a weak boy in orange, then broke limits nobody else could touch.",
      answer: "Goku",
      hints: [
        "Saiyan blood, Earth heart.",
        "Gravity training is a normal Tuesday.",
      ],
    },
    {
      prompt:
        "He picked up a notebook and decided the world needed his own justice.",
      answer: "Light",
      hints: [
        "His partner loves sweets and crouching.",
        "The shinigami above finds it entertaining.",
      ],
    },
    {
      prompt:
        "He can command anyone with a single look and a word, but the cost is heavy.",
      answer: "Lelouch",
      hints: [
        "A mask, a rebellion, and a mecha battlefield.",
        "Chess strategies applied to nations.",
      ],
    },
  ];

  const UNIVERSE_NAMES = [
    "Naruto",
    "Naruto: Shippuuden",
    "Fullmetal Alchemist: Brotherhood",
    "Hunter x Hunter (2011)",
  ];

  // Helper: safe class toggles with a timeout
  function addClassTemporarily(el, className, duration) {
    if (!el) return;
    el.classList.add(className);
    window.setTimeout(() => {
      el.classList.remove(className);
    }, duration);
  }

  // Click feedback (single system, delegated)
  function attachButtonClickFeedback() {
    body.addEventListener("click", (event) => {
      const target = event.target.closest(".btn");
      if (!target) return;
      target.classList.remove("is-clicked");
      // Next frame ensures CSS transition runs
      window.requestAnimationFrame(() => {
        target.classList.add("is-clicked");
        window.setTimeout(() => {
          target.classList.remove("is-clicked");
        }, 220);
      });
    });
  }

  // Charge Awakening: single special animation.
  function handleChargeClick() {
    if (chargeCooldown) return;
    chargeCooldown = true;

    // Reduce pressure slightly then bounce back as part of the pulse.
    const oldPressure = pressure;
    pressure = Math.max(40, pressure - 10);
    updatePressureDisplay();

    body.classList.add("hero-charged");
    // Restore pressure to previous level smoothly.
    window.setTimeout(() => {
      pressure = Math.min(120, oldPressure + 5);
      updatePressureDisplay();
    }, 260);

    // Cooldown to prevent spamming visual
    window.setTimeout(() => {
      body.classList.remove("hero-charged");
      chargeCooldown = false;
    }, 800);
  }

  function updatePressureDisplay() {
    const clamped = Math.max(0, Math.min(120, pressure));
    const percentText = clamped + "%";
    worldPressureValue.textContent = percentText;

    const scaleFactor = Math.min(1.2, clamped / 100);
    worldPressureFill.style.transform = "scaleX(" + scaleFactor + ")";
  }

  // Fate Spinner: one clean spin per click
  function handleSpin() {
    if (spinnerLock) return;
    spinnerLock = true;

    spinnerLabel.textContent = "Spinning...";
    spinnerWheel.classList.add("is-spinning");

    const choice =
      UNIVERSE_NAMES[Math.floor(Math.random() * UNIVERSE_NAMES.length)];

    window.setTimeout(() => {
      spinnerWheel.classList.remove("is-spinning");
      spinnerLabel.textContent = "Next stop: " + choice;
      highlightUniverseCard(choice);
      spinnerLock = false;
    }, 920);
  }

  function highlightUniverseCard(name) {
    const cards = universeGrid.querySelectorAll(".universe-card");
    cards.forEach((card) => {
      card.classList.remove("is-active");
      if (card.dataset.universe === name) {
        card.classList.add("is-active");
      }
    });
  }

  // Guess system: controlled, no animation spam
  function setPrompt(index) {
    currentPromptIndex = index % MC_PROMPTS.length;
    const data = MC_PROMPTS[currentPromptIndex];
    guessPrompt.textContent = data.prompt;
    guessFeedback.textContent = "";
  }

  function handleGuessClick(event) {
    const btn = event.target.closest(".guess-option");
    if (!btn) return;

    const selected = btn.dataset.answer;
    const { answer } = MC_PROMPTS[currentPromptIndex];

    if (selected === answer) {
      streak += 1;
      guessFeedback.textContent = "Correct. Resolve recognized.";
    } else {
      streak = 0;
      guessFeedback.textContent = "Missed. The system resets your streak.";
    }
    streakValue.textContent = streak.toString();

    // Nudge pressure slightly but safely
    pressure = Math.min(120, pressure + (selected === answer ? 5 : -5));
    updatePressureDisplay();
  }

  function handleHint() {
    const data = MC_PROMPTS[currentPromptIndex];
    const hintPool = data.hints || [];
    if (!hintPool.length) return;

    const hint =
      hintPool[Math.floor(Math.random() * hintPool.length)];
    guessFeedback.textContent = hint;
  }

  // Universe card interaction: minimal but responsive
  function attachUniverseCardHandlers() {
    universeGrid.addEventListener("click", (event) => {
      const card = event.target.closest(".universe-card");
      if (!card) return;

      const name = card.dataset.universe;
      highlightUniverseCard(name);
      guessFeedback.textContent = "Locked in: " + name;
    });
  }

  function attachCoreHandlers() {
    if (chargeBtn) {
      chargeBtn.addEventListener("click", handleChargeClick, { passive: true });
    }
    if (spinBtn) {
      spinBtn.addEventListener("click", handleSpin, { passive: true });
    }
    if (guessOptionsContainer) {
      guessOptionsContainer.addEventListener("click", handleGuessClick, {
        passive: true,
      });
    }
    if (hintBtn) {
      hintBtn.addEventListener("click", handleHint, { passive: true });
    }
  }

  function init() {
    // Initial state
    updatePressureDisplay();
    setPrompt(0);

    attachButtonClickFeedback();
    attachCoreHandlers();
    attachUniverseCardHandlers();
  }

  // Ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
