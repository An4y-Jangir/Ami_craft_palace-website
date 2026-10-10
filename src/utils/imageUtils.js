/**
 * Utility to ensure all product images load at optimal, high-definition resolution.
 * Automatically upgrades Amazon thumbnail URLs (e.g. ._AC_UY218_.) to crystal-clear high-res (.AC_SL1200.).
 */
export function getOptimizedImageUrl(url) {
  if (!url) return '/favicon.svg';

  // Amazon media URL with thumbnail modifiers
  if (url.includes('media-amazon.com')) {
    // If it has thumbnail height/size modifier like ._AC_UY218_. or ._AC_SR..., upgrade to ._AC_SL1200_.
    return url.replace(/\._AC_[^.]+\./, '._AC_SL1200_.');
  }

  return url;
}

/**
 * Fallback handler for broken image links
 */
export function handleImageError(e) {
  e.currentTarget.onerror = null;
  e.currentTarget.src = '/favicon.svg';
}
