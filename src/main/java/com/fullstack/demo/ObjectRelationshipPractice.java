package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.model.CourseOffering;
import com.fullstack.demo.model.Instructor;

public class ObjectRelationshipPractice {
    public static void main(String[] args) {

        // ====================================================================
        // TASK A: Create two instructors
        // ====================================================================
        Instructor i1 = new Instructor("I001", "Mike Rahman", "Java and Spring Boot");
        Instructor i2 = new Instructor("I002", "Marcus Lee", "React and Frontend Development");

        // ====================================================================
        // TASK B: Create two courses
        // ====================================================================
        Course c1 = new Course("C001", "Java Fundamentals", 14, "Beginner", "Programming", true);
        Course c2 = new Course("C002", "React Frontend Development", 21, "Intermediate", "Web", true);

        // ====================================================================
        // TASK C: Assign instructors to courses
        // ====================================================================
        c1.setInstructor(i1);
        c2.setInstructor(i2);

        System.out.println("=== Courses ===");
        System.out.println(c1.getTitle() + " with " + (c1.getInstructor() != null ? c1.getInstructor().getName() : "No Instructor"));
        System.out.println(c2.getTitle() + " with " + (c2.getInstructor() != null ? c2.getInstructor().getName() : "No Instructor"));

        // ====================================================================
        // TASK D & F: Create two course offerings with composition comments
        // ====================================================================
        
        /* * COMMENT:
         * CourseOffering uses composition because it "has a" Course and "has an" Instructor.
         * Rather than duplicating strings like courseTitle or instructorName, it holds direct object 
         * references to the actual entities. This prevents stale data inconsistencies across the system.
         */
        CourseOffering off1 = new CourseOffering("OFF001", "Java Fundamentals June Intake", c1, i1, "2026-06-29", "2026-06-30", 25, "Physical");
        CourseOffering off2 = new CourseOffering("OFF002", "React Frontend July Intake", c2, i2, "2026-07-01", "2026-07-03", 20, "Hybrid");

        // ====================================================================
        // EXTENSION TASK: Create a third offering reusing the same course
        // ====================================================================
        CourseOffering off3 = new CourseOffering("OFF003", "Java Fundamentals July Weekend Intake", c1, i1, "2026-07-11", "2026-07-12", 15, "Physical");

        // ====================================================================
        // TASK E: Print the course offerings
        // ====================================================================
        System.out.println("\n=== Course Offerings ===");
        off1.printSummary();
        off2.printSummary();
        off3.printSummary();
    }
}