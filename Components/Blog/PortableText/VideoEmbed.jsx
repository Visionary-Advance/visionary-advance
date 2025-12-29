// Components/Blog/PortableText/VideoEmbed.jsx
// Video embed component for YouTube and Vimeo

export default function VideoEmbed({ value }) {
  const { url, caption } = value;

  if (!url) return null;

  // Extract video ID and determine platform
  let embedUrl = null;

  // YouTube
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  if (youtubeMatch) {
    embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo
  const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);
  if (vimeoMatch) {
    embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  if (!embedUrl) {
    return (
      <div className="my-8 p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
        <p className="font-manrope text-red-400">
          Invalid video URL. Please use a YouTube or Vimeo link.
        </p>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="relative aspect-video overflow-hidden rounded-xl border border-white/10">
        <iframe
          src={embedUrl}
          title={caption || 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
      {caption && (
        <p className="font-manrope text-sm text-gray-400 text-center mt-4">
          {caption}
        </p>
      )}
    </div>
  );
}
