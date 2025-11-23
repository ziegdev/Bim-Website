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
    const apiKey =
      'AIzaSyDamiQ0RnH_vnBYd5qCtA_EU15ptd9Ql48';
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

    // Method 2: Try to get channel ID from the channel page and then use RSS feed
    try {
      // First, try to get the channel ID by fetching the channel page
      const channelPageUrl = `https://www.youtube.com/${channelHandle}`;
      let channelPageResponse: Response | null = null;
      let channelId: string | null = null;

      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          10000,
        ); // 10 second timeout

        channelPageResponse = await fetch(channelPageUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (channelPageResponse.ok) {
          const channelPageText =
            await channelPageResponse.text();
          // Try to extract channel ID from the page
          const channelIdMatch = channelPageText.match(
            /"channelId":"([^"]+)"/,
          );
          if (channelIdMatch) {
            channelId = channelIdMatch[1];
          }
        }
      } catch (fetchError) {
        console.error(
          'Error fetching channel page:',
          fetchError,
        );
        // Continue without channel ID
      }

      // If we got a channel ID, use RSS feed
      if (channelId) {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const rssResponse = await fetch(rssUrl);

        if (rssResponse.ok) {
          const rssText = await rssResponse.text();
          const videoIds = new Set<string>();
          const videos: YouTubeVideo[] = [];

          // Parse RSS feed using XML parser or regex
          const videoIdPattern =
            /<yt:videoId>([^<]+)<\/yt:videoId>/g;
          const titlePattern = /<title>([^<]+)<\/title>/g;
          const publishedPattern =
            /<published>([^<]+)<\/published>/g;
          const titles: string[] = [];
          const publishedDates: string[] = [];

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

          // Extract titles (skip the first one which is usually the channel name)
          while (
            (match = titlePattern.exec(rssText)) !== null
          ) {
            if (match[1] && !match[1].includes('YouTube')) {
              titles.push(match[1]);
            }
          }

          // Extract published dates
          while (
            (match = publishedPattern.exec(rssText)) !==
            null
          ) {
            publishedDates.push(match[1]);
          }

          // Match titles and dates with videos
          videos.forEach((video, index) => {
            if (titles[index + 1]) {
              // Skip first title (channel name)
              video.title = titles[index + 1];
            }
            if (publishedDates[index]) {
              video.publishedAt = publishedDates[index];
            }
          });

          if (videos.length > 0) {
            // Sort by published date (latest first)
            return videos.sort((a, b) => {
              const dateA = a.publishedAt
                ? new Date(a.publishedAt).getTime()
                : 0;
              const dateB = b.publishedAt
                ? new Date(b.publishedAt).getTime()
                : 0;
              return dateB - dateA;
            });
          }
        }
      }
    } catch (rssError) {
      console.error('RSS feed error:', rssError);
    }

    // Last resort: Try alternative RSS feed format (for handle-based channels)
    try {
      // Try using the handle without @ symbol in user parameter
      const handleWithoutAt = channelHandle.replace(
        '@',
        '',
      );
      const altRssUrl = `https://www.youtube.com/feeds/videos.xml?user=${handleWithoutAt}`;
      const altRssResponse = await fetch(altRssUrl);

      if (altRssResponse.ok) {
        const rssText = await altRssResponse.text();
        const videoIds = new Set<string>();
        const videos: YouTubeVideo[] = [];

        const videoIdPattern =
          /<yt:videoId>([^<]+)<\/yt:videoId>/g;
        const titlePattern = /<title>([^<]+)<\/title>/g;
        const publishedPattern =
          /<published>([^<]+)<\/published>/g;
        const titles: string[] = [];
        const publishedDates: string[] = [];

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

        while (
          (match = titlePattern.exec(rssText)) !== null
        ) {
          if (match[1] && !match[1].includes('YouTube')) {
            titles.push(match[1]);
          }
        }

        while (
          (match = publishedPattern.exec(rssText)) !== null
        ) {
          publishedDates.push(match[1]);
        }

        videos.forEach((video, index) => {
          if (titles[index + 1]) {
            video.title = titles[index + 1];
          }
          if (publishedDates[index]) {
            video.publishedAt = publishedDates[index];
          }
        });

        if (videos.length > 0) {
          return videos.sort((a, b) => {
            const dateA = a.publishedAt
              ? new Date(a.publishedAt).getTime()
              : 0;
            const dateB = b.publishedAt
              ? new Date(b.publishedAt).getTime()
              : 0;
            return dateB - dateA;
          });
        }
      }
    } catch (altRssError) {
      console.error(
        'Alternative RSS feed error:',
        altRssError,
      );
    }

    // Last resort: Return empty array
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

    // Ensure we always return JSON, even if there's an error
    let videos: YouTubeVideo[] = [];

    try {
      videos = await scrapeYouTubeChannel(channelHandle);
      console.log(
        `Fetched ${videos.length} videos for channel ${channelHandle}`,
      );
    } catch (scrapeError) {
      console.error(
        'Error in scrapeYouTubeChannel:',
        scrapeError,
      );
      // Continue with empty array
    }

    if (videos.length === 0) {
      console.warn(
        'No videos found. This might be due to:',
      );
      console.warn(
        '1. Missing YOUTUBE_API_KEY environment variable',
      );
      console.warn('2. Channel RSS feed not accessible');
      console.warn('3. Channel has no videos');
    }

    // Always return JSON response
    return NextResponse.json(
      {
        success: true,
        videos: videos.map((video) => ({
          id: video.id || '',
          embedUrl: video.embedUrl || '',
          thumbnail: video.thumbnail || '',
          title: video.title || '',
          description: video.description || '',
        })),
      },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    // Ensure we always return JSON, even on unexpected errors
    console.error('Error in YouTube API route:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch YouTube videos',
        videos: [],
        message:
          error instanceof Error
            ? error.message
            : 'Unknown error',
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
