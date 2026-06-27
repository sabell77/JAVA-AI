const statusMessage = document.getElementById("status-message");
const studentList = document.getElementById("student-list");

function renderStudents(students) {
    studentList.innerHTML = "";

    students.forEach((student) => {
        const studentCard = document.createElement("div");
        studentCard.className = "student-card";

        studentCard.innerHTML = `
            <h2>${student.studentName}</h2>
            <p><strong>Student ID:</strong> ${student.studentId}</p>
            <p><strong>Email:</strong> ${student.email}</p>
            <p><strong>Status:</strong> ${student.status}</p>
            <hr>
        `;

        studentList.appendChild(studentCard);
    });
}

async function loadStudents() {
    try {
        statusMessage.textContent = "Loading students...";

        const response = await fetch("students.json");

        if (!response.ok) {
            throw new Error("Failed to load student data.");
        }

        const students = await response.json();

        statusMessage.textContent = "";
        renderStudents(students);

    } catch (error) {
        statusMessage.textContent = "Error: " + error.message;
    }
}

loadStudents();