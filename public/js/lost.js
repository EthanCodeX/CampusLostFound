const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) {
  alert("Please log in to report lost items.");
  window.location.href = "/login";
}

// Submit form
document.getElementById("lostForm").addEventListener("submit", addLostItem);

// =====================
// ADD NEW LOST ITEM
// =====================
async function addLostItem(e) {
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
  formData.append("itemCategory", itemCategory.toUpperCase());
  formData.append("location", location);
  formData.append("date", date);
  formData.append("contactInfo", contactInfo);
  formData.append("type", "LOST");

  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const res = await fetch(`${BASE_URL}/items`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    });

    const data = await res.json();

    if (res.status === 201) {

      document.getElementById("lost-msg").classList.remove("text-danger");
      document.getElementById("lost-msg").classList.add("text-success");
      document.getElementById("lost-msg").innerText = "Lost item reported successfully ✅";

      document.getElementById("lostForm").reset();

      // Close modal after success
      const modal = bootstrap.Modal.getInstance(document.getElementById('lostModal'));
      setTimeout(() => {
        modal.hide();
        document.getElementById("lost-msg").innerText = "";
      }, 1200);

    } else {
      document.getElementById("lost-msg").innerText = data.message || "Failed to submit report.";
    }

  } catch (err) {
    console.error(err);
    document.getElementById("lost-msg").innerText = "Server error.";
  }
}