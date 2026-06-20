package com.fullstack.demo;

import java.util.ArrayList;
import com.fullstack.demo.model.*;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

public class Main {
    public static void main(String[] args) {
        CourseRepository repository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(repository);

        ArrayList<Instructor> instructors = new ArrayList<>();
        instructors.add(new Instructor("I001", "Aina Rahman", "Java Development"));
        instructors.add(new Instructor("I002", "Bob Smith", "React Development"));

        ArrayList<Course> courses = new ArrayList<>();
        courses.add(new Course("C001", "Java Fundamentals", 14, "Beginner", "Programming", true));
        courses.add(new Course("C002", "React Frontend Development", 21, "Intermediate", "Frontend", true));
        courses.add(new Course("C003", "MongoDB Basics", 14, "Beginner", "Database", false));

        ArrayList<Student> students = new ArrayList<>();
        students.add(new Student("S001", "Alice Johnson", "alice@example.com"));
        students.add(new Student("S002", "Charlie Brown", "charlie@example.com"));
        students.add(new Student("S003", "Diana Prince", "diana@example.com"));

        courses.get(0).setInstructor(instructors.get(0));
        courses.get(1).setInstructor(instructors.get(1));

        courseService.createCourse(courses.get(0));
        courseService.createCourse(courses.get(1));
        courseService.createCourse(courses.get(2));

        ArrayList<CourseOffering> offerings = new ArrayList<>();
        offerings.add(new CourseOffering(
            "OFF001", 
            "Java Fundamentals - June 2026 Intake", 
            courses.get(0),       // References first course item in our list
            instructors.get(0),   // References first instructor item in our list
            "2026-06-19", 
            "2026-06-20", 
            25, 
            "Online"
        ));

        offerings.add(new CourseOffering(
            "OFF002", 
            "React Frontend - Corporate Cohort", 
            courses.get(1),       // References second course item in our list
            instructors.get(1),   // References second instructor item in our list
            "2026-07-01", 
            "2026-07-15", 
            15, 
            "Hybrid"
        ));

        System.out.println("================================================");
        System.out.println("          COURSE OFFERING SUMMARIES             ");
        System.out.println("================================================");
        for (CourseOffering offering : offerings) {
            offering.printOfferingSummary();
        }

        System.out.println("================================================");
        System.out.println("               Instructor Profiles              ");
        System.out.println("================================================");
        for (Instructor instructor : instructors) {
            instructor.printProfile();
        }

        System.out.println("================================================");
        System.out.println("                Course Summaries                ");
        System.out.println("================================================");
        for (Course course : courses) {
            course.printSummary();
        }

        System.out.println("================================================");
        System.out.println("                Student Profiles                ");
        System.out.println("================================================");
        for (Student student : students) {
            student.printProfile();
        }

    }
}