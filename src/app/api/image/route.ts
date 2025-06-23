// src/app/api/image/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    if (!imageUrl) {
      return new NextResponse('URL required', { status: 400 });
    }

    // Проверяем домен
    try {
      const urlObj = new URL(imageUrl);
      if (urlObj.hostname !== '2.ugdr97aqcjm.xvest3.ru') {
        return new NextResponse('Domain not allowed', {
          status: 403,
        });
      }
    } catch {
      return new NextResponse('Invalid URL', { status: 400 });
    }

    // Получаем изображение
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType =
      response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': imageBuffer.byteLength.toString(),
      },
    });
  } catch {
    return new NextResponse('Server error', { status: 500 });
  }
}
