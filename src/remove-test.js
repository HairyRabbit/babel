/**
 * remove all test function decls
 *
 * @flow
 */

export default function plugin({ types: t }: any) {
  return {
    visitor: {
      ImportDeclaration(path: any) {
        if('assert' !== path.node.source.value) {
          return
        }

        path.remove()
      },
      FunctionDeclaration(path: any) {
        if(!path.node.id) {
          return
        }

        if(!path.node.id.name.startsWith('$test_')) {
          return
        }

        path.remove()
      }
    }
  }
}
