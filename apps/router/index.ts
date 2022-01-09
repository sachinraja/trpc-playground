import * as trpc from '@trpc/server'
import { z } from 'zod'

export const appRouter = trpc
  .router()
  .query('hello', {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      }
    },
  })
  .query('hello_num', {
    input: z
      .object({
        text: z.number(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `hello ${input?.text ?? 'world'}`,
      }
    },
  })
  .query('subtract_nums', {
    input: z
      .object({
        a: z.number(),
        b: z.number(),
      }),
    resolve({ input }) {
      return {
        sum: input.a - input.b,
      }
    },
  })
  .query('add_nums', {
    input: z
      .object({
        a: z.number(),
        b: z.number(),
      }),
    resolve({ input }) {
      return {
        sum: input.a + input.b,
      }
    },
  })

export type AppRouter = typeof appRouter
