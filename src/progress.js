export function initializeProgress(deck) {
  const progress = document.createElement("div");
  progress.className = "presentation-progress";
  progress.setAttribute("role", "progressbar");
  progress.setAttribute("aria-label", "Präsentationsfortschritt");
  progress.setAttribute("aria-valuemin", "0");
  progress.setAttribute("aria-valuemax", "100");
  const bar = document.createElement("span");
  progress.appendChild(bar);
  deck.getRevealElement().appendChild(progress);

  const update = () => {
    const lastIndex = deck.getTotalSlides() - 1;
    const fraction = lastIndex > 0 ? deck.getIndices().h / lastIndex : 0;
    bar.style.transform = `scaleX(${fraction})`;
    progress.setAttribute("aria-valuenow", String(Math.round(fraction * 100)));
  };

  progress.addEventListener("click", (event) => {
    const bounds = progress.getBoundingClientRect();
    if (bounds.width <= 0) return;
    const fraction = Math.max(
      0,
      Math.min(1, (event.clientX - bounds.left) / bounds.width),
    );
    deck.slide(Math.round(fraction * (deck.getTotalSlides() - 1)));
  });

  deck.on("slidechanged", update);
  update();
}
