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

const studentId = getStudentIdFromToken();
if (!studentId) {
    console.error("Student ID not found! User may not be logged in.");
}

document.addEventListener("DOMContentLoaded", async function () {
    const studentId = getStudentIdFromToken();
    if (!studentId) {
        console.error("Student ID not found! User may not be logged in.");
        return;
    }

    const coursesList = document.getElementById("courses-list");

    try {
        // Fetch all courses with instructor names
        const coursesResponse = await fetch(`${API_URL}/courses`);
        const courses = await coursesResponse.json();

        // Fetch student's enrolled courses
        const enrollmentsResponse = await fetch(`${API_URL}/enrollments/my-courses`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        });

        if (!enrollmentsResponse.ok) {
            throw new Error(`Failed to fetch enrollments: ${enrollmentsResponse.statusText}`);
        }

        const enrolledCourses = await enrollmentsResponse.json();
        const enrolledCourseIds = new Set(enrolledCourses.map(enrollment => enrollment.course._id));

        coursesList.innerHTML = "";

        courses.forEach(course => {
            const isEnrolled = enrolledCourseIds.has(course._id);
            const instructorName = course.instructor && course.instructor.username ? course.instructor.username : "Unknown";

            const courseContainer = document.createElement("div");
            courseContainer.classList.add("course-container");

            courseContainer.innerHTML = `
                <div class="course-header">
                    <a href="#" class="course-title" data-course-id="${course._id}">
                        ${course.title}
                    </a>
                    <span class="lecturer-name">${instructorName}</span>
                    <button class="enroll-btn" data-course-id="${course._id}" ${isEnrolled ? 'disabled' : ''}>
                        ${isEnrolled ? 'Enrolled ' : 'Enroll'}
                    </button>
                </div>
                <p><strong>Description:</strong> ${course.description}</p>
            `;

            coursesList.appendChild(courseContainer);
        });

        // Add event listener to enroll buttons
        document.querySelectorAll(".enroll-btn").forEach(button => {
            button.addEventListener("click", async function () {
                const courseId = this.getAttribute("data-course-id");
                if (enrolledCourseIds.has(courseId)) {
                    alert("Already enrolled in this course.");
                    return;
                }
                await enrollStudent(courseId, this);
            });
        });

        // Add event listener to course titles
        document.querySelectorAll(".course-title").forEach(title => {
            title.addEventListener("click", function (event) {
                event.preventDefault();
                const courseId = this.getAttribute("data-course-id");
                if (enrolledCourseIds.has(courseId)) {
                    window.location.href = `${API_URL}/courses/${courseId}`;
                } else {
                    alert("Enroll in the course first to see content.");
                }
            });
        });

        // Attach the search function to the search button
        document.getElementById("searchButton").addEventListener("click", function () {
            filterCourses(courses);
        });

        // Allow pressing "Enter" to trigger search
        document.getElementById("searchInput").addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                filterCourses(courses);
            }
        });

    } catch (error) {
        console.error("Error fetching courses or enrollments:", error);
    }
});

async function enrollStudent(courseId, button) {
    try {
        const studentId = getStudentIdFromToken();
        if (!studentId) {
            alert("User not logged in. Please log in first.");
            return;
        }

        const response = await fetch(`${API_URL}/enrollments/${courseId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ student: studentId })
        });

        if (response.ok) {
            button.textContent = "Enrolled";
            button.disabled = true;
            button.style.backgroundColor = "grey";
        } else {
            const errorData = await response.json();
            console.error("Enrollment failed:", errorData);
            alert(`Enrollment failed: ${errorData.error}`);
        }
    } catch (error) {
        console.error("Error enrolling student:", error);
    }
}

/**
 * Filters courses based on user input
 */
function filterCourses(courses) {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let resultDiv = document.getElementById("result");
    let coursesList = document.getElementById("courses-list");

    // Clear previous results
    //coursesList.innerHTML = "";
    resultDiv.innerHTML = "";
    const isEnrolled = enrolledCourseIds.has(course._id);
    let filteredCourses = courses.filter(course => course.title.toLowerCase().includes(input));

    if (filteredCourses.length > 0) {
        filteredCourses.forEach(course => {
            const instructorName = course.instructor && course.instructor.username ? course.instructor.username : "Unknown";

            const courseContainer = document.createElement("div");
            courseContainer.classList.add("course-container");

            courseContainer.innerHTML = `
                <div class="course-header">
                    <a href="#" class="course-title" data-course-id="${course._id}">
                        ${course.title}
                    </a>
                    <span class="lecturer-name">${instructorName}</span>
                    <button class="enroll-btn" data-course-id="${course._id}" ${isEnrolled ? 'disabled' : ''}>
                        ${isEnrolled ? 'Enrolled ' : 'Enroll'}
                    </button>
                </div>
                <p><strong>Description:</strong> ${course.description}</p>
            `;

            resultDiv.appendChild(courseContainer);
        });
    } else {
        resultDiv.innerHTML = "Course not found!";
    }
}
