const instructors = [
    {
        instructorId: "I001",
        instructorName: "John Doe",
        expertise: "Java Development"
    },
    {
        instructorId: "I002",
        instructorName: "Jane Smith",
        expertise: "React Development"
    },
    {
        instructorId: "I003",
        instructorName: "Bob Johnson",
        expertise: "MongoDB Development"
    },
    {
        instructorId: "I004",
        instructorName: "Alice Brown",
        expertise: "Python Development"
    }
];

console.log("=== Instructor Details ===");

for (const instructor of instructors) {
    console.log(`${instructor.instructorId} - ${instructor.instructorName} - ${instructor.expertise}`);
}

console.log();

console.log("Total instructors: " + instructors.length);

    
    