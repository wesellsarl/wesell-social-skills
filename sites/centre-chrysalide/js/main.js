/* Centre Chrysalide – contenu éditable + interactions.
   Pour mettre à jour le site : modifier uniquement DISCIPLINES et TEAM ci-dessous. */

const DISCIPLINES = [
  { id: "logopedie", ico: "💬", title: "Logopédie",
    text: "Bilan et rééducation du langage oral et écrit, de la parole, de la voix et de la déglutition.",
    points: ["Retard de langage, bégaiement", "Dyslexie, dysorthographie, dyscalculie", "Rééducation de la déglutition"],
    for: "Enfants · Adolescents · Adultes" },
  { id: "psychologie", ico: "🌱", title: "Psychologie & life coaching",
    text: "Un espace d'écoute pour traverser une période difficile, mieux se comprendre et retrouver de l'élan.",
    points: ["Anxiété, stress, gestion des émotions", "Soutien à la parentalité", "Accompagnement de projets de vie"],
    for: "Enfants · Adolescents · Adultes" },
  { id: "neuropsychologie", ico: "🧠", title: "Neuropsychologie",
    text: "Évaluation et remédiation des fonctions cognitives : attention, mémoire, fonctions exécutives.",
    points: ["Bilan TDA/H et troubles de l'attention", "Évaluation du potentiel intellectuel", "Remédiation cognitive"],
    for: "Enfants · Adolescents · Adultes" },
  { id: "psychomotricite", ico: "🤸", title: "Psychomotricité",
    text: "Le corps comme point d'appui pour se développer : coordination, équilibre, confiance en soi.",
    points: ["Maladresse, troubles de la coordination", "Graphomotricité", "Régulation tonique et émotionnelle"],
    for: "Tout-petits · Enfants" },
  { id: "kinesitherapie", ico: "🦴", title: "Kinésithérapie",
    text: "Rééducation fonctionnelle et prise en charge des douleurs pour retrouver mobilité et confort.",
    points: ["Rééducation après blessure ou chirurgie", "Douleurs du dos et articulaires"],
    for: "Adolescents · Adultes" },
  { id: "dietetique", ico: "🥗", title: "Diététique",
    text: "Un accompagnement alimentaire personnalisé, réaliste et sans culpabilité.",
    points: ["Équilibre alimentaire, poids", "Alimentation de l'enfant", "Pathologies nécessitant un régime adapté"],
    for: "Enfants · Adolescents · Adultes" },
  { id: "coaching", ico: "📚", title: "Coaching scolaire",
    text: "Méthode de travail, organisation et motivation pour reprendre confiance dans sa scolarité.",
    points: ["Méthodologie et planification", "Préparation aux examens", "Gestion du stress scolaire"],
    for: "Primaire · Secondaire · Supérieur" }
];

/* ⚠ Liste issue d'une ancienne version de la page « Équipe » (© 2015-2021) : À VÉRIFIER avec le centre.
   Champs : name, discipline (id ci-dessus), role, bio (facultatif), photo (facultatif, ex. "assets/team/nom.jpg"),
   booking (facultatif : lien Rosa, Doctoranytime...). Sans booking, le bouton renvoie vers le formulaire. */
const TEAM = [
  { name: "Rajaa Boudiba",   discipline: "logopedie",       role: "Logopède" },
  { name: "Ysaline Genel",   discipline: "logopedie",       role: "Logopède" },
  { name: "Daphné Hillaire", discipline: "logopedie",       role: "Logopède" },
  { name: "Yousra Echaibi",  discipline: "logopedie",       role: "Logopède" },
  { name: "Chloé Donnadieu", discipline: "psychomotricite", role: "Psychomotricienne" },
  { name: "Astrid Galliot",  discipline: "psychomotricite", role: "Psychomotricienne" }
];

const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const initials = n => n.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();

/* Cartes disciplines */
$("#discipline-cards").innerHTML = DISCIPLINES.map(d => `
  <article class="card" id="d-${d.id}">
    <div class="ico" aria-hidden="true">${d.ico}</div>
    <h3>${esc(d.title)}</h3>
    <p>${esc(d.text)}</p>
    <ul>${d.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
    <span class="for">${esc(d.for)}</span>
  </article>`).join("");

/* Options du formulaire */
$("#discipline-select").insertAdjacentHTML("beforeend",
  DISCIPLINES.map(d => `<option value="${d.id}">${esc(d.title)}</option>`).join(""));

/* Équipe + filtres */
const used = DISCIPLINES.filter(d => TEAM.some(t => t.discipline === d.id));
const filters = $("#team-filters");
filters.innerHTML = [`<button type="button" data-f="all" aria-pressed="true">Toute l'équipe</button>`]
  .concat(used.map(d => `<button type="button" data-f="${d.id}" aria-pressed="false">${esc(d.title)}</button>`)).join("");

function renderTeam(f = "all") {
  const list = TEAM.filter(t => f === "all" || t.discipline === f);
  $("#team-grid").innerHTML = list.map(t => `
    <article class="member">
      ${t.photo ? `<img class="avatar" src="${esc(t.photo)}" alt="" loading="lazy" width="84" height="84">`
                : `<div class="avatar" aria-hidden="true">${initials(t.name)}</div>`}
      <h3>${esc(t.name)}</h3>
      <div class="role">${esc(t.role)}</div>
      ${t.bio ? `<p>${esc(t.bio)}</p>` : ""}
      <a class="btn btn-sm btn-ghost" href="${t.booking ? esc(t.booking) : "#rdv"}" ${t.booking ? 'target="_blank" rel="noopener"' : `data-disc="${t.discipline}"`}>Prendre rendez-vous</a>
    </article>`).join("");
}
renderTeam();
filters.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  filters.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
  renderTeam(b.dataset.f);
});
/* Pré-sélectionne la discipline dans le formulaire */
document.addEventListener("click", e => {
  const a = e.target.closest("[data-disc]"); if (a) $("#discipline-select").value = a.dataset.disc;
});

/* Menu mobile */
const toggle = $(".nav-toggle"), nav = $("#nav");
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", open); nav.classList.toggle("open", open);
});
nav.addEventListener("click", e => { if (e.target.closest("a")) { toggle.setAttribute("aria-expanded", false); nav.classList.remove("open"); } });

/* Formulaire (envoi AJAX vers contact.php, repli en POST classique) */
const form = $(".form"), status = $(".form-status");
form.addEventListener("submit", async e => {
  e.preventDefault();
  status.className = "form-status";
  if (!form.checkValidity()) { status.textContent = "Merci de compléter les champs obligatoires (*) et d'accepter la politique de confidentialité."; status.classList.add("err"); form.reportValidity(); return; }
  const btn = form.querySelector("button"); btn.disabled = true; status.textContent = "Envoi en cours…";
  try {
    const r = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { "Accept": "application/json" } });
    const j = await r.json();
    if (!r.ok || !j.ok) throw new Error(j.error || "Erreur");
    status.textContent = "Merci ! Votre demande a bien été envoyée. Nous vous recontactons rapidement.";
    status.classList.add("ok"); form.reset();
  } catch (err) {
    status.innerHTML = 'L\'envoi a échoué. Écrivez-nous à <a href="mailto:info@centrechrysalide.be">info@centrechrysalide.be</a> ou appelez le 02 411 72 92.';
    status.classList.add("err");
  } finally { btn.disabled = false; }
});

$("#year").textContent = new Date().getFullYear();
