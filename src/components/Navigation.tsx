import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Navigation() {
  const session = await auth();

  return (
    <nav className="nav" style={{ background: "linear-gradient(90deg, var(--primary) 0%, #4f46e5 100%)", color: "#fff" }}>
      <div className="nav-container" style={{ paddingBlock: "0.75rem" }}>
        <Link href="/" className="nav-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span style={{ marginLeft: "0.5rem", fontWeight: 700 }}>B2B Market</span>
        </Link>

        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {session ? (
            <>
              <Link href="/dashboard" className="nav-link" style={{ color: "#3b82f6" }}>
                Dashboard
              </Link>

              {session.user.role === "supplier" && (
                <>
                  <Link href="/listings/mine" className="nav-link" style={{ color: "#3b82f6" }}>
                    My Listings
                  </Link>
                  <Link href="/listings/new" className="nav-link" style={{ color: "#3b82f6" }}>
                    New Listing
                  </Link>
                  <Link href="/requests" className="nav-link" style={{ color: "#3b82f6" }}>
                    Requests
                  </Link>
                </>
              )}

              {session.user.role === "buyer" && (
                <Link href="/my-requests" className="nav-link" style={{ color: "#3b82f6" }}>
                  My Requests
                </Link>
              )}

              <div className="nav-user">
                <span className="nav-user-info">
                  <span className="nav-user-name">{session.user.name}</span>
                  {" · "}
                  <span className="badge badge-primary" style={{ marginLeft: "0.25rem", background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}>
                    {session.user.role}
                  </span>
                </span>

                <form action="/auth/logout" method="POST" style={{ display: "inline" }}>
                  <button type="submit" className="btn btn-outline btn-sm" style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
                    Logout
                  </button>
                </form>
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-outline btn-sm" style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
                Login
              </Link>
              <Link href="/auth/register" className="btn btn-primary btn-sm" style={{ background: "#fff", color: "var(--primary)" }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
