"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createRequestSchema, updateRequestStatusSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

type ActionState = { error?: string; success?: boolean } | null;

export async function createRequestAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();

  if (!session || session.user.role !== "buyer") {
    return { error: "Unauthorized - only buyers can create requests" };
  }

  const rawData = {
    listingId: formData.get("listingId") as string,
    requestedQuantity: formData.get("requestedQuantity") as string,
    message: formData.get("message") as string || undefined,
  };

  const parsed = createRequestSchema.safeParse({
    ...rawData,
    requestedQuantity: parseInt(rawData.requestedQuantity, 10),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { listingId, requestedQuantity, message } = parsed.data;

  // Get the listing
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    return { error: "Listing not found" };
  }

  if (!listing.isActive) {
    return { error: "Listing is no longer active" };
  }

  // Calculate total amount for fixed pricing
  const totalAmount = listing.pricingMode === "fixed" && listing.unitPrice
    ? listing.unitPrice.toNumber() * requestedQuantity
    : null;

  // Create the request
  await prisma.request.create({
    data: {
      listingId,
      buyerId: session.user.id,
      supplierId: listing.supplierId,
      requestedQuantity,
      message: message || null,
      pricingModeSnapshot: listing.pricingMode,
      unitPriceSnapshot: listing.unitPrice,
      totalAmount,
    },
  });

  revalidatePath("/");
  revalidatePath("/my-requests");
  revalidatePath("/requests");

  return { success: true };
}

export async function updateRequestStatusAction(
  requestId: string,
  formData: FormData
): Promise<void> {
  const session = await auth();

  if (!session || session.user.role !== "supplier") {
    throw new Error("Unauthorized");
  }

  const rawData = {
    status: formData.get("status") as string,
  };

  const parsed = updateRequestStatusSchema.safeParse(rawData);

  if (!parsed.success) {
    throw new Error(parsed.error.errors[0].message);
  }

  // Verify the supplier owns this request
  const existingRequest = await prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!existingRequest) {
    throw new Error("Request not found");
  }

  if (existingRequest.supplierId !== session.user.id) {
    throw new Error("Unauthorized - this request is not for your listings");
  }

  await prisma.request.update({
    where: { id: requestId },
    data: { status: parsed.data.status },
  });

  revalidatePath("/requests");
  revalidatePath("/my-requests");
}

export async function markAsPaidAction(requestId: string): Promise<void> {
  const session = await auth();

  if (!session || session.user.role !== "supplier") {
    throw new Error("Unauthorized");
  }

  // Verify the supplier owns this request
  const existingRequest = await prisma.request.findUnique({
    where: { id: requestId },
  });

  if (!existingRequest) {
    throw new Error("Request not found");
  }

  if (existingRequest.supplierId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  if (existingRequest.status !== "accepted") {
    throw new Error("Can only mark accepted requests as paid");
  }

  if (existingRequest.pricingModeSnapshot !== "fixed") {
    throw new Error("Can only mark fixed-price requests as paid");
  }

  await prisma.request.update({
    where: { id: requestId },
    data: { paymentStatus: "marked_paid" },
  });

  revalidatePath("/requests");
}
