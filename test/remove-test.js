import assert from 'assert'
import { transform } from '@babel/core'
import plugin from '../src/remove-test'

describe('test remove-test', function() {
  it('should remove test function decls', function() {
    const code = `\
function $test_should_convert() {

}`

    const result = transform(code, {
      babelrc: false,
      plugins: [plugin]
    })

    assert(result.code == ``)
  })

  it('should remove assert module', function() {
    const code = `import 'assert'`

    const result = transform(code, {
      babelrc: false,
      plugins: [plugin]
    })

    assert(result.code == ``)
  })
})
