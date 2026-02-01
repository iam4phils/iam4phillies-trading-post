let cards = [];

async function loadCards() {
  const response = await fetch("data/cards.json");
  cards = await response.json();
  populateFilters();
  renderCards(cards);
}

function populateFilters() {
  const years = [...new Set(cards.map(c => c.year))].sort();
  const teams = [...new Set(cards.map(c => c.team))].sort();

  const yearFilter = document.getElementById("yearFilter");
  const teamFilter = document.getElementById("teamFilter");

  years.forEach(y => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearFilter.appendChild(opt);
  });

  teams.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t;
    opt.textContent = t;
    teamFilter.appendChild(opt);
  });
}

function renderCards(list) {
  const grid = document.getElementById("cardGrid");
  grid.innerHTML = "";

  list.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${card.front_url}" alt="${card.player}">
      <h3>#${card.number} – ${card.player}</h3>
      <p>${card.team}</p>
      <a class="button" href="card.html?id=${card.id}">View Details</a>
    `;

    grid.appendChild(div);
  });
}

document.getElementById("search").addEventListener("input", e => {
  const term = e.target.value.toLowerCase();
  const filtered = cards.filter(c => c.player.toLowerCase().includes(term));
  renderCards(filtered);
});

document.getElementById("yearFilter").addEventListener("change", () => applyFilters());
document.getElementById("teamFilter").addEventListener("change", () => applyFilters());

function applyFilters() {
  const year = document.getElementById("yearFilter").value;
  const team = document.getElementById("teamFilter").value;

  let filtered = cards;

  if (year) filtered = filtered.filter(c => c.year == year);
  if (team) filtered = filtered.filter(c => c.team == team);

  renderCards(filtered);
}

loadCards();