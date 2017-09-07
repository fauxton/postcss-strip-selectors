var postcss = require('postcss');

var plugin = require('./');

function run(input, output, opts) {
  return postcss([ plugin(opts) ]).process(input)
    .then(result => {
      expect(result.css).toEqual(output);
      expect(result.warnings().length).toBe(0);
    });
}

it('strips single element', () => {
  return run('a{ }', '', { selectors: ['a'] });
});

it('strips only selector passed', () => {
  const input = `
  body {
    font-weight: bold;
  }
  `;

  return run(input, input, { selectors: ['b'] });
});

it('strips single element from compound definition', () => {
  const input = `
  strong, a{
    font-weight: bold;
  }

  a{
    color: red;
  }
  `;

  const output = `
  strong{
    font-weight: bold;
  }
  `;

  return run(input, output, { selectors: ['a'] });
});

it('strips single class', () => {
  return run('.a{ }', '', { selectors: ['.a'] });
});

it('strips single class from compound definition', () => {
  const input = `
  strong, .a{
    font-weight: bold;
  }

  .a{
    color: red;
  }
  `;

  const output = `
  strong{
    font-weight: bold;
  }
  `;

  return run(input, output, { selectors: ['.a'] });
});

it('strips element with class when element passed', () => {
  const input = `
  strong, a.foo{
    font-weight: bold;
  }

  a{
    color: red;
  }
  `;

  const output = `
  strong{
    font-weight: bold;
  }
  `;

  return run(input, output, { selectors: ['a'] });
});

it('strips element with attribute when element passed', () => {
  const input = `
  strong, input[type='text']{
    font-weight: bold;
  }

  input {
    background: red;
  }
  `;

  const output = `
  strong{
    font-weight: bold;
  }
  `;

  return run(input, output, { selectors: ['input'] });
});

it('strips element with pseudo class when element passed', () => {
  const input = `a:active, a:hover{ outline-width:0; }`;
  const output = ``;

  return run(input, output, { selectors: ['a'] });
});

it('strips selectors when element attributes passed', () => {
  const input = `[type="reset"], [type="submit"]{ -webkit-appearance:button; }`;
  const output = `[type="submit"]{ -webkit-appearance:button; }`;

  return run(input, output, { selectors: [`[type="reset"]`] });
});

it('strips selectors matching passed regex', () => {
  const input = `.foo{ height:0; position:relative; }`;
  const output = ``;

  return run(input, output, { regexen: [ new RegExp(/\.foo|bar/) ] });
});

it('does not strip selectors not matching passed regex', () => {
  const input = `.foo, .bar{ height: 0; }`;
  const output = `.foo{ height: 0; }`;

  return run(input, output, { regexen: [ new RegExp(/\.bar/) ] });
});

it('strips multiple selectors matching regex', () => {
  const input = `.foo, .bar, .baz, .qux{ height: 0; }`;
  const output = `.baz, .qux{ height: 0; }`;

  return run(input, output, { regexen: [ new RegExp(/^(\.foo|\.bar)*$/) ] });
});
