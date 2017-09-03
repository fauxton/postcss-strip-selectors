# PostCSS Strip Selectors [![Build Status][ci-img]][ci]

[PostCSS] plugin to remove specified selectors from your stylesheets.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/clekstro/postcss-strip-selectors.svg
[ci]:      https://travis-ci.org/clekstro/postcss-strip-selectors

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

```js
postcss([ require('postcss-strip-selectors') ])
```

See [PostCSS] docs for examples for your environment.
