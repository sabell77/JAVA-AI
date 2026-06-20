package com.fullstack.demo.repository;

import java.util.List;
import java.util.Optional;

import com.fullstack.demo.model.Course;

public interface CourseRepository {
    Course save(Course course);
    Optional<Course> findById(String courseId);
    List<Course> findAll();
    void deleteById(String courseId);
    boolean existsById(String courseId);
}