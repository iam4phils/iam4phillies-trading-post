// Global card storage
let allCards = [];
let filteredCards = [];

// Load cards for a specific year OR all years
async function loadCards(year) {
  allCards = [];

  if (year) {
    // Load only the selected year
    const file = `data/topps_baseball_${year}.json`;
    const res = await fetch(file);
    const data = await res.json();
    allCards = data;
  } else {
    // Load ALL years when no year is selected
    const years = [1985, 1986, 1987, 1988, 1989];

    for (const y of years) {
      const file = `data/topps_baseball_${y}.json`;
      try {
        const res = await fetch(file);
        const data = await res.json();
        allCards = allCards.concat(data);
      } catch (e) {
        console.warn(`Missing or unreadable file: ${file}`);
      }
    }
  }

  populateTeams();
  applyFilters();
}

// Populate team dropdown dynamically
function populateTeams() {
  const teamFilter = document.getElementById("teamFilter");
  const selectedTeam = teamFilter.value;

  // Clear existing options
  teamFilter.innerHTML = `<option value="">All Teams</option>`;

  const teams = [...new Set(allCards.map(card => card.team).sort())];

  teams.forEach(team => {
    const opt = document.createElement("option");
    opt.value = team;
    opt.textContent = team;
    teamFilter.appendChild(opt);
  });

  // Restore previous selection if still valid
  if (selectedTeam) {
    teamFilter.value = selectedTeam;
  }
}

// Apply search, year, and team filters
function applyFilters() {
  const search = document.getElementById("search").value.toLowerCase();
  const year = document.getElementById("yearFilter").value;
  const team = document.getElementById("teamFilter").value;

  filteredCards = allCards;

  // Search filter
  if (search) {
    filteredCards = filteredCards.filter(card =>
      card.player.toLowerCase().includes(search) ||
      card.number.includes(search)
    );
  }

  // Year filter (only applies when a year is selected)
  if (year) {
    filteredCards = filteredCards.filter(card => card.year == year);
  }

  // Team filter
  if (team) {
    filteredCards = filteredCards.filter(card => card.team === team);
  }

  renderCards();
}

// Render cards to the grid
function renderCards() {
  const grid = document.getElementById("cardGrid");
  grid.innerHTML = "";

  if (filteredCards.length === 0) {
    grid.innerHTML = "<p>No cards found.</p>";
    return;
  }

  filteredCards.forEach(card => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${card.front_url}" alt="${card.player}">
      <h3>${card.number} – ${card.player}</h3>
      <p>${card.team}</p>
      <a href="card.html?id=${card.id}" class="details-btn">View Details</a>
    `;

    grid.appendChild(div);
  });
}

// Event listeners
document.getElementById("search").addEventListener("input", applyFilters);

document.getElementById("yearFilter").addEventListener("change", (e) => {
  const year = e.target.value;
  loadCards(year);
});

document.getElementById("teamFilter").addEventListener("change", applyFilters);

// Initial load: load ALL cards so search works immediately
loadCards("");