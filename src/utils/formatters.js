/**
 * Format a price with currency symbol
 */
export function formatPrice(amount, currency = 'USD') {
  if (amount === null || amount === undefined) return 'N/A';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

/**
 * Get price type label
 */
export function getPriceLabel(priceType) {
  switch (priceType) {
    case 'EXACT': return '';
    case 'FROM': return 'From';
    case 'ESTIMATED': return 'Est.';
    case 'RANGE': return 'Range';
    case 'UNAVAILABLE': return 'Price unavailable';
    default: return '';
  }
}

/**
 * Get CSS class for price type
 */
export function getPriceClass(priceType) {
  switch (priceType) {
    case 'EXACT': return 'price-exact';
    case 'FROM': return 'price-from';
    case 'ESTIMATED': return 'price-estimated';
    case 'RANGE': return 'price-range';
    default: return 'price-unavailable';
  }
}

/**
 * Format a number with suffix (1.2k, 2.5M)
 */
export function formatCompact(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
  return num.toString();
}

/**
 * Truncate text to a maximum length
 */
export function truncate(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Get transport type icon/emoji
 */
export function getTransportIcon(type) {
  switch (type?.toUpperCase()) {
    case 'FLIGHT': return '✈️';
    case 'TRAIN': return '🚆';
    case 'BUS': return '🚌';
    default: return '🚗';
  }
}

/**
 * Get expense category icon
 */
export function getCategoryIcon(category) {
  switch (category) {
    case 'TRANSPORT': return '🚀';
    case 'ACCOMMODATION': return '🏨';
    case 'ACTIVITY': return '🎯';
    case 'FOOD': return '🍽️';
    case 'SHOPPING': return '🛍️';
    case 'OTHER': return '📦';
    default: return '💰';
  }
}

/**
 * Get category color class
 */
export function getCategoryColor(category) {
  switch (category) {
    case 'TRANSPORT': return '#f97316';
    case 'ACCOMMODATION': return '#3b82f6';
    case 'ACTIVITY': return '#8b5cf6';
    case 'FOOD': return '#10b981';
    case 'SHOPPING': return '#f472b6';
    case 'OTHER': return '#94a3b8';
    default: return '#64748b';
  }
}

/**
 * Format duration in minutes to human-readable
 */
export function formatDuration(minutes) {
  if (!minutes) return 'N/A';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs}h`;
  return `${hrs}h ${mins}m`;
}

/**
 * Format star rating
 */
export function formatRating(rating) {
  if (!rating) return 'N/A';
  return `⭐ ${rating.toFixed(1)}`;
}
