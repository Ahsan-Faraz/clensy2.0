import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CMSAdapter from "@/lib/cms-adapter";

// Get location data by slug
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const rawSlug = params?.slug;
    // Normalize slug: handle leading/trailing slashes and arrays
    const slugValue = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    const slug = typeof slugValue === 'string' ? slugValue.replace(/^\/+|\/+$/g, '') : '';

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Missing slug", source: 'strapi' },
        { status: 400 }
      );
    }
    
    // Try Strapi first
    const strapiData = await CMSAdapter.getLocationBySlug(slug);
    if (strapiData) {
      return NextResponse.json({ success: true, data: strapiData, source: 'strapi' });
    }
    
    // If no data found
    return NextResponse.json(
      { success: false, error: `Location '${slug}' not found`, source: 'strapi' },
      { status: 404 }
    );
  } catch (error) {
    console.error("Location slug handler error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch location data", source: 'strapi' },
      { status: 500 }
    );
  }
}

// Update location data (for admin)
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // For now, updates go through Strapi admin panel
    return NextResponse.json(
      { success: false, error: "Please use Strapi admin panel to update locations" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update location data" },
      { status: 500 }
    );
  }
}
