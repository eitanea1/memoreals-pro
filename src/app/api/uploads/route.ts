import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOADS_DIR = join(process.cwd(), 'uploads');

export async function POST(req: NextRequest) {
  try {
    await mkdir(UPLOADS_DIR, { recursive: true });

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
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(join(UPLOADS_DIR, filename), buffer);
        return {
          id,
          originalName: file.name,
          url: `/api/uploads/${filename}`,
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
