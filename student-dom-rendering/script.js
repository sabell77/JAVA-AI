const students = [
    { studentId: "S001", studentName: "Ignacio de Paul", email: "ignacio@example.com", status: "Active" },
    { studentId: "S002", studentName: "Ben Tan", email: "ben@example.com", status: "Inactive" },
    { studentId: "S003", studentName: "Chong Mei", email: "mei@example.com", status: "Active" },
    { studentId: "S004", studentName: "Aina Rahman", email: "aina@example.com", status: "Active" }
];

// 1. Select the target container div using its ID attribute
const container = document.getElementById("student-list");

// 2. Loop through the student objects using forEach
students.forEach((student) => {
    // 3. Create a clean div element container for the individual card
    const card = document.createElement("div");
    card.className = "student-card";

    // 4. Populate internal content blocks using template literals with innerHTML
    card.innerHTML = `
        <h3>${student.studentName}</h3>
        <p><strong>ID:</strong> ${student.studentId}</p>
        <p><strong>Email:</strong> ${student.email}</p>
        <p><strong>Status:</strong> <span class="status ${student.status}">${student.status}</span></p>
    `;

    // 5. Append the newly compiled card node onto our document layout viewport
    container.appendChild(card);
});