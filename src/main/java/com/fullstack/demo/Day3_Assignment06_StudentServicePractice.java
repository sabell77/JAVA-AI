package com.fullstack.demo;

import com.fullstack.demo.exception.StudentNotFoundException;
import com.fullstack.demo.model.Student;
import com.fullstack.demo.repository.StudentRepository;
import com.fullstack.demo.repository.InMemoryStudentRepository;
import com.fullstack.demo.service.StudentService;
import java.util.List;

public class Day3_Assignment06_StudentServicePractice {
    public static void main(String[] args) {
        // 1. Core Setup
        StudentRepository repo = new InMemoryStudentRepository();
        StudentService service = new StudentService(repo);

        // 2. Register Students
        System.out.println("=== Register Students ===");
        service.registerStudent(new Student("S001", "Roberto Chan", "roberto@example.com"));
        service.registerStudent(new Student("S002", "Priya Nair", "priya@example.com"));
        service.registerStudent(new Student("S003", "Lee Salazar", "lee@example.com"));
        System.out.println("Successfully registered 3 students.");
        System.out.println();

        // 3. Print All Students
        System.out.println("=== All Students ===");
        for (Student s : service.getAllStudents()) {
            System.out.println(s.getStudentId() + " - " + s.getStudentName() + " (" + s.getEmail() + ")");
        }
        System.out.println();

        // 4. Find Single Target
        System.out.println("=== Find Student By ID ===");
        Student target = service.getStudentById("S002");
        System.out.println("Found: " + target.getStudentName());
        System.out.println();

        // 5. Query Strings
        System.out.println("=== Search Student By Name ===");
        List<Student> searchResults = service.searchByNameUsingLoop("pri");
        for (Student s : searchResults) {
            System.out.println("Match: " + s.getStudentName());
        }
        System.out.println();

        // 6. Exception Escalation Target Validation Test
        System.out.println("=== Missing Student Test ===");
        try {
            service.getStudentById("S999");
        } catch (StudentNotFoundException e) {
            System.out.println(e.getMessage());
        }
        System.out.println();
    }
} 