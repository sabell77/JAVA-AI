package com.fullstack.demo.model;

public class Course {
    private String courseId;
    private String title;
    private int durationHours;
    private String level;
    private Instructor instructor;
    private String category;
    private boolean active;

    public Course(String courseId, String title, int durationHours, String level, String category, boolean active) {
        setCourseId(courseId);
        setTitle(title);
        setDurationHours(durationHours);
        setLevel(level);
        setCategory(category);
        setActive(active);
    }

    public String getCourseId() { return courseId;}
    public void setCourseId(String courseId) { 
        this.courseId = requireText(courseId, "Course ID"); }
        
    public String getTitle() { return title; }
    public void setTitle(String title) { 
        this.title = requireText(title, "CourseTitle"); }

    public int getDurationHours() { return durationHours;}
    public void setDurationHours(int durationHours) {
        if (durationHours <= 0) {
            throw new IllegalArgumentException("Duration must be more than 0.");
        }
        this.durationHours = durationHours;
    }

    public String getLevel() {return level;}
    public void setLevel(String level) {
        this.level = requireText(level, "Level");
    }

    public String getCategory() { return category;}
    public void setCategory(String category) {
        this.category = requireText(category, "Category");
    }

    public boolean isActive() {return active;}
    public void setActive(boolean active) { this.active = active; }   

    public Instructor getInstructor() {return instructor;}
    public void setInstructor(Instructor instructor) {
        this.instructor = instructor;
    }

    private static String requireText(String value, String fieldName) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(fieldName + " is required.");
        }
        return value.trim();
    }

    public void printSummary() {
        System.out.println("Course ID: " + courseId);
        System.out.println("Title: " + title);
        System.out.println("Duration: " + durationHours + " hours");
        System.out.println("Level: " + level);
        System.out.println("Category: " + category);

        String friendlyStatus = active ? "Active" : "Inactive";
        System.out.println("Status: " + friendlyStatus);

        if (instructor == null) {
            System.out.println("Instructor: Not assigned yet");
        } else {
            System.out.println("Instructor: " + instructor.getInstructorName());
        }
    }
}