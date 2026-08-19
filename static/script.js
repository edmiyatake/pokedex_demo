const form = document.getElementById("lookup-form");
const generateBtn = document.getElementById("generate-btn");
const nameInput = document.getElementById("name-input");
const personaSelect = document.getElementById("persona-select");
const statusEl = document.getElementById("status");
const card = document.getElementById("card");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  generatePokemon();
});

const STAT_LABELS = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  special_attack: "Sp. Atk",
  special_defense: "Sp. Def",
  speed: "Speed",
};

async function generatePokemon() {
  const name = nameInput.value.trim();
  const persona = personaSelect.value;

  if (!name) {
    statusEl.textContent = "Enter a name to scan first.";
    return;
  }

  statusEl.textContent = "Scanning...";
  card.classList.add("hidden");
  generateBtn.disabled = true;

  try {
    const res = await fetch("/api/pokedex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, persona }),
    });

    const data = await res.json();

    if (!res.ok) {
      statusEl.textContent = data.error || "Scan failed. Try again.";
      return;
    }

    renderCard(data);
    statusEl.textContent = "Scan complete.";
  } catch (err) {
    statusEl.textContent = "Could not reach the server.";
  } finally {
    generateBtn.disabled = false;
  }
}

function renderCard(data) {
  document.getElementById("card-name").textContent = data.name;
  document.getElementById("card-number").textContent = "#" + data.entry_number;

  const typesEl = document.getElementById("card-types");
  typesEl.innerHTML = "";
  (data.types || []).forEach((type) => {
    const chip = document.createElement("span");
    chip.className = "type-chip";
    chip.textContent = type;
    typesEl.appendChild(chip);
  });

  document.getElementById("card-description").textContent = data.description;

  const statsList = document.getElementById("card-stats");
  statsList.innerHTML = "";
  for (const key in STAT_LABELS) {
    const value = Number(data.stats?.[key]) || 0;
    const percent = Math.max(0, Math.min(100, (value / 15) * 100));

    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML = `
      <span>${STAT_LABELS[key]}</span>
      <span class="stat-track"><span class="stat-fill" style="--fill:${percent}%"></span></span>
      <span class="stat-value">${value}</span>
    `;
    statsList.appendChild(row);
  }

  const detailsList = document.getElementById("card-details");
  detailsList.innerHTML = "";
  const details = data.details || {};
  const detailRows = [
    ["Height", details.height],
    ["Weight", details.weight],
    ["Gender", details.gender],
    ["Category", details.category],
  ];
  detailRows.forEach(([label, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value || "Unknown";
    detailsList.appendChild(dt);
    detailsList.appendChild(dd);
  });

  document.getElementById("card-abilities").textContent =
    (details.abilities || []).join(", ") || "None listed";
  document.getElementById("card-weaknesses").textContent =
    (data.weaknesses || []).join(", ") || "None listed";
  document.getElementById("card-evolutions").textContent =
    (data.evolutions || []).join("  ->  ") || "No evolution data";

  card.classList.remove("hidden");
}