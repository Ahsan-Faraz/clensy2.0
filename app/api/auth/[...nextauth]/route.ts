import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering - NextAuth v4 is not compatible with React 19 static generation
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Authentication is temporarily disabled due to React 19 / Next.js 16 compatibility issues.
 * NextAuth v4 uses React.createContext which is incompatible with React 19's changes.
 * 
 * The SessionProvider in providers.tsx is already bypassed.
 * This route provides a graceful fallback until next-auth v5 is stable with React 19.
 */

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { 
      error: "Authentication temporarily disabled",
      reason: "React 19 compatibility - NextAuth v4 is not compatible with React 19/Next.js 16",
      suggestion: "Access admin pages directly at /protected or /editor"
    },
    { status: 503 }
  );
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { 
      error: "Authentication temporarily disabled",
      reason: "React 19 compatibility - NextAuth v4 is not compatible with React 19/Next.js 16"
    },
    { status: 503 }
  );
}