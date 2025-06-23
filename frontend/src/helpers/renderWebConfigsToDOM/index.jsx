/**
 * @param {Array} webConfigs
 * @param {string} lang
 */
export const renderWebConfigsToDOM = (webConfigs, lang = 'vi') => {
  if (!Array.isArray(webConfigs)) return;

  webConfigs.forEach(({ key, value }) => {
    const el = document.querySelector(`[data-key="${key}"]`);
    if (el && value?.[lang]) {
      el.textContent = value[lang];
    }
  });
};
