import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Decimal } from "@prisma/client/runtime/library";
import { Listing } from "@prisma/client";

function formatPrice(price: Decimal | null): string {
  if (price === null) return "RFQ Only";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price.toNumber());
}

export default async function MyListingsPage() {
  const session = await auth();

  if (!session || session.user.role !== "supplier") {
    return <p>Unauthorized</p>;
  }

  const listings: Listing[] = await prisma.listing.findMany({
    where: { supplierId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container">
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className="page-title">📦 My Listings</h1>
          <p className="page-subtitle">Manage your products and services</p>
        </div>
        <Link href="/listings/new" className="btn btn-primary">
          ➕ Create New Listing
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">📭</div>
          <h3 className="empty-state-title">No listings yet</h3>
          <p style={{ marginBottom: "1rem" }}>Create your first listing to start selling on the marketplace</p>
          <Link href="/listings/new" className="btn btn-primary">
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id}>
                  <td>
                    <strong>{listing.name}</strong>
                  </td>
                  <td>
                    <span className="badge badge-secondary">
                      {listing.category.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    {listing.quantityAvailable} {listing.unit}
                  </td>
                  <td>
                    <span style={{ color: "var(--primary)", fontWeight: 500 }}>
                      {formatPrice(listing.unitPrice)}
                    </span>
                  </td>
                  <td>
                    {listing.isActive ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-secondary">Inactive</span>
                    )}
                  </td>
                  <td>
                    <Link href={`/listings/${listing.id}/edit`} className="btn btn-outline btn-sm">
                      ✏️ Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
