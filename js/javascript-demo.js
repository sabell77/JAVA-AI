// JS does not require classes for simple data.
// We can represent a course as an object literal with properties.
// Course course = new Course("C001", "JavaScript Fundamentals", 12, "Beginner", "John Doe");
// to run, type: node javascript-demo.js

/*
Java:
    1. Stricter type checking
    2. Class-based structure
    3. Private fields and methods (getter and setter)
    4. Compile-time errors
    5. More boilerplate code

JavaScript:
    1. Dynamic typing
    2. Prototype-based structure
    3. No private fields (ES6 introduced private fields with #)
    4. Properties can be accessed and modified at runtime
    5. Less boilerplate code
    6. Object literals and functions can be used to create objects without classes
    7. Runtime errors
*/

const course = {
    courseId: "C001",
    title: "JavaScript Fundamentals",
    durationHours: 12,
    level: "Beginner",
    instructor: "John Doe"
};

console.log("=== Course Details ===");
console.log(`Course ID: ${course.courseId}`);
console.log(`Title: ${course.title}`);
console.log(`Duration: ${course.durationHours} hours`);
console.log(`Level: ${course.level}`); // `${}` is a template literal
console.log(`Instructor: ${course.instructor}`);