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
    loadCourses();
  } else if (role === "instructor") {
    document.getElementById("instructor-section").style.display = "block";
    loadInstructorCourses();
    loadStudentsInCourses();
  } else {
    document.getElementById("student-section").style.display = "block";
    loadStudentCourses();
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

// ✅ Load all courses (Admin only)
async function loadCourses() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/courses`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const courses = await response.json();
  const courseList = document.getElementById("course-list");
  courseList.innerHTML = "";

  courses.forEach((course) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
            <strong>${course.title}</strong> <br>
            <small>${course.description}</small> <br>
            <button class="btn-delete" onclick="deleteCourse('${course._id}')">Delete</button>
        `;
    courseList.appendChild(card);
  });
}

// ✅ Load instructor courses
async function loadInstructorCourses() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/courses`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const courses = await response.json();
  const courseList = document.getElementById("instructor-courses");
  courseList.innerHTML = "";

  courses.forEach((course) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
            <strong>${course.title}</strong> <br>
            <small>${course.description}</small> <br>
            <button class="btn-manage" onclick="manageCourse('${course._id}')">Manage</button>
        `;
    courseList.appendChild(card);
  });
}

// ✅ Load students in instructor’s courses
async function loadStudentsInCourses() {
  document.getElementById("students-list").innerHTML = "<p>Coming soon...</p>"; // Placeholder
}

// ✅ Load student courses
async function loadStudentCourses() {
  document.getElementById("student-courses").innerHTML =
    "<p>Coming soon...</p>"; // Placeholder
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

// ✅ Delete a course (Admin only)
async function deleteCourse(id) {
  const token = localStorage.getItem("token");

  await fetch(`${API_URL}/admin/courses/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  loadCourses();
}

// ✅ Load dashboard when page loads
document.addEventListener("DOMContentLoaded", loadDashboard);
