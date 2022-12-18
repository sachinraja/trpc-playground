import { syntaxTree } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import { RangeSet, RangeSetBuilder, RangeValue } from '@codemirror/state'
import { transformTs } from '@trpc-playground/utils'
import { maskedEval } from './masked-eval'

export type Query = {
  operation: string
  args: unknown[]
}

export class QueryRangeValue extends RangeValue {
  public query: Query
  public rawArgs?: string[]

  constructor({ operation, args }: Omit<Query, 'args'> & { args?: string[] }) {
    super()

    this.query = {
      operation,
      args: [],
    }
    this.rawArgs = args
  }

  async init() {
    if (this.rawArgs) {
      this.query.args = await Promise.all(this.rawArgs.map((arg) => {
        const argsWithReturn = `return ${arg}`
        const transformedCode = transformTs(argsWithReturn)
        return maskedEval(transformedCode, {})
      }))
    }
  }
}

const queryFunctions = ['query', 'mutate']
export const findQueries = (state: EditorState): RangeSet<QueryRangeValue> => {
  const syntax = syntaxTree(state)
  const queries = new RangeSetBuilder<QueryRangeValue>()

  syntax.iterate({
    enter(node) {
      if (node.name !== 'CallExpression') return

      const callExpression = node.node

      // check if the call expression is a query function
      // first child should be name of function
      const identifier = callExpression.firstChild

      if (identifier?.name !== 'MemberExpression') return
      // slice the doc to get the name of the function
      const identifierName = state.sliceDoc(identifier.from, identifier.to)

      // if the function is not a query function, return
      const queryFunction = identifierName.split('.').pop()
      if (!queryFunction || !(queryFunctions.includes(queryFunction))) return

      // get the arguments of the function
      const argList = callExpression.lastChild
      if (argList?.name !== 'ArgList') return

      // get the arguments
      let args: string[] = []

      let arg = argList.firstChild
      while (arg) {
        // Skip over unnecessary tokens
        if (arg.type.name !== ',') {
          args.push(state.sliceDoc(arg.from, arg.to))
        }

        arg = arg.nextSibling
      }

      // Ignore away the parenthesis (first and last child of `argsExpression`)
      args = args.slice(1, -1)

      const endpointPath = `"${identifierName.split('.').slice(1, -1).join('.')}"`
      queries.add(
        callExpression.from,
        callExpression.to,
        new QueryRangeValue({
          operation: queryFunction,
          args: [endpointPath, ...args],
        }),
      )
    },
  })

  return queries.finish()
}
