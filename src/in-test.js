/**
 * write test in source code file
 *
 * @flow
 */

import { basename, extname } from 'path'

export default function plugin({ types: t }: any) {
  const nodes = []

  return {
    visitor: {
      Program(path: any, { filename }) {
        let describe = null

        const comment = path.parent.comments.find(s => {
          return 'CommentBlock' === s.type
            && /\*\s*test/i.test(s.value)
        })

        if(comment) {
          const ma = comment.value.match(/@describe\s+([^\r\n]*)/)
          if(ma) {
            describe = ma[1].trim()
          }
        }

        if(!describe) {
          describe = `test ${basename(filename, extname(filename))}`
        }

        path.node.body.push(
          t.callExpression(
            t.identifier('describe'),
            [
              t.stringLiteral(describe),
              t.functionExpression(
                null,
                [],
                t.blockStatement(
                  nodes
                )
              )
            ]
          )
        )
      },
      FunctionDeclaration(path: any) {
        if(!path.node.id) {
          return
        }

        if(!path.node.id.name.startsWith('$test_')) {
          return
        }

        path.replaceWith(
          t.callExpression(
            t.identifier('it'),
            [
              t.stringLiteral(
                path.node.id.name.substr(6).replace(/_/g, ' ')
              ),
              t.functionExpression(
                null,
                path.node.params,
                path.node.body
              )
            ]
          )
        )
        nodes.push(path.node)
        path.remove()
      }
    }
  }
}
