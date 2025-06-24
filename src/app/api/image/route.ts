// src/app/api/image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

const ALLOWED_DOMAINS = ['2.ugdr97aqcjm.xvest3.ru'];
const MAX_AGE = 31536000;
const STALE_WHILE_REVALIDATE = 86400;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    const width = parseInt(searchParams.get('w') || '800');
    const height = parseInt(searchParams.get('h') || '600');
    const quality = parseInt(searchParams.get('q') || '80');
    const format = searchParams.get('f') || 'webp';

    if (!imageUrl) {
      return new NextResponse('URL required', { status: 400 });
    }

    // Проверка домена
    try {
      const urlObj = new URL(imageUrl);
      if (!ALLOWED_DOMAINS.includes(urlObj.hostname)) {
        return new NextResponse('Domain not allowed', {
          status: 403,
        });
      }
    } catch {
      return new NextResponse('Invalid URL', { status: 400 });
    }

    // Кэш-ключ для проверки
    const cacheKey = `${imageUrl}-${width}-${height}-${quality}-${format}`;
    const etag = `"${Buffer.from(cacheKey).toString('base64')}"`;

    // Проверяем If-None-Match для 304
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 });
    }

    // Получаем изображение
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'EastTelecom-ImageOptimizer/1.0',
      },
    });

    if (!response.ok) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const originalBuffer = await response.arrayBuffer();

    // Оптимизация через Sharp
    const sharpInstance = sharp(Buffer.from(originalBuffer)).resize(
      width,
      height,
      {
        fit: 'cover',
        position: 'center',
      },
    );

    // Выбор формата и получение оптимизированного буфера
    let optimizedBuffer: Buffer;
    let contentType: string;

    switch (format) {
      case 'avif':
        optimizedBuffer = await sharpInstance
          .avif({ quality, effort: 6 })
          .toBuffer();
        contentType = 'image/avif';
        break;
      case 'webp':
        optimizedBuffer = await sharpInstance
          .webp({ quality, effort: 6 })
          .toBuffer();
        contentType = 'image/webp';
        break;
      case 'jpeg':
        optimizedBuffer = await sharpInstance
          .jpeg({ quality, progressive: true })
          .toBuffer();
        contentType = 'image/jpeg';
        break;
      default:
        optimizedBuffer = await sharpInstance
          .webp({ quality })
          .toBuffer();
        contentType = 'image/webp';
    }

    // Преобразуем Buffer в правильный формат для NextResponse
    return new NextResponse(new Uint8Array(optimizedBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': `public, max-age=${MAX_AGE}, s-maxage=${MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
        ETag: etag,
        Vary: 'Accept',
        'X-Optimized': 'true',
        'Content-Length': optimizedBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Image optimization error:', error);
    return new NextResponse('Server error', { status: 500 });
  }
}

// Поддержка HEAD запросов
export async function HEAD(request: NextRequest) {
  const response = await GET(request);
  return new NextResponse(null, {
    status: response.status,
    headers: response.headers,
  });
}
