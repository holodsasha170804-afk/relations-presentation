import Reveal from "reveal.js";
import "reveal.js/reveal.css";
import "reveal.js/theme/white.css";

const deck = new Reveal({
  hash: true,
  transition: "none",
});

await deck.initialize();
