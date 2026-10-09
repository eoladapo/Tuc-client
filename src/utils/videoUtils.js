/**
 * Convert various YouTube URL formats to embeddable format with extra parameters
 * @param {string} url - YouTube URL (youtu.be, youtube.com/watch, etc.)
 * @returns {string} - Embeddable YouTube URL with parameters to hide branding
 */
export const convertToEmbedUrl = (url) => {
  if (!url) return url;

  // Trim whitespace
  url = url.trim();

  // Check if it's a YouTube URL
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(youtubeRegex);

  if (match && match[1]) {
    // Extract video ID and convert to embed URL with parameters
    // Parameters explanation:
    // - modestbranding=1: Removes YouTube logo from control bar
    // - rel=0: Shows related videos from same channel only
    // - showinfo=0: Hides video title and uploader (deprecated but kept for old browsers)
    // - iv_load_policy=3: Hides video annotations
    // - disablekb=1: Disables keyboard controls (optional)
    return `https://www.youtube.com/embed/${match[1]}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`;
  }

  // For other video platforms, just return trimmed URL
  return url;
};

/**
 * Extract video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null
 */
export const getYouTubeVideoId = (url) => {
  if (!url) return null;

  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);

  return match ? match[1] : null;
};
