package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;
import com.fullstack.demo.exception.InvalidCourseException;

public class CourseServiceDemo {
    public static void main(String[] args) {
        CourseRepository repository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(repository);

       System.out.println("=== Valid Course Test ===");
        try {
            Course validCourse = new Course("C001", "Java Fundamentals", 14, "Beginner", "Programming", true);
            courseService.createCourse(validCourse);
            System.out.println("Course saved successfully.");
        } catch (InvalidCourseException e) {
            System.out.println("Validation error: " + e.getMessage());
        }
        
       System.out.println("\n=== Invalid Course Test ===");
       
       try {
            Course badTitleCourse = new Course("C002", "", 10, "Beginner", "Programming", true);
            courseService.createCourse(badTitleCourse);
        } catch (IllegalArgumentException | InvalidCourseException e) {
            System.out.println("Validation error: Course title is required.");
        }

        try {
            Course badDurationCourse = new Course("C003", "Valid Title", 0, "Beginner", "Programming", true);
            courseService.createCourse(badDurationCourse);
        } catch (IllegalArgumentException | InvalidCourseException e) {
            System.out.println("Validation error: Course duration must be greater than zero.");
        }

        try {
            courseService.createCourse(null);
        } catch (InvalidCourseException e) {
            System.out.println("Validation error: " + e.getMessage());
        }

        System.out.println("\nTotal courses stored in backend: " + courseService.getAllCourses().size());

    }
}   
