/**
 * remove all test function decls
 *
 * @flow
 */

type Options = {
  test?: RegExp,
  include?: Array<string>
}

export default function plugin({ types: t }: any,
                               { test, include = [] }: Options) {
  return {
    visitor: {
      ImportDeclaration(path: any) {
        const value = path.node.source.value

        if(
          /**
           * always remove 'assert'
           */
          'assert' === value ||
          /**
           * check includes
           */
          Boolean(~include.indexOf(value)) ||
          /**
           * check tester
           */
          (test && isRegExp(test) && test.test(value))
        ) {
          /**
           * remove path node
           */
          path.remove()
          return
        }

        return
      },
      CallExpression(path: any) {
        const name = path.node.callee.name
        if('describe' !== name) {
          return
        }

        path.remove()
      }
    }
  }
}


function isRegExp(regex: any): boolean %checks {
  return '[object RegExp]' === Object.prototype.toString.call(regex)
}


/**
 * test
 */

import assert from 'assert'
import { transform } from '@babel/core'

describe('isRegExp', () => {
  it('check object was a regexp', () => {
    assert(false === isRegExp('foo'))
    assert(false === isRegExp(42))
    assert(false === isRegExp(true))
    assert(false === isRegExp({}))
    assert(false === isRegExp([]))
    assert(true === isRegExp(/foo/))
  })
})

describe('test remove-test', function() {
  it('should remove describe callee', function() {
    const code = `describe()`

    const result = transform(code, {
      babelrc: false,
      plugins: [plugin]
    })
  })

  it('should remove assert module importer', function() {
    const code = `import 'assert'`

    const result = transform(code, {
      babelrc: false,
      plugins: [plugin]
    })

    assert(result.code == ``)
  })

  it('should remove assert module importer with test option', function() {
    const code = `import 'foo'`

    const result = transform(code, {
      babelrc: false,
      plugins: [[plugin, {
        test: /foo/
      }]]
    })

    assert(result.code == ``)
  })

  it('should remove assert module importer with include option', function() {
    const code = `import 'foo'`

    const result = transform(code, {
      babelrc: false,
      plugins: [[plugin, {
        include: ['foo']
      }]]
    })

    assert(result.code == ``)
  })
})
