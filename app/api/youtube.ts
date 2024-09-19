import ytdl from 'ytdl-core';
import * as cliProgress from 'cli-progress';
import fs from 'fs';

const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

export async function YoutubeDownloader(videoUrl: string, quality: string) {
    try {
        const video = ytdl(videoUrl, {
            filter: format => format.qualityLabel === quality
        });

        video.pipe(fs.createWriteStream(`public/video_${new Date().getTime()}.mp4`));

        bar.start(100, 0);
        video.on('progress', (_, downloaded, total) => {
            const percent = (downloaded / total * 100).toFixed(2);
            bar.update(Number(percent));
        });

        video.on('end', () => {
            bar.stop();
        });
    } catch (error) {
        console.error(`Failed to download video: ${error}`);
    }
}
