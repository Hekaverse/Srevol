import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema, createBucketSchema, buildPackageSchema } from "./validation";

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      name: "Alex",
      email: "alex@example.com",
      password: "Password123",
      partnerEmail: "partner@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects weak password", () => {
    const result = registerSchema.safeParse({
      name: "Alex",
      email: "alex@example.com",
      password: "weak",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      name: "Alex",
      email: "not-an-email",
      password: "Password123",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid login data", () => {
    const result = loginSchema.safeParse({
      email: "alex@example.com",
      password: "password",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing password", () => {
    const result = loginSchema.safeParse({
      email: "alex@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("buildPackageSchema", () => {
  it("accepts valid package config", () => {
    const result = buildPackageSchema.safeParse({
      destination: "Santorini",
      duration: 7,
    });
    expect(result.success).toBe(true);
  });

  it("rejects duration over 30 days", () => {
    const result = buildPackageSchema.safeParse({
      destination: "Santorini",
      duration: 31,
    });
    expect(result.success).toBe(false);
  });
});
