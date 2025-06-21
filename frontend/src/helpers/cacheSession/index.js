const DEFAULT_TTL = 10 * 60 * 1000;

export const getCachedData = (key, ttl = DEFAULT_TTL) => {
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;

  try {
    const { data, timestamp } = JSON.parse(raw);
    const isExpired = Date.now() - timestamp > ttl;
    if (isExpired) sessionStorage.removeItem(key);
    return isExpired ? null : data;
  } catch {
    sessionStorage.removeItem(key);
    return null;
  }
};

export const setCachedData = (key, data) => {
  sessionStorage.setItem(
    key,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
};
