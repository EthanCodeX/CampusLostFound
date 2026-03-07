let displayedItems = []; // all items after fetch/filter
let itemsPerPage = 6;    // number of cards per batch
let currentIndex = 0;    // track how many items are displayed

const foundList = document.getElementById("found-list");

// =======================
// LOAD FOUND ITEMS
// =======================
async function loadFoundItems() {
  try {
    const res = await fetch(`${BASE_URL}/items`);
    const items = await res.json();
    const foundItems = items.filter(i => i.type === "FOUND");
    displayedItems = foundItems;
    currentIndex = 0; // reset
    displayFoundItemsBatch();
  } catch (err) {
    console.error("Failed to load found items", err);
    foundList.innerHTML = `<p class="text-center text-danger">Failed to load items.</p>`;
  }
}

// =======================
// DISPLAY ITEMS IN BATCHES
// =======================
function displayFoundItemsBatch() {
  const batch = displayedItems.slice(currentIndex, currentIndex + itemsPerPage);

  // Append batch
  batch.forEach((item, index) => {
    const col = document.createElement("div");
    col.className = "col";

    let statusClass = item.type === "FOUND" ? "bg-success" : "bg-danger";

    col.innerHTML = `
      <div class="card p-3 shadow h-100 found-item-card" data-index="${currentIndex + index}">
        ${item.image ? `<img src="${BASE_URL}/${item.image}" loading="lazy" style="width:100%; height:200px; object-fit:cover; border-radius:4px;" class="mt-2 mb-2">` : ""}
        <h6>
          ${item.title} 
          <span class="badge ${statusClass} text-white">${item.type}</span>
        </h6>
        <p>${item.description}</p>
        <p><strong>Category:</strong> ${item.itemCategory}</p>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
        <p><strong>Contact:</strong> ${item.contactInfo}</p>
      </div>
    `;

    foundList.appendChild(col);
  });

  currentIndex += batch.length;

  // Remove existing "View More" button if any
  const existingBtn = document.getElementById("view-more-btn");
  if (existingBtn) existingBtn.remove();

  // Add "View More" if more items left
  if (currentIndex < displayedItems.length) {
    const viewMoreBtn = document.createElement("button");
    viewMoreBtn.id = "view-more-btn";
    viewMoreBtn.className = "btn btn-primary w-100 mt-3";
    viewMoreBtn.innerText = "View More";
    viewMoreBtn.addEventListener("click", displayFoundItemsBatch);
    foundList.parentElement.appendChild(viewMoreBtn);
  }

  attachItemDetailListeners2(); // attach modal click events
}

// =======================
// ITEM DETAIL MODAL
// =======================
function attachItemDetailListeners2() {
  const cards = document.querySelectorAll(".found-item-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const index = card.getAttribute("data-index");
      const item = displayedItems[index];

      if (!item) return;

      // Populate modal
      document.getElementById("detail-title").innerHTML = `${item.title} <span class="badge ${item.type === 'FOUND' ? 'bg-success' : 'bg-danger'} text-white">${item.type}</span>`;

      document.getElementById("detail-body").innerHTML = `
        ${item.image ? `<img src="${BASE_URL}/${item.image}" loading="lazy" style="width:100%; height:auto; object-fit:cover; border-radius:4px;" class="mb-3">` : ""}
        <p><strong>Description:</strong> ${item.description}</p>
        <p><strong>Category:</strong> ${item.itemCategory}</p>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
        <p><strong>Contact:</strong> ${item.contactInfo}</p>
        <p><strong>Reported By:</strong> ${item.createdByName || 'Anonymous'}</p>
      `;

      const modal = new bootstrap.Modal(document.getElementById('itemDetailModal2'));
      modal.show();
    });
  });
}

// =======================
// FILTER FUNCTION
// =======================
function applyFoundFilter() {
  const sortOption = document.getElementById("sort-option").value;
  const categoryFilter = document.getElementById("filter-category").value.toUpperCase();

  fetch(`${BASE_URL}/items`)
    .then(res => res.json())
    .then(items => {
      let filtered = items.filter(i => i.type === "FOUND");
      if (categoryFilter) filtered = filtered.filter(i => i.itemCategory.toUpperCase() === categoryFilter);

      filtered.sort((a, b) => {
        if (sortOption === "recent") return new Date(b.date) - new Date(a.date);
        return new Date(a.date) - new Date(b.date);
      });

      displayedItems = filtered;
      currentIndex = 0;
      foundList.innerHTML = ""; // clear previous
      displayFoundItemsBatch();
    })
    .catch(err => {
      console.error("Filter failed", err);
      foundList.innerHTML = `<p class="text-center text-danger">Failed to load items.</p>`;
    });
}

// =======================
// LOAD ON PAGE READY
// =======================
document.addEventListener("DOMContentLoaded", loadFoundItems);