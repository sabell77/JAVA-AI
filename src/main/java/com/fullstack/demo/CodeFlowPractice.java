package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

public class CodeFlowPractice {
    public static void main(String[] args) {
        System.out.println("=== Add and Find Course ===");

        /* * TRACE COMMENT: Why do we create the repository first?
         * 1. The repository layer directly interacts with the raw data storage (the LinkedHashMap).
         * 2. It has no dependencies of its own, so it must be instantiated first to act as 
         * the data foundation.
         */
        CourseRepository courseRepository = new InMemoryCourseRepository();

        /* * TRACE COMMENT: Why does CourseService need CourseRepository?
         * 1. The Service layer coordinates business rules (validation, security) but doesn't 
         * own data storage methods.
         * 2. It relies on "Dependency Injection" via its constructor to delegate saving and 
         * finding tasks down to the repository interface.
         */
        CourseService courseService = new CourseService(courseRepository);
        Course newCourse = new Course("C004", "Spring Boot API Development", 18, "Intermediate", "Programming", true);
        courseService.createCourse(newCourse);

        /*
         * TRACE FLOW - COURSE RETRIEVAL:
         * 1. CodeFlowPractice calls courseService.getCourseById("C004").
         * 2. CourseService routes the inquiry forward by querying courseRepository.findById("C004").
         * 3. InMemoryCourseRepository fetches an Optional<Course> wrapper out of the LinkedHashMap.
         * 4. CourseService evaluates the Optional wrapper: unboxes the Course item if present, 
         * or triggers a CourseNotFoundException runtime error if empty.
         * 5. The unboxed Course entity returns to this Demo class variable.
         */
        Course retrievedCourse = courseService.getCourseById("C004");
        printSummary(retrievedCourse);
    }

    private static void printSummary(Course course) {
        System.out.println("Course ID: " + course.getCourseId());
        System.out.println("Title: " + course.getTitle());
        System.out.println("Duration: " + course.getDurationHours() + " hours");
        System.out.println("Level: " + course.getLevel());
        
        String instructorName = (course.getInstructor() != null) 
                ? course.getInstructor().getName() 
                : "Not assigned yet";
        System.out.println("Instructor: " + instructorName);
    }
}