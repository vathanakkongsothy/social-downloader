import { request, fetch } from 'undici';
import querystring from "querystring";
import { Buffer } from 'buffer';

export interface Media {
    url: string;
    quality: string; // e.g., "hd", "sd", "watermark", "128kbps"
    extension: string; // e.g., "mp4", "mp3"
    size: number;
    formattedSize: string; // e.g., "8.62 MB", "242.57 KB"
    videoAvailable: boolean;
    audioAvailable: boolean;
    chunked: boolean;
    cached: boolean;
}

export interface TiktokVideo {
    error?: string;
    url: string;
    title: string;
    thumbnail: string;
    duration: string; // e.g., "00:15"
    source: string; // e.g., "tiktok"
    medias: Media[];
    sid?: string;
}

const apiUrl = 'https://snapdouyin.app/wp-json/aio-dl/video-data/';

const headers = {
    "content-type": "application/x-www-form-urlencoded",
};

async function downloadTiktok(url: string): Promise<TiktokVideo> {
    try {
        const options = querystring.stringify({ url });
        const response = await request(apiUrl, { method: "POST", body: options, headers });
        const responseBody = await response.body.json();
        if (typeof responseBody !== 'object' || responseBody === null) {
            throw new Error('Invalid response format');
        }
        return responseBody as TiktokVideo;
    } catch (error) {
        throw new Error(`An error occurred: ${error}`);
    }
}

async function getBufferFromURL(url: string): Promise<Buffer> {
    try {
        const response = await fetch(url);
        const buffer = Buffer.from(await response.arrayBuffer());
        return buffer;
    } catch (error) {
        throw new Error(`An error occurred: ${error}`);
    }
}

function getBestMediaWithinLimit(medias: Media[], limitedSizeBytes: number): Media | null {
    return medias.filter(media => media.size <= limitedSizeBytes)
        .sort((a, b) => b.size - a.size)[0] || null;
}

function filterNoWatermark(medias: Media[]): Media[] {
    return medias.filter(media => media.quality !== 'watermark');
}

function filterVideo(medias: Media[]): Media[] {
    return medias.filter(media => media.videoAvailable && media.audioAvailable);
}

function filterAudio(medias: Media[]): Media[] {
    return medias.filter(media => !media.videoAvailable && media.audioAvailable);
}

// Function to check if the video requires HEVC extension
function requiresHEVC(media: Media): boolean {
    return media.extension === 'hevc';
}

export { downloadTiktok, getBufferFromURL, getBestMediaWithinLimit, filterNoWatermark, filterVideo, filterAudio, requiresHEVC };