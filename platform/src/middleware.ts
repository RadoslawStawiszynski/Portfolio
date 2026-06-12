import { NextRequest, NextResponse } from "next/server";

const PLATFORM_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "korp-cbm.com";

const RESERVED = new Set(["www", "admin", "api"]);

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // Strip port (localhost:3000 → localhost)
  const host = hostname.split(":")[0];

  // Local dev — no subdomain routing
  if (host === "localhost" || host === "127.0.0.1") {
    return NextResponse.next();
  }

  // Extract subdomain: "radek.korp-cbm.com" → "radek"
  const subdomain = host.endsWith(`.${PLATFORM_DOMAIN}`)
    ? host.slice(0, host.length - PLATFORM_DOMAIN.length - 1)
    : null;

  // Root domain or unrecognized host — pass through
  if (!subdomain || RESERVED.has(subdomain)) {
    return NextResponse.next();
  }

  // Valid portfolio subdomain — forward slug via request headers so
  // Server Components can read it with `headers()` from "next/headers"
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-portfolio-slug", subdomain);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // Skip Next.js static assets and internal routes
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
