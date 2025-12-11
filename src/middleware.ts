import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/listings", "/requests", "/my-requests"];

// Routes that require specific roles
const supplierOnlyRoutes = ["/listings/new", "/listings/mine", "/requests"];
const buyerOnlyRoutes = ["/my-requests"];

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const pathname = request.nextUrl.pathname;

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtectedRoute) {
    if (!session) {
      const url = new URL("/auth/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Check supplier-only routes
    const isSupplierOnly = supplierOnlyRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );
    if (isSupplierOnly && session.user.role !== "supplier") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Check buyer-only routes
    const isBuyerOnly = buyerOnlyRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );
    if (isBuyerOnly && session.user.role !== "buyer") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect authenticated users away from auth pages
  if (session && (pathname === "/auth/login" || pathname === "/auth/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/listings/:path*",
    "/requests/:path*",
    "/my-requests/:path*",
    "/auth/:path*",
  ],
};
