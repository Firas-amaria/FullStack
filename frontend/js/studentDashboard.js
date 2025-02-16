const API_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

function getStudentIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return payload.userId; // ✅ Extract userId from token
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

function logout() {
  localStorage.removeItem("token"); // Remove token
  window.location.href = "login.html"; // Redirect to login page
}

const studentId = getStudentIdFromToken();
if (!studentId) {
  console.error("Student ID not found! User may not be logged in.");
}

const username = localStorage.getItem("username");
document.getElementById("username").innerText = username;

// ✅ Load dashboard

document.addEventListener("DOMContentLoaded", async function () {
  const studentId = getStudentIdFromToken();
  if (!studentId) {
    console.error("Student ID not found! User may not be logged in.");
    return;
  }

  const coursesList = document.getElementById("courses-list");
  const myCoursesList = document.getElementById("myCourses");

  try {
    // Fetch student's enrolled courses
    const enrollmentsResponse = await fetch(
      `${API_URL}/enrollments/my-courses`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    if (!enrollmentsResponse.ok) {
      throw new Error(
        `Failed to fetch enrollments: ${enrollmentsResponse.statusText}`
      );
    }
    const enrolledCourses = await enrollmentsResponse.json();

    console.log("Enrolled Courses Data:", enrolledCourses); // 🔍 Debugging line

    myCoursesList.innerHTML = "<h2>My Courses</h2>";

    enrolledCourses.forEach((enrollment) => {
      const course = enrollment.course;
      const instructorName =
        course.instructor && course.instructor.username
          ? course.instructor.username
          : "Unknown";

      const latestMaterial =
        course.materials && course.materials.length > 0
          ? course.materials[course.materials.length - 1]
          : "No materials yet";
      const courseContainer = document.createElement("div");
      courseContainer.classList.add("course-container");
      ///change in course content display page to be loaded by id of course
      courseContainer.innerHTML = `
                <div class="course-header">
                    <a href="#" class="course-title" data-course-id="${course._id}">
                        ${course.title}
                    </a>
                    <span class="lecturer-name">${instructorName}</span>
                </div>
                <p class="latest-update"><strong>Latest Update:</strong> ${latestMaterial}</p>
            `;

      myCoursesList.appendChild(courseContainer);
    });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
  }
});

function getStudentIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

document.getElementById("logout-btn").addEventListener("click", logout);
