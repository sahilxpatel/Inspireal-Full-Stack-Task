import { auth } from "@/lib/auth";
import Link from "next/link";

const cardStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  textAlign: "center" as const,
  padding: "2rem 1.5rem",
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  textDecoration: "none",
  transition: "transform 0.2s, box-shadow 0.2s",
};

const iconStyle = {
  width: 56,
  height: 56,
  borderRadius: 12,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.5rem",
  marginBottom: "1rem",
  color: "#fff",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <p>Loading...</p>;
  }

  const isBuyer = session.user.role === "buyer";

  return (
    <main style={{ background: "var(--background)", minHeight: "calc(100vh - 60px)" }}>
      {/* Hero */}
      <section
        style={{
          background: isBuyer
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
          padding: "4rem 1.5rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <h1 style={{ fontSize: "2.25rem", fontWeight: 700, margin: 0, letterSpacing: "-0.02em" }}>Welcome back, {session.user.name}!</h1>
        <p style={{ marginTop: "0.75rem", opacity: 0.9, fontSize: "1.0625rem" }}>
          You are logged in as a <strong style={{ textTransform: "capitalize" }}>{session.user.role}</strong>
        </p>
      </section>

      {/* Actions */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, color: "#1e293b", marginBottom: "1.5rem" }}>Quick Actions</h2>

        {isBuyer ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            <Link href="/" style={cardStyle}>
              <div style={{ ...iconStyle, background: "linear-gradient(135deg, #667eea, #764ba2)" }}>🏪</div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>Browse Marketplace</h3>
              <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem" }}>Discover products from trusted suppliers</p>
            </Link>
            <Link href="/my-requests" style={cardStyle}>
              <div style={{ ...iconStyle, background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>📋</div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>My Requests</h3>
              <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem" }}>Track your purchase requests</p>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
            <Link href="/listings/mine" style={cardStyle}>
              <div style={{ ...iconStyle, background: "linear-gradient(135deg, #11998e, #38ef7d)" }}>📦</div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>My Listings</h3>
              <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem" }}>Manage your products</p>
            </Link>
            <Link href="/listings/new" style={cardStyle}>
              <div style={{ ...iconStyle, background: "linear-gradient(135deg, #667eea, #764ba2)" }}>➕</div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>New Listing</h3>
              <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem" }}>Add a new product</p>
            </Link>
            <Link href="/requests" style={cardStyle}>
              <div style={{ ...iconStyle, background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>📬</div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#1e293b", margin: 0 }}>Requests</h3>
              <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.5rem" }}>View buyer requests</p>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
