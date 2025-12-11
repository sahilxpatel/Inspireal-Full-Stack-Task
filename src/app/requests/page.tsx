import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";
import RequestStatusForm from "./RequestStatusForm";
import { Prisma } from "@prisma/client";

function formatPrice(price: Decimal | null): string {
  if (price === null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price.toNumber());
}

type RequestWithRelations = Prisma.RequestGetPayload<{
  include: {
    listing: { select: { name: true; unit: true } };
    buyer: { select: { name: true; email: true } };
  };
}>;

export default async function SupplierRequestsPage() {
  const session = await auth();

  if (!session || session.user.role !== "supplier") {
    return <p>Unauthorized</p>;
  }

  const requests: RequestWithRelations[] = await prisma.request.findMany({
    where: { supplierId: session.user.id },
    include: {
      listing: {
        select: { name: true, unit: true },
      },
      buyer: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container">
      <div className="page-header">
        <h1 className="page-title">📬 Incoming Requests</h1>
        <p className="page-subtitle">Manage buyer requests for your products</p>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-state-icon">📭</div>
          <h3 className="empty-state-title">No requests yet</h3>
          <p>When buyers request your products, they&apos;ll appear here</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Buyer</th>
                <th>Quantity</th>
                <th>Type</th>
                <th>Total</th>
                <th>Message</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <strong>{request.listing.name}</strong>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{request.buyer.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{request.buyer.email}</div>
                  </td>
                  <td>
                    {request.requestedQuantity} {request.listing.unit}
                  </td>
                  <td>
                    <span className={`badge ${request.pricingModeSnapshot === "fixed" ? "badge-primary" : "badge-secondary"}`}>
                      {request.pricingModeSnapshot === "fixed" ? "Fixed" : "RFQ"}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500, color: "var(--primary)" }}>
                    {formatPrice(request.totalAmount)}
                  </td>
                  <td style={{ maxWidth: "150px", fontSize: "0.875rem", color: "var(--muted)" }}>
                    {request.message || "-"}
                  </td>
                  <td>
                    <span className={`badge ${
                      request.status === "accepted"
                        ? "badge-success"
                        : request.status === "rejected"
                        ? "badge-danger"
                        : "badge-warning"
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td>
                    {request.pricingModeSnapshot === "fixed"
                      ? request.paymentStatus === "marked_paid"
                        ? <span className="badge badge-success">✓ Paid</span>
                        : <span className="badge badge-secondary">Unpaid</span>
                      : "-"}
                  </td>
                  <td>
                    <RequestStatusForm
                      requestId={request.id}
                      currentStatus={request.status}
                      pricingMode={request.pricingModeSnapshot}
                      paymentStatus={request.paymentStatus}
                  />
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
