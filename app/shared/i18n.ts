/**
 * @file Ollin i18n Utility
 * @description Internationalization utility for Chrome Extension
 * @author bearholmes

 * @license MIT
 */

/**
 * Get localized message from Chrome i18n API
 */
export const i18n = (key: string, substitutions?: string | string[]): string => {
  if (key === '@@IETF_lang_tag') {
    return i18n('@@ui_locale').replace(/_/g, '-');
  }
  return chrome.i18n.getMessage(key, substitutions);
};

/**
 * Process all elements with data-i18n attribute
 */
const localeText = document.querySelectorAll<HTMLElement>('[data-i18n]');

localeText.forEach((elt) => {
  const i18nData = elt.dataset.i18n;
  if (!i18nData) return;

  const terms = i18nData.split(/\s*,\s*/);
  delete elt.dataset.i18n;
  let child = 0;

  terms.forEach((termStr) => {
    const term = termStr.split(/\s*=\s*/);
    if (term.length > 1 && isNaN(Number(term[0])) && term[0] && term[1]) {
      elt.setAttribute(term[0], i18n(term[1]));
    } else {
      if (term.length === 1) {
        child++;
      } else if (term[0]) {
        child = Number(term[0]);
      }
      const lastTerm = term[term.length - 1];
      if (lastTerm) {
        elt.insertBefore(document.createTextNode(i18n(lastTerm)), elt.children.item(child - 1));
      }
    }
  });
});
