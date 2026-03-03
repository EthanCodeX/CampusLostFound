const token = localStorage.getItem("token");

// Redirect anonymous users
if (!token) {
  alert("Please log in to report a lost item.");
  window.location.href = "/login"; // adjust to your login page
}

// =====================
// SUBMIT LOST ITEM
// =====================
document.getElementById("lostForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const title = document.getElementById("lost-title").value.trim();
  const description = document.getElementById("lost-description").value.trim();
  const itemCategory = document.getElementById("lost-category").value;
  const location = document.getElementById("lost-location").value.trim();
  const date = document.getElementById("lost-date").value;
  const contactInfo = document.getElementById("lost-contact").value.trim();
  const imageFile = document.getElementById("lost-image").files[0];

  if (!title || !itemCategory || !location || !date || !contactInfo) {
    document.getElementById("lost-msg").innerText = "Please fill all required fields.";
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("itemCategory", itemCategory);
  formData.append("location", location);
  formData.append("date", date);
  formData.append("contactInfo", contactInfo);
  formData.append("type", "LOST"); // auto set LOST
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const res = await fetch(`${BASE_URL}/items`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();

    if (res.status === 201) {
      document.getElementById("lost-msg").classList.remove("text-danger");
      document.getElementById("lost-msg").classList.add("text-success");
      document.getElementById("lost-msg").innerText = "Lost item reported successfully ✅";
      document.getElementById("lostForm").reset();

      // Reload found items below
      loadFoundItems();
    } else {
      document.getElementById("lost-msg").innerText = data.message || "Failed to submit report.";
    }

  } catch (err) {
    console.error(err);
    document.getElementById("lost-msg").innerText = "Server error.";
  }
});

// =====================
// DISPLAY FOUND ITEMS
// =====================
async function loadFoundItems() {
  const foundList = document.getElementById("found-list");
  foundList.innerHTML = `<p class="text-center text-muted">Loading...</p>`;

  try {
    const res = await fetch(`${BASE_URL}/items`);
    const items = await res.json();

    // Filter only type = FOUND
    let foundItems = items.filter(item => item.type === "FOUND");

    // Apply filters if selected
    const sortOption = document.getElementById("sort-option").value;
    const filterCategory = document.getElementById("filter-category").value;

    if (filterCategory) {
      foundItems = foundItems.filter(item => item.itemCategory === filterCategory);
    }

    // Sort by date
    foundItems.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOption === "recent" ? dateB - dateA : dateA - dateB;
    });

    foundList.innerHTML = "";

    if (foundItems.length === 0) {
      foundList.innerHTML = `<p class="text-center text-muted">No found items.</p>`;
      return;
    }

    foundItems.forEach(item => {
      const card = document.createElement("div");
      card.className = "col mb-3";
      card.style.width = "300px"; // fixed width
      card.innerHTML = `
        <div class="card p-3 shadow h-100">
          <h5>${item.title}</h5>
          <p>${item.description}</p>
          <p><strong>Category:</strong> ${item.itemCategory}</p>
          <p><strong>Location:</strong> ${item.location}</p>
          <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
          <p><strong>Contact:</strong> ${item.contactInfo}</p>
          // Inside the card.innerHTML in loadLostItems()
          ${item.image ? `<img src="${BASE_URL}/${item.image}" class="img-fluid mt-2 mb-2 lost-img">` : ""}
        </div>
      `;
      foundList.appendChild(card);
    });

  } catch (err) {
    console.error("Failed to load found items:", err);
    foundList.innerHTML = `<p class="text-center text-danger">Failed to load found items</p>`;
  }
}

// =====================
// APPLY FILTER BUTTON
// =====================
function applyFilter() {
  loadFoundItems();
}

// =====================
// INIT ON PAGE LOAD
// =====================
document.addEventListener("DOMContentLoaded", () => {
  loadFoundItems();
});