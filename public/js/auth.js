const BASE_URL = window.location.origin; // dynamically uses current host

// -------------------- LOGIN --------------------
async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    document.getElementById("msg").innerText = "Please enter email & password";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      // ✅ save token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);  // <- new
      localStorage.setItem("name", data.name);
      localStorage.setItem("role", data.role || "student"); // default role

      // ✅ redirect to dashboard
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("msg").innerText = data.message;
    }
  } catch (err) {
    console.error(err);
    document.getElementById("msg").innerText = "Server error. Try again later.";
  }
}

// -------------------- REGISTER --------------------
async function registerUser() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !email || !password) {
    document.getElementById("reg_msg").innerText = "All fields are required";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.status === 201) {
      alert("Registration successful ✅ Please login.");
      window.location.href = "login.html";
    } else {
      document.getElementById("reg_msg").innerText = data.message || "Registration failed";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("reg_msg").innerText = "Server error. Try again later.";
  }
}

// -------------------- UTILITY --------------------
function togglePassword(inputId) {
  const pass = document.getElementById(inputId);
  pass.type = pass.type === "password" ? "text" : "password";
}