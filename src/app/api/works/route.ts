import { NextResponse } from 'next/server';
import { getWorksGallery } from '@/lib/gallery';

export const runtime = 'nodejs';

export async function GET() {
  const works = await getWorksGallery();
  return NextResponse.json({ works });
}
