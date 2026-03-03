const token = localStorage.getItem("token");

// ========================
// LOG CURRENT USER ID
// ========================
if (token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Current User ID from token:", payload.id);
  } catch (err) {
    console.error("Failed to decode token", err);
  }
}

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
    document.getElementById("lostBody").innerHTML = `<tr><td colspan="6" class="text-center text-danger">Failed to load reports</td></tr>`;
    document.getElementById("foundBody").innerHTML = `<tr><td colspan="6" class="text-center text-danger">Failed to load reports</td></tr>`;
    document.getElementById("closedBody").innerHTML = `<tr><td colspan="6" class="text-center text-danger">Failed to load reports</td></tr>`;
  }
}

function createRow(item, type) {
  let isLost = type === true;
  let isClosed = type === "closed";

  return `
    <tr>
      <td>
        ${item.image
          ? `<img src="${BASE_URL}/${item.image}" width="60" />`
          : `<i class="fa fa-image text-muted"></i>`}
      </td>
      <td>${item.itemCategory}</td>
      <td>${item.location}</td>
      <td>${new Date(item.date).toLocaleDateString()}</td>
      <td>
        <span class="badge bg-${item.type === "FOUND" ? "success" : item.type === "CLOSED" ? "secondary" : "warning"}">
          ${item.type}
        </span>
      </td>
      <td>
        <div class="d-flex flex-wrap gap-1">
          ${!isClosed
            ? `<button class="btn btn-sm btn-success" onclick="markAsClosed('${item._id}')">Mark as Closed</button>`
            : ""}
          <button class="btn btn-sm btn-danger" onclick="deleteItem('${item._id}')">Delete</button>
        </div>
      </td>
    </tr>
  `;
}

async function markAsClosed(id) {
  if (!confirm("Mark this item as closed?")) return;

  try {
    const res = await fetch(`${BASE_URL}/items/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ type: "CLOSED" })
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