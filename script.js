document.addEventListener("DOMContentLoaded", () => {
  /* =========================
   * CARD INTERACTIONS
   * filters, spotlight, tilt, ripple
   * ========================= */
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".character-card");

  if (filterButtons.length && cards.length) {
    // Filter buttons
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

    // Random spotlight on one card
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    randomCard.classList.add("spotlight");
    setTimeout(() => {
      randomCard.classList.remove("spotlight");
    }, 1600);

    // 3D tilt + click ripple
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
  }

  /* =========================
   * GUESS THE MC GAME
   * difficulty + streak
   * ========================= */
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
      // Easter egg difficulty toggle: Ctrl + click
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

  /* =========================
   * RANDOM MC SPIN GAME
   * ========================= */
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

  /* =========================
   * WHICH MC ARE YOU? QUIZ
   * ========================= */
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
        resultEl.textContent = `You are most like ${bestMC}!`;
        questionEl.textContent = "Want to try again with different choices?";
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

  /* =========================
   * SCROLL REVEAL + PARALLAX
   * ========================= */
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
        const offset = (rect.top / window.innerHeight) * 10;
        el.style.transform = `translateY(${offset}px)`;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();
});
