import { NextRequest, NextResponse } from "next/server";

const PLATFORM_DOMAIN =
  process.env.NEXT_PUBLIC_PLATFORM_DOMAIN || "korp-cbm.com";

const RESERVED = new Set(["www", "admin", "api"]);

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const host = hostname.split(":")[0];
  const pathname = request.nextUrl.pathname;

  // Local dev: radek.localhost → subdomain routing (requires /etc/hosts entries)
  if (host.endsWith(".localhost")) {
    const subdomain = host.slice(0, host.length - ".localhost".length);
    if (subdomain && !RESERVED.has(subdomain)) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-portfolio-slug", subdomain);
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
    return NextResponse.next();
  }

  // Local dev: /dev/[slug] → set x-portfolio-slug from URL
  if (host === "localhost" || host === "127.0.0.1") {
    const devMatch = pathname.match(/^\/dev\/([^/]+)/);
    if (devMatch) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-portfolio-slug", devMatch[1]);
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
    return NextResponse.next();
  }

  // Prod: subdomain routing
  const subdomain = host.endsWith(`.${PLATFORM_DOMAIN}`)
    ? host.slice(0, host.length - PLATFORM_DOMAIN.length - 1)
    : null;

  if (!subdomain || RESERVED.has(subdomain)) {
    return NextResponse.next();
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-portfolio-slug", subdomain);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
