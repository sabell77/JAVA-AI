package com.fullstack.demo;

public class Instructor {
    private String instructorId;
    private String instructorName;
    private String expertise;

    public Instructor(String instructorId, String instructorName, String expertise) {
        this.instructorId = instructorId;
        this.instructorName = instructorName;
        this.expertise = expertise;
    }

    public String getInstructorId() {
        return instructorId;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public String getExpertise() {
        return expertise;
    }

    public void printProfile() {
        System.out.println("Instructor ID: " + instructorId);
        System.out.println("Name: " + instructorName);
        System.out.println("Expertise: " + expertise);
    }
}