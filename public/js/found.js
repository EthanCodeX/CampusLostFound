const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) {
  alert("Please log in to report found items.");
  window.location.href = "/login";
}

// Submit form
document.getElementById("foundForm").addEventListener("submit", addFoundItem);

// Load current user's found items
document.addEventListener("DOMContentLoaded", loadFoundItems);

async function loadFoundItems() {
  try {
    const res = await fetch(`${BASE_URL}/items/user/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const items = await res.json();
    const foundList = document.getElementById("found-list");
    foundList.innerHTML = "";

    const foundItems = items.filter(item => item.type === "FOUND");

    if (foundItems.length === 0) {
      foundList.innerHTML = `<p class="text-center text-muted">No found reports yet.</p>`;
      return;
    }

    foundItems.forEach(item => {
      const card = document.createElement("div");
      card.className = "col";
      card.innerHTML = `
        <div class="card p-3 shadow">
          <h5>${item.title}</h5>
          <p>${item.description}</p>
          <p><strong>Category:</strong> ${item.itemCategory}</p>
          <p><strong>Location:</strong> ${item.location}</p>
          <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
          <p><strong>Contact:</strong> ${item.contactInfo}</p>
          ${item.image ? `<img src="${BASE_URL}/${item.image}" width="100%" class="mb-2"/>` : ""}
          <div>
            <button class="btn btn-danger btn-sm" onclick="deleteItem('${item._id}')">Delete</button>
          </div>
        </div>
      `;
      foundList.appendChild(card);
    });

  } catch (err) {
    console.error(err);
    document.getElementById("found-list").innerHTML = `<p class="text-center text-danger">Failed to load reports.</p>`;
  }
}

// Add new found item
async function addFoundItem(e) {
  e.preventDefault();

  const title = document.getElementById("found-title").value.trim();
  const description = document.getElementById("found-description").value.trim();
  const itemCategory = document.getElementById("found-category").value;
  const location = document.getElementById("found-location").value.trim();
  const date = document.getElementById("found-date").value;
  const contactInfo = document.getElementById("found-contact").value.trim();
  const imageFile = document.getElementById("found-image").files[0];

  if (!title || !itemCategory || !location || !date || !contactInfo) {
    document.getElementById("found-msg").innerText = "Please fill all required fields.";
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("description", description);
  formData.append("itemCategory", itemCategory);
  formData.append("location", location);
  formData.append("date", date);
  formData.append("contactInfo", contactInfo);
  formData.append("type", "FOUND"); // force type
  if (imageFile) formData.append("image", imageFile);

  try {
    const res = await fetch(`${BASE_URL}/items`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();
    if (res.status === 201) {
      document.getElementById("found-msg").classList.remove("text-danger");
      document.getElementById("found-msg").classList.add("text-success");
      document.getElementById("found-msg").innerText = "Found item reported successfully ✅";
      document.getElementById("foundForm").reset();
      loadFoundItems();
    } else {
      document.getElementById("found-msg").innerText = data.message || "Failed to submit report.";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("found-msg").innerText = "Server error.";
  }
}

// Delete item
async function deleteItem(id) {
  if (!confirm("Delete this item?")) return;
  try {
    const res = await fetch(`${BASE_URL}/items/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) loadFoundItems();
  } catch (err) {
    console.error(err);
    alert("Failed to delete item.");
  }
}