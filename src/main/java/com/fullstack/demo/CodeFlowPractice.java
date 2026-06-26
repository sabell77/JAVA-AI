package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

public class CodeFlowPractice {
    public static void main(String[] args) {
        System.out.println("=== Add and Find Course ===");
        CourseRepository courseRepository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(courseRepository);
        Course newCourse = new Course("C004", "Spring Boot API Development", 18, "Intermediate", "Programming", true);
        courseService.createCourse(newCourse);
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