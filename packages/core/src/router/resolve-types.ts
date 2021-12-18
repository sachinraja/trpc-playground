import { AnyRouter } from '@trpc/server'
import { ZodAny } from 'zod'
import { printNode, zodToTs } from 'zod-to-ts'
import { appRouter } from '../../../next-app/server/router'

const resolveTypes = (router: AnyRouter) => {
  console.log(
    Object.entries(router._def.queries).map(([name, query]) => {
      // @ts-expect-error query type is not defined
      const { node } = zodToTs(query.inputParser as ZodAny)

      const inputType = printNode(node)

      const queryType = `function q(name: '${name}', input: ${inputType})`
      console.log(queryType)
      return queryType
    }),
  )
}

resolveTypes(appRouter)
