import { downloadTiktok, filterVideo, Media } from '@/lib/tiktok';
import { NextResponse } from 'next/server';

async function tiktokDownloader(url: string): Promise<Media> {
    // Get the response from the server
    const result = await downloadTiktok(url);
    // Print the result (the server response)
    console.log(result);

    // Get videos only
    const videos: Media[] = filterVideo(result.medias);
    // Print the videos
    console.log(videos);

    if (videos.length === 0) {
        throw new Error('No videos found.');
    }

    // Return the first video (or implement your own logic to select the best video)
    return videos[0];
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const videoUrl = url.searchParams.get('videoUrl');

        if (!videoUrl) {
            return new NextResponse('Please provide a video URL', {
                status: 400,
                headers: {
                    'content-type': 'text/plain',
                },
            });
        }

        const video = await tiktokDownloader(videoUrl);

        // Stream the video directly to the response
        const response = await fetch(video.url);
        const readableStream = response.body;

        return new NextResponse(readableStream, {
            headers: {
                'Content-Disposition': `inline; filename="video_${video.quality}.mp4"`,
                'Content-Type': 'video/mp4',
            },
        });
    } catch (error) {
        console.error('Error in GET handler:', error);
        return new NextResponse('Failed to download video', {
            status: 500,
            headers: {
                'content-type': 'text/plain',
            },
        });
    }
}