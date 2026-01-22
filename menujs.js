// Animación extra al cargar
document.querySelectorAll(".menu-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform 0.2s";
  });
});
