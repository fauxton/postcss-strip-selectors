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
