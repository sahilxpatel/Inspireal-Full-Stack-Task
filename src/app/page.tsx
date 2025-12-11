import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Decimal } from "@prisma/client/runtime/library";
import RequestForm from "@/components/RequestForm";
import CategoryFilter from "@/components/CategoryFilter";
import { Prisma } from "@prisma/client";

function formatPrice(price: Decimal | null): string {
  if (price === null) return "Request Quote";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price.toNumber());
}

type ListingWithSupplier = Prisma.ListingGetPayload<{
  include: { supplier: { select: { name: true } } };
}>;

const validCategories = ["raw_material", "service", "other"] as const;
type Category = typeof validCategories[number];

interface HomePageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const session = await auth();
  const { category } = await searchParams;

  const whereClause: Prisma.ListingWhereInput = {
    isActive: true,
  };
  
  if (category && category !== "all" && validCategories.includes(category as Category)) {
    whereClause.category = category as Category;
  }

  const listings: ListingWithSupplier[] = await prisma.listing.findMany({
    where: whereClause,
    include: {
      supplier: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ background: "var(--background)" }}>
      {/* Hero Section */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "3rem 1rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>🏪 B2B Marketplace</h1>
          <p style={{ fontSize: "1.125rem", opacity: 0.9, marginTop: "0.5rem" }}>
            Discover quality products and services from trusted suppliers
          </p>
          {!session && (
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.25rem" }}>
              <Link
                href="/auth/login"
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "#fff",
                  color: "#667eea",
                  fontWeight: 600,
                  borderRadius: 8,
                  textDecoration: "none",
                }}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "transparent",
                  color: "#fff",
                  fontWeight: 600,
                  borderRadius: 8,
                  border: "2px solid rgba(255,255,255,0.6)",
                  textDecoration: "none",
                }}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="container" style={{ paddingTop: "1.5rem" }}>
        {/* Category Filter */}
        <CategoryFilter currentCategory={category || "all"} />

      {listings.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No listings found</h3>
          <p>Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {listings.map((listing) => (
            <article
              key={listing.id}
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "box-shadow 0.2s, transform 0.2s",
              }}
            >
              {/* Header with category badge */}
              <div
                style={{
                  background: "linear-gradient(90deg, #667eea, #764ba2)",
                  padding: "0.75rem 1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    color: "#fff",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "0.25rem 0.5rem",
                    borderRadius: 4,
                    textTransform: "uppercase",
                  }}
                >
                  {listing.category.replace("_", " ")}
                </span>
                <span
                  style={{
                    color: "#fff",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  📍 {listing.locationCountry}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: "1rem", flex: 1 }}>
                <h2
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "#1e293b",
                    margin: 0,
                    marginBottom: "0.5rem",
                  }}
                >
                  {listing.name}
                </h2>

                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "#64748b",
                    margin: 0,
                    marginBottom: "0.75rem",
                  }}
                >
                  Supplier: <strong style={{ color: "#334155" }}>{listing.supplier.name}</strong>
                </p>

                {listing.description && (
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#475569",
                      margin: 0,
                      marginBottom: "0.75rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {listing.description}
                  </p>
                )}

                {/* Info row */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: "1px solid #e2e8f0",
                    paddingTop: "0.75rem",
                    marginTop: "auto",
                  }}
                >
                  <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>
                    Qty: <strong style={{ color: "#1e293b" }}>{listing.quantityAvailable}</strong> {listing.unit}
                  </span>
                  {listing.pricingMode === "fixed" ? (
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "#667eea" }}>
                      {formatPrice(listing.unitPrice)}
                      <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#64748b" }}> / {listing.unit}</span>
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        color: "#f59e0b",
                        background: "#fef3c7",
                        padding: "0.25rem 0.5rem",
                        borderRadius: 4,
                      }}
                    >
                      Request Quote
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: "0 1rem 1rem" }}>
                {session && session.user.role === "buyer" && (
                  <RequestForm
                    listingId={listing.id}
                    pricingMode={listing.pricingMode}
                    unitPrice={listing.unitPrice?.toNumber() ?? null}
                    unit={listing.unit}
                  />
                )}

                {!session && (
                  <Link
                    href="/auth/login"
                    style={{
                      display: "block",
                      textAlign: "center",
                      padding: "0.625rem",
                      background: "linear-gradient(90deg, #667eea, #764ba2)",
                      color: "#fff",
                      fontWeight: 600,
                      borderRadius: 6,
                      textDecoration: "none",
                    }}
                  >
                    Login to Request
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      </div>
    </main>
  );
}
