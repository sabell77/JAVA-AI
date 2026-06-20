## Day 1 Exercise 01 - Code Explanation

### 1.	What is the purpose of `Course.java`?
The purpose of Course.java is to serve as a domain model that represents a conceptual blueprint used to represent a real-world educational course within a software system.

### 2.	What is the purpose of `Instructor.java`?
The purpose of Instructor.java is to serve as a domain model that represents a faculty member or a teacher within the software system.

### 3.	What is the purpose of `Student.java`?
The purpose of Instructor.java is to serve as a domain model that represents a student within the software system.

### 4.	What does the constructor do?
A constructor is a special block of code inside a class that is automatically executed the moment user use the new keyword to create an object.

### 5.	Why are the fields marked as private?
Marking fields as private is done to enforce a core concept of Object-Oriented Programming called encapsulation (often referred to as data hiding).

### 6.	What does `course1.assignInstructor(instructor1);` mean?
In Java, the line `course1.assignInstructor(instructor1)` is a method call that establishes a relationship between two objects. 

### 7.	What does `student1.printProfile();` do?
It looks up a specific student’s data since we called it on student1, Java targets the memory location of student1 and retrieves only that specific student’s information.

### 8.	Explain this Java class to someone who already knows Python or C++. Then write down:

* #### One explanation from AI that helped you.
Java requires every variable to be explicitly typed and declared at the top of the class definition. For C++ equivalent, this is identical to placing variables under a private: access specifier block in a C++ class definition.

* #### One part you still needed the trainer or your own reading to understand.
A Java constructor must have the exact same name as the class and does not declare a return type.

## Day 1 Exercise 03 

### Why is CourseOffering more useful than using only Course when building a real web application?

    
    In a production-ready full-stack application, separating a `Course` from a `CourseOffering` is essential for data normalization, relational data integrity, and business scaling.

1. **Separation of Concerns:** A `Course` serves as a timeless master blueprint or catalog item (containing static details like Title, Syllabus Description, Base Duration, and Skill Level). It does not change based on *when* or *how* it is taught. 

2. **One-to-Many Scheduling Matrix:** A modern web application must handle concurrent schedules. For example, the course "Java Fundamentals" may run concurrently as an "Online Evening Cohort" and an "In-Person Corporate Bootcamp." If scheduling details (Start Dates, End Dates, Classroom capacities, or shifting delivery formats) were attached straight to the `Course` model, you would have to duplicate the primary course metadata repeatedly, inflating your database tables and breaking normalization rules.

3. **Dynamic Resource Allocation:** Fluid attributes like student rosters, assigned classrooms, unique access links, and variable instructing faculty belong explicitly to a specific scheduled instance. Tracking these entities via a distinct `CourseOffering` relational component enables real-time cohort tracking and accurate historical logs without muddying your foundational course catalog metrics.

