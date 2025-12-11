import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";
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
    supplier: { select: { name: true } };
  };
}>;

export default async function MyRequestsPage() {
  const session = await auth();

  if (!session || session.user.role !== "buyer") {
    return <p>Unauthorized</p>;
  }

  const requests: RequestWithRelations[] = await prisma.request.findMany({
    where: { buyerId: session.user.id },
    include: {
      listing: {
        select: { name: true, unit: true },
      },
      supplier: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const statusColors: Record<string, { bg: string; color: string }> = {
    pending: { bg: "#fef3c7", color: "#b45309" },
    accepted: { bg: "#d1fae5", color: "#047857" },
    rejected: { bg: "#fee2e2", color: "#b91c1c" },
  };

  return (
    <main style={{ background: "var(--background)", minHeight: "calc(100vh - 60px)" }}>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "4rem 1.5rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>My Requests</h1>
        <p style={{ marginTop: "0.75rem", opacity: 0.9, fontSize: "1.0625rem" }}>Track your purchase requests and quotes</p>
      </section>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "2rem 1rem" }}>
        {requests.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "3rem",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>No requests yet</h3>
            <p style={{ color: "#64748b", marginTop: "0.5rem" }}>Browse the marketplace and request products from suppliers</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {requests.map((request) => (
              <div
                key={request.id}
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  padding: "1.25rem 1.5rem",
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "1rem",
                  alignItems: "center",
                }}
              >
                {/* Left: Details */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>{request.listing.name}</h3>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        padding: "0.25rem 0.5rem",
                        borderRadius: 4,
                        background: statusColors[request.status]?.bg || "#e2e8f0",
                        color: statusColors[request.status]?.color || "#334155",
                        textTransform: "capitalize",
                      }}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem", margin: 0 }}>
                    Supplier: <strong style={{ color: "#334155" }}>{request.supplier.name}</strong>
                    {" · "}
                    Qty: <strong style={{ color: "#334155" }}>{request.requestedQuantity} {request.listing.unit}</strong>
                    {" · "}
                    {request.pricingModeSnapshot === "fixed" ? "Fixed Price" : "RFQ"}
                  </p>
                  <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginTop: "0.375rem" }}>
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Right: Price & Payment */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "#667eea" }}>
                    {formatPrice(request.totalAmount)}
                  </div>
                  {request.pricingModeSnapshot === "fixed" && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        padding: "0.25rem 0.5rem",
                        borderRadius: 4,
                        background: request.paymentStatus === "marked_paid" ? "#d1fae5" : "#f1f5f9",
                        color: request.paymentStatus === "marked_paid" ? "#047857" : "#64748b",
                        display: "inline-block",
                        marginTop: "0.375rem",
                      }}
                    >
                      {request.paymentStatus === "marked_paid" ? "Paid" : "Unpaid"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
