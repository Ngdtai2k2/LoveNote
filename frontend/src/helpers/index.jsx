import { toast } from 'react-fox-toast';

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

  shortenUrl: (url, maxLength = 40) => {
    if (!url || url.length <= maxLength) return url;
    const head = Math.ceil((maxLength - 3) / 2);
    const tail = Math.floor((maxLength - 3) / 2);
    return `${url.slice(0, head)}...${url.slice(-tail)}`;
  },

  handleCopy: async (text, t) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('template:copy_success'), { position: 'top-right' });
    } catch {
      toast.error(t('template:copy_fail'), { position: 'top-right' });
    }
  },

  formatDateTime: (date) =>
    new Date(date).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
};

export default helperFunctions;
