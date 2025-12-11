"use client";

import { useActionState, Suspense } from "react";
import { loginAction } from "../actions";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function RegistrationSuccess() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  if (!registered) return null;

  return (
    <div className="alert alert-success">
      ✓ Registration successful! Please login.
    </div>
  );
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
          padding: "2.5rem",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto 1rem",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.75rem",
              color: "#fff",
            }}
          >
            👋
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>Welcome Back</h1>
          <p style={{ color: "#64748b", marginTop: "0.5rem", fontSize: "0.9375rem" }}>Sign in to your account</p>
        </div>

        <Suspense fallback={null}>
          <RegistrationSuccess />
        </Suspense>

        <form action={formAction}>
          {state?.error && (
            <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "0.75rem 1rem", borderRadius: 8, marginBottom: "1rem", fontSize: "0.875rem" }}>{state.error}</div>
          )}

          <div style={{ marginBottom: "1.25rem" }}>
            <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, fontSize: "0.875rem", color: "#334155" }}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                fontSize: "0.9375rem",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, fontSize: "0.875rem", color: "#334155" }}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                fontSize: "0.9375rem",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            style={{
              width: "100%",
              padding: "0.9375rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#fff",
              background: "linear-gradient(90deg, #667eea, #764ba2)",
              border: "none",
              borderRadius: 10,
              cursor: isPending ? "not-allowed" : "pointer",
              opacity: isPending ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: "1.5rem", textAlign: "center", color: "#64748b" }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" style={{ color: "#667eea", fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </main>
  );
}
