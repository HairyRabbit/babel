import assert from 'assert'
import { transform } from '@babel/core'
import plugin from '../src/in-test'

describe('test in-test', function() {
  it('should convert function name', function() {
    const code = `\
function $test_should_convert() {

}`

    const result = transform(code, {
      babelrc: false,
      plugins: [plugin]
    })

    assert(result.code == `\
describe("test in-test", function () {
  it("should convert", function () {});
})`)
  })

  it('should_configure_describe', function() {
    const code = `\
/**
 * test
 *
 * @describe foo
 */

function $test_should_convert() {

}`

  const result = transform(code, {
    babelrc: false,
    plugins: [plugin]
  })

  assert(result.code == `\
/**
 * test
 *
 * @describe foo
 */
describe("foo", function () {
  it("should convert", function () {});
})`)
  })
})
