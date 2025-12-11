import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== "supplier") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify ownership
    const existingRequest = await prisma.request.findUnique({
      where: { id },
    });

    if (!existingRequest) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    if (existingRequest.supplierId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    if (existingRequest.status !== "accepted") {
      return NextResponse.json(
        { error: "Can only mark accepted requests as paid" },
        { status: 400 }
      );
    }

    if (existingRequest.pricingModeSnapshot !== "fixed") {
      return NextResponse.json(
        { error: "Can only mark fixed-price requests as paid" },
        { status: 400 }
      );
    }

    const updated = await prisma.request.update({
      where: { id },
      data: { paymentStatus: "marked_paid" },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error marking as paid:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
