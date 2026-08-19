const generateBtn = document.getElementById("generate-btn");
const nameInput = document.getElementById("name-input");
const personaSelect = document.getElementById("persona-select");
const statusEl = document.getElementById("status");
const card = document.getElementById("card");

generateBtn.addEventListener("click", generatePokemon);
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") generatePokemon();
});

async function generatePokemon() {
  const name = nameInput.value.trim();
  const persona = personaSelect.value;

  if (!name) {
    statusEl.textContent = "Type a Pokemon name first.";
    return;
  }

  statusEl.textContent = "Generating...";
  card.classList.add("hidden");

  try {
    const res = await fetch("/api/pokedex", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, persona }),
    });

    const data = await res.json();

    if (!res.ok) {
      statusEl.textContent = data.error || "Something went wrong.";
      return;
    }

    renderCard(data);
    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = "Could not reach the server.";
  }
}

function renderCard(data) {
  document.getElementById("card-name").textContent = data.name;
  document.getElementById("card-number").textContent = "#" + data.entry_number;

  const statsList = document.getElementById("card-stats");
  statsList.innerHTML = "";
  const statLabels = {
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    special_attack: "Special Attack",
    special_defense: "Special Defense",
    speed: "Speed",
  };
  for (const key in statLabels) {
    const li = document.createElement("li");
    li.innerHTML = `<span>${statLabels[key]}</span><span>${data.stats[key]}/15</span>`;
    statsList.appendChild(li);
  }

  document.getElementById("card-description").textContent = data.description;

  const detailsList = document.getElementById("card-details");
  detailsList.innerHTML = "";
  const details = data.details;
  const detailRows = [
    ["Height", details.height],
    ["Weight", details.weight],
    ["Gender", details.gender],
    ["Category", details.category],
    ["Abilities", details.abilities.join(", ")],
  ];
  detailRows.forEach(([label, value]) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${label}</span><span>${value}</span>`;
    detailsList.appendChild(li);
  });

  document.getElementById("card-types").textContent = data.types.join(", ");
  document.getElementById("card-weaknesses").textContent = data.weaknesses.join(", ");
  document.getElementById("card-evolutions").textContent = data.evolutions.join(" --> ");

  card.classList.remove("hidden");
}