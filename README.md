babel plugins
----

## remove test plugin

This plugin erasure `describe()` and `import assert from 'assert'`. Allow you write test in your source file, e.g.

Input:

```js

function sum(a, b) {
  return a + b
}

/**
 * test
 */

import assert from 'assert'

describe('sum()', () => {
  it('should eq 3', () => {
    assert.ok(sum(1, 2), 3)
  })
})
```

Output:

```js
function sum(a, b) {
  return a + b
}

/**
 * test
 */


// 'import' and 'describe' was removed
```

### Usage

```js
// basic usage

{
  "plugins": ["@rabbitcc/remove-test"]
}

// or with options

{
  "plugins": [["@rabbitcc/remove-test", {
    // options see below..
  }]]
}

// remove on production evn

{
  "env": {
    "production": {
      "plugins": ["@rabbitcc/remove-test"]
    }
  }
}
```

Plugin options:

```js
type Options = {
  /**
   * remove test helper modules if match test, e.g. "import 'foo'" with `test: /foo/`
   */
  test?: RegExp,
  /**
   * like test, used for remove test helpers modules
   */
  include?: Array<string>
}
```
