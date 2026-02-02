// ------------------------------
// GET CARD ID FROM URL
// ------------------------------
const urlParams = new URLSearchParams(window.location.search);
const cardId = urlParams.get("id");

// ------------------------------
// UNIVERSAL DATA FILE LIST
// ------------------------------
const dataFiles = [
  // Sports
  "data/topps_baseball_1985.json",
  "data/topps_baseball_1986.json",
  "data/topps_baseball_1987.json",
  "data/topps_baseball_1988.json",
  "data/topps_baseball_1989.json",

  // Non-Sports
  "data/gpk_topps_2025_media_menace.json"
];

// ------------------------------
// LOAD ALL CARDS AND FIND MATCH
// ------------------------------
async function loadCard() {
  let allCards = [];

  // Load all sets
  for (const file of dataFiles) {
    try {
      const res = await fetch(file);
      const data = await res.json();
      allCards = allCards.concat(data);
    } catch (e) {
      console.warn("Missing file:", file);
    }
  }

  // Find the card by ID
  const card = allCards.find(c => String(c.id) === cardId);

  if (!card) {
    document.getElementById("cardDetails").innerHTML = "<p>Card not found.</p>";
    return;
  }

  renderCard(card);
}

// ------------------------------
// RENDER CARD DETAILS (Sports + GPK)
// ------------------------------
function renderCard(card) {
  const container = document.getElementById("cardDetails");

  // Determine if this is Sports or Non-Sports
  const isSports = card.category === "sports";
  const isNonSports = card.category === "nonsports";

  // Build Team row (Sports only)
  const teamRow = isSports
    ? `<p><strong>Team:</strong> ${card.team}</p>`
    : ``;

  // Build Player/Character row
  const nameLabel = isSports ? "Player" : "Character";

  container.innerHTML = `
    <div class="card-details">

      <div class="images">
        <img src="${card.front_url}" alt="${card.player}" class="front-img">
        <img src="${card.back_url}" alt="${card.player} Back" class="back-img">
      </div>

      <div class="info">
        <h2>${card.number} – ${card.player}</h2>

        <p><strong>${nameLabel}:</strong> ${card.player}</p>
        ${teamRow}
        <p><strong>Year:</strong> ${card.year}</p>
        <p><strong>Set:</strong> ${card.set}</p>

        <p><strong>Price (Ungraded):</strong> $${card.price_ungraded}</p>

        <a href="inventory.html" class="back-btn">Back to Inventory</a>
      </div>

    </div>
  `;
}

// ------------------------------
// INITIAL LOAD
// ------------------------------
loadCard();