const API_URL = "http://localhost:3000";

// ✅ Load dashboard based on user role
async function loadDashboard() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");

  document.getElementById("username").innerText = username;

  if (role === "admin") {
    document.getElementById("admin-section").style.display = "block";
    loadUsers();
  } else {
    document.getElementById("student-section").style.display = "block";
    loadStudentDashboard();
  }
}

// ✅ Load all users (Admin only)
async function loadUsers() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const users = await response.json();
  const userList = document.getElementById("user-list");
  userList.innerHTML = "";

  users.forEach((user) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
            <strong>${user.username}</strong> <br>
            <small>${user.email}</small> <br>
            <small>Role: ${user.role}</small> <br>
            <button class="btn-delete" onclick="deleteUser('${user._id}')">Delete</button>
        `;
    userList.appendChild(card);
  });
}



// ✅ Delete a user (Admin only)
async function deleteUser(id) {
  const token = localStorage.getItem("token");

  await fetch(`${API_URL}/admin/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  loadUsers();
}

// ✅ Load dashboard when page loads
document.addEventListener("DOMContentLoaded", loadDashboard);
