package com.fullstack.demo.repository;

import com.fullstack.demo.model.Student;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class InMemoryStudentRepository implements StudentRepository {
    private final Map<String, Student> students = new LinkedHashMap<>();

    @Override
    public Student save(Student student) {
        students.put(student.getStudentId(), student);
        return student;
    }

    @Override
    public Optional<Student> findById(String studentId) {
        return Optional.ofNullable(students.get(studentId));
    }

    @Override
    public List<Student> findAll() {
        return new ArrayList<>(students.values());
    }

    @Override
    public boolean existsById(String studentId) {
        return students.containsKey(studentId);
    }
}