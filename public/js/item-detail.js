function showItemDetail(item) {
  const modalTitle = document.getElementById("detail-title");
  const modalBody = document.getElementById("detail-body");

  modalTitle.innerHTML = `${item.title} <span class="badge ${item.type==='LOST'?'bg-danger':'bg-success'} text-white">${item.type}</span>`;

  modalBody.innerHTML = `
    ${item.image ? `<img src="${BASE_URL}/items/${item._id}/image" class="img-fluid mb-3" style="max-height:300px; object-fit:cover;">` : ""}
    <p><strong>Description:</strong> ${item.description || "-"}</p>
    <p><strong>Category:</strong> ${item.itemCategory}</p>
    <p><strong>Location:</strong> ${item.location}</p>
    <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
    <p><strong>Contact:</strong> ${item.contactInfo}</p>
    <p><strong>Reported By:</strong> ${item.createdByName || "Anonymous"}</p>
  `;

  const modal = new bootstrap.Modal(document.getElementById('itemDetailModal'));
  modal.show();
}

function attachItemDetailListeners() {
  const cards = document.querySelectorAll("#lost-list .card");
  cards.forEach((card,index)=>{
    card.style.cursor = "pointer";
    card.addEventListener("click", ()=>{
      const item = displayedItems[index];
      showItemDetail(item);
    });
  });
}