let allCards = [];

// Load a specific year's JSON file
async function loadYear(year) {
    const response = await fetch(`data/topps_baseball_${year}.json`);
    allCards = await response.json();
    renderCards(allCards);
}

// Render cards into the grid
function renderCards(cards) {
    const container = document.getElementById("cardGrid");
    container.innerHTML = "";

    cards.forEach(card => {
        const div = document.createElement("div");
        div.className = "card-item";

        div.innerHTML = `
            <a href="card.html?year=${card.year}&id=${card.id}">
                <img src="${card.front_url}" alt="${card.player}">
                <p>${card.number} - ${card.player}</p>
            </a>
        `;

        container.appendChild(div);
    });
}

// Apply search + team filter
function applyFilters() {
    const search = document.getElementById("search").value.toLowerCase();
    const team = document.getElementById("teamFilter").value;

    const filtered = allCards.filter(card => {
        const matchesSearch =
            card.player.toLowerCase().includes(search) ||
            card.number.includes(search);

        const matchesTeam =
            team === "" || card.team === team;

        return matchesSearch && matchesTeam;
    });

    renderCards(filtered);
}

// When user selects a year, load that year's JSON
document.getElementById("yearFilter").addEventListener("change", (e) => {
    const year = e.target.value;
    if (year !== "") loadYear(year);
});

// Search + team filter listeners
document.getElementById("search").addEventListener("input", applyFilters);
document.getElementById("teamFilter").addEventListener("change", applyFilters);