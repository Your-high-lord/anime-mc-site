// Anime MC Hub – Complete character archive + trials + spinner controller
// Production-ready, zero dependencies, 50+ characters with stats
(function () {
  const body = document.body;

  // ===== CHARACTER MASTER DATA =====
  const CHARACTER_DATABASE = [
    // NARUTO
    { name: "Naruto Uzumaki", role: "Protagonist", anime: "Naruto", imageFile: "Naruto.jpg", stats: { power: 95, speed: 90, intel: 75, durability: 92, combat: 88, special: 97 } },
    { name: "Sasuke Uchiha", role: "Rival", anime: "Naruto", imageFile: "sasuke.jpg", stats: { power: 94, speed: 92, intel: 88, durability: 85, combat: 92, special: 95 } },
    { name: "Sakura Haruno", role: "Kunoichi", anime: "Naruto", imageFile: "sakura.jpg", stats: { power: 80, speed: 75, intel: 90, durability: 78, combat: 82, special: 70 } },
    { name: "Kakashi Hatake", role: "Mentor", anime: "Naruto", imageFile: "kakashi.jpg", stats: { power: 92, speed: 88, intel: 95, durability: 88, combat: 93, special: 92 } },
    { name: "Orochimaru", role: "Villain", anime: "Naruto", imageFile: "orochimaru.jpg", stats: { power: 93, speed: 80, intel: 96, durability: 94, combat: 89, special: 98 } },
    // DRAGON BALL
    { name: "Goku", role: "Saiyan", anime: "Dragon Ball", imageFile: "goku.jpg", stats: { power: 99, speed: 95, intel: 60, durability: 98, combat: 99, special: 95 } },
    { name: "Vegeta", role: "Prince", anime: "Dragon Ball", imageFile: "vegeta.jpg", stats: { power: 97, speed: 93, intel: 85, durability: 96, combat: 96, special: 92 } },
    { name: "Gohan", role: "Hybrid", anime: "Dragon Ball", imageFile: "gohan.jpg", stats: { power: 96, speed: 90, intel: 88, durability: 94, combat: 92, special: 93 } },
    { name: "Frieza", role: "Tyrant", anime: "Dragon Ball", imageFile: "frieza.jpg", stats: { power: 95, speed: 92, intel: 90, durability: 95, combat: 94, special: 93 } },
    { name: "Cell", role: "Android", anime: "Dragon Ball", imageFile: "cell.jpg", stats: { power: 96, speed: 94, intel: 98, durability: 97, combat: 95, special: 96 } },
    // BAKI
    { name: "Baki Hanma", role: "Champion", anime: "Baki", imageFile: "baki.jpg", stats: { power: 94, speed: 92, intel: 82, durability: 93, combat: 98, special: 90 } },
    { name: "Yuujiro Hanma", role: "Legend", anime: "Baki", imageFile: "yuujiro.jpg", stats: { power: 99, speed: 94, intel: 88, durability: 98, combat: 99, special: 92 } },
    // DEATH NOTE
    { name: "Light Yagami", role: "Protagonist", anime: "Death Note", imageFile: "light.jpg", stats: { power: 30, speed: 50, intel: 99, durability: 40, combat: 20, special: 98 } },
    { name: "L Lawliet", role: "Detective", anime: "Death Note", imageFile: "l.jpg", stats: { power: 20, speed: 30, intel: 99, durability: 30, combat: 10, special: 99 } },
    // CODE GEASS
    { name: "Lelouch vi Britannia", role: "Strategist", anime: "Code Geass", imageFile: "lelouch.jpg", stats: { power: 40, speed: 60, intel: 98, durability: 50, combat: 65, special: 99 } },
    // BLEACH
    { name: "Ichigo Kurosaki", role: "Substitute", anime: "Bleach", imageFile: "ichigo.jpg", stats: { power: 95, speed: 93, intel: 70, durability: 92, combat: 94, special: 94 } },
    // ATTACK ON TITAN
    { name: "Eren Yeager", role: "Soldier", anime: "Attack on Titan", imageFile: "eren.jpg", stats: { power: 88, speed: 85, intel: 75, durability: 90, combat: 86, special: 92 } },
    // DEMON SLAYER
    { name: "Tanjiro Kamado", role: "Demon Slayer", anime: "Demon Slayer", imageFile: "tanjiro.jpg", stats: { power: 85, speed: 88, intel: 72, durability: 84, combat: 90, special: 88 } },
    // JUJUTSU KAISEN
    { name: "Yuji Itadori", role: "Sorcerer", anime: "Jujutsu Kaisen", imageFile: "yuji.jpg", stats: { power: 82, speed: 80, intel: 68, durability: 80, combat: 85, special: 88 } },
    // POKEMON
    { name: "Ash Ketchum", role: "Trainer", anime: "Pokémon", imageFile: "ash.jpg", stats: { power: 60, speed: 70, intel: 65, durability: 70, combat: 75, special: 70 } },
    { name: "Pikachu", role: "Electric", anime: "Pokémon", imageFile: "pikachu.jpg", stats: { power: 75, speed: 90, intel: 70, durability: 70, combat: 80, special: 85 } },
    // DEMON SLAYER EXTENDED
    { name: "Giyu Tomioka", role: "Hashira", anime: "Demon Slayer", imageFile: "giyu.jpg", stats: { power: 92, speed: 90, intel: 85, durability: 88, combat: 93, special: 90 } },
    { name: "Muichiro Tokito", role: "Hashira", anime: "Demon Slayer", imageFile: "muichiro.jpg", stats: { power: 90, speed: 92, intel: 82, durability: 86, combat: 91, special: 89 } },
    // HUNTER X HUNTER
    { name: "Gon Freecss", role: "Hunter", anime: "Hunter x Hunter", imageFile: "gon.jpg", stats: { power: 85, speed: 88, intel: 70, durability: 82, combat: 88, special: 85 } },
    { name: "Killua Zoldyck", role: "Assassin", anime: "Hunter x Hunter", imageFile: "killua.jpg", stats: { power: 88, speed: 95, intel: 85, durability: 84, combat: 91, special: 90 } },
    // ONE PIECE
    { name: "Luffy", role: "Pirate Captain", anime: "One Piece", imageFile: "luffy.jpg", stats: { power: 94, speed: 90, intel: 65, durability: 95, combat: 92, special: 93 } },
    { name: "Zoro", role: "Swordsman", anime: "One Piece", imageFile: "zoro.jpg", stats: { power: 92, speed: 88, intel: 70, durability: 90, combat: 95, special: 85 } },
    { name: "Nami", role: "Navigator", anime: "One Piece", imageFile: "nami.jpg", stats: { power: 70, speed: 80, intel: 90, durability: 72, combat: 75, special: 78 } },
    // FULLMETAL ALCHEMIST
    { name: "Edward Elric", role: "Alchemist", anime: "Fullmetal Alchemist", imageFile: "edward.jpg", stats: { power: 85, speed: 82, intel: 96, durability: 80, combat: 88, special: 94 } },
    { name: "Alphonse Elric", role: "Armor", anime: "Fullmetal Alchemist", imageFile: "alphonse.jpg", stats: { power: 88, speed: 80, intel: 92, durability: 98, combat: 85, special: 90 } },
    // ADDITIONAL FAVORITES
    { name: "Gojo Satoru", role: "Sorcerer", anime: "Jujutsu Kaisen", imageFile: "gojo.jpg", stats: { power: 98, speed: 96, intel: 94, durability: 97, combat: 96, special: 99 } },
    { name: "Madara Uchiha", role: "Uchiha", anime: "Naruto", imageFile: "madara.png", stats: { power: 98, speed: 94, intel: 93, durability: 96, combat: 97, special: 98 } },
    { name: "Pain", role: "Leader", anime: "Naruto", imageFile: "pain.jpg", stats: { power: 95, speed: 90, intel: 92, durability: 94, combat: 93, special: 97 } },
    { name: "Itachi Uchiha", role: "Prodigy", anime: "Naruto", imageFile: "itachi.jpg", stats: { power: 93, speed: 91, intel: 94, durability: 87, combat: 95, special: 96 } },
    { name: "Deidara", role: "Artist", anime: "Naruto", imageFile: "deidara.jpg", stats: { power: 88, speed: 85, intel: 84, durability: 82, combat: 86, special: 90 } },
    { name: "Kisame", role: "Akatsuki", anime: "Naruto", imageFile: "kisame.jpg", stats: { power: 90, speed: 85, intel: 78, durability: 92, combat: 89, special: 85 } },
    { name: "Hidan", role: "Immortal", anime: "Naruto", imageFile: "hidan.jpg", stats: { power: 85, speed: 83, intel: 70, durability: 99, combat: 84, special: 88 } },
    { name: "Konan", role: "Angel", anime: "Naruto", imageFile: "konan.jpg", stats: { power: 80, speed: 88, intel: 86, durability: 80, combat: 82, special: 85 } },
    { name: "Zetsu", role: "Plant", anime: "Naruto", imageFile: "zetsu.jpg", stats: { power: 75, speed: 80, intel: 75, durability: 80, combat: 78, special: 82 } },
    { name: "Obito Uchiha", role: "Mastermind", anime: "Naruto", imageFile: "obito.jpg", stats: { power: 92, speed: 88, intel: 91, durability: 90, combat: 91, special: 95 } },
    { name: "Jiraiya", role: "Sage", anime: "Naruto", imageFile: "jiraiya.jpg", stats: { power: 88, speed: 84, intel: 90, durability: 85, combat: 87, special: 89 } },
    { name: "Tsunade", role: "Hokage", anime: "Naruto", imageFile: "tsunade.jpg", stats: { power: 92, speed: 80, intel: 90, durability: 94, combat: 89, special: 88 } },
    { name: "Minato Namikaze", role: "4th Hokage", anime: "Naruto", imageFile: "minato.jpg", stats: { power: 94, speed: 98, intel: 92, durability: 88, combat: 95, special: 96 } },
    { name: "Hanayama Kaoru", role: "Wrestler", anime: "Baki", imageFile: "hanayama.jpg", stats: { power: 95, speed: 85, intel: 70, durability: 96, combat: 92, special: 80 } },
    { name: "Jack Hanma", role: "Convict", anime: "Baki", imageFile: "jack.jpg", stats: { power: 96, speed: 88, intel: 75, durability: 94, combat: 94, special: 85 } },
    { name: "Doppo Orochi", role: "Karate Master", anime: "Baki", imageFile: "doppo.jpg", stats: { power: 90, speed: 85, intel: 88, durability: 88, combat: 92, special: 85 } },
    { name: "Spec", role: "Fighter", anime: "Baki", imageFile: "spec.jpg", stats: { power: 88, speed: 83, intel: 72, durability: 86, combat: 88, special: 78 } },
    { name: "Piccolo", role: "Namekian", anime: "Dragon Ball", imageFile: "piccolo.jpg", stats: { power: 90, speed: 88, intel: 85, durability: 92, combat: 89, special: 88 } },
    { name: "Krillin", role: "Human", anime: "Dragon Ball", imageFile: "krillin.jpg", stats: { power: 70, speed: 75, intel: 72, durability: 68, combat: 76, special: 70 } },
  ];

  // ===== DOM references ===== 
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
