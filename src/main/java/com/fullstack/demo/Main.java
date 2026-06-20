package com.fullstack.demo;

import com.fullstack.demo.model.*;

public class Main {
    public static void main(String[] args) {
        // Syntax for creating a new object (instance) of the Course class
        // ClassName objectName = new Constructor();
        // ClassName and Constructor usually match

        Instructor instructor1 = new Instructor("I001", "Alice Johnson", "Java Development");
        Instructor instructor2 = new Instructor("I002", "Bob Smith", "React Development");

        Course course1 = new Course("C001", "Java Fundamentals", 14, "Beginner", "Programming", true);
        Course course2 = new Course("C002", "React Frontend Development", 21, "Intermediate", "Frontend", false);

        CourseOffering offering1 = new CourseOffering(
            "OFF001",
            "Java Fundamentals - June 2026 Intake",
            course1,
            instructor1,
            "2026-06-19",
            "2026-06-20",
            25,
            "Online"
        );

        CourseOffering offering2 = new CourseOffering(
            "OFF002",
            "React Frontend - Corporate Cohort",
            course2,
            instructor2,
            "2026-07-01",
            "2026-07-15",
            15,
            "Hybrid"
        );

        System.out.println("================================================");
        System.out.println("          COURSE OFFERING SUMMARIES             ");
        System.out.println("================================================");
        offering1.printOfferingSummary();
        offering2.printOfferingSummary();

        Student student1 = new Student("S001", "Charlie Brown", "cFq0l@example.com");
        Student student2 = new Student("S002", "Daisy Duck", "d4oQG@example.com");

        course1.setInstructor(instructor1);
        course2.setInstructor(instructor2);

        System.out.println("================================================");
        System.out.println("               Instructor Profiles              ");
        System.out.println("================================================");
        instructor1.printProfile();
        instructor2.printProfile();

        System.out.println("================================================");
        System.out.println("                Course Summaries                ");
        System.out.println("================================================");
        course1.printSummary();
        course2.printSummary();

        System.out.println("================================================");
        System.out.println("                Student Profiles                ");
        System.out.println("================================================");
        student1.printProfile();
        student2.printProfile();

    }
}