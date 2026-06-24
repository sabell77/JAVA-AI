package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;
import java.util.List;
import com.fullstack.demo.model.Instructor;
import com.fullstack.demo.exception.CourseNotFoundException;
import java.util.Scanner;

public class CourseServiceDemo {
    public static void main(String[] args) {
        CourseRepository repository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(repository);

        courseService.createCourse(new Course("C001", "Java Fundamentals", 14, "Beginner", "Programming", true));
        courseService.createCourse(new Course("C002", "Advanced Java Backend", 21, "Advanced", "Programming", true));
        courseService.createCourse(new Course("C003", "MongoDB Basics", 14, "Beginner", "Database", true));

        Instructor instructorAlice = new Instructor("I001", "Alice Smith", "alice@email.com");
        Instructor instructorBob = new Instructor("I002", "Bob Jones", "bob@email.com");

        courseService.assignInstructor("C001", instructorAlice);
        courseService.assignInstructor("C002", instructorBob);
    
        Scanner scanner = new Scanner(System.in);

        System.out.println("================================================");
        System.out.println("         TESTING SEARCH BY INSTRUCTOR           ");
        System.out.println("================================================");

        System.out.print("\nEnter an instructor's name to search: ");
        String userInstructor = scanner.nextLine();

        List<Course> instructorResults = courseService.searchByInstructorName(userInstructor);
        System.out.println("\n--- Courses taught by '" + userInstructor + "' ---");
        if (instructorResults.isEmpty()) {
            System.out.println("No courses found for this instructor.");
        } else {
            for (Course c : instructorResults) {
                System.out.println("- " + c.getTitle() + " [Instructor: " + c.getInstructor().getName() + "]");
            }
        }

        System.out.println("\n================================================");
        System.out.println("            TESTING FIND COURSE BY ID           ");
        System.out.println("================================================");

        System.out.print("\nEnter a Course ID to lookup (e.g., C001, C999): ");
        String userIdInput = scanner.nextLine();

        System.out.println("\n--- ID Lookup Results for '" + userIdInput + "' ---");
        try {
            Course foundCourse = courseService.getCourseById(userIdInput);
            System.out.println("✅ Found! " + foundCourse.getCourseId() + ": " + foundCourse.getTitle());
            if (foundCourse.getInstructor() != null) {
                System.out.println("   Assigned Instructor: " + foundCourse.getInstructor().getName());
            } else {
                System.out.println("   Assigned Instructor: None");
            }
        } catch (CourseNotFoundException e) {
            System.out.println("❌ " + e.getMessage());
        }

        scanner.close();

        System.out.println("\nThank you for using the Course Management System!");
        

    }
}   
