package com.fullstack.demo.service;

import java.util.List;
import java.util.stream.Collectors;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.exception.CourseNotFoundException;
import com.fullstack.demo.exception.InvalidCourseException;
import com.fullstack.demo.model.Course;
import com.fullstack.demo.model.Instructor;

public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public Course createCourse(Course course) {
        validateCourse(course);
        return courseRepository.save(course);
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<Course> searchByTitle(String keyword) {
        // Safe check: Treat null keyword as an empty string ""
        final String searchKeyword = (keyword == null) ? "" : keyword.toLowerCase().trim();

        return courseRepository.findAll().stream()
                .filter(course -> course.getTitle() != null && 
                                  course.getTitle().toLowerCase().contains(searchKeyword))
                .collect(Collectors.toList()); 
    }

    public List<Course> filterByLevel(String level) {
        // Safe check: Treat null level as an empty string ""
        final String filterLevel = (level == null) ? "" : level.toLowerCase().trim();

        return courseRepository.findAll().stream()
                .filter(course -> course.getLevel() != null && 
                                  course.getLevel().toLowerCase().equalsIgnoreCase(filterLevel))
                .collect(Collectors.toList());
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

    public Course assignInstructor(String courseId, Instructor instructor) {
        Course course = getCourseById(courseId); // 1. Find the course by ID 
        course.setInstructor(instructor); // 2. Assign the instructor to the course
        return courseRepository.save(course); // 3 & 4. Save and return the updated course
    }

    public List<Course> searchByInstructorName(String instructorName) {
        // 1 & 2. Handle null input safely by treating it as an empty string
        final String searchName = (instructorName == null) ? "" : instructorName.toLowerCase().trim();

        // 3. Search all courses using Java Streams
        return courseRepository.findAll().stream()
                // 4. Critical Checkpoint: Ignore courses that don't have an instructor assigned yet
                .filter(course -> course.getInstructor() != null)
                // 5 & 6. Match instructor name ignoring uppercase/lowercase differences
                .filter(course -> course.getInstructor().getName() != null &&
                                  course.getInstructor().getName().toLowerCase().contains(searchName))
                .collect(Collectors.toList());
    }

    public Course updateDuration(String courseId, int newDurationHours) {
        Course course = getCourseById(courseId);
        if (newDurationHours <= 0) {
            throw new InvalidCourseException("Course duration must be greater than zero.");
        }
        course.setDurationHours(newDurationHours);
        return courseRepository.save(course);
    }

    public void deleteCourse(String courseId) {
        getCourseById(courseId);
        courseRepository.deleteById(courseId);
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
}