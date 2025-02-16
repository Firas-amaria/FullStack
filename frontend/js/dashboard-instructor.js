const API_URL = "http://localhost:3000"; // Change if needed

// Function to fetch instructor courses
// Function to fetch instructor courses
async function fetchInstructorCourses() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized! Please log in again.");
      window.location.href = "login.html"; // Redirect to login page
      return;
    }

    // Fetch courses for the logged-in instructor
    const response = await fetch(`${API_URL}/instructor/courses`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch courses");

    const courses = await response.json();
    displayCourses(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    alert("Unable to load courses.");
  }
}

// Function to display courses in the instructor's dashboard
function displayCourses(courses) {
  const courseListDiv = document.getElementById("course-list");
  courseListDiv.innerHTML = ""; // Clear old courses

  if (courses.length === 0) {
    courseListDiv.innerHTML = "<p>You are not teaching any courses yet.</p>";
    return;
  }

  courses.forEach((course) => {
    const courseDiv = document.createElement("div");
    courseDiv.classList.add("card");
    courseDiv.innerHTML = `
        <h3>${course.title}</h3>
        <p>${course.description}</p>
        <button class="btn-add-quiz" onclick="addQuiz('${course._id}')">Add Quiz</button>
      `;
    courseListDiv.appendChild(courseDiv);
  });
}

// Function to handle adding a quiz (will be implemented later)
function addQuiz(courseId) {
  alert(`Redirecting to quiz creation for course ID: ${courseId}`);
  // In the future, redirect to a quiz creation page
  // window.location.href = `add-quiz.html?courseId=${courseId}`;
}

// Logout function
function logout() {
  localStorage.removeItem("token"); // Remove token
  window.location.href = "login.html"; // Redirect to login page
}

// Attach logout function to the button
document.getElementById("logout-btn").addEventListener("click", logout);

// Load instructor courses on page load
document.addEventListener("DOMContentLoaded", fetchInstructorCourses);
