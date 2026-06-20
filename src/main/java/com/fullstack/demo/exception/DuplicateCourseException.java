package com.fullstack.demo.exception;

public class DuplicateCourseException extends RuntimeException {
    public DuplicateCourseException(String courseId) {
        super("Duplicate course found with ID: " + courseId);
    }

}
