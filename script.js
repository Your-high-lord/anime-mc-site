// Simple micro-interactions for Anime MC Hub

// 1. Character filter buttons
document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll(".character-card");

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

  // 2. Random spotlight on load
  if (cards.length > 0) {
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    randomCard.classList.add("spotlight");
    setTimeout(() => {
      randomCard.classList.remove("spotlight");
    }, 1600);
  }

  // 3. Tiny tilt effect on mouse move for cards
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
