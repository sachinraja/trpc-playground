/**
 * @see https://github.com/prisma/text-editors/blob/main/src/extensions/prisma-query/find-queries.ts
 */
import { syntaxTree } from '@codemirror/language'
import { RangeSet, RangeSetBuilder, RangeValue } from '@codemirror/rangeset'
import { EditorState } from '@codemirror/state'
import RJSON from 'relaxed-json'

export type Query = {
  operation: string
  args: (string | Record<string, unknown>)[]
}

export class QueryRangeValue extends RangeValue {
  public query: Query

  constructor({ operation, args }: Omit<Query, 'args'> & { args?: string[] }) {
    super()

    this.query = {
      operation,
      args: [],
    }

    if (args) {
      this.query.args = args.map(arg => {
        try {
          return RJSON.parse(arg)
        } catch (_) {
          return arg.trim()
        }
      })
    }

    console.log(this.query.args)
  }
}

const queryFunctions = ['query', 'mutate']
export const findQueries = (state: EditorState): RangeSet<QueryRangeValue> => {
  const syntax = syntaxTree(state)
  const queries = new RangeSetBuilder<QueryRangeValue>()

  syntax.iterate({
    enter(type, from, to, get) {
      if (type.name !== 'CallExpression') return

      const callExpression = get()

      // check if the call expression is a query function
      // first child should be name of function
      const identifier = callExpression.firstChild

      if (identifier?.name !== 'VariableName') return
      // slice the doc to get the name of the function
      const identifierName = state.sliceDoc(identifier.from, identifier.to)

      // if the function is not a query function, return
      if (!(queryFunctions.includes(identifierName))) return

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

      queries.add(
        callExpression.from,
        callExpression.to,
        new QueryRangeValue({ operation: identifierName, args }),
      )
    },
  })

  return queries.finish()
}
