import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('photos') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const results = await Promise.all(
      files.map(async (file) => {
        const id = uuidv4();
        const ext = file.name.split('.').pop() ?? 'jpg';
        const filename = `${id}.${ext}`;

        const blob = await put(filename, file, {
          access: 'public',
          contentType: file.type || 'image/jpeg',
        });

        return {
          id,
          originalName: file.name,
          url: blob.url,
          size: file.size,
        };
      })
    );

    return NextResponse.json({ files: results });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
