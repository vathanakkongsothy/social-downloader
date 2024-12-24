import { downloadTiktok, filterVideo, Media } from '@/lib/tiktok';
import { NextResponse } from 'next/server';

async function tiktokDownloader(url: string): Promise<Media> {
    const result = await downloadTiktok(url);
    console.log(result);

    const videos: Media[] = filterVideo(result.medias);
    console.log(videos);

    if (videos.length === 0) {
        throw new Error('No videos found.');
    }

    return videos[0];
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const videoUrl = searchParams.get('videoUrl');

        if (!videoUrl) {
            return new NextResponse('Please provide a video URL', {
                status: 400,
                headers: {
                    'content-type': 'text/plain',
                },
            });
        }

        const video = await tiktokDownloader(videoUrl);

        const response = await fetch(video.url);
        if (!response.ok) {
            throw new Error('Failed to fetch video.');
        }

        const contentLength = response.headers.get('Content-Length');
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Failed to get reader from response body.');
        }

        const stream = new ReadableStream({
            start(controller) {
                function push() {
                    reader?.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            return;
                        }
                        controller.enqueue(value);
                        push();
                    }).catch(error => {
                        console.error('Error reading chunk:', error);
                        controller.error(error);
                    });
                }
                push();
            }
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Disposition': `inline; filename="video_${video.quality}.mp4"`,
                'Content-Type': 'video/mp4',
                'Content-Length': contentLength || '0',
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