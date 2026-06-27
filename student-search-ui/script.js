const students = [
    { studentId: "S001", studentName: "Ignacio de Paul", email: "ignacio@example.com", status: "Active" },
    { studentId: "S002", studentName: "Ben Tan", email: "ben@example.com", status: "Inactive" },
    { studentId: "S003", studentName: "Chong Mei", email: "mei@example.com", status: "Active" },
    { studentId: "S004", studentName: "Aina Rahman", email: "aina@example.com", status: "Active" }
];

const container = document.getElementById("student-list");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resetButton = document.getElementById("reset-button");


function renderStudents(studentArray) {
    // Clear out any old elements inside student-list container
    container.innerHTML = "";

    // Show descriptive fallback text if array is empty
    if (studentArray.length === 0) {
        container.innerHTML = `<p class="no-results">No students found</p>`;
        return;
    }

    studentArray.forEach((student) => {
        const card = document.createElement("div");
        card.className = "student-card";
        card.innerHTML = `
            <h3>${student.studentName}</h3>
            <p><strong>ID:</strong> ${student.studentId}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Status:</strong> <span class="status ${student.status}">${student.status}</span></p>
        `;
        container.appendChild(card);
    });
}

searchButton.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase().trim();

    const filteredStudents = students.filter((student) => {
        return student.studentName.toLowerCase().includes(query);
    });

    renderStudents(filteredStudents);
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        searchButton.click(); 
    }
});

resetButton.addEventListener("click", () => {
    searchInput.value = "";
    renderStudents(students);
});

renderStudents(students);