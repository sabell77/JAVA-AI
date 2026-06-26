package com.fullstack.demo;

import com.fullstack.demo.exception.CourseNotFoundException;
import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

public class ExceptionPractice {
    public static void main(String[] args) {

        // ====================================================================
        // TASK A: Set up CourseService
        // ====================================================================
        CourseRepository courseRepository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(courseRepository);

        // ====================================================================
        // TASK B: Add two courses
        // ====================================================================
        courseService.createCourse(new Course("C001", "Java Fundamentals", 14, "Beginner", "Programming", true));
        courseService.createCourse(new Course("C002", "React Frontend Development", 30, "Intermediate", "Web", true));

        // ====================================================================
        // TASK C: Find an existing course
        // ====================================================================
        System.out.println("=== Find Existing Course ===");
        Course course = courseService.getCourseById("C001");
        System.out.println("Success: Found '" + course.getTitle() + "'");

        // ====================================================================
        // TASK D: Find a missing course and catch the exception (C999)
        // ====================================================================
        System.out.println("\n=== Find Missing Course (C999) ===");
        try {
            Course missingCourse = courseService.getCourseById("C999");
            System.out.println("This line will not print: " + missingCourse.getTitle());
        } catch (CourseNotFoundException e) {
            System.out.println("Friendly message for user: Lookups failed because " + e.getMessage());
        }

        // ====================================================================
        // TASK E: Add one more try/catch block (C888)
        // ====================================================================
        System.out.println("\n=== Find Missing Course (C888) ===");
        try {
            courseService.getCourseById("C888");
        } catch (CourseNotFoundException e) {
            System.out.println("Cannot display course details because the course does not exist.");
        }
        
        System.out.println("\n✅ Execution Completed: Program handled all exceptions without crashing!");
    }
}