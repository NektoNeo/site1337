/**
 * YouTube API Integration
 * Fetches Shorts from VA-PC YouTube channel
 * Supports both API mode and playlist embed fallback
 */

export interface ShortItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
  type?: 'build' | 'test' | 'unboxing' | 'review';
  viewCount?: number;
}

interface YouTubeVideoSnippet {
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default?: { url: string };
    medium?: { url: string };
    high?: { url: string };
    maxres?: { url: string };
  };
  resourceId?: {
    videoId: string;
  };
}

interface YouTubePlaylistItem {
  snippet: YouTubeVideoSnippet;
  contentDetails?: {
    videoId: string;
  };
  statistics?: {
    viewCount: string;
  };
}

interface YouTubeAPIResponse {
  items: YouTubePlaylistItem[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

// Cache for shorts data
let cachedShorts: ShortItem[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Detect video type from title/description
 */
function detectVideoType(title: string, description: string): ShortItem['type'] {
  const lowerTitle = title.toLowerCase();
  const lowerDesc = description.toLowerCase();
  
  if (lowerTitle.includes('сборка') || lowerDesc.includes('сборка') || lowerTitle.includes('build')) {
    return 'build';
  }
  if (lowerTitle.includes('тест') || lowerDesc.includes('тест') || lowerTitle.includes('test')) {
    return 'test';
  }
  if (lowerTitle.includes('распаковка') || lowerDesc.includes('распаковка') || lowerTitle.includes('unboxing')) {
    return 'unboxing';
  }
  if (lowerTitle.includes('обзор') || lowerDesc.includes('обзор') || lowerTitle.includes('review')) {
    return 'review';
  }
  return 'build'; // Default
}

/**
 * Fetch shorts from YouTube Playlist API
 * Requires YOUTUBE_API_KEY and YOUTUBE_PLAYLIST_ID env vars
 */
export async function getYouTubeShorts(limit = 8): Promise<ShortItem[]> {
  // Check cache
  if (cachedShorts && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cachedShorts.slice(0, limit);
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  const playlistId = process.env.YOUTUBE_PLAYLIST_ID || 'UUSFtesting'; // VA-PC shorts playlist
  const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UCvapc'; // VA-PC channel

  // If no API key, return fallback data
  if (!apiKey) {
    console.warn('[YouTube] No API key, using fallback data');
    return getFallbackShorts(limit);
  }

  try {
    // Fetch playlist items
    const url = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
    url.searchParams.set('part', 'snippet,contentDetails');
    url.searchParams.set('playlistId', playlistId);
    url.searchParams.set('maxResults', '50');
    url.searchParams.set('key', apiKey);

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
    });

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }

    const data: YouTubeAPIResponse = await response.json();

    // Transform to ShortItem format
    const shorts: ShortItem[] = data.items.map((item) => {
      const videoId = item.contentDetails?.videoId || item.snippet.resourceId?.videoId || '';
      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description.slice(0, 200),
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || '',
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/shorts/${videoId}`,
        type: detectVideoType(item.snippet.title, item.snippet.description),
        viewCount: item.statistics ? parseInt(item.statistics.viewCount, 10) : undefined,
      };
    });

    // Update cache
    cachedShorts = shorts;
    cacheTimestamp = Date.now();

    return shorts.slice(0, limit);
  } catch (error) {
    console.error('[YouTube] API fetch failed:', error);
    return getFallbackShorts(limit);
  }
}

/**
 * Fallback shorts data when API is unavailable
 */
function getFallbackShorts(limit: number): ShortItem[] {
  const fallbackData: ShortItem[] = [
    {
      id: 'fallback-1',
      title: 'Сборка VA PHOENIX для стримера',
      description: 'RTX 4080 + i7-14700K, RGB подсветка Corsair iCUE',
      thumbnail: '/images/live/prev_svo_1.png',
      publishedAt: new Date().toISOString(),
      url: 'https://www.youtube.com/@vapc',
      type: 'build',
    },
    {
      id: 'fallback-2',
      title: 'Стресс-тест системы охлаждения',
      description: 'Проверяем температуры под нагрузкой, настраиваем кривые вентиляторов',
      thumbnail: '/images/live/prev_svo_2.png',
      publishedAt: new Date().toISOString(),
      url: 'https://www.youtube.com/@vapc',
      type: 'test',
    },
    {
      id: 'fallback-3',
      title: 'Распаковка RTX 4090 ASUS ROG',
      description: 'Новая топовая видеокарта для проекта Creator',
      thumbnail: '/images/live/prev_svo_3.png',
      publishedAt: new Date().toISOString(),
      url: 'https://www.youtube.com/@vapc',
      type: 'unboxing',
    },
    {
      id: 'fallback-4',
      title: 'Компактный ITX билд',
      description: 'Meshlicious + RTX 4070 Ti, максимум производительности в минимуме объёма',
      thumbnail: '/images/live/prev_svo_4.png',
      publishedAt: new Date().toISOString(),
      url: 'https://www.youtube.com/@vapc',
      type: 'build',
    },
    {
      id: 'fallback-5',
      title: 'Обзор новой сборки VA BETA',
      description: 'Бюджетная игровая сборка для 1080p гейминга',
      thumbnail: '/images/live/prev_svo_5.png',
      publishedAt: new Date().toISOString(),
      url: 'https://www.youtube.com/@vapc',
      type: 'review',
    },
    {
      id: 'fallback-6',
      title: 'Сборка VA ROSE для фанатки розового',
      description: 'Эстетичная сборка в розовом корпусе с кастомной RGB подсветкой',
      thumbnail: '/images/live/prev_svo_6.png',
      publishedAt: new Date().toISOString(),
      url: 'https://www.youtube.com/@vapc',
      type: 'build',
    },
    {
      id: 'fallback-7',
      title: 'Тестируем RTX 4070 Super',
      description: 'Проверяем производительность в играх и сравниваем с предыдущим поколением',
      thumbnail: '/images/live/prev_svo_7.png',
      publishedAt: new Date().toISOString(),
      url: 'https://www.youtube.com/@vapc',
      type: 'test',
    },
    {
      id: 'fallback-8',
      title: 'Распаковка кастомной СВО',
      description: 'Кастомный контур охлаждения для максимального оверклока',
      thumbnail: '/images/live/prev_svo_8.png',
      publishedAt: new Date().toISOString(),
      url: 'https://www.youtube.com/@vapc',
      type: 'unboxing',
    },
  ];

  return fallbackData.slice(0, limit);
}

/**
 * Clear shorts cache
 */
export function clearShortsCache(): void {
  cachedShorts = null;
  cacheTimestamp = 0;
}

/**
 * Get cached shorts (for ISR/server components)
 */
export async function getCachedShorts(limit = 8): Promise<ShortItem[]> {
  // Use revalidation on server
  const shorts = await getYouTubeShorts(limit);
  return shorts;
}
