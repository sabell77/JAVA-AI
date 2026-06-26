package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;
import java.util.List;
import com.fullstack.demo.exception.CourseNotFoundException;
import com.fullstack.demo.exception.InvalidCourseException;

import java.util.Scanner;

public class CourseServiceDemo {
    public static void main(String[] args) {
        CourseRepository repository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(repository);

        courseService.createCourse(new Course("C001", "Java Fundamentals", 14, "Beginner", "Programming", true));
        courseService.createCourse(new Course("C002", "Advanced Java Backend", 21, "Advanced", "Programming", true));
        courseService.createCourse(new Course("C003", "MongoDB Basics", 14, "Beginner", "Database", true));

        try (Scanner scanner = new Scanner(System.in)) {
            boolean running = true;

            System.out.println("================================================");
            System.out.println("       INTERACTIVE COURSE CRUD CONTROLLER       ");
            System.out.println("================================================");

            while (running) {
                System.out.println("\n--- Select an Operation ---");
                System.out.println("1. View All Courses");
                System.out.println("2. Update Course Duration (U)");
                System.out.println("3. Delete a Course (D)");
                System.out.println("4. Find Course By ID (R)");
                System.out.println("5. Exit");
                System.out.print("Enter choice (1-5): ");

                String choice = scanner.nextLine().trim();

                switch (choice) {
                    case "1":
                        System.out.println("\n=== Current Courses ===");
                        List<Course> courses = courseService.getAllCourses();
                        if (courses.isEmpty()) {
                            System.out.println("No courses registered.");
                        } else {
                            for (Course c : courses) {
                                System.out.println("- " + c.getCourseId() + ": " + c.getTitle() + " (" + c.getDurationHours() + " hours)");
                            }
                        }
                        break;

                    case "2":
                        System.out.println("\n=== Update Duration ===");
                        System.out.print("Enter Course ID to update: ");
                        String updateId = scanner.nextLine().trim();
                        System.out.print("Enter new duration in hours: ");
                        String durationInput = scanner.nextLine().trim();
                        
                        try {
                            int newHours = Integer.parseInt(durationInput);
                            Course updated = courseService.updateDuration(updateId, newHours);
                            System.out.println("✅ Success: " + updated.getCourseId() + " duration updated to " + updated.getDurationHours() + " hours.");
                        } catch (NumberFormatException e) {
                            System.out.println("❌ Validation error: Please enter a valid number for hours.");
                        } catch (CourseNotFoundException | InvalidCourseException e) {
                            System.out.println("❌ Logic error: " + e.getMessage());
                        }
                        break;

                    case "3":
                        System.out.println("\n=== Delete Course ===");
                        System.out.print("Enter Course ID to delete: ");
                        String deleteId = scanner.nextLine().trim();
                        
                        try {
                            courseService.deleteCourse(deleteId);
                            System.out.println("✅ Success: Course " + deleteId + " deleted successfully.");
                        } catch (CourseNotFoundException e) {
                            System.out.println("❌ Delete error: " + e.getMessage());
                        }
                        break;

                    case "4":
                        System.out.println("\n=== Find Course By ID ===");
                        System.out.print("Enter Course ID: ");
                        String findId = scanner.nextLine().trim();
                        
                        try {
                            Course c = courseService.getCourseById(findId);
                            System.out.println("✅ Found Course Details:");
                            System.out.println("   ID: " + c.getCourseId());
                            System.out.println("   Title: " + c.getTitle());
                            System.out.println("   Level: " + c.getLevel());
                            System.out.println("   Duration: " + c.getDurationHours() + " hours");
                        } catch (CourseNotFoundException e) {
                            System.out.println("❌ " + e.getMessage());
                        }
                        break;

                    case "5":
                        running = false;
                        break;

                    default:
                        System.out.println("❌ Invalid option. Please choose between 1 and 5.");
                }
            }
        }

        System.out.println("\nThank you for using the Course Management System!");
    }
}   
