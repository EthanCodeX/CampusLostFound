let displayedItems = [];
let itemsPerPage = 6;
let currentIndex = 0;

const foundList = document.getElementById("found-list");

async function loadFoundItems() {
  try {
    const res = await fetch(`${BASE_URL}/items`);
    const items = await res.json();
    const foundItems = items.filter(i => i.type === "FOUND");
    displayedItems = foundItems;
    currentIndex = 0;
    displayFoundItemsBatch();
  } catch (err) {
    console.error("Failed to load found items", err);
    foundList.innerHTML = `<p class="text-center text-danger">Failed to load items.</p>`;
  }
}

function displayFoundItemsBatch() {
  const batch = displayedItems.slice(currentIndex, currentIndex + itemsPerPage);
  batch.forEach((item, index) => {
    const col = document.createElement("div");
    col.className = "col";
    const statusClass = item.type === "FOUND" ? "bg-success" : "bg-danger";

    col.innerHTML = `
      <div class="card p-3 shadow h-100 found-item-card" data-index="${currentIndex + index}">
        ${item.image ? `<img src="${BASE_URL}/items/${item._id}/image" loading="lazy" style="width:100%; height:200px; object-fit:cover; border-radius:4px;" class="mt-2 mb-2">` : ""}
        <h6>
          ${item.title} <span class="badge ${statusClass} text-white">${item.type}</span>
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
  const existingBtn = document.getElementById("view-more-btn");
  if (existingBtn) existingBtn.remove();
  if (currentIndex < displayedItems.length) {
    const viewMoreBtn = document.createElement("button");
    viewMoreBtn.id = "view-more-btn";
    viewMoreBtn.className = "btn btn-primary w-100 mt-3";
    viewMoreBtn.innerText = "View More";
    viewMoreBtn.addEventListener("click", displayFoundItemsBatch);
    foundList.parentElement.appendChild(viewMoreBtn);
  }

  attachItemDetailListeners2();
}

function attachItemDetailListeners2() {
  const cards = document.querySelectorAll(".found-item-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const index = card.getAttribute("data-index");
      const item = displayedItems[index];
      if (!item) return;

      document.getElementById("detail-title").innerHTML = `${item.title} <span class="badge ${item.type === 'FOUND' ? 'bg-success' : 'bg-danger'} text-white">${item.type}</span>`;

      document.getElementById("detail-body").innerHTML = `
        ${item.image ? `<img src="${BASE_URL}/items/${item._id}/image" loading="lazy" style="width:100%; height:auto; object-fit:cover; border-radius:4px;" class="mb-3">` : ""}
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

function applyFoundFilter() {
  const sortOption = document.getElementById("sort-option").value;
  const categoryFilter = document.getElementById("filter-category").value.toUpperCase();
  fetch(`${BASE_URL}/items`)
    .then(res => res.json())
    .then(items => {
      let filtered = items.filter(i => i.type === "FOUND");
      if (categoryFilter) filtered = filtered.filter(i => i.itemCategory.toUpperCase() === categoryFilter);
      filtered.sort((a, b) => sortOption === "recent" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date));
      displayedItems = filtered;
      currentIndex = 0;
      foundList.innerHTML = "";
      displayFoundItemsBatch();
    })
    .catch(err => {
      console.error("Filter failed", err);
      foundList.innerHTML = `<p class="text-center text-danger">Failed to load items.</p>`;
    });
}

document.addEventListener("DOMContentLoaded", loadFoundItems);