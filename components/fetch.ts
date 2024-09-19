export async function downloadVideo({ url, platform }: { url: string; platform: string }): Promise<string> {
    const response = await fetch(`/api?videoUrl=${url}&platform=${platform}`);
    if (!response.ok) {
      throw new Error('An error occurred while processing the video.');
    }
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = downloadUrl;
    a.download = `video_${platform}.mp4`; // Example file name format
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    return `Video from ${platform} is ready for download!`;
  }