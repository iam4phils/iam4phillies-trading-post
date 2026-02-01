// Extract card ID from URL
function getCardId() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

let allCards = [];

// Load ALL years so any card can be found
async function loadAllCards() {
  const years = [1985, 1986, 1987, 1988, 1989];
  allCards = [];

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

  renderCard();
}

// Render the selected card
function renderCard() {
  const cardId = getCardId();
  const card = allCards.find(c => String(c.id) === String(cardId));

  const container = document.getElementById("cardDetails");

  if (!card) {
    container.innerHTML = "<p>Card not found.</p>";
    return;
  }

  container.innerHTML = `
    <h2>${card.year} Topps – ${card.number} – ${card.player}</h2>

    <div class="card-images">
      <img src="${card.front_url}" alt="${card.player} front">
      <img src="${card.back_url}" alt="${card.player} back">
    </div>

    <p><strong>Team:</strong> ${card.team}</p>
    <p><strong>Note:</strong> ${card.notes || "None"}</p>

    <h3>Pricing</h3>
    <ul>
      <li><strong>Ungraded:</strong> $${card.price_ungraded ?? "N/A"}</li>
    </ul>

    <a href="inventory.html" class="back-btn">← Back to Inventory</a>
  `;
}

// Start
loadAllCards();