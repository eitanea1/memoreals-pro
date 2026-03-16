import { NextRequest, NextResponse } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    // Search for the file in Vercel Blob
    const { blobs } = await list({ prefix: filename });
    if (blobs.length > 0) {
      return NextResponse.redirect(blobs[0].url);
    }
    return new NextResponse('Not found', { status: 404 });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
