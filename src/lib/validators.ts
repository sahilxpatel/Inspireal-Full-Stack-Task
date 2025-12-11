import { z } from "zod";

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["buyer", "supplier"], {
    errorMap: () => ({ message: "Role must be buyer or supplier" }),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Listing schema
export const listingSchema = z
  .object({
    category: z.enum(["raw_material", "service", "other"], {
      errorMap: () => ({ message: "Invalid category" }),
    }),
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name must be at most 100 characters"),
    description: z
      .string()
      .max(1000, "Description must be at most 1000 characters")
      .default(""),
    quantityAvailable: z.coerce
      .number()
      .int("Quantity must be an integer")
      .min(0, "Quantity must be >= 0"),
    unit: z.enum(["kg", "ton", "litre", "unit"], {
      errorMap: () => ({ message: "Invalid unit" }),
    }),
    locationCountry: z.string().min(1, "Location country is required"),
    pricingMode: z.enum(["fixed", "rfq_only"], {
      errorMap: () => ({ message: "Invalid pricing mode" }),
    }),
    unitPrice: z
      .string()
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
    isActive: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.pricingMode === "fixed") {
        if (!data.unitPrice) return false;
        const price = parseFloat(data.unitPrice);
        return !isNaN(price) && price >= 0;
      }
      return true;
    },
    {
      message: "Unit price is required and must be >= 0 for fixed pricing",
      path: ["unitPrice"],
    }
  );

export type ListingInput = z.infer<typeof listingSchema>;

// Request creation schema
export const createRequestSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  requestedQuantity: z.coerce
    .number()
    .int("Quantity must be an integer")
    .positive("Quantity must be > 0"),
  message: z.string().max(1000, "Message must be at most 1000 characters").optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

// Request status update schema
export const updateRequestStatusSchema = z.object({
  status: z.enum(["accepted", "rejected"], {
    errorMap: () => ({ message: "Status must be accepted or rejected" }),
  }),
});

export type UpdateRequestStatusInput = z.infer<typeof updateRequestStatusSchema>;
