// Anime MC Hub – single, clean interaction controller
// Works with index.html structure you pasted (hero, universes, MC trials, spinner).

(function () {
  const body = document.body;

  // --- DOM references ---
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

  // --- State ---
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

  // --- Utility: shared button click ripple (no extra DOM) ---
  function attachButtonClickFeedback() {
    body.addEventListener("click", (event) => {
      const btn = event.target.closest(".btn");
      if (!btn) return;

      btn.classList.remove("is-clicked");
      window.requestAnimationFrame(() => {
        btn.classList.add("is-clicked");
        window.setTimeout(() => {
          btn.classList.remove("is-clicked");
        }, 220);
      });
    });
  }

  // --- World pressure logic ---
  function updatePressureDisplay() {
    const clamped = Math.max(0, Math.min(120, pressure));
    worldPressureValue.textContent = clamped + "%";

    const scale = Math.min(1.2, clamped / 100);
    worldPressureFill.style.transform = "scaleX(" + scale + ")";
  }

  function handleChargeClick() {
    if (chargeCooldown) return;
    chargeCooldown = true;

    const oldPressure = pressure;
    pressure = Math.max(40, pressure - 10);
    updatePressureDisplay();

    body.classList.add("hero-charged");

    window.setTimeout(() => {
      pressure = Math.min(120, oldPressure + 5);
      updatePressureDisplay();
    }, 260);

    window.setTimeout(() => {
      body.classList.remove("hero-charged");
      chargeCooldown = false;
    }, 800);
  }

  // --- Fate spinner logic ---
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
    if (!universeGrid) return;
    const cards = universeGrid.querySelectorAll(".universe-card");
    cards.forEach((card) => {
      card.classList.remove("is-active");
      if (card.dataset.universe === name) {
        card.classList.add("is-active");
      }
    });
  }

  // --- Guess game logic ---
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
    const current = MC_PROMPTS[currentPromptIndex];

    if (selected === current.answer) {
      streak += 1;
      guessFeedback.textContent = "Correct. Resolve recognized.";
      pressure = Math.min(120, pressure + 5);
    } else {
      streak = 0;
      guessFeedback.textContent = "Missed. The system resets your streak.";
      pressure = Math.max(0, pressure - 5);
    }

    streakValue.textContent = String(streak);
    updatePressureDisplay();
  }

  function handleHint() {
    const data = MC_PROMPTS[currentPromptIndex];
    const hints = data.hints || [];
    if (!hints.length) return;
    const hint = hints[Math.floor(Math.random() * hints.length)];
    guessFeedback.textContent = hint;
  }

  // --- Wiring listeners (no scroll, all lightweight) ---
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

  // --- Init ---
  function init() {
    updatePressureDisplay();
    setPrompt(0);
    attachButtonClickFeedback();
    attachCoreHandlers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
