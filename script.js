// Anime MC Hub – Complete controller: characters + trials + spinner
(function () {
  const body = document.body;

  // ===== CHARACTER DATABASE =====
  const CHARACTER_DATABASE = [
    { name: "Naruto Uzumaki", role: "Protagonist", anime: "Naruto", imageFile: "Naruto.jpg", stats: { power: 95, speed: 90, intel: 75, durability: 92, combat: 88, special: 97 } },
    { name: "Sasuke Uchiha", role: "Rival", anime: "Naruto", imageFile: "sasuke.jpg", stats: { power: 94, speed: 92, intel: 88, durability: 85, combat: 92, special: 95 } },
    { name: "Sakura Haruno", role: "Kunoichi", anime: "Naruto", imageFile: "sakura.jpg", stats: { power: 80, speed: 75, intel: 90, durability: 78, combat: 82, special: 70 } },
    { name: "Kakashi Hatake", role: "Mentor", anime: "Naruto", imageFile: "kakashi.jpg", stats: { power: 92, speed: 88, intel: 95, durability: 88, combat: 93, special: 92 } },
    { name: "Orochimaru", role: "Villain", anime: "Naruto", imageFile: "orochimaru.jpg", stats: { power: 93, speed: 80, intel: 96, durability: 94, combat: 89, special: 98 } },
    { name: "Itachi Uchiha", role: "Prodigy", anime: "Naruto", imageFile: "itachi.jpg", stats: { power: 93, speed: 91, intel: 94, durability: 87, combat: 95, special: 96 } },
    { name: "Minato Namikaze", role: "4th Hokage", anime: "Naruto", imageFile: "minato.jpg", stats: { power: 94, speed: 98, intel: 92, durability: 88, combat: 95, special: 96 } },
    { name: "Madara Uchiha", role: "Legend", anime: "Naruto", imageFile: "madara.png", stats: { power: 98, speed: 94, intel: 93, durability: 96, combat: 97, special: 98 } },
    { name: "Pain", role: "Leader", anime: "Naruto", imageFile: "pain.jpg", stats: { power: 95, speed: 90, intel: 92, durability: 94, combat: 93, special: 97 } },
    { name: "Goku", role: "Saiyan", anime: "Dragon Ball", imageFile: "goku.jpg", stats: { power: 99, speed: 95, intel: 60, durability: 98, combat: 99, special: 95 } },
    { name: "Vegeta", role: "Prince", anime: "Dragon Ball", imageFile: "vegeta.jpg", stats: { power: 97, speed: 93, intel: 85, durability: 96, combat: 96, special: 92 } },
    { name: "Gohan", role: "Hybrid", anime: "Dragon Ball", imageFile: "gohan.jpg", stats: { power: 96, speed: 90, intel: 88, durability: 94, combat: 92, special: 93 } },
    { name: "Frieza", role: "Tyrant", anime: "Dragon Ball", imageFile: "frieza.jpg", stats: { power: 95, speed: 92, intel: 90, durability: 95, combat: 94, special: 93 } },
    { name: "Cell", role: "Android", anime: "Dragon Ball", imageFile: "cell.jpg", stats: { power: 96, speed: 94, intel: 98, durability: 97, combat: 95, special: 96 } },
    { name: "Piccolo", role: "Namekian", anime: "Dragon Ball", imageFile: "piccolo.jpg", stats: { power: 90, speed: 88, intel: 85, durability: 92, combat: 89, special: 88 } },
    { name: "Baki Hanma", role: "Champion", anime: "Baki", imageFile: "baki.jpg", stats: { power: 94, speed: 92, intel: 82, durability: 93, combat: 98, special: 90 } },
    { name: "Yuujiro Hanma", role: "Legend", anime: "Baki", imageFile: "yuujiro.jpg", stats: { power: 99, speed: 94, intel: 88, durability: 98, combat: 99, special: 92 } },
    { name: "Jack Hanma", role: "Convict", anime: "Baki", imageFile: "jack.jpg", stats: { power: 96, speed: 88, intel: 75, durability: 94, combat: 94, special: 85 } },
    { name: "Hanayama Kaoru", role: "Wrestler", anime: "Baki", imageFile: "hanayama.jpg", stats: { power: 95, speed: 85, intel: 70, durability: 96, combat: 92, special: 80 } },
    { name: "Light Yagami", role: "Protagonist", anime: "Death Note", imageFile: "light.jpg", stats: { power: 30, speed: 50, intel: 99, durability: 40, combat: 20, special: 98 } },
    { name: "L Lawliet", role: "Detective", anime: "Death Note", imageFile: "l.jpg", stats: { power: 20, speed: 30, intel: 99, durability: 30, combat: 10, special: 99 } },
    { name: "Lelouch vi Britannia", role: "Strategist", anime: "Code Geass", imageFile: "lelouch.jpg", stats: { power: 40, speed: 60, intel: 98, durability: 50, combat: 65, special: 99 } },
    { name: "Ichigo Kurosaki", role: "Substitute", anime: "Bleach", imageFile: "ichigo.jpg", stats: { power: 95, speed: 93, intel: 70, durability: 92, combat: 94, special: 94 } },
    { name: "Eren Yeager", role: "Soldier", anime: "Attack on Titan", imageFile: "eren.jpg", stats: { power: 88, speed: 85, intel: 75, durability: 90, combat: 86, special: 92 } },
    { name: "Tanjiro Kamado", role: "Demon Slayer", anime: "Demon Slayer", imageFile: "tanjiro.jpg", stats: { power: 85, speed: 88, intel: 72, durability: 84, combat: 90, special: 88 } },
    { name: "Giyu Tomioka", role: "Hashira", anime: "Demon Slayer", imageFile: "giyu.jpg", stats: { power: 92, speed: 90, intel: 85, durability: 88, combat: 93, special: 90 } },
    { name: "Yuji Itadori", role: "Sorcerer", anime: "Jujutsu Kaisen", imageFile: "yuji.jpg", stats: { power: 82, speed: 80, intel: 68, durability: 80, combat: 85, special: 88 } },
    { name: "Gojo Satoru", role: "Sorcerer", anime: "Jujutsu Kaisen", imageFile: "gojo.jpg", stats: { power: 98, speed: 96, intel: 94, durability: 97, combat: 96, special: 99 } },
    { name: "Luffy", role: "Pirate Captain", anime: "One Piece", imageFile: "luffy.jpg", stats: { power: 94, speed: 90, intel: 65, durability: 95, combat: 92, special: 93 } },
    { name: "Zoro", role: "Swordsman", anime: "One Piece", imageFile: "zoro.jpg", stats: { power: 92, speed: 88, intel: 70, durability: 90, combat: 95, special: 85 } },
    { name: "Edward Elric", role: "Alchemist", anime: "Fullmetal Alchemist", imageFile: "edward.jpg", stats: { power: 85, speed: 82, intel: 96, durability: 80, combat: 88, special: 94 } },
    { name: "Gon Freecss", role: "Hunter", anime: "Hunter x Hunter", imageFile: "gon.jpg", stats: { power: 85, speed: 88, intel: 70, durability: 82, combat: 88, special: 85 } },
    { name: "Killua Zoldyck", role: "Assassin", anime: "Hunter x Hunter", imageFile: "killua.jpg", stats: { power: 88, speed: 95, intel: 85, durability: 84, combat: 91, special: 90 } }
  ];

  // ===== DOM refs =====
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
  const characterGrid = document.getElementById("character-grid");

  // ===== State =====
  let pressure = 100;
  let chargeCooldown = false;
  let streak = 0;
  let currentPromptIndex = 0;
  let spinnerLock = false;

  const MC_PROMPTS = [
    {
      prompt: "He once stole a legendary scroll and painted graffiti on faces.",
      answer: "Naruto",
      hints: ["His nindo is louder than any jutsu.", "A fox watches from within."]
    },
    {
      prompt: "He started as a weak boy in orange, then broke limits nobody else could touch.",
      answer: "Goku",
      hints: ["Saiyan blood, Earth heart.", "Gravity training is a normal Tuesday."]
    },
    {
      prompt: "He picked up a notebook and decided the world needed his own justice.",
      answer: "Light",
      hints: ["His partner loves sweets and crouching.", "The shinigami above finds it entertaining."]
    },
    {
      prompt: "He can command anyone with a single look and a word, but the cost is heavy.",
      answer: "Lelouch",
      hints: ["A mask, a rebellion, and a mecha battlefield.", "Chess strategies applied to nations."]
    }
  ];

  const UNIVERSE_NAMES = ["Naruto", "Naruto: Shippuuden", "Fullmetal Alchemist: Brotherhood", "Hunter x Hunter (2011)"];

  // ===== Button feedback =====
  function attachButtonClickFeedback() {
    body.addEventListener("click", (event) => {
      const btn = event.target.closest(".btn");
      if (!btn) return;
      btn.classList.remove("is-clicked");
      requestAnimationFrame(() => {
        btn.classList.add("is-clicked");
        setTimeout(() => btn.classList.remove("is-clicked"), 220);
      });
    });
  }

  // ===== World pressure =====
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
    setTimeout(() => {
      pressure = Math.min(120, oldPressure + 5);
      updatePressureDisplay();
    }, 260);
    setTimeout(() => {
      body.classList.remove("hero-charged");
      chargeCooldown = false;
    }, 800);
  }

  // ===== Fate spinner =====
  function handleSpin() {
    if (spinnerLock) return;
    spinnerLock = true;
    spinnerLabel.textContent = "Spinning...";
    spinnerWheel.classList.add("is-spinning");
    const choice = UNIVERSE_NAMES[Math.floor(Math.random() * UNIVERSE_NAMES.length)];
    setTimeout(() => {
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

  // ===== Guess game =====
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
