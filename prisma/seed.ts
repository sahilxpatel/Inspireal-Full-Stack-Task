import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.request.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  // Create supplier
  const supplierPassword = await bcrypt.hash("password123", 12);
  const supplier = await prisma.user.create({
    data: {
      name: "Sahil Supplier",
      email: "supplier@example.com",
      hashedPassword: supplierPassword,
      role: "supplier",
    },
  });
  console.log("Created supplier:", supplier.email);

  // Create buyer
  const buyerPassword = await bcrypt.hash("password123", 12);
  const buyer = await prisma.user.create({
    data: {
      name: "Sahil Buyer",
      email: "buyer@example.com",
      hashedPassword: buyerPassword,
      role: "buyer",
    },
  });
  console.log("Created buyer:", buyer.email);

  // Create listings
  const listings = [
    {
      category: "raw_material" as const,
      name: "Steel Bars",
      description: "High quality steel bars for construction. Grade A certified, suitable for structural applications.",
      quantityAvailable: 1000,
      unit: "kg" as const,
      locationCountry: "United States",
      pricingMode: "fixed" as const,
      unitPrice: 2.5,
    },
    {
      category: "raw_material" as const,
      name: "Copper Wire",
      description: "Premium copper wire for electrical applications. 99.9% purity, various gauges available.",
      quantityAvailable: 500,
      unit: "kg" as const,
      locationCountry: "Germany",
      pricingMode: "fixed" as const,
      unitPrice: 8.75,
    },
    {
      category: "service" as const,
      name: "Welding Services",
      description: "Professional welding and fabrication services. MIG, TIG, and arc welding available.",
      quantityAvailable: 100,
      unit: "unit" as const,
      locationCountry: "Canada",
      pricingMode: "rfq_only" as const,
      unitPrice: null,
    },
    {
      category: "other" as const,
      name: "Industrial Lubricant",
      description: "Multi-purpose industrial lubricant for heavy machinery. Long-lasting formula.",
      quantityAvailable: 200,
      unit: "litre" as const,
      locationCountry: "Japan",
      pricingMode: "fixed" as const,
      unitPrice: 15.0,
    },
    {
      category: "raw_material" as const,
      name: "Aluminum Sheets",
      description: "Lightweight aluminum sheets for manufacturing. Various thicknesses from 1mm to 10mm.",
      quantityAvailable: 750,
      unit: "kg" as const,
      locationCountry: "China",
      pricingMode: "fixed" as const,
      unitPrice: 4.25,
    },
    {
      category: "raw_material" as const,
      name: "Stainless Steel Tubes",
      description: "Corrosion-resistant stainless steel tubes. Ideal for plumbing and industrial use.",
      quantityAvailable: 300,
      unit: "unit" as const,
      locationCountry: "India",
      pricingMode: "fixed" as const,
      unitPrice: 12.5,
    },
    {
      category: "service" as const,
      name: "CNC Machining",
      description: "Precision CNC machining services for custom parts. Tolerances up to ±0.01mm.",
      quantityAvailable: 50,
      unit: "unit" as const,
      locationCountry: "South Korea",
      pricingMode: "rfq_only" as const,
      unitPrice: null,
    },
    {
      category: "other" as const,
      name: "Safety Equipment Bundle",
      description: "Complete safety kit including helmets, gloves, goggles, and vests. OSHA compliant.",
      quantityAvailable: 500,
      unit: "unit" as const,
      locationCountry: "United Kingdom",
      pricingMode: "fixed" as const,
      unitPrice: 45.0,
    },
    {
      category: "raw_material" as const,
      name: "Carbon Fiber Rolls",
      description: "High-strength carbon fiber for aerospace and automotive applications. 3K weave pattern.",
      quantityAvailable: 100,
      unit: "kg" as const,
      locationCountry: "France",
      pricingMode: "fixed" as const,
      unitPrice: 85.0,
    },
    {
      category: "service" as const,
      name: "Quality Inspection",
      description: "Third-party quality inspection and certification services. ISO 9001 auditors.",
      quantityAvailable: 200,
      unit: "unit" as const,
      locationCountry: "Singapore",
      pricingMode: "rfq_only" as const,
      unitPrice: null,
    },
  ];

  for (const listing of listings) {
    const created = await prisma.listing.create({
      data: {
        supplierId: supplier.id,
        ...listing,
      },
    });
    console.log("Created listing:", created.name);
  }

  console.log("Seeding complete!");
  console.log("\nTest credentials:");
  console.log("  Supplier: supplier@example.com / password123");
  console.log("  Buyer: buyer@example.com / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
