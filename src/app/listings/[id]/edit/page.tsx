import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import EditListingForm from "./EditListingForm";

interface EditListingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session || session.user.role !== "supplier") {
    redirect("/auth/login");
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) {
    notFound();
  }

  // Verify ownership
  if (listing.supplierId !== session.user.id) {
    redirect("/listings/mine");
  }

  return (
    <main className="container container-md">
      <div className="page-header">
        <h1 className="page-title">✏️ Edit Listing</h1>
        <p className="page-subtitle">Update your product or service details</p>
      </div>
      <div className="card">
        <EditListingForm
          listing={{
            id: listing.id,
            category: listing.category,
            name: listing.name,
            description: listing.description,
            quantityAvailable: listing.quantityAvailable,
            unit: listing.unit,
            locationCountry: listing.locationCountry,
            pricingMode: listing.pricingMode,
            unitPrice: listing.unitPrice ? listing.unitPrice.toNumber() : null,
            isActive: listing.isActive,
          }}
        />
      </div>
    </main>
  );
}
