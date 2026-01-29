import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import CMSAdapter from "@/lib/cms-adapter";

// Cache redirects for 5 minutes
let redirectsCache: Array<{ fromPath: string; toPath: string; statusCode: string }> = [];
let redirectsCacheTime: number = 0;
const REDIRECTS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getRedirects() {
  const now = Date.now();
  if (redirectsCache.length > 0 && now - redirectsCacheTime < REDIRECTS_CACHE_DURATION) {
    return redirectsCache;
  }

  try {
    const redirects = await CMSAdapter.getAllRedirects();
    redirectsCache = redirects.filter((r) => r.isActive);
    redirectsCacheTime = now;
    return redirectsCache;
  } catch (error) {
    console.error("Error fetching redirects:", error);
    return [];
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path starts with /admin
  // Note: Auth check moved to page level since middleware runs in Edge runtime
  // which doesn't support next-auth/jwt (requires Node.js modules)
  // The /admin routes should handle auth checks in their page components
  if (pathname.startsWith("/admin")) {
    // Auth check will be handled in the admin page components
    // Middleware can't use next-auth/jwt in Edge runtime
  }

  // Handle redirects from Strapi
  // Skip redirects for API routes, _next, and static files
  if (
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.startsWith("/static") &&
    !pathname.includes(".")
  ) {
    const redirects = await getRedirects();
    
    // Normalize pathname (remove trailing slash for comparison)
    const normalizedPath = pathname.replace(/\/$/, "") || "/";
    
    // Find matching redirect
    const redirect = redirects.find((r) => {
      const fromPath = r.fromPath.replace(/\/$/, "") || "/";
      return fromPath === normalizedPath;
    });

    if (redirect) {
      // Ensure toPath starts with / or is absolute URL
      let toPath = redirect.toPath;
      if (!toPath.startsWith("/") && !toPath.startsWith("http")) {
        toPath = `/${toPath}`;
      }

      // Determine status code
      let status = 301; // Default to permanent redirect
      switch (redirect.statusCode) {
        case "temporary_302":
          status = 302;
          break;
        case "temporary_307":
          status = 307;
          break;
        case "permanent_308":
          status = 308;
          break;
        case "permanent_301":
        default:
          status = 301;
          break;
      }

      // Handle absolute URLs
      if (toPath.startsWith("http")) {
        return NextResponse.redirect(new URL(toPath), status);
      }

      // Handle relative URLs
      const url = new URL(toPath, request.url);
      return NextResponse.redirect(url, status);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};