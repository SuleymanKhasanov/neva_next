// src/app/api/image/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Простая реализация без Sharp - использует прокси с заголовками оптимизации
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

    // Проверяем, что URL безопасный (только ваш домен)
    const allowedDomains = ['2.ugdr97aqcjm.xvest3.ru'];
    const urlObj = new URL(imageUrl);

    if (!allowedDomains.includes(urlObj.hostname)) {
      return new NextResponse('Domain not allowed', { status: 403 });
    }

    // Получаем изображение с исходного API
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

    // Возвращаем изображение с оптимизированными заголовками
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': imageBuffer.byteLength.toString(),
        // Заголовки для браузерной оптимизации
        Vary: 'Accept',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// POST метод для предзагрузки изображений
export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();

    if (!Array.isArray(urls)) {
      return NextResponse.json(
        { error: 'URLs must be an array' },
        { status: 400 },
      );
    }

    // Предзагружаем изображения (просто проверяем доступность)
    const results = await Promise.allSettled(
      urls.map(async (url: string) => {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          return response.ok;
        } catch {
          return false;
        }
      }),
    );

    return NextResponse.json({
      checked: results.filter(
        (r) => r.status === 'fulfilled' && r.value,
      ).length,
      total: urls.length,
    });
  } catch (error) {
    console.error('Preload error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
