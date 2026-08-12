import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  studentId: z.string().trim().min(2, "Enter your student ID"),
  universityEmail: z.string().trim().email("Enter a valid email address"),
  department: z.string().trim().min(1, "Select your department"),
  phone: z.string().trim().min(6, "Enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  universityEmail: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export const editProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  department: z.string().trim().min(1, "Select your department"),
  phone: z.string().trim().min(6, "Enter a valid phone number"),
});

export const changePasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electrical & Electronic Engineering",
  "Business Administration",
  "Economics",
  "English",
  "Architecture",
  "Civil Engineering",
  "Pharmacy",
  "Law",
  "Other",
];
