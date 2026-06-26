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

## Day 3 Exercise 01

### When getCourseById("C004") is called, which file does the request go to first, second, and third?

#### 1. First File: `CourseService.java`
    The request starts when the demo/practice class calls courseService.getCourseById("C004").

    What it does: The service layer acts as the coordinator. It intercepts the call and prepares to apply any business rules or validation checks.

#### 2. Second File: `InMemoryCourseRepository.java` (or `CourseRepository.java`)
    Because the service doesn't manage data directly, it immediately hands off the lookup request to the repository layer by executing courseRepository.findById("C004").

    What it does: The repository layer directly manages access to the raw data storage (the LinkedHashMap). It locates the key "C004" and wraps the outcome into a Java Optional.

#### 3. Third File: `Course.java`
    The repository extracts the actual matching instance from memory. The request finishes inside the service layer as it unpacks the object from its Optional container.

    What it does: The execution flow returns the physical Course entity payload back to the main method runner, allowing you to access its properties like .getTitle() or .getDurationHours().

## Day 3 Exercise 02

#### Why is InMemoryCourseRepository temporary storage?

    It uses a Java Map (LinkedHashMap) running directly inside the computer's volatile RAM memory. The moment the program finishes running or the server stops, all data held within that map completely vanishes.

#### What would probably replace it later when we use MongoDB?

    A concrete class named something like 'MongoCourseRepository' or an interface extending Spring Data's 'MongoRepository'. This class will implement the exact same 'CourseRepository' interface but route all save/find queries across a network connection directly to a persistent MongoDB database cluster on a hard drive.

## Day 3 Exercise 03

#### Why is throwing CourseNotFoundException better than printing inside CourseService?
    Throwing an exception decouples the business logic from the user interface. A backend service layer might be shared by multiple client controllers. 

    If you hardcode 'System.out.println()' inside the service:

    1. A Console App would print text to the terminal screen (which works fine).

    2. A Web API (Spring Boot) would log text uselessly to the server terminal, but return a deceptive '200 OK' status with blank data to the web browser instead of a clean '404 Not Found' error code.

    3. A Frontend Web UI (React/Angular) or Mobile App wouldn't be able to read or intercept a system console printout, causing the app to fail silently.

    By throwing an exception, the service alerts the app that an error occurred, allowing different entry point controllers to catch the error and translate it into whatever specific presentation format their client requires.

## Day 3 Exercise 04

#### Why is CourseOffering a better design than putting start date, end date, and capacity directly inside Course?

Putting scheduling data inside 'Course' creates a 1:1 limitation, meaning a course could only ever be taught once. 

By separating them out into a 'CourseOffering' class using composition, a single blueprint 'Course' (e.g., Java Fundamentals) can be reused infinitely across different intakes, different dates, different locations, and different instructors without duplicating the core metadata (title, syllabus, description, credit hours). 

## Day 3 Exercise 05

#### Which version is easier to understand: loop or stream? Why?

For beginners, the loop version is often easier to read because it outlines explicit, step-by-step instructions (imperative): it creates an empty list, opens an iterative loop, tests an expression, and appends data.

#### What does filter() do in a stream?

The .filter() method acts as a gatekeeper or checklist condition. It accepts a true/false condition (a Predicate) and applies it to every item passing through the stream conveyor belt. If an element evaluates to true, it is kept in the stream and moves down the line. If it evaluates to false, it is immediately discarded.

