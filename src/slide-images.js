export async function preloadSlideImages(root) {
  const failures = await Promise.all(
    Array.from(root.querySelectorAll("img"), async (image) => {
      const source =
        image.getAttribute("data-src") || image.getAttribute("src");
      if (!source) return;

      image.setAttribute("src", source);
      image.removeAttribute("data-src");

      try {
        await image.decode();
      } catch (error) {
        console.error(`Failed to prepare PDF image: ${source}`, error);
        return source;
      }
    }),
  );
  return failures.filter(Boolean);
}

export function manageSlideImages(deck) {
  // Print layout may not have activated yet when initialization resolves.
  if (deck.getConfig().view === "print") return;

  const slides = deck.getSlides();
  const images = new Map(
    slides.map((slide) => [
      slide,
      Array.from(slide.querySelectorAll("img"), (image) => ({
        image,
        source: image.getAttribute("data-src") || image.getAttribute("src"),
      })),
    ]),
  );

  const refresh = () => {
    const currentIndex = deck.getIndices().h;
    const overview = deck.isOverview();

    slides.forEach((slide, index) => {
      const bounds = overview ? slide.getBoundingClientRect() : null;
      const shouldLoad = overview
        ? bounds.width > 0 &&
          bounds.height > 0 &&
          bounds.right > 0 &&
          bounds.bottom > 0 &&
          bounds.left < window.innerWidth &&
          bounds.top < window.innerHeight
        : Math.abs(index - currentIndex) <= 1;

      for (const { image, source } of images.get(slide)) {
        if (!source) continue;
        if (shouldLoad) {
          if (image.getAttribute("src") !== source) {
            image.setAttribute("src", source);
          }
          image.removeAttribute("data-src");
        } else {
          image.setAttribute("data-src", source);
          image.removeAttribute("src");
        }
      }
    });
  };

  const scheduleRefresh = () => queueMicrotask(refresh);
  for (const event of [
    "slidechanged",
    "overviewshown",
    "overviewhidden",
    "resize",
  ]) {
    deck.on(event, scheduleRefresh);
  }

  const observer = new IntersectionObserver(() => {
    if (deck.isOverview()) refresh();
  });
  slides.forEach((slide) => observer.observe(slide));
  refresh();
}
