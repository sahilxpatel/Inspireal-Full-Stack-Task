import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  listingSchema,
  createRequestSchema,
  updateRequestStatusSchema,
} from "@/lib/validators";

describe("registerSchema", () => {
  it("should validate a correct registration", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "buyer",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid email", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "not-an-email",
      password: "password123",
      role: "buyer",
    });
    expect(result.success).toBe(false);
  });

  it("should reject short password", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "123",
      role: "buyer",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid role", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "admin",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("should validate correct login", () => {
    const result = loginSchema.safeParse({
      email: "john@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should reject missing password", () => {
    const result = loginSchema.safeParse({
      email: "john@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("listingSchema", () => {
  it("should validate a fixed-price listing", () => {
    const result = listingSchema.safeParse({
      category: "raw_material",
      name: "Steel Bars",
      description: "High quality steel",
      quantityAvailable: 100,
      unit: "kg",
      locationCountry: "USA",
      pricingMode: "fixed",
      unitPrice: "10.50",
    });
    expect(result.success).toBe(true);
  });

  it("should validate an RFQ listing without price", () => {
    const result = listingSchema.safeParse({
      category: "service",
      name: "Welding Service",
      description: "",
      quantityAvailable: 50,
      unit: "unit",
      locationCountry: "Canada",
      pricingMode: "rfq_only",
      unitPrice: "",
    });
    expect(result.success).toBe(true);
  });

  it("should reject fixed-price listing without price", () => {
    const result = listingSchema.safeParse({
      category: "raw_material",
      name: "Steel Bars",
      quantityAvailable: 100,
      unit: "kg",
      locationCountry: "USA",
      pricingMode: "fixed",
      unitPrice: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject name shorter than 3 characters", () => {
    const result = listingSchema.safeParse({
      category: "other",
      name: "AB",
      quantityAvailable: 10,
      unit: "unit",
      locationCountry: "UK",
      pricingMode: "rfq_only",
    });
    expect(result.success).toBe(false);
  });
});

describe("createRequestSchema", () => {
  it("should validate a valid request", () => {
    const result = createRequestSchema.safeParse({
      listingId: "abc123",
      requestedQuantity: 10,
      message: "Please provide a quote",
    });
    expect(result.success).toBe(true);
  });

  it("should reject zero quantity", () => {
    const result = createRequestSchema.safeParse({
      listingId: "abc123",
      requestedQuantity: 0,
    });
    expect(result.success).toBe(false);
  });

  it("should reject negative quantity", () => {
    const result = createRequestSchema.safeParse({
      listingId: "abc123",
      requestedQuantity: -5,
    });
    expect(result.success).toBe(false);
  });
});

describe("updateRequestStatusSchema", () => {
  it("should accept 'accepted' status", () => {
    const result = updateRequestStatusSchema.safeParse({ status: "accepted" });
    expect(result.success).toBe(true);
  });

  it("should accept 'rejected' status", () => {
    const result = updateRequestStatusSchema.safeParse({ status: "rejected" });
    expect(result.success).toBe(true);
  });

  it("should reject invalid status", () => {
    const result = updateRequestStatusSchema.safeParse({ status: "pending" });
    expect(result.success).toBe(false);
  });
});
