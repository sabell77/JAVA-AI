package com.fullstack.demo.repository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.fullstack.demo.model.Course;

public class InMemoryCourseRepository implements CourseRepository {
    // Implementation details would go here
    private final Map<String, Course> courses = new LinkedHashMap<>();

    @Override
    public Course save(Course course) {
        courses.put(course.getCourseId(), course);
        return course;
    }

    @Override
    public Optional<Course> findById(String courseId) {
        return Optional.ofNullable(courses.get(courseId));
    }

    @Override
    public List<Course> findAll() {
        return new ArrayList<>(courses.values());
    }

    @Override
    public void deleteById(String courseId) {
        courses.remove(courseId);
    }

    @Override
    public boolean existsById(String courseId) {
        return courses.containsKey(courseId);
    }
}