import { NextResponse } from 'next/server';
import { getCachedShorts } from '@/lib/youtube';

export const runtime = 'nodejs';

// Revalidate every 5 minutes
export const revalidate = 300;

export async function GET() {
  try {
    const shorts = await getCachedShorts(8);
    return NextResponse.json({ shorts }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('[API/shorts] Error:', error);
    return NextResponse.json({ shorts: [], error: 'Failed to fetch shorts' }, { status: 500 });
  }
}
