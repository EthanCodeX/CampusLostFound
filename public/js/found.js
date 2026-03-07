const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token) {
  alert("Please log in to report found items.");
  window.location.href = "/login";
}

// Submit form
document.getElementById("foundForm").addEventListener("submit", addFoundItem);

// =====================
// ADD NEW FOUND ITEM
// =====================
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
  formData.append("itemCategory", itemCategory.toUpperCase());
  formData.append("location", location);
  formData.append("date", date);
  formData.append("contactInfo", contactInfo);
  formData.append("type", "FOUND");

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

      document.getElementById("found-msg").classList.remove("text-danger");
      document.getElementById("found-msg").classList.add("text-success");
      document.getElementById("found-msg").innerText = "Found item reported successfully ✅";

      document.getElementById("foundForm").reset();

      // Close modal after success
      const modal = bootstrap.Modal.getInstance(document.getElementById('foundModal'));
      setTimeout(() => {
        modal.hide();
        document.getElementById("found-msg").innerText = "";
      }, 1200);

    } else {
      document.getElementById("found-msg").innerText = data.message || "Failed to submit report.";
    }

  } catch (err) {
    console.error(err);
    document.getElementById("found-msg").innerText = "Server error.";
  }
}