import Reveal from "reveal.js";
import "reveal.js/reveal.css";
import "./styles.css";
import { initializeProgress } from "./progress.js";
import { manageSlideImages, preloadSlideImages } from "./slide-images.js";
import {
  Award,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  createIcons,
  GraduationCap,
  LayoutGrid,
  Lightbulb,
  Link2,
  Scale,
  Search,
  Target,
  Users,
  UsersRound,
  X,
} from "lucide";
import characterUrl from "./assets/slide-01/cover-character.png";
import routeUrl from "./assets/slide-01/cover-route.png?cover-route";
import thomasUrl from "./assets/slide-02/thomas.png";
import felixUrl from "./assets/slide-02/felix.png";
import platformTopUrl from "./assets/slide-04/platform-top.png?definition-layer";
import platformBottomUrl from "./assets/slide-04/platform-bottom.png?definition-layer";
import characterTopBackUrl from "./assets/slide-04/character-top-back.png?definition-layer";
import characterTopLeftUrl from "./assets/slide-04/character-top-left.png?definition-layer";
import characterTopRightUrl from "./assets/slide-04/character-top-right.png?definition-layer";
import characterBottomBackLeftUrl from "./assets/slide-04/character-bottom-back-left.png?definition-layer";
import characterBottomBackRightUrl from "./assets/slide-04/character-bottom-back-right.png?definition-layer";
import characterBottomFrontLeftUrl from "./assets/slide-04/character-bottom-front-left.png?definition-layer";
import characterBottomFrontRightUrl from "./assets/slide-04/character-bottom-front-right.png?definition-layer";
import connectionsRedTopUrl from "./assets/slide-04/connections-red-top.png?definition-layer";
import connectionsRedBottomUrl from "./assets/slide-04/connections-red-bottom.png?definition-layer";
import connectionsWhiteUrl from "./assets/slide-04/connections-white.png?definition-layer";
import granovetterUrl from "./assets/slide-05/mark-granovetter.jpeg";
import jobOfferUrl from "./assets/slide-05/job-offer.png";
import linkedinCharacterUrl from "./assets/slide-06/linkedin-character.png";
import linkedinLogoUrl from "./assets/slide-06/linkedin-logo.png";
import thomasResolutionUrl from "./assets/slide-07/thomas.png";
import thomasNetworkUrl from "./assets/slide-07/thomas-network.png";
import felixResolutionUrl from "./assets/slide-07/felix.png";
import felixNetworkUrl from "./assets/slide-07/felix-network.png";
import tableCharactersUrl from "./assets/slide-08/characters-at-table.png";
import growthBubbleUrl from "./assets/slide-08/speech-bubble-growth.png";
import codeBubbleUrl from "./assets/slide-08/speech-bubble-code.png";
import benUrl from "./assets/slide-09/ben.png";
import maximilianUrl from "./assets/slide-09/maximilian.png";
import conclusionCharactersUrl from "./assets/slide-10/characters-layer.png";
import conclusionPlatformUrl from "./assets/slide-10/platform-layer.png";

/* ---------------------------------------------------------------------------
 * Markup helpers
 *
 * Every slide wears the same chrome (dot grids, header grid, frame); only the
 * body differs. Building that chrome from helpers keeps the six slides on one
 * grid and removes the copy-pasted markup they used to carry.
 *
 * Hard rule: a slide body must never contain a <section>. Reveal reads a
 * nested section as a vertical slide, turns the parent into a `.stack` and
 * applies `pointer-events: none` to the whole slide. Use a <div> layer.
 * ------------------------------------------------------------------------- */

const FRAME_EDGES = ["top", "right", "bottom", "left"];
const FRAME_CORNERS = ["tl", "tr", "br", "bl"];

/** Thin white inset lines plus red corner brackets. Purely decorative. */
const frame = () => `
    <div class="slide-frame u-layer" aria-hidden="true">
      ${FRAME_EDGES.map((edge) => `<i class="frame-line frame-line-${edge}"></i>`).join("")}
      ${FRAME_CORNERS.map((corner) => `<i class="frame-corner frame-corner-${corner}"></i>`).join("")}
    </div>`;

/** White dot grids, anchored to the same coordinates on every slide. */
const dots = () => `
    <div class="dot-grid dot-grid-top" aria-hidden="true"></div>
    <div class="dot-grid dot-grid-bottom" aria-hidden="true"></div>`;

/** Number badge, title and accent line on the shared header grid. */
const header = ({ number, title, subtitle }) => `
    <div class="slide-header">
      <div class="slide-badge">${number}</div>
      <h2 class="slide-title">${title}</h2>
      ${subtitle ? `<p class="slide-subtitle">${subtitle}</p>` : ""}
      <div class="accent-line" aria-hidden="true"></div>
    </div>`;

/** One horizontal slide: shared chrome around a slide-specific body. */
const slide = ({ name, label, head, body }) => `
  <section class="${name}-slide" aria-label="${label}">
    ${dots()}
    ${head}
    ${body.replace(/<img\b([^>]*?)\bsrc=/g, '<img decoding="async"$1data-src=')}
    ${frame()}
  </section>`;

const definitionImage = (className, image, alt = "") =>
  `<img class="${className}" src="${image.src}" style="${image.style}" alt="${alt}" />`;

/* ---------------------------------------------------------------------------
 * Slides
 * ------------------------------------------------------------------------- */

const SLIDES = [
  {
    name: "cover",
    label: "Warum Können allein manchmal nicht reicht",
    head: `
    <div class="slide-header cover-header">
      <div class="slide-badge">01</div>
      <h1 class="cover-title">Warum Können allein<br />manchmal <span>nicht reicht</span></h1>
      <div class="accent-line" aria-hidden="true"></div>
      <p class="cover-author">Oleksandr Kholod</p>
    </div>`,
    body: `
    <div class="cover-artwork u-layer">
      <img class="cover-route" src="${routeUrl}" alt="Steinpfad zu einem Pokal" />
      <img class="cover-character" src="${characterUrl}" alt="Nachdenklicher Charakter mit Rucksack, Büchern und Laptop" />
    </div>`,
  },
  {
    name: "comparison",
    label: "Gleiche Voraussetzungen",
    head: header({ number: "02", title: "Gleiche Voraussetzungen" }),
    body: `
    <div class="comparison-stage u-layer">
      <div class="participant participant-left">
        <div class="speech-bubble">bleibt vor allem<br />im eigenen Kreis<i aria-hidden="true"></i></div>
        <img src="${thomasUrl}" alt="Thomas, ein zurückhaltender Entwickler" />
        <div class="nameplate">Thomas</div>
      </div>
      <div class="participant participant-right">
        <div class="speech-bubble">vernetzt sich mit Menschen<br />aus verschiedenen Bereichen<i aria-hidden="true"></i></div>
        <img src="${felixUrl}" alt="Felix, ein offener Entwickler" />
        <div class="nameplate">Felix</div>
      </div>
    </div>
    <div class="comparison-cards" aria-label="Gemeinsame Voraussetzungen">
      <article class="comparison-card u-surface"><span class="icon-tile"><i data-lucide="graduation-cap"></i></span><span>gleiche<br />Ausbildung</span></article>
      <article class="comparison-card u-surface"><span class="icon-tile"><i data-lucide="briefcase-business"></i></span><span>gleiche<br />Erfahrung</span></article>
      <article class="comparison-card u-surface"><span class="icon-tile"><i data-lucide="award"></i></span><span>gleiche<br />Qualifikation</span></article>
    </div>
    <div class="comparison-question u-surface fragment" data-fragment-index="0"><span class="question-icon"><i data-lucide="circle-help"></i></span><span>Haben beide deshalb auch die gleichen Chancen?</span></div>`,
  },
  {
    name: "outline",
    label: "Gliederung",
    head: header({ number: "03", title: "Gliederung" }),
    body: `
    <div class="outline-content">
      <div class="outline-timeline" aria-hidden="true"><i></i><b></b><b></b><b></b><b></b></div>
      <div class="outline-items">
        <article class="outline-item u-surface"><span class="outline-icon"><i data-lucide="book-open"></i></span><div><h3>Begriffklärung</h3><p>Wichtige Konzepte und Beziehungen</p></div></article>
        <article class="outline-item u-surface"><span class="outline-icon"><i data-lucide="bar-chart-3"></i></span><div><h3>Statistik</h3><p>Ergebnisse der Untersuchung</p></div></article>
        <article class="outline-item u-surface"><span class="outline-icon"><i data-lucide="search"></i></span><div><h3>Analyse</h3><p>Einordnung und Handlungsempfehlungen</p></div></article>
        <article class="outline-item u-surface"><span class="outline-icon"><i data-lucide="lightbulb"></i></span><div><h3>Fazit</h3><p>Zentrale Erkenntnisse und Ausblick</p></div></article>
      </div>
    </div>`,
  },
  {
    name: "definition",
    label: "Begriffsklärung",
    head: header({ number: "04", title: "Begriffsklärung" }),
    body: `
    <div class="definition-strong u-layer fragment" data-fragment-index="0">
      <article class="binding-card binding-card-strong u-surface">
        <span class="binding-icon"><i data-lucide="users-round"></i></span>
        <div><h3><em>Starke</em> Bindungen</h3><ul><li>enge Kontakte</li><li>regelmäßiger Austausch</li><li>hohes Vertrauen</li></ul></div>
      </article>
      <div class="definition-diagram u-layer" aria-hidden="true">
        <div class="definition-platforms u-layer">
          ${definitionImage("definition-platform-top", platformTopUrl)}
          ${definitionImage("definition-platform-bottom", platformBottomUrl)}
        </div>
        <div class="definition-links u-layer">
          ${definitionImage("definition-link-top", connectionsRedTopUrl)}
          ${definitionImage("definition-link-bottom", connectionsRedBottomUrl)}
        </div>
        <div class="definition-people u-layer">
          ${definitionImage("definition-person-top", characterTopBackUrl)}
          ${definitionImage("definition-person-top", characterTopLeftUrl)}
          ${definitionImage("definition-person-top", characterTopRightUrl)}
          ${definitionImage("definition-person-bottom", characterBottomBackLeftUrl)}
          ${definitionImage("definition-person-bottom", characterBottomBackRightUrl)}
          ${definitionImage("definition-person-bottom", characterBottomFrontLeftUrl)}
          ${definitionImage("definition-person-bottom definition-person-shift", characterBottomFrontRightUrl)}
        </div>
      </div>
    </div>
    <div class="definition-weak u-layer fragment" data-fragment-index="1">
      <article class="binding-card binding-card-weak u-surface"><span class="binding-icon"><i data-lucide="users"></i></span><div><h3>Schwache Bindungen</h3><ul><li>lockere Kontakte</li><li>seltenere Kommunikation</li><li>verbinden verschiedene<br />Kreise</li></ul></div></article>
      ${definitionImage("definition-weak-links", connectionsWhiteUrl, "Punktierte schwache Verbindungen")}
    </div>`,
  },
  {
    name: "research",
    label: "Die Forschung hinter der Theorie",
    head: header({ number: "05", title: "Die Forschung hinter der Theorie" }),
    body: `
    <aside class="researcher-card" aria-label="Informationen zu Mark Granovetter">
      <img src="${granovetterUrl}" alt="Mark Granovetter" />
      <div class="researcher-details"><h3>Mark<br />Granovetter</h3><span>1973</span><p><em>Die Stärke schwacher<br />Bindungen</em></p></div>
      <div class="researcher-sample"><strong>282</strong><span>untersuchte<br />Berufswechsler</span></div>
    </aside>
    <i class="research-divider" aria-hidden="true"></i>
    <div class="research-results" aria-label="Ergebnisse der Untersuchung">
      <h3>Wie häufig sahen sie ihren Kontakt?</h3>
      <p class="research-basis">Basis: 54 Personen mit Jobinformationen über Kontakte</p>
      <article class="frequency-row frequency-often fragment" data-fragment-index="0"><div class="frequency-heading"><h4>Häufig</h4><strong>16,7 %</strong></div><p>Mindestens zweimal pro Woche</p><div class="frequency-track"><i></i></div></article>
      <article class="frequency-row frequency-sometimes fragment" data-fragment-index="1"><div class="frequency-heading"><h4>Gelegentlich</h4><strong>55,6 %</strong></div><p>Häufiger als einmal im Jahr, aber seltener als zweimal pro Woche</p><div class="frequency-track"><i></i></div></article>
      <article class="frequency-row frequency-rarely fragment" data-fragment-index="2"><div class="frequency-heading"><h4>Selten</h4><strong>27,8 %</strong></div><p>Einmal im Jahr oder seltener</p><div class="frequency-track"><i></i></div></article>
    </div>
    <div class="research-artwork u-layer" aria-hidden="true"><img src="${jobOfferUrl}" alt="" /></div>
    <div class="research-insight u-callout fragment" data-fragment-index="2"><span>ZENTRALE ERKENNTNIS</span><strong>Neue Chancen entstehen oft außerhalb des engsten Freundeskreises.</strong></div>`,
  },
  {
    name: "linkedin",
    label: "LinkedIn-Studie 2022",
    head: header({
      number: "06",
      title: "LinkedIn-Studie 2022",
      subtitle: "A Causal Test of the Strength of Weak Ties",
    }),
    body: `
    <div class="linkedin-scene u-layer">
      <div class="linkedin-chart" role="img" aria-label="Geschätzte Wahrscheinlichkeit einer Jobvermittlung nach Anzahl gemeinsamer Kontakte: Maximum von etwa 0,37 Prozent bei rund 10 gemeinsamen Kontakten">
        <div class="linkedin-chart-heading" aria-hidden="true">
          <span class="linkedin-chart-icon"><i data-lucide="bar-chart-3"></i></span>
          <strong>Vermittlungswahrscheinlichkeit</strong>
        </div>
        <div class="linkedin-chart-caption">Wahrscheinlichkeit</div>
        <div class="linkedin-chart-ticks"><span>0,4 %</span><span>0,3 %</span><span>0,2 %</span><span>0,1 %</span><span>0 %</span></div>
        <svg class="linkedin-chart-graphic" viewBox="0 0 1000 390" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="linkedin-chart-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="chart-area-stop-top" /><stop offset="1" class="chart-area-stop-bottom" /></linearGradient><marker id="linkedin-chart-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="chart-arrow" d="M0,0 L10,5 L0,10 Z" /></marker></defs><path class="chart-grid" d="M46 252H938M46 184H938M46 116H938M46 48H938"/><path class="chart-area" d="M105 274 C260 220 404 95 530 94 C662 94 778 222 905 278 L905 320 L105 320 Z"/><path class="chart-axis-x" d="M46 320H938" marker-end="url(#linkedin-chart-arrow)"/><path class="chart-axis-y" d="M46 320V48" marker-end="url(#linkedin-chart-arrow)"/><path class="chart-curve" d="M105 274 C260 220 404 95 530 94 C662 94 778 222 905 278"/><path class="chart-guide" d="M530 94V320"/><circle class="chart-dot" cx="105" cy="274" r="8"/><circle class="chart-focus" cx="530" cy="94" r="17"/><circle class="chart-dot" cx="905" cy="278" r="8"/></svg>
        <div class="linkedin-chart-peak">≈ 0,37 %</div>
        <div class="linkedin-chart-label linkedin-chart-start">0 – 2</div>
        <div class="linkedin-chart-label linkedin-chart-focus">≈ 10</div>
        <div class="linkedin-chart-label linkedin-chart-end">20+</div>
        <div class="linkedin-chart-title">Gemeinsame Kontakte</div>
      </div>
      <img class="linkedin-character" src="${linkedinCharacterUrl}" alt="Figur mit LinkedIn-Laptop" />
    </div>
    <img class="linkedin-logo" src="${linkedinLogoUrl}" alt="LinkedIn" />
    <div class="linkedin-metrics" aria-label="Studienkennzahlen">
      <article class="u-surface"><i data-lucide="users-round"></i><div><strong>20 Mio.</strong><span>Teilnehmer</span></div></article>
      <article class="u-surface"><i data-lucide="link-2"></i><div><strong>2 Mrd.</strong><span>neue Kontakte</span></div></article>
      <article class="u-surface"><i data-lucide="briefcase-business"></i><div><strong>600.000</strong><span>Jobwechsel</span></div></article>
    </div>
    <div class="linkedin-result u-callout"><span>ERGEBNIS</span><strong>Am wirksamsten waren Kontakte mit etwa 10 gemeinsamen Kontakten.</strong></div>`,
  },
  {
    name: "resolution",
    label: "Auflösung: Thomas und Felix",
    head: header({ number: "07", title: "Auflösung: Thomas und Felix" }),
    body: `
    <div class="resolution-scene u-layer">
      <div class="resolution-accent-line" aria-hidden="true"></div>
      <article class="resolution-panel resolution-panel-thomas u-surface" aria-label="Thomas: überwiegend enge Kontakte und weniger Jobchancen">
        <img class="resolution-person" src="${thomasResolutionUrl}" alt="Thomas" />
        <span class="resolution-name">Thomas</span>
        <img class="resolution-network resolution-network-thomas fragment" data-fragment-index="0" src="${thomasNetworkUrl}" alt="Enges Netzwerk von Thomas mit einer Jobchance" />
        <ul class="resolution-points fragment" data-fragment-index="0"><li>überwiegend enge Kontakte</li><li>ähnliche Informationen</li><li>weniger Jobchancen</li></ul>
      </article>
      <article class="resolution-panel resolution-panel-felix u-surface" aria-label="Felix: Kontakte über den Freundeskreis hinaus und zusätzliche Jobchancen">
        <img class="resolution-person" src="${felixResolutionUrl}" alt="Felix" />
        <span class="resolution-name">Felix</span>
        <img class="resolution-network resolution-network-felix fragment" data-fragment-index="1" src="${felixNetworkUrl}" alt="Breites Netzwerk von Felix mit mehreren Jobchancen" />
        <ul class="resolution-points fragment" data-fragment-index="1"><li>Kontakte über den Freundeskreis hinaus</li><li>Zugang zu neuen Informationen</li><li>zusätzliche Jobchancen</li></ul>
      </article>
    </div>`,
  },
  {
    name: "perspectives",
    label: "Andere Menschen, andere Perspektiven",
    head: header({
      number: "08",
      title: "Andere Menschen, andere Perspektiven",
    }),
    body: `
    <div class="perspectives-dot-left" aria-hidden="true"></div>
    <div class="perspectives-scene u-layer" aria-hidden="true">
      <img class="perspectives-table" src="${tableCharactersUrl}" alt="" />
      <img class="perspectives-bubble perspectives-bubble-code" src="${codeBubbleUrl}" alt="" />
      <img class="perspectives-bubble perspectives-bubble-growth" src="${growthBubbleUrl}" alt="" />
    </div>
    <div class="perspectives-insights" aria-label="Vorteile unterschiedlicher Perspektiven">
      <article class="perspectives-insight u-surface" style="--i: 1"><span class="perspectives-check"><i data-lucide="check"></i></span><i class="perspectives-divider" aria-hidden="true"></i><strong>neue<br />Erfahrungen</strong></article>
      <article class="perspectives-insight u-surface" style="--i: 2"><span class="perspectives-check"><i data-lucide="check"></i></span><i class="perspectives-divider" aria-hidden="true"></i><strong>andere<br />Sichtweisen</strong></article>
      <article class="perspectives-insight u-surface" style="--i: 3"><span class="perspectives-check"><i data-lucide="check"></i></span><i class="perspectives-divider" aria-hidden="true"></i><strong>breiteres<br />Netzwerk</strong></article>
    </div>`,
  },
  {
    name: "critique",
    label: "Kritik: Networking um jeden Preis?",
    head: header({ number: "09", title: "Kritik: Networking um jeden Preis?" }),
    body: `
    <div class="critique-dot-left" aria-hidden="true"></div>
    <div class="critique-scene u-layer" aria-hidden="true">
      <img class="critique-person critique-person-ben" src="${benUrl}" alt="" />
      <img class="critique-person critique-person-maximilian fragment" data-fragment-index="0" src="${maximilianUrl}" alt="" />
    </div>
    <article class="critique-card critique-card-ben u-surface" aria-label="Kritik an Ben">
      <span class="critique-name">Ben</span>
      <h3>Viele Kontakte,<br />wenig Können</h3>
      <i class="critique-rule" aria-hidden="true"></i>
      <ul><li><span><i data-lucide="x"></i></span>sehr großes Netzwerk</li><li><span><i data-lucide="x"></i></span>kaum Fachkenntnisse</li><li><span><i data-lucide="x"></i></span>nutzt Chancen nicht</li></ul>
    </article>
    <article class="critique-card critique-card-maximilian u-surface fragment" data-fragment-index="0" aria-label="Kritik an Maximilian">
      <span class="critique-name">Maximilian</span>
      <h3>Nehmen,<br />ohne zu geben</h3>
      <i class="critique-rule" aria-hidden="true"></i>
      <ul><li><span><i data-lucide="x"></i></span>kontaktiert andere<br />nur bei Bedarf</li><li><span><i data-lucide="x"></i></span>selten Unterstützung</li><li><span><i data-lucide="x"></i></span>verliert langfristig<br />Vertrauen</li></ul>
    </article>`,
  },
  {
    name: "conclusion",
    label: "Fazit",
    head: header({ number: "10", title: "Fazit" }),
    body: `
    <div class="conclusion-scene u-layer" aria-hidden="true">
      <img class="conclusion-platform" src="${conclusionPlatformUrl}" alt="" />
      <img class="conclusion-characters" src="${conclusionCharactersUrl}" alt="" />
    </div>
    <div class="conclusion-statement">
      <h3>Kontakte öffnen nicht nur Türen,<br />sondern auch <em>neue Perspektiven.</em></h3>
      <i aria-hidden="true"></i>
    </div>
    <article class="conclusion-summary u-surface" aria-label="Zentrale Schlussfolgerungen">
      <div class="conclusion-summary-row"><i data-lucide="target"></i><strong>Zugang zu Informationen</strong></div>
      <div class="conclusion-summary-row"><i data-lucide="users-round"></i><strong>Erweiterung des eigenen<br />Horizonts</strong></div>
      <div class="conclusion-summary-row"><i data-lucide="scale"></i><strong>ersetzen aber weder<br />Kompetenz noch Fairness</strong></div>
    </article>`,
  },
  {
    name: "sources",
    label: "Quellenverzeichnis",
    head: header({ number: "11", title: "Quellenverzeichnis" }),
    body: `
    <div class="sources-board u-layer" aria-label="Quellenverzeichnis">
      <article class="source-card source-card-one u-surface" style="--i: 1">
        <span class="source-index">01</span>
        <h3>Granovetter, M. S. <span>(1973)</span></h3>
        <p class="source-title"><em>The Strength of Weak Ties.</em></p>
        <p class="source-meta">American Journal of Sociology, 78(6), S. 1360–1380.</p>
        <div class="source-links"><a href="https://doi.org/10.1086/225469" target="_blank" rel="noreferrer">Original</a><a href="https://snap.stanford.edu/class/cs224w-readings/granovetter73weakties.pdf" target="_blank" rel="noreferrer">Volltext</a></div>
      </article>
      <article class="source-card source-card-two u-surface" style="--i: 2">
        <span class="source-index">02</span>
        <h3>Granovetter, M. S. <span>(1974)</span></h3>
        <p class="source-title"><em>Getting a Job: A Study of Contacts and Careers.</em></p>
        <p class="source-meta">Harvard University Press.</p>
        <div class="source-links"><a href="https://books.google.com/books?id=loCRAAAAIAAJ" target="_blank" rel="noreferrer">Originalausgabe</a><a href="https://eric.ed.gov/?id=ED394056" target="_blank" rel="noreferrer">Zusammenfassung</a></div>
      </article>
      <article class="source-card source-card-three u-surface" style="--i: 3">
        <span class="source-index">03</span>
        <h3>Rajkumar, K. et al. <span>(2022)</span></h3>
        <p class="source-title"><em>A Causal Test of the Strength of Weak Ties.</em></p>
        <p class="source-meta">Science, 377(6612), S. 1304–1310.</p>
        <div class="source-links"><a href="https://doi.org/10.1126/science.abl4476" target="_blank" rel="noreferrer">Original</a><a href="https://ide.mit.edu/wp-content/uploads/2022/09/abl4476.pdf" target="_blank" rel="noreferrer">Volltext</a></div>
      </article>
      <article class="source-card source-card-four u-surface" style="--i: 4">
        <span class="source-index">04</span>
        <h3>Bildquelle: Mark Granovetter</h3>
        <p class="source-title">Stanford University <span>(2023)</span></p>
        <p class="source-meta">Foto: Do Pham.</p>
        <div class="source-links"><a href="https://news.stanford.edu/stories/2023/07/strength-weak-ties" target="_blank" rel="noreferrer">Stanford University</a></div>
      </article>
    </div>`,
  },
];

document.querySelector(".slides").innerHTML = SLIDES.map(slide).join("\n");

document.querySelector(".reveal").insertAdjacentHTML(
  "beforeend",
  `
    <nav class="presentation-controls" lang="ru" aria-label="Управление презентацией">
      <button type="button" class="presentation-button" data-action="previous" aria-label="Предыдущий слайд" title="Предыдущий слайд">
        <i data-lucide="chevron-left"></i>
      </button>
      <button type="button" class="presentation-button presentation-button-overview" data-action="overview" aria-label="Обзор слайдов (Esc)" title="Обзор слайдов (Esc)">
        <i data-lucide="layout-grid"></i>
      </button>
      <button type="button" class="presentation-button" data-action="next" aria-label="Следующий слайд" title="Следующий слайд">
        <i data-lucide="chevron-right"></i>
      </button>
    </nav>
  `,
);

createIcons({
  icons: {
    Award,
    BarChart3,
    BookOpen,
    BriefcaseBusiness,
    Check,
    ChevronLeft,
    ChevronRight,
    CircleHelp,
    GraduationCap,
    LayoutGrid,
    Lightbulb,
    Link2,
    Scale,
    Search,
    Target,
    Users,
    UsersRound,
    X,
  },
});

/* ---------------------------------------------------------------------------
 * Deck
 * ------------------------------------------------------------------------- */

// Load before Reveal clones slides for fragment pages in the PDF layout.
const isPrintView = /print-pdf/gi.test(window.location.search);
const pdfMode = new URLSearchParams(window.location.search).get("pdf-mode");
let pdfImageErrors = [];
if (isPrintView) {
  document.documentElement.dataset.pdfState = "loading";
  pdfImageErrors = await preloadSlideImages(document.querySelector(".slides"));
}

const deck = new Reveal({
  hash: true,
  transition: "none",
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.1,
  center: false,
  controls: false,
  progress: false,
  viewDistance: 2,
  mobileViewDistance: 2,
  pdfPageHeightOffset: 0,
  pdfMaxPagesPerSlide: 1,
  pdfSeparateFragments: pdfMode !== "final",
  view: isPrintView ? "print" : "slide",
});

// PDF fragment pages contain cloned images; wait for those to decode too.
deck.on("pdf-ready", async () => {
  const failures = await preloadSlideImages(document.querySelector(".slides"));
  const errors = [...new Set([...pdfImageErrors, ...failures])];
  document.documentElement.dataset.pdfErrors = JSON.stringify(errors);
  document.documentElement.dataset.pdfState = errors.length ? "error" : "ready";
});

await deck.initialize();
manageSlideImages(deck);
initializeProgress(deck);

let lastHorizontalIndex = deck.getIndices().h;

const syncDefinitionReturnState = ({ indexh, currentSlide }) => {
  const definitionSlide = document.querySelector(".definition-slide");
  const isReturningToDefinition =
    currentSlide === definitionSlide && indexh < lastHorizontalIndex;

  definitionSlide.classList.toggle("is-returning", isReturningToDefinition);
  lastHorizontalIndex = indexh;
};

deck.on("slidechanged", syncDefinitionReturnState);

const presentationControls = document.querySelector(".presentation-controls");
const previousButton = presentationControls.querySelector(
  '[data-action="previous"]',
);
const nextButton = presentationControls.querySelector('[data-action="next"]');
const overviewButton = presentationControls.querySelector(
  '[data-action="overview"]',
);

const updateNavigationControls = () => {
  const { h } = deck.getIndices();
  const isLastSlide = h === deck.getTotalSlides() - 1;
  const hasHiddenFragment = Boolean(
    deck.getCurrentSlide().querySelector(".fragment:not(.visible)"),
  );
  const hasVisibleFragment = Boolean(
    deck.getCurrentSlide().querySelector(".fragment.visible"),
  );

  previousButton.disabled = h === 0 && !hasVisibleFragment;
  nextButton.disabled = isLastSlide && !hasHiddenFragment;
  previousButton.hidden = previousButton.disabled;
  nextButton.hidden = nextButton.disabled;
  if (
    (previousButton.hidden && document.activeElement === previousButton) ||
    (nextButton.hidden && document.activeElement === nextButton)
  ) {
    overviewButton.focus({ preventScroll: true });
  }
  overviewButton.setAttribute("aria-pressed", String(deck.isOverview()));
};

for (const event of [
  "slidechanged",
  "fragmentshown",
  "fragmenthidden",
  "overviewshown",
  "overviewhidden",
]) {
  deck.on(event, updateNavigationControls);
}

updateNavigationControls();

presentationControls.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button || button.disabled || button.hidden) return;

  const { action } = button.dataset;
  if (action === "previous") deck.prev();
  if (action === "next") deck.next();
  if (action === "overview") {
    deck.toggleOverview();
    updateNavigationControls();
  }
});
