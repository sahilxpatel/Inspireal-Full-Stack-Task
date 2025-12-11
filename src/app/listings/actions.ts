"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { listingSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type ActionState = { error?: string } | null;

export async function createListingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();

  if (!session || session.user.role !== "supplier") {
    return { error: "Unauthorized" };
  }

  const rawData = {
    category: formData.get("category") as string,
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || "",
    quantityAvailable: formData.get("quantityAvailable") as string,
    unit: formData.get("unit") as string,
    locationCountry: formData.get("locationCountry") as string,
    pricingMode: formData.get("pricingMode") as string,
    unitPrice: formData.get("unitPrice") as string,
  };

  const parsed = listingSchema.safeParse({
    ...rawData,
    quantityAvailable: parseInt(rawData.quantityAvailable, 10),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const data = parsed.data;

  await prisma.listing.create({
    data: {
      supplierId: session.user.id,
      category: data.category,
      name: data.name,
      description: data.description,
      quantityAvailable: data.quantityAvailable,
      unit: data.unit,
      locationCountry: data.locationCountry,
      pricingMode: data.pricingMode,
      unitPrice: data.pricingMode === "fixed" ? parseFloat(data.unitPrice!) : null,
    },
  });

  revalidatePath("/listings/mine");
  redirect("/listings/mine");
}

export async function updateListingAction(
  listingId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();

  if (!session || session.user.role !== "supplier") {
    return { error: "Unauthorized" };
  }

  // Verify ownership
  const existingListing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!existingListing || existingListing.supplierId !== session.user.id) {
    return { error: "Listing not found or unauthorized" };
  }

  const rawData = {
    category: formData.get("category") as string,
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || "",
    quantityAvailable: formData.get("quantityAvailable") as string,
    unit: formData.get("unit") as string,
    locationCountry: formData.get("locationCountry") as string,
    pricingMode: formData.get("pricingMode") as string,
    unitPrice: formData.get("unitPrice") as string,
    isActive: formData.get("isActive") === "on",
  };

  const parsed = listingSchema.safeParse({
    ...rawData,
    quantityAvailable: parseInt(rawData.quantityAvailable, 10),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const data = parsed.data;

  await prisma.listing.update({
    where: { id: listingId },
    data: {
      category: data.category,
      name: data.name,
      description: data.description,
      quantityAvailable: data.quantityAvailable,
      unit: data.unit,
      locationCountry: data.locationCountry,
      pricingMode: data.pricingMode,
      unitPrice: data.pricingMode === "fixed" ? parseFloat(data.unitPrice!) : null,
      isActive: rawData.isActive,
    },
  });

  revalidatePath("/listings/mine");
  redirect("/listings/mine");
}
