let displayedItems = [];
let itemsPerPage = 6;
let currentIndex = 0;

const lostList = document.getElementById("lost-list");

async function loadLostItems() {
  try {
    const res = await fetch(`${BASE_URL}/items`);
    const items = await res.json();
    displayedItems = items.filter(i => i.type === "LOST");
    currentIndex = 0;
    displayLostItemsBatch();
  } catch (err) {
    console.error("Failed to load lost items", err);
    lostList.innerHTML = `<p class="text-center text-danger">Failed to load items.</p>`;
  }
}

function displayLostItemsBatch() {
  const batch = displayedItems.slice(currentIndex, currentIndex + itemsPerPage);
  batch.forEach((item, index) => {
    const col = document.createElement("div");
    col.className = "col";
    const statusClass = item.type === "LOST" ? "bg-danger" : "bg-success";

    col.innerHTML = `
      <div class="card p-3 shadow h-100 lost-item-card" data-index="${currentIndex + index}">
        ${item.image ? `<img src="${BASE_URL}/items/${item._id}/image" loading="lazy" style="width:100%; height:200px; object-fit:cover; border-radius:4px;" class="mt-2 mb-2">` : ""}
        <h6>${item.title} <span class="badge ${statusClass} text-white">${item.type}</span></h6>
        <p>${item.description}</p>
        <p><strong>Category:</strong> ${item.itemCategory}</p>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
        <p><strong>Contact:</strong> ${item.contactInfo}</p>
      </div>
    `;
    lostList.appendChild(col);
  });

  currentIndex += batch.length;
  const existingBtn = document.getElementById("view-more-btn");
  if (existingBtn) existingBtn.remove();
  if (currentIndex < displayedItems.length) {
    const viewMoreBtn = document.createElement("button");
    viewMoreBtn.id = "view-more-btn";
    viewMoreBtn.className = "btn btn-primary w-100 mt-3";
    viewMoreBtn.innerText = "View More";
    viewMoreBtn.addEventListener("click", displayLostItemsBatch);
    lostList.parentElement.appendChild(viewMoreBtn);
  }

  attachItemDetailListeners();
}

function attachItemDetailListeners() {
  const cards = document.querySelectorAll(".lost-item-card");
  cards.forEach(card => {
    card.addEventListener("click", () => {
      const index = card.getAttribute("data-index");
      const item = displayedItems[index];
      if (!item) return;

      document.getElementById("detail-title").innerHTML = `${item.title} <span class="badge ${item.type === 'LOST' ? 'bg-danger' : 'bg-success'} text-white">${item.type}</span>`;
      document.getElementById("detail-body").innerHTML = `
        ${item.image ? `<img src="${BASE_URL}/items/${item._id}/image" loading="lazy" style="width:100%; height:auto; object-fit:cover; border-radius:4px;" class="mb-3">` : ""}
        <p><strong>Description:</strong> ${item.description}</p>
        <p><strong>Category:</strong> ${item.itemCategory}</p>
        <p><strong>Location:</strong> ${item.location}</p>
        <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
        <p><strong>Contact:</strong> ${item.contactInfo}</p>
        <p><strong>Reported By:</strong> ${item.createdByName || 'Anonymous'}</p>
      `;
      const modal = new bootstrap.Modal(document.getElementById('itemDetailModal'));
      modal.show();
    });
  });
}

function applyLostFilter() {
  const sortOption = document.getElementById("sort-option").value;
  const categoryFilter = document.getElementById("filter-category").value.toUpperCase();
  fetch(`${BASE_URL}/items`)
    .then(res => res.json())
    .then(items => {
      let filtered = items.filter(i => i.type === "LOST");
      if (categoryFilter) filtered = filtered.filter(i => i.itemCategory.toUpperCase() === categoryFilter);
      filtered.sort((a,b) => sortOption==="recent"?new Date(b.date)-new Date(a.date):new Date(a.date)-new Date(b.date));
      displayedItems = filtered;
      currentIndex = 0;
      lostList.innerHTML = "";
      displayLostItemsBatch();
    }).catch(err=>{
      console.error("Filter failed", err);
      lostList.innerHTML = `<p class="text-center text-danger">Failed to load items.</p>`;
    });
}

document.addEventListener("DOMContentLoaded", loadLostItems);