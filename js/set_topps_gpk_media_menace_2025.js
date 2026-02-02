// Load the 2025 Topps GPK Media Menace set
async function loadGPK2025() {
  const grid = document.getElementById("cardGrid");
  grid.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch("../data/gpk_topps_2025_media_menace.json");
    const cards = await res.json();

    grid.innerHTML = "";

    cards.forEach(card => {
      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <img src="${card.front_url}" alt="${card.player}">
        <h3>${card.number} – ${card.player}</h3>
        <p>N/A</p>
        <a href="../card.html?id=${card.id}" class="details-btn">View Details</a>
      `;

      grid.appendChild(div);
    });

  } catch (e) {
    grid.innerHTML = "<p>Error loading set.</p>";
  }
}

loadGPK2025();