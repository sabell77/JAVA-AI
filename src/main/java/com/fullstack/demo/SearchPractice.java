package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;
import java.util.List;

public class SearchPractice {
    public static void main(String[] args) {
        // 1. Create Repository and Service Layers
        CourseRepository repository = new InMemoryCourseRepository();
        CourseService service = new CourseService(repository);

        // 2. Populate data matrix with 4 courses
        service.createCourse(new Course("C001", "Java Fundamentals", 14, "Beginner", "Programming", true));
        service.createCourse(new Course("C002", "React Frontend Development", 21, "Intermediate", "Web", true));
        service.createCourse(new Course("C003", "MongoDB Basics", 8, "Beginner", "Data", true));
        service.createCourse(new Course("C004", "Spring Boot API Development", 24, "Intermediate", "Programming", true));

        // 3. Run Loop-based search
        System.out.println("=== Beginner Courses (Using Loop) ===");
        List<Course> beginnerCoursesLoop = service.searchByLevelUsingLoop("Beginner");
        for (Course course : beginnerCoursesLoop) {
            System.out.println(course.getCourseId() + " - " + course.getTitle() + " (" + course.getLevel() + ")");
        }

        // 4. Run Stream-based search (With extra newline separation)
        System.out.println(); 
        System.out.println("=== Beginner Courses (Using Stream) ===");
        List<Course> beginnerCoursesStream = service.searchByLevelUsingStream("  beginner  "); // Testing trim and ignore case
        for (Course course : beginnerCoursesStream) {
            System.out.println(course.getCourseId() + " - " + course.getTitle() + " (" + course.getLevel() + ")");
        }
        System.out.println();
    }
}