/**
 * Format a rating value to a fixed decimal string
 * @param {number|string|null|undefined} rating - The rating value
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted rating string
 */
export const formatRating = (rating, decimals = 1) => {
  if (rating === null || rating === undefined || rating === '') {
    return '0.0';
  }

  const numRating = Number(rating);

  if (isNaN(numRating)) {
    return '0.0';
  }

  return numRating.toFixed(decimals);
};

/**
 * Format price to display string
 * @param {number} price - The price value
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  if (price === 0 || price === null || price === undefined) {
    return 'Free';
  }
  return `$${Number(price).toFixed(2)}`;
};

/**
 * Format number with commas for thousands
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) {
    return '0';
  }
  return Number(num).toLocaleString();
};

/**
 * Format duration in seconds to readable time string (e.g., "10:30", "1:05:20")
 * @param {number|null|undefined} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
export const formatDuration = (seconds) => {
  if (!seconds || seconds === 0) {
    return '0:00';
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

/**
 * Get initials from a name string
 * @param {string} name - The full name
 * @returns {string} Initials (e.g., "John Doe" -> "JD")
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') {
    return '';
  }

  const names = name.trim().split(' ').filter(n => n.length > 0);

  if (names.length === 0) {
    return '';
  }

  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};
