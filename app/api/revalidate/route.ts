import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { clearLandingPageCache } from '@/lib/cms-adapter';

/**
 * API route to revalidate cache and clear CMS adapter cache
 * Call this after syncing Page Builder data to see changes immediately
 */
export async function POST(request: NextRequest) {
  try {
    // Clear the CMS adapter cache
    clearLandingPageCache();
    
    // Revalidate the home page
    revalidatePath('/');
    revalidatePath('/preview');
    
    console.log('Cache cleared and paths revalidated');
    
    return NextResponse.json({
      success: true,
      message: 'Cache cleared successfully. Refresh your page to see changes.',
      revalidated: ['/', '/preview'],
    });
  } catch (error: any) {
    console.error('Error revalidating:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
