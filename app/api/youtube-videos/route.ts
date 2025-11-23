import { NextResponse } from 'next/server';

// YouTube video data structure
interface YouTubeVideo {
  id: string;
  embedUrl: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  publishedAt?: string;
}

// Helper function to extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Helper function to get embed URL from video ID
function getEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

// Function to scrape YouTube channel videos
async function scrapeYouTubeChannel(
  channelHandle: string,
): Promise<YouTubeVideo[]> {
  try {
    // Method 1: Try using YouTube Data API v3 (if API key is available)
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      try {
        let channelId: string | null = null;

        // Try to get channel ID using the handle directly in search
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(channelHandle)}&type=channel&key=${apiKey}&maxResults=1`,
        );

        if (searchResponse.ok) {
          const searchData: any =
            await searchResponse.json();
          if (
            searchData.items &&
            searchData.items.length > 0
          ) {
            channelId =
              searchData.items[0].snippet.channelId;
          }
        }

        // If search didn't work, try channels.list with username
        if (!channelId) {
          const channelResponse: Response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${channelHandle.replace('@', '')}&key=${apiKey}`,
          );

          if (channelResponse.ok) {
            const channelData: any =
              await channelResponse.json();
            if (
              channelData.items &&
              channelData.items.length > 0
            ) {
              channelId = channelData.items[0].id;
            }
          }
        }

        if (channelId) {
          // Get all videos from the channel (including Shorts) - fetch up to 50 (API limit)
          // We'll filter for Shorts/Reels and sort by date (latest first)
          let allVideos: YouTubeVideo[] = [];
          let nextPageToken: string | undefined = undefined;
          let hasMore = true;

          // Fetch videos in batches (YouTube API limit is 50 per request)
          while (hasMore && allVideos.length < 200) {
            const videosResponse: Response = await fetch(
              `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&key=${apiKey}&maxResults=50&order=date${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`,
            );

            if (videosResponse.ok) {
              const videosData: any =
                await videosResponse.json();
              if (
                videosData.items &&
                videosData.items.length > 0
              ) {
                const batchVideos = videosData.items.map(
                  (item: any) => ({
                    id: item.id.videoId,
                    embedUrl: getEmbedUrl(item.id.videoId),
                    thumbnail:
                      item.snippet.thumbnails?.high?.url ||
                      item.snippet.thumbnails?.default?.url,
                    title: item.snippet.title,
                    description: item.snippet.description,
                    publishedAt: item.snippet.publishedAt,
                  }),
                );

                allVideos = [...allVideos, ...batchVideos];
                nextPageToken = videosData.nextPageToken;
                hasMore = !!nextPageToken;
              } else {
                hasMore = false;
              }
            } else {
              hasMore = false;
            }
          }

          // Return all videos sorted by date (latest first)
          // The API already returns them sorted by date, but we'll ensure proper sorting
          return allVideos.sort((a, b) => {
            const dateA = a.publishedAt
              ? new Date(a.publishedAt).getTime()
              : 0;
            const dateB = b.publishedAt
              ? new Date(b.publishedAt).getTime()
              : 0;
            return dateB - dateA; // Latest first
          });
        }
      } catch (apiError) {
        console.error('YouTube API error:', apiError);
      }
    }

    // Method 2: Scrape the channel page (fallback - may not work due to YouTube's anti-scraping)
    // Try to fetch the RSS feed first (more reliable)
    try {
      const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelHandle}`;
      const rssResponse = await fetch(rssUrl);

      if (rssResponse.ok) {
        const rssText = await rssResponse.text();
        const videoIds = new Set<string>();
        const videos: YouTubeVideo[] = [];

        // Extract video IDs from RSS
        const videoIdPattern =
          /<yt:videoId>([^<]+)<\/yt:videoId>/g;
        const titlePattern = /<title>([^<]+)<\/title>/g;
        const titles: string[] = [];

        let match;
        while (
          (match = videoIdPattern.exec(rssText)) !== null
        ) {
          const videoId = match[1];
          if (
            videoId &&
            videoId.length === 11 &&
            !videoIds.has(videoId)
          ) {
            videoIds.add(videoId);
            videos.push({
              id: videoId,
              embedUrl: getEmbedUrl(videoId),
            });
          }
        }

        // Extract titles
        while (
          (match = titlePattern.exec(rssText)) !== null
        ) {
          if (match[1] && !match[1].includes('YouTube')) {
            titles.push(match[1]);
          }
        }

        // Match titles with videos
        videos.forEach((video, index) => {
          if (titles[index]) {
            video.title = titles[index];
          }
        });

        if (videos.length > 0) {
          // Return all videos (already sorted by date from RSS)
          return videos;
        }
      }
    } catch (rssError) {
      console.error('RSS feed error:', rssError);
    }

    // Last resort: Return empty array (scraping HTML is unreliable)
    console.warn(
      'Unable to fetch YouTube videos. Please set YOUTUBE_API_KEY environment variable for best results.',
    );
    return [];
  } catch (error) {
    console.error('Error scraping YouTube channel:', error);
    return [];
  }
}

export async function GET() {
  try {
    const channelHandle = '@BimDating';
    const videos =
      await scrapeYouTubeChannel(channelHandle);

    return NextResponse.json(
      {
        success: true,
        videos: videos.map((video) => ({
          id: video.id,
          embedUrl: video.embedUrl,
          thumbnail: video.thumbnail,
          title: video.title,
          description: video.description,
        })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in YouTube API route:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch YouTube videos',
        videos: [],
      },
      { status: 500 },
    );
  }
}
