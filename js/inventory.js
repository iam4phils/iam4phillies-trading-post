// ------------------------------
// SET METADATA (landing page tiles)
// ------------------------------
const sets = [
  {
    year: 1985,
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1985/1985%20Topps%20Baseball%20IMG_2026_01_29_19_12_37S.jpg"
  },
  {
    year: 1986,
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1986/1986%20Topps%20Baseball%20IMG_2026_01_29_19_12_37S.jpg"
  },
  {
    year: 1987,
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1987/1987%20Topps%20Baseball%20IMG_2026_01_29_19_12_37S.jpg"
  },
  {
    year: 1988,
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1988/1988%20Topps%20Baseball%20IMG_2026_01_29_19_12_37S.jpg"
  },
  {
    year: 1989,
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1989/1989%20Topps%20Baseball%20IMG_2026_01_29_19_12_37S.jpg"
  }
];

// ------------------------------
// GLOBAL STATE
// ------------------------------
let allCards = [];
let filteredCards = [];

// Detect if user arrived from a landing page (inventory.html?year=1985)
const urlParams = new URLSearchParams(window.location.search);
const preselectYear = urlParams.get("year");

// ------------------------------
// RENDER SET LANDING PAGE
// ------------------------------
function renderSetLanding() {
  const setGrid = document.getElementById("setGrid");
  const cardGrid = document.getElementById("cardGrid");

  setGrid.style.display = "grid";
  cardGrid.style.display = "none";

  setGrid.innerHTML = "";

  sets.forEach(set => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${set.img}" alt="${set.year} Topps Baseball">
      <h3>${set.year} Topps Baseball</h3>
      <a href="sets/topps_baseball_${set.year}.html" class="details-btn">View Set</a>
    `;

    setGrid.appendChild(div);
  });
}

// ------------------------------
// LOAD CARDS FOR A SPECIFIC YEAR
// ------------------------------
async function loadCards(year) {
  const setGrid = document.getElementById("setGrid");
  const cardGrid = document.getElementById("cardGrid");

  // Hide set landing page, show card grid
  setGrid.style.display = "none";
  cardGrid.style.display = "grid";

  allCards = [];

  const file = `data/topps_baseball_${year}.json`;
  const res = await fetch(file);
  const data = await res.json();
  allCards = data;

  populateTeams();
  applyFilters();
}

// ------------------------------
// POPULATE TEAM DROPDOWN
// ------------------------------
function populateTeams() {
  const teamFilter = document.getElementById("teamFilter");
  const selectedTeam = teamFilter.value;

  teamFilter.innerHTML = `<option value="">All Teams</option>`;

  const teams = [...new Set(allCards.map(card => card.team).sort())];

  teams.forEach(team => {
    const opt = document.createElement("option");
    opt.value = team;
    opt.textContent = team;
    teamFilter.appendChild(opt);
  });

  if (selectedTeam) {
    teamFilter.value = selectedTeam;
  }
}

// ------------------------------
// APPLY FILTERS
// ------------------------------
function applyFilters() {
  const search = document.getElementById("search").value.toLowerCase();
  const year = document.getElementById("yearFilter").value;
  const team = document.getElementById("teamFilter").value;

  filteredCards = allCards;

  if (search) {
    filteredCards = filteredCards.filter(card =>
      card.player.toLowerCase().includes(search) ||
      card.number.includes(search)
    );
  }

  if (team) {
    filteredCards = filteredCards.filter(card => card.team === team);
  }

  renderCards();
}

// ------------------------------
// RENDER CARDS
// ------------------------------
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

// ------------------------------
// EVENT LISTENERS
// ------------------------------
document.getElementById("search").addEventListener("input", applyFilters);

document.getElementById("yearFilter").addEventListener("change", (e) => {
  const year = e.target.value;

  if (year) {
    // Redirect to set landing page
    window.location.href = `sets/topps_baseball_${year}.html`;
  } else {
    // Return to set landing page
    renderSetLanding();
  }
});

document.getElementById("teamFilter").addEventListener("change", applyFilters);

// ------------------------------
// INITIAL LOAD
// ------------------------------
if (preselectYear) {
  // Coming from a set landing page → load that year
  document.getElementById("yearFilter").value = preselectYear;
  loadCards(preselectYear);
} else {
  // Default → show set thumbnails
  renderSetLanding();
}