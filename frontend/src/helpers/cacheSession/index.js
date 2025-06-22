export const setCachedData = (key, data) => {
  sessionStorage.setItem(
    key,
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );
};
