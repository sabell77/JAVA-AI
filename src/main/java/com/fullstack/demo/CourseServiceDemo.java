package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import java.util.Scanner;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;
import java.util.List;

public class CourseServiceDemo {
    public static void main(String[] args) {
        CourseRepository repository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(repository);

        courseService.createCourse(new Course("C001", "Java Fundamentals", 14, "Beginner", "Programming", true));
        courseService.createCourse(new Course("C002", "Advanced Java Backend", 21, "Advanced", "Programming", true));
        courseService.createCourse(new Course("C003", "MongoDB Basics", 14, "Beginner", "Database", true));

        Scanner scanner = new Scanner(System.in);

        System.out.println("================================================");
        System.out.println("          INTERACTIVE COURSE SEARCH             ");
        System.out.println("================================================");

        System.out.print("Enter a keyword to search course titles: ");
        String userKeyword = scanner.nextLine(); // Waits for user to type and press Enter

        List<Course> searchResults = courseService.searchByTitle(userKeyword);
        System.out.println("\n--- Search Results for '" + userKeyword + "' ---");
        if (searchResults.isEmpty()) {
            System.out.println("No matching courses found.");
        } else {
            for (Course c : searchResults) {
                System.out.println("- " + c.getTitle());
            }
        }

        System.out.print("\nEnter a course level to filter (e.g., Beginner, Advanced): ");
        String userLevel = scanner.nextLine();

        List<Course> filterResults = courseService.filterByLevel(userLevel);
        System.out.println("\n--- Filter Results for level '" + userLevel + "' ---");
        if (filterResults.isEmpty()) {
            System.out.println("No matching courses found for that level.");
        } else {
            for (Course c : filterResults) {
                System.out.println("- " + c.getTitle() + " (" + c.getLevel() + ")");
            }
        }

        scanner.close();
        System.out.println("\nThank you for using the Course Management System!");
        
    }
}   
