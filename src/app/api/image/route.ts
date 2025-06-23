// src/app/api/image/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const width = parseInt(searchParams.get('w') || '800');
    const height = parseInt(searchParams.get('h') || '600');
    const quality = parseInt(searchParams.get('q') || '80');

    if (!imageUrl) {
      return new NextResponse('URL parameter is required', {
        status: 400,
      });
    }

    // Проверяем безопасность URL
    const allowedDomains = ['2.ugdr97aqcjm.xvest3.ru'];
    const urlObj = new URL(imageUrl);

    if (!allowedDomains.includes(urlObj.hostname)) {
      return new NextResponse('Domain not allowed', { status: 403 });
    }

    // Получаем изображение
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'NextJS-ImageOptimizer/1.0',
        Accept: 'image/webp,image/avif,image/*,*/*;q=0.8',
      },
    });

    if (!imageResponse.ok) {
      return new NextResponse('Failed to fetch image', {
        status: 404,
      });
    }

    const contentType =
      imageResponse.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await imageResponse.arrayBuffer();

    // Возвращаем с метаданными для клиентской оптимизации
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': imageBuffer.byteLength.toString(),
        Vary: 'Accept',
        'X-Content-Type-Options': 'nosniff',
        // Метаданные для клиента
        'X-Target-Width': width.toString(),
        'X-Target-Height': height.toString(),
        'X-Target-Quality': (quality / 100).toString(),
        'X-Optimize': 'true',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
