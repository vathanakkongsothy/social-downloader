export async function downloadVideo({ url, platform }: { url: string; platform: string }, onProgress: (percentage: number) => void): Promise<string> {
  const response = await fetch(`/api?videoUrl=${url}&platform=${platform}`);
  if (!response.ok) {
    throw new Error('An error occurred while processing the video.');
  }

  const contentLength = response.headers.get('Content-Length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;
  let loaded = 0;

  console.log('Content-Length:', contentLength);
  console.log('Total size:', total);

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
          loaded += value?.length || 0;
          const percentage = total ? (loaded / total) * 100 : 0;
          console.log('Loaded:', loaded, 'Percentage:', percentage);
          onProgress(percentage);
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

  const blob = await new Response(stream).blob();
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