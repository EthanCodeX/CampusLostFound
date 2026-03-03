const foundList = document.getElementById("found-list");

async function loadFoundItems() {
  try {
    const res = await fetch(`${BASE_URL}/items`);
    const items = await res.json();
    displayFoundItems(items.filter(i => i.type === "FOUND"));
  } catch (err) {
    console.error("Failed to load found items", err);
    foundList.innerHTML = `<p class="text-center text-danger">Failed to load items.</p>`;
  }
}

function displayFoundItems(items) {
  foundList.innerHTML = "";

  if (items.length === 0) {
    foundList.innerHTML = `<p class="text-center text-muted">No found items yet.</p>`;
    return;
  }

  items.forEach(item => {
    const col = document.createElement("div");
    col.className = "col";

    // Status badge color: FOUND = green
    let statusClass = item.type === "FOUND" ? "bg-success" : "bg-danger";

    col.innerHTML = `
      <div class="card p-3 shadow h-100">
        ${item.image ? `<img src="${BASE_URL}/${item.image}" style="width:100%; height:200px; object-fit:cover; border-radius:4px;" class="mt-2 mb-2">` : ""}
        <h6>${item.title}</h6>
        <p>${item.description}</p>
        <p><strong>Category:</strong> ${item.itemCategory}</p>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
        <p><strong>Contact:</strong> ${item.contactInfo}</p>
        <span class="badge ${statusClass} text-white mb-2">${item.type}</span>
      </div>
    `;

    foundList.appendChild(col);
  });
}

// Apply filter
function applyFilter() {
  const sortOption = document.getElementById("sort-option").value;
  const categoryFilter = document.getElementById("filter-category").value.toUpperCase();

  fetch(`${BASE_URL}/items`)
    .then(res => res.json())
    .then(items => {
      let filtered = items.filter(i => i.type === "FOUND");
      if (categoryFilter) {
        filtered = filtered.filter(i => i.itemCategory.toUpperCase() === categoryFilter);
      }

      filtered.sort((a, b) => {
        if (sortOption === "recent") return new Date(b.date) - new Date(a.date);
        return new Date(a.date) - new Date(b.date);
      });

      displayFoundItems(filtered);
    })
    .catch(err => {
      console.error("Filter failed", err);
      foundList.innerHTML = `<p class="text-center text-danger">Failed to load items.</p>`;
    });
}

// Load on page load
document.addEventListener("DOMContentLoaded", loadFoundItems);