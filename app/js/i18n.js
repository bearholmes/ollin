/*jslint laxbreak: true, strict: true*/
/*global self, chrome, document*/

(function (document) {
  "use strict";
  let i18n = function(key, substitutions) {
    if (key === "@@IETF_lang_tag") {
      return i18n("@@ui_locale").replace(/_/g, "-");
    }
    return chrome.i18n.getMessage(key, substitutions);
  };

  let localeText = document.querySelectorAll("[data-i18n]");

  localeText.forEach(elt => {
    let terms = elt.dataset.i18n.split(/\s*,\s*/);
    delete elt.dataset.i18n;
    let child = 0;

    terms.forEach(term => {
      term = term.split(/\s*=\s*/);
      if (term.length > 1 && isNaN(term[0])) {
        elt.setAttribute(term[0], i18n(term[1]));
      } else {
        if (term.length === 1) {
          child++;
        } else {
          child = +term[0];
        }
        elt.insertBefore(
          document.createTextNode(i18n(term[term.length - 1])),
          elt.children.item(child - 1)
        );
      }
    });
  });
}(document));
