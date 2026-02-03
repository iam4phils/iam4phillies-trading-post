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
  "data/topps_baseball_1983.json",
  "data/topps_baseball_1984.json",
  "data/topps_baseball_1985.json",
  "data/topps_baseball_1986.json",
  "data/topps_baseball_1987.json",
  "data/topps_baseball_1988.json",
  "data/topps_baseball_1989.json",
  "data/topps_baseball_1990.json",
  "data/topps_baseball_1992.json",
  "data/topps_baseball_1993.json",

  // Non-Sports
  "data/gpk_topps_2025_media_menace.json"
];

// ------------------------------
// LOAD ALL CARDS AND FIND MATCH
// ------------------------------
async function loadCard() {
  let allCards = [];

  for (const file of dataFiles) {
    try {
      const res = await fetch(file);
      const data = await res.json();
      allCards = allCards.concat(data);
    } catch (e) {
      console.warn("Missing file:", file);
    }
  }

  const card = allCards.find(c => String(c.id) === cardId);

  if (!card) {
    document.getElementById("cardDetails").innerHTML = "<p>Card not found.</p>";
    return;
  }

  renderCard(card);
}

// ------------------------------
// RENDER CARD DETAILS
// ------------------------------
function renderCard(card) {
  const container = document.getElementById("cardDetails");

  const isSports = card.category === "sports";
  const nameLabel = isSports ? "Player" : "Character";

// Show team for sports, set name for non-sports
  const teamRow = isSports
  ? `<p><strong>Team:</strong> ${card.team}</p>`
  : `<p><strong>Set:</strong> ${card.set}</p>`;

  const price = card.price_ungraded
    ? `$${card.price_ungraded}`
    : "N/A";

  const ebayButton = card.ebay_listing
    ? `<a href="${card.ebay_listing}" target="_blank" class="ebay-btn">Buy on eBay</a>`
    : ``;

  container.innerHTML = `
    <div class="card-details">

      <div class="card-images">
        <img src="${card.front_url}" alt="${card.player}">
        <img src="${card.back_url}" alt="${card.player} Back">
      </div>

      <div class="info">
        <h2>${card.number} – ${card.player}</h2>

        <p><strong>${nameLabel}:</strong> ${card.player}</p>
        ${teamRow}
        <p><strong>Year:</strong> ${card.year}</p>
        <p><strong>Set:</strong> ${card.set}</p>

        <p><strong>Price (Ungraded):</strong> ${price}</p>

        ${ebayButton}

        <a href="inventory.html" class="back-btn">Back to Inventory</a>
      </div>

    </div>
  `;
}

// ------------------------------
// INITIAL LOAD
// ------------------------------
loadCard();