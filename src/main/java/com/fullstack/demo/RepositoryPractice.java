package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;

import java.util.List;
import java.util.Optional;

public class RepositoryPractice {
    public static void main(String[] args) {

        // ====================================================================
        // TASK A: Create the repository using the interface type
        // ====================================================================
        
        /* * COMMENT: 
         * The variable type is CourseRepository (Interface), but the actual object is InMemoryCourseRepository (Implementation).
         * This decouples our application components. The program only knows what actions are available 
         * through the interface contract, making it trivial to swap out memory arrays for a real database later.
         */
        CourseRepository courseRepository = new InMemoryCourseRepository();

        // ====================================================================
        // TASK B: Save three courses directly through the repository
        // ====================================================================
        Course c5 = new Course("C005", "API Documentation", 7, "Beginner", "Programming", true);
        Course c6 = new Course("C006", "Java Collections Practice", 12, "Beginner", "Programming", true);
        Course c7 = new Course("C007", "Clean Code Basics", 8, "Intermediate", "Programming", true);

        courseRepository.save(c5);
        courseRepository.save(c6);
        courseRepository.save(c7);

        // ====================================================================
        // TASK C: Print all courses
        // ====================================================================
        System.out.println("=== All Courses ===");
        List<Course> courses = courseRepository.findAll();
        for (Course course : courses) {
            // Note: If your Course model uses a custom summary print method, use that here.
            System.out.println(course.getCourseId() + " - " + course.getTitle() + " (" + course.getDurationHours() + " hours - " + course.getLevel() + ")");
        }

        // ====================================================================
        // TASK D: Find one course using Optional
        // ====================================================================
        System.out.println("\n=== Find C006 ===");
        Optional<Course> optionalCourse = courseRepository.findById("C006");
        
        if (optionalCourse.isPresent()) {
            Course foundCourse = optionalCourse.get();
            System.out.println("Found: " + foundCourse.getCourseId() + " - " + foundCourse.getTitle());
        } else {
            System.out.println("Course not found.");
        }

        // ====================================================================
        // TASK E: Check if a course exists
        // ====================================================================
        System.out.println("\n=== Exists Check ===");
        boolean exists = courseRepository.existsById("C007");
        System.out.println("C007 exists: " + exists);
    }
}