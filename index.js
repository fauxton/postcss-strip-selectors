var postcss = require('postcss');

/* This implementation was forked from
 * https://github.com/ShogunPanda/postcss-remove-selectors
 *
 * Unfortunately, that package used a regex to strip selectors that started with
 * a selector, causing `b` to remove `body` which was a non-starter */


module.exports = postcss.plugin('postcss-strip-selectors', function (opts) {
  opts = opts || {};
  let { selectors, regexen } = opts;

  if (!Array.isArray(selectors) && !Array.isArray(regexen))
    throw new TypeError("You must pass either a list of selectors or regexen to be removed");

  selectors = selectors || [];
  regexen = regexen || [];

  const elementMatches = (s, char) => s.includes(char) ? s.split(char)[0] : null;

  const isMatchingElement = (s) => selectors.includes(s);
  const isMatchingElementWithClass = (s) => elementMatches(s, '.');
  const isMatchingElementWithAttr = (s) => elementMatches(s, '[');
  const isMatchingElementWithPseudoClass = (s) => elementMatches(s, ':');

  const toBeRemoved = (s) => {
    return isMatchingElement(s)
      || isMatchingElementWithClass(s)
      || isMatchingElementWithAttr(s)
      || isMatchingElementWithPseudoClass(s);
  };

  const matchesRegex = (s) => {
    return regexen.some(regex => regex.test(s));
  };

  const processRule = (rule) => {
    const allowedSelectors = rule.selectors.filter(s => !toBeRemoved(s) && !matchesRegex(s));

    if(allowedSelectors.length) {
      rule.selectors = allowedSelectors;
    } else {
      rule.remove();
    }
  };

  return (css) => css.walkRules(rule => processRule(rule));
});
