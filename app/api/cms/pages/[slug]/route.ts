import { NextResponse } from "next/server";
import { draftMode } from "next/headers";
import CMSAdapter from "@/lib/cms-adapter";

// Get page data by slug
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    // Handle both Promise and direct params (Next.js 15+ vs 14)
    const resolvedParams = params instanceof Promise ? await params : params;
    const rawSlug = resolvedParams?.slug;
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

    const pageData = await CMSAdapter.getPageBySlug(slug, isDraftMode ? 'draft' : 'published');
    if (pageData) {
      return NextResponse.json({ success: true, data: pageData, source: 'strapi' });
    }

    return NextResponse.json(
      { success: false, error: `Page '${slug}' not found`, source: 'strapi' },
      { status: 404 }
    );
  } catch (error) {
    console.error("Page slug handler error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch page data", source: 'strapi' },
      { status: 500 }
    );
  }
}
