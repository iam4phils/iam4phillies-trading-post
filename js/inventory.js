// ------------------------------
// SET METADATA (landing page tiles)
// ------------------------------
const sets = [
  {
    year: 1985,
    category: "sports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1985/1985%20Topps%20Baseball%20IMG_2026_01_29_19_12_37S.jpg"
  },
  {
    year: 1986,
    category: "sports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1986/1986%20Topps%20Baseball%20IMG_2026_01_18_16_00_59S.jpg"
  },
  {
    year: 1987,
    category: "sports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1987/1987%20Topps%20Basepsball%20IMG_2026_01_13_21_56_01S.jpg"
  },
  {
    year: 1988,
    category: "sports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1988/1988%20Topps%20Baseball%20IMG_2026_01_29_19_12_37S.jpg"
  },
  {
    year: 1989,
    category: "sports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1989/1989%20Topps%20Baseball%20IMG_2026_01_29_19_12_37S.jpg"
  },
  {
    year: 2025,
    category: "nonsports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/gpk_topps_2025_media_menace/gpk_2025_media_menace.jpg"
  }
];

// ------------------------------
// GLOBAL STATE
// ------------------------------
let allCards = [];
let filteredCards = [];

// ------------------------------
// JSON FILES TO LOAD
// ------------------------------
const dataFiles = [
  "/iam4phillies-trading-post/data/topps_baseball_1985.json",
  "/iam4phillies-trading-post/data/topps_baseball_1986.json",
  "/iam4phillies-trading-post/data/topps_baseball_1987.json",
  "/iam4phillies-trading-post/data/topps_baseball_1988.json",
  "/iam4phillies-trading-post/data/topps_baseball_1989.json",
  "/iam4phillies-trading-post/data/gpk_topps_2025_media_menace.json"
];

// ------------------------------
// LOAD ALL DATA
// ------------------------------
async function loadAllData() {
  allCards = [];

  for (const file of dataFiles) {
    try {
      const res = await fetch(file);
      const data = await res.json();
      allCards = allCards.concat(data);
    } catch (e) {
      console.warn("Missing or unreadable file:", file);
    }
  }

  populateYears();
  populateTeams();
}

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
    div.className = "card set-tile";

    // ⭐ UNIVERSAL ENGINE LINK — THIS IS THE FIX
    const link = `inventory.html?year=${set.year}&category=${set.category}`;

    div.innerHTML = `
      <img src="${set.img}" alt="${set.year}">
      <h3>${set.year} ${set.category === "sports" ? "Topps Baseball" : "Topps GPK Media Menace"}</h3>
      <a href="${link}" class="details-btn">View Set</a>
    `;

    setGrid.appendChild(div);
  });
}

// ------------------------------
// POPULATE YEAR DROPDOWN
// ------------------------------
function populateYears() {
  const yearFilter = document.getElementById("yearFilter");
  const category = document.getElementById("categoryFilter").value;

  yearFilter.innerHTML = `<option value="all">All Years</option>`;

  const years = [...new Set(
    allCards
      .filter(card => category === "all" || card.category === category)
      .map(card => card.year)
  )].sort((a, b) => a - b);

  years.forEach(year => {
    const opt = document.createElement("option");
    opt.value = year;
    opt.textContent = year;
    yearFilter.appendChild(opt);
  });
}

// ------------------------------
// POPULATE TEAM DROPDOWN
// ------------------------------
function populateTeams() {
  const teamFilter = document.getElementById("teamFilter");
  const category = document.getElementById("categoryFilter").value;

  teamFilter.innerHTML = `<option value="all">All Teams</option>`;

  let teams = [...new Set(
    allCards
      .filter(card => category === "all" || card.category === category)
      .map(card => card.team)
  )].sort();

  if (category === "nonsports") {
    teams = ["N/A"];
  }

  teams.forEach(team => {
    const opt = document.createElement("option");
    opt.value = team;
    opt.textContent = team;
    teamFilter.appendChild(opt);
  });
}

// ------------------------------
// APPLY FILTERS
// ------------------------------
function applyFilters() {
  const search = document.getElementById("search").value.toLowerCase();
  const team = document.getElementById("teamFilter").value;
  const category = document.getElementById("categoryFilter").value;
  const year = document.getElementById("yearFilter").value;

  filteredCards = allCards;

  if (category !== "all") {
    filteredCards = filteredCards.filter(card => card.category === category);
  }

  if (year !== "all") {
    filteredCards = filteredCards.filter(card => String(card.year) === year);
  }

  if (search) {
    filteredCards = filteredCards.filter(card =>
      card.player.toLowerCase().includes(search) ||
      card.number.includes(search)
    );
  }

  if (team !== "all") {
    filteredCards = filteredCards.filter(card => card.team === team);
  }

  renderCards();
}

// ------------------------------
// RENDER CARDS
// ------------------------------
function renderCards() {
  const setGrid = document.getElementById("setGrid");
  const cardGrid = document.getElementById("cardGrid");

  setGrid.style.display = "none";
  cardGrid.style.display = "grid";

  cardGrid.innerHTML = "";

  if (filteredCards.length === 0) {
    cardGrid.innerHTML = "<p>No cards found.</p>";
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

    cardGrid.appendChild(div);
  });
}

// ------------------------------
// EVENT LISTENERS
// ------------------------------
document.getElementById("search").addEventListener("input", applyFilters);

document.getElementById("categoryFilter").addEventListener("change", () => {
  populateYears();
  populateTeams();
  applyFilters();
});

document.getElementById("yearFilter").addEventListener("change", applyFilters);
document.getElementById("teamFilter").addEventListener("change", applyFilters);

// ------------------------------
// INITIAL LOAD WITH URL PARAM SUPPORT 
// ------------------------------
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const year = urlParams.get("year");
  const category = urlParams.get("category");

  loadAllData().then(() => {
    if (year || category) {
      if (category) {
        document.getElementById("categoryFilter").value = category;
      }
      if (year) {
        document.getElementById("yearFilter").value = year;
      }
      applyFilters();
    } else {
      renderSetLanding();
    }
  });
});