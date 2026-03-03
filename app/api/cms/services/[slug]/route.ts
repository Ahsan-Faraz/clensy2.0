import { NextResponse } from "next/server";
import { draftMode } from "next/headers";
import CMSAdapter from "@/lib/cms-adapter";

// Get service data by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Handle both Promise and direct params (Next.js 15+ vs 14)
    const resolvedParams = params instanceof Promise ? await params : params;
    const rawSlug = resolvedParams?.slug;
    // Normalize slug: handle leading/trailing slashes and arrays
    const slugValue = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    const slug = typeof slugValue === 'string' ? slugValue.replace(/^\/+|\/+$/g, '') : '';

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Missing slug", source: 'strapi' },
        { status: 400 }
      );
    }
    
    // Check if draft mode is enabled (for preview)
    const { isEnabled: isDraftMode } = await draftMode();
    
    // Try Strapi first - pass draft status if in preview mode
    const strapiData = await CMSAdapter.getServiceBySlug(slug, isDraftMode ? 'draft' : 'published');
    if (strapiData) {
      const response = NextResponse.json({ success: true, data: strapiData, source: 'strapi' });
      // Cache at edge for 60s, serve stale for 5 min
      if (!isDraftMode) {
        response.headers.set('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');
      }
      return response;
    }
    
    // If no data found
    return NextResponse.json(
      { success: false, error: `Service '${slug}' not found`, source: 'strapi' },
      { status: 404 }
    );
  } catch (error) {
    console.error("Service slug handler error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch service data", source: 'strapi' },
      { status: 500 }
    );
  }
}

// Update service data (for admin)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  // Handle both Promise and direct params (Next.js 15+ vs 14)
  const resolvedParams = params instanceof Promise ? await params : params;
  try {
    // Lazy import to avoid mongoose dependency in GET requests
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // For now, updates go through Strapi admin panel
    return NextResponse.json(
      { success: false, error: "Please use Strapi admin panel to update services" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update service data" },
      { status: 500 }
    );
  }
}
