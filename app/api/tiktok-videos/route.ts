import { NextResponse } from 'next/server';

// TikTok video data structure
interface TikTokVideo {
  id: string;
  embedUrl: string;
  thumbnail?: string;
  description?: string;
}

// Helper function to extract video ID from TikTok URL
function extractVideoId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}

// Helper function to get embed URL from video ID or full URL
function getEmbedUrl(videoIdOrUrl: string): string {
  // If it's already a full URL, extract the ID
  if (videoIdOrUrl.includes('tiktok.com')) {
    const id = extractVideoId(videoIdOrUrl);
    if (id) {
      return `https://www.tiktok.com/embed/v2/${id}`;
    }
  }
  // If it's just an ID, construct the embed URL
  return `https://www.tiktok.com/embed/v2/${videoIdOrUrl}`;
}

// This function fetches TikTok videos from the account
// Note: TikTok doesn't have a public API, so we'll use embed URLs
// You can manually add video IDs or use a scraping service
async function getTikTokVideos(): Promise<TikTokVideo[]> {
  // TikTok username: @bim.video.dating
  // TikTok account URL: https://www.tiktok.com/@bim.video.dating

  try {
    // Option 1: Manual video IDs or URLs
    // To get video IDs: Visit your TikTok video, copy the URL
    // Example: https://www.tiktok.com/@bim.video.dating/video/7234567890123456789
    // You can use either the full URL or just the video ID

    const videoData: Array<
      string | { url: string; description?: string }
    > = [
      // Add your actual TikTok video URLs or IDs here
      // Examples:
      // '7234567890123456789', // Just the video ID
      // 'https://www.tiktok.com/@bim.video.dating/video/7234567890123456789', // Full URL
      // { url: 'https://www.tiktok.com/@bim.video.dating/video/7234567890123456789', description: 'My video description' },
    ];

    // Process video data
    const videos: TikTokVideo[] = videoData.map(
      (item, index) => {
        let videoId: string;
        let description: string | undefined;

        if (typeof item === 'string') {
          videoId = extractVideoId(item) || item;
          description = `TikTok video ${index + 1}`;
        } else {
          videoId = extractVideoId(item.url) || item.url;
          description =
            item.description || `TikTok video ${index + 1}`;
        }

        return {
          id: videoId,
          embedUrl: getEmbedUrl(videoId),
          description,
        };
      },
    );

    // Option 2: Fetch from TikTok's oEmbed API (requires full video URLs)
    // This can get thumbnails and metadata
    // for (const video of videos) {
    //   try {
    //     const videoUrl = `https://www.tiktok.com/@bim.video.dating/video/${video.id}`;
    //     const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`;
    //     const response = await fetch(oembedUrl);
    //     const data = await response.json();
    //     video.thumbnail = data.thumbnail_url;
    //     video.description = data.title || video.description;
    //   } catch (error) {
    //     console.error(`Error fetching oEmbed for video ${video.id}:`, error);
    //   }
    // }

    // Option 3: Use a scraping service or library
    // You can integrate services like:
    // - RapidAPI TikTok API
    // - Custom scraping solution (be mindful of TikTok's ToS)
    // - TikTok RSS feed (if available)

    return videos;
  } catch (error) {
    console.error('Error fetching TikTok videos:', error);
    return [];
  }
}

export async function GET() {
  try {
    const videos = await getTikTokVideos();

    return NextResponse.json(
      {
        success: true,
        videos: videos.map((video) => ({
          id: video.id,
          embedUrl: video.embedUrl,
          thumbnail: video.thumbnail,
          description: video.description,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in TikTok API route:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch TikTok videos',
        videos: [],
      },
      { status: 500 },
    );
  }
}
