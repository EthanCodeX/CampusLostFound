// Function to show item details in modal
function showItemDetail(item) {
  const modalTitle = document.getElementById("detail-title");
  const modalBody = document.getElementById("detail-body");

  modalTitle.innerHTML = `${item.title} 
  <span class="badge ${item.type === 'LOST' ? 'bg-danger' : 'bg-success'} text-white">${item.type}</span>`;

  modalBody.innerHTML = `
    ${item.image ? `<img src="${BASE_URL}/${item.image}" class="img-fluid mb-3" style="max-height:300px; object-fit:cover;">` : ""}
    <p><strong>Description:</strong> ${item.description || "-"}</p>
    <p><strong>Category:</strong> ${item.itemCategory}</p>
    <p><strong>Location:</strong> ${item.location}</p>
    <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
    <p><strong>Contact:</strong> ${item.contactInfo}</p>
    <p><strong>Reported By:</strong> ${item.createdByName || "Anonymous"}</p>
  `;

  // Open the modal
  const modal = new bootstrap.Modal(document.getElementById('itemDetailModal'));
  modal.show();
}

// Add click listener to each card after items are displayed
function attachItemDetailListeners() {
  const cards = document.querySelectorAll("#lost-list .card");
  cards.forEach((card, index) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      // Each card element has a data-item-index attribute
      const item = displayedItems[index]; // `displayedItems` is a global array in lost-display.js
      showItemDetail(item);
    });
  });
}