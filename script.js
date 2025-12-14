// --- Card interactions, filters, spotlight, tilt ----
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".character-card"); 
  
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
  if (cards.length > 0) {
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    randomCard.classList.add("spotlight");
    setTimeout(() => {
      randomCard.classList.remove("spotlight");
    }, 1600);
  }

  // 3D tilt on hover
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
  });
});

// --- Guess the MC mini-game ---
document.addEventListener("DOMContentLoaded", () => {
  const hints = [
    { name: "Naruto", text: "Dreams of becoming leader of his village and never gives up." },
    { name: "Goku", text: "Loves fighting strong opponents and gets stronger every battle." },
    { name: "Baki", text: "Trains to surpass the strongest creature on Earth, his own father." },
    { name: "Light", text: "Thinks of himself as justice after finding a deadly notebook." },
    { name: "Alucard", text: "An immortal vampire who works for a human organization." },
    { name: "Lelouch", text: "A masked strategist leading a rebellion with a mysterious power." }
  ];

  let currentAnswer = null;

  const hintEl = document.getElementById("quiz-hint");
  const resultEl = document.getElementById("quiz-result");
  const newHintBtn = document.getElementById("new-hint-btn");
  const optionButtons = document.querySelectorAll(".quiz-option");

  if (!hintEl || !newHintBtn || optionButtons.length === 0) return;

  function pickNewHint() {
    const random = hints[Math.floor(Math.random() * hints.length)];
    currentAnswer = random.name;
    hintEl.textContent = random.text;
    resultEl.textContent = "";
    optionButtons.forEach((btn) => btn.classList.remove("correct", "wrong"));
  }

  newHintBtn.addEventListener("click", pickNewHint);

  optionButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!currentAnswer) return;

      const guess = btn.textContent.trim();
      if (guess === currentAnswer) {
        resultEl.textContent = "Correct!";
        btn.classList.add("correct");
      } else {
        resultEl.textContent = `Wrong! It was ${currentAnswer}.`;
        btn.classList.add("wrong");
      }
    });
  });
});

// --- Random MC spin game ---
document.addEventListener("DOMContentLoaded", () => {
  const spinBtn = document.getElementById("spin-btn");
  const spinDisplay = document.getElementById("spin-display");

  const mcs = [
    { name: "Naruto", url: "naruto.html" },
    { name: "Goku", url: "dragon-ball.html" },
    { name: "Baki", url: "baki.html" },
    { name: "Light", url: "light.html" },
    { name: "Alucard", url: "alucard.html" },
    { name: "Lelouch", url: "lelouch.html" }
  ];

  if (!spinBtn || !spinDisplay) return;

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
});
