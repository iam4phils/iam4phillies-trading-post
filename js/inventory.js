// ------------------------------
// SET METADATA (landing page tiles)
// ------------------------------
const sets = [
  {
    year: 1983,
    category: "sports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1983/1983%20Topps%20Baseball%20IMG_2026_01_30_23_12_23S.jpg"
  },
  {
    year: 1984,
    category: "sports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1984/1984%20Topps%20Baseball%20IMG_2026_01_30_21_03_26S.jpg"
  },
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
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1987/1987%20Topps%20Baseball%20IMG_2026_01_13_21_56_01S.jpg"
  },
  {
    year: 1988,
    category: "sports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1988/IMG_2026_01_06_19_41_50S.jpg"
  },
  {
    year: 1989,
    category: "sports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1989/1989%20Topps%20Baseball_IMG_2026_01_07_23_01_37S.jpg"
  },
  {
    year: 1990,
    category: "sports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1990/1990%20Topps%20Baseball_IMG_2026_01_11_15_54_38S.jpg"
  },
  {
    year: 1992,
    category: "sports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1992/1992%20Topps%20Baseball_IMG_2026_01_11_18_30_10S.jpg"
  },
  {
    year: 1993,
    category: "sports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_baseball_1993/1993%20Topps%20Baseball%20IMG_2026_01_12_17_08_44S.jpg"
  },
  {
    year: 2025,
    category: "nonsports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_gpk_media_menace_2025/25-MEDIA-MENACE%20SSP.jpg"
  },
  {
    year: 2025,
    category: "nonsports",
    img: "https://raw.githubusercontent.com/iam4phils/Ebay_card_Listings/main/topps_gpk_media_menace_2025/25-MEDIA-MENACE.jpg"
  }
];

// ------------------------------
// GLOBAL STATE
// ------------------------------
let allCards = [];
let filteredCards = [];
let isCompactMode = false;

// ------------------------------
// JSON FILES TO LOAD
// ------------------------------
const dataFiles = [
  "/iam4phillies-trading-post/data/topps_baseball_1983.json",
  "/iam4phillies-trading-post/data/topps_baseball_1984.json",
  "/iam4phillies-trading-post/data/topps_baseball_1985.json",
  "/iam4phillies-trading-post/data/topps_baseball_1986.json",
  "/iam4phillies-trading-post/data/topps_baseball_1987.json",
  "/iam4phillies-trading-post/data/topps_baseball_1988.json",
  "/iam4phillies-trading-post/data/topps_baseball_1989.json",
  "/iam4phillies-trading-post/data/topps_baseball_1990.json",
  "/iam4phillies-trading-post/data/topps_baseball_1992.json",
  "/iam4phillies-trading-post/data/topps_baseball_1993.json",
  "/iam4phillies-trading-post/data/gpk_topps_2025_media_menace_SPs_Gold.json",
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

    const link = `inventory.html?year=${set.year}&category=${set.category}`;

    div.innerHTML = `
      <img src="${set.img}" alt="${set.year}">
      <h3>${set.year} ${
        set.category === "sports"
          ? "Topps Baseball"
          : "Topps GPK Media Menace"
      }</h3>
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
// POPULATE TEAM/SET DROPDOWN
// ------------------------------
function populateTeams() {
  const teamFilter = document.getElementById("teamFilter");
  const category = document.getElementById("categoryFilter").value;

  // Default option changes depending on category
  teamFilter.innerHTML =
    category === "nonsports"
      ? `<option value="all">Set</option>`
      : `<option value="all">All Teams</option>`;

  // SPORTS → real teams
  if (category === "sports") {
    let teams = [...new Set(
      allCards
        .filter(card => card.category === "sports")
        .map(card => card.team)
    )].sort();

    teams.forEach(team => {
      const opt = document.createElement("option");
      opt.value = team;
      opt.textContent = team;
      teamFilter.appendChild(opt);
    });
  }

  // NON‑SPORTS → unique set names
  if (category === "nonsports") {
    let sets = [...new Set(
      allCards
        .filter(card => card.category === "nonsports")
        .map(card => card.set)
    )].sort();

    sets.forEach(setName => {
      const opt = document.createElement("option");
      opt.value = setName;
      opt.textContent = setName;
      teamFilter.appendChild(opt);
    });
  }
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

  // CATEGORY FILTER
  if (category !== "all") {
    filteredCards = filteredCards.filter(card => card.category === category);
  }

  // YEAR FILTER
  if (year !== "all") {
    filteredCards = filteredCards.filter(card => String(card.year) === year);
  }

  // SEARCH FILTER
  if (search) {
    filteredCards = filteredCards.filter(card =>
      card.player.toLowerCase().includes(search) ||
      card.number.includes(search)
    );
  }

  // TEAM / SET FILTER
  if (team !== "all") {
    if (category === "sports") {
      // SPORTS → filter by team
      filteredCards = filteredCards.filter(card => card.team === team);
    } else {
      // NON‑SPORTS → filter by set name
      filteredCards = filteredCards.filter(card => card.set === team);
    }
  }

  // RENDER
  isCompactMode ? renderCompact() : renderCards();
}

// ------------------------------
// RENDER CARDS (GRID MODE)
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

    const fullSetName =
      card.category === "sports"
        ? `${card.year} Topps Baseball`
        : card.set;

    const ebayButton = card.ebay_listing
      ? `<a href="${card.ebay_listing}" target="_blank" class="ebay-btn">Buy on eBay</a>`
      : ``;

    div.innerHTML = `
      <img src="${card.front_url}" alt="${card.player}">

      <h3>${card.number} – ${card.player}</h3>
      <p><strong>${fullSetName}</strong></p>

      ${card.category === "sports" ? `<p>${card.team}</p>` : ""}

      <a href="card.html?id=${card.id}" class="details-btn">View Details</a>
      ${ebayButton}
    `;

    cardGrid.appendChild(div);
  });
}

// ------------------------------
// RENDER COMPACT MODE (ONE-LINE, PERFECT ALIGNMENT)
// ------------------------------
function renderCompact() {
  const setGrid = document.getElementById("setGrid");
  const cardGrid = document.getElementById("cardGrid");

  setGrid.style.display = "none";
  cardGrid.style.display = "block";

  cardGrid.innerHTML = "";

  if (filteredCards.length === 0) {
    cardGrid.innerHTML = "<p>No cards found.</p>";
    return;
  }

  filteredCards.forEach(card => {
    const div = document.createElement("div");
    div.className = "compact-row";

    const fullSetName =
      card.category === "sports"
        ? `${card.year} Topps Baseball`
        : card.set;

    div.innerHTML = `
      <span class="compact-num">${card.number}</span>
      <span class="compact-player">${card.player}</span>
      <span class="compact-set">${fullSetName}</span>

      <a href="card.html?id=${card.id}" class="compact-details">Details</a>

      ${
        card.ebay_listing
          ? `<a href="${card.ebay_listing}" target="_blank" class="compact-ebay">eBay</a>`
          : `<span></span>`
      }
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
// COMPACT MODE TOGGLE
// ------------------------------
document.getElementById("toggleView").addEventListener("click", () => {

  // ⭐ Prevent compact mode on landing page
  const setGridVisible = document.getElementById("setGrid").style.display !== "none";
  if (setGridVisible) {
    alert("Select a set or apply filters before using Compact Mode.");
    return;
  }

  isCompactMode = !isCompactMode;

  if (isCompactMode) {
    renderCompact();
    document.getElementById("toggleView").textContent = "Grid Mode";
  } else {
    renderCards();
    document.getElementById("toggleView").textContent = "Compact Mode";
  }
});

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