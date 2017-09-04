var postcss = require('postcss');

module.exports = postcss.plugin('postcss-strip-selectors', function (opts) {
  opts = opts || {};
  const { selectors } = opts;

  if (!Array.isArray(selectors))
    throw new TypeError("selectors should be a list of elements or classes to remove");

  return function(css){
    const elementMatches = (s, char) => s.includes(char) ? s.split(char)[0] : null;

    const isMatchingElement = (s) => selectors.includes(s);
    const isMatchingElementWithClass = (s) => elementMatches(s, '.');
    const isMatchingElementWithAttr = (s) => elementMatches(s, '[');

    const toBeRemoved = (s) => {
      return isMatchingElement(s)
        || isMatchingElementWithClass(s)
        || isMatchingElementWithAttr(s);
    };

    css.walkRules(rule => {
      const allowedSelectors = rule.selectors.filter(s => !toBeRemoved(s));

      if(allowedSelectors.length)
        rule.selectors = allowedSelectors;
      else
        rule.remove();
    });
  };
});
