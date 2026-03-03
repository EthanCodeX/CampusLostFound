const BASE_URL = "http://localhost:3000"; // match your backend port

// Redirect to login if token missing
if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("name");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  window.location.href = "login.html";
}

function goToLost() {
  window.location.href = "lost.html";
}

function goToFound() {
  window.location.href = "found.html";
}

function goBack() {
  window.location.href = "dashboard.html"; // adjust path if needed
}