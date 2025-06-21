const CACHE_KEY = 'banners';
const TTL = 10 * 60 * 1000;

export const getCachedBanners = () => {
  const raw = sessionStorage.getItem(CACHE_KEY);
  if (!raw) return null;

  try {
    const { data, timestamp } = JSON.parse(raw);
    const isExpired = Date.now() - timestamp > TTL;
    if (isExpired) sessionStorage.removeItem(CACHE_KEY);
    return isExpired ? null : data;
  } catch {
    sessionStorage.removeItem(CACHE_KEY);
    return null;
  }
};

export const setCachedBanners = data => {
  sessionStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
};
