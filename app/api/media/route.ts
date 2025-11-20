
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const mediaDirectory = path.join(process.cwd(), 'public', 'Media');

  try {
    let filenames = fs.readdirSync(mediaDirectory);
    filenames = filenames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    const files = filenames.map((filename) => {
      const ext = path.extname(filename).toLowerCase();
      let type = 'other';
      if ([".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"].includes(ext)) type = 'image';
      else if ([".mp4", ".webm", ".mov", ".avi", ".mkv"].includes(ext)) type = 'video';
      else if ([".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt"].includes(ext)) type = 'doc';
      // Use decodeURIComponent in the frontend, but here we just encode
      return {
        name: filename,
        url: `/Media/${encodeURIComponent(filename)}`,
        type,
      };
    });
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error reading media directory:', error);
    return NextResponse.json({ error: 'Unable to fetch media files.' }, { status: 500 });
  }
}
