package com.fullstack.demo.service;

import java.util.List;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.exception.CourseNotFoundException;
import com.fullstack.demo.exception.InvalidCourseException;
import com.fullstack.demo.model.Course;

public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course createCourse(Course course) {
        validateCourse(course);
        return courseRepository.save(course);
    }

    private void validateCourse(Course course) {
        // 1. Check if course is null
        if (course == null) {
            throw new InvalidCourseException("Course cannot be null.");
        }
        // 2. Check Course ID
        if (isBlank(course.getCourseId())) {
            throw new InvalidCourseException("Course ID is required.");
        }
        // 3. Check Course Title
        if (isBlank(course.getTitle())) {
            throw new InvalidCourseException("Course title is required.");
        }
        // 4. Check Duration
        if (course.getDurationHours() <= 0) {
            throw new InvalidCourseException("Course duration must be greater than zero.");
        }
        // 5. Check Level
        if (isBlank(course.getLevel())) {
            throw new InvalidCourseException("Course level is required.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    public Course getCourseById(String courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new CourseNotFoundException(courseId));
    }
    // public Course getCourseById(String courseId) {
    //     Optional<Course> optionalCourse = courseRepository.findById(courseId);
    //     if (optionalCourse.isPresent()) {
    //         return optionalCourse.get();
    //     } else {
    //         throw new CourseNotFoundException(courseId);
    //     }
    // }
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
}