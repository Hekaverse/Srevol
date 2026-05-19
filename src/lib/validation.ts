import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  partnerEmail: z.string().email("Invalid partner email").optional().or(z.literal("")),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createBucketSchema = z.object({
  tierId: z.string().min(1, "Tier is required"),
  coupleId: z.string().min(1, "Couple ID is required"),
  targetAmount: z.number().positive().optional(),
  months: z.number().int().min(12).max(48).optional(),
  initialDeposit: z.number().min(0).optional(),
  preferredDestinations: z.array(z.string()).optional(),
  preferredDates: z.object({ start: z.string(), end: z.string() }).optional(),
});

export const buildPackageSchema = z.object({
  destination: z.string().min(1, "Destination is required"),
  duration: z.number().int().positive().max(30),
  budgetMax: z.number().positive().optional(),
});

export const createBookingSchema = z.object({
  bucketId: z.string().min(1, "Bucket ID is required"),
  packageId: z.string().min(1, "Package ID is required"),
  travelDate: z.string().datetime().optional(),
});

export const processPaymentSchema = z.object({
  bucketId: z.string().min(1, "Bucket ID is required"),
  amount: z.number().positive(),
});

export const seedSchema = z.object({
  secret: z.string().min(1, "Seed secret is required"),
});
