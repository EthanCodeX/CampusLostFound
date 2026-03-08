const token = localStorage.getItem("token");

// redirect if not logged in
if (!token) {
  alert("Please log in to view your reports.");
  window.location.href = "/login";
}

document.addEventListener("DOMContentLoaded", loadMyReports);

async function loadMyReports() {
  try {
    const res = await fetch(`${BASE_URL}/items/user/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const items = await res.json();

    const lostBody = document.getElementById("lostBody");
    const foundBody = document.getElementById("foundBody");
    const closedBody = document.getElementById("closedBody");

    lostBody.innerHTML = "";
    foundBody.innerHTML = "";
    closedBody.innerHTML = "";

    const lostItems = items.filter(item => item.type === "LOST");
    const foundItems = items.filter(item => item.type === "FOUND");
    const closedItems = items.filter(item => item.type === "CLOSED");

    // LOST TABLE
    if (lostItems.length === 0) {
      lostBody.innerHTML = `<tr><td colspan="6" class="text-center">No lost reports</td></tr>`;
    } else {
      lostItems.forEach(item => {
        lostBody.innerHTML += createRow(item, true);
      });
    }

    // FOUND TABLE
    if (foundItems.length === 0) {
      foundBody.innerHTML = `<tr><td colspan="6" class="text-center">No found reports</td></tr>`;
    } else {
      foundItems.forEach(item => {
        foundBody.innerHTML += createRow(item, false);
      });
    }

    // CLOSED TABLE
    if (closedItems.length === 0) {
      closedBody.innerHTML = `<tr><td colspan="6" class="text-center">No closed reports</td></tr>`;
    } else {
      closedItems.forEach(item => {
        closedBody.innerHTML += createRow(item, "closed");
      });
    }

  } catch (err) {
    console.error(err);
    const errorRow = `<tr><td colspan="6" class="text-center text-danger">Failed to load reports</td></tr>`;
    lostBody.innerHTML = errorRow;
    foundBody.innerHTML = errorRow;
    closedBody.innerHTML = errorRow;
  }
}

function createRow(item, type) {
  const isLost = type === true;
  const isClosed = type === "closed";

  // === UPDATE IMAGE SRC TO FETCH FROM MONGODB ===
  const imgSrc = item.image ? `${BASE_URL}/items/${item._id}/image` : null;

  return `
    <tr>
      <td>
        ${imgSrc
          ? `<img src="${imgSrc}" width="60" style="object-fit:cover; border-radius:4px;" />`
          : `<i class="fa fa-image text-muted"></i>`}
      </td>
      <td>${item.itemCategory}</td>
      <td>${item.location}</td>
      <td>${new Date(item.date).toLocaleDateString('en-GB')}</td>
      <td>
        <span class="badge bg-${item.type === "FOUND" ? "success" : item.type === "CLOSED" ? "secondary" : "warning"}">
          ${item.type}
        </span>
      </td>
      <td>
        <div class="d-flex flex-wrap gap-1">
          ${!isClosed
            ? `<button class="btn btn-sm btn-success flex-fill" onclick="markAsClosed('${item._id}')">Completed</button>`
            : ""}
          <button class="btn btn-sm btn-danger flex-fill" onclick="deleteItem('${item._id}')">Delete</button>
        </div>
      </td>
    </tr>
  `;
}

// --- Keep your existing functions unchanged ---
async function markAsClosed(id) {
  if (!confirm("Mark this item as closed?")) return;

  try {
    const res = await fetch(`${BASE_URL}/items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ 
        type: "CLOSED",       
        status: "RESOLVED"    
      })
    });

    if (!res.ok) throw new Error("Failed to update");

    loadMyReports();
  } catch (err) {
    console.error(err);
    alert("Failed to mark as closed.");
  }
}

async function deleteItem(id) {
  if (!confirm("Delete this item?")) return;

  try {
    const res = await fetch(`${BASE_URL}/items/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to delete");

    loadMyReports();
  } catch (err) {
    console.error(err);
    alert("Failed to delete item.");
  }
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}