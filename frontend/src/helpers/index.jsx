const helperFunctions = {
  hexToRgba: (hex, alpha = 1) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  },

  toggleFullscreen: () => {
    const doc = document;
    const el = document.documentElement;

    if (!doc.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      doc.exitFullscreen?.();
    }
  },

  arrayToMultilineText: (arr) => (Array.isArray(arr) ? arr.join('\n') : ''),

  multilineTextToArray: (text) =>
    text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line),

  serializeItems: (items, delimiter = ' ') => {
    return items.map(({ text, duration }) => `${text}${delimiter}${duration}`).join('\n');
  },

  deserializeItems: (textInput) => {
    return textInput
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const parts = line.split(/[\s;]+/);
        const duration = parseInt(parts.pop(), 10);
        const text = parts.join(' ');
        return { text, duration: isNaN(duration) ? 1000 : duration };
      });
  },
};

export default helperFunctions;
