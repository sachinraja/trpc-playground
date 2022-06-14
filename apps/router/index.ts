import * as trpc from '@trpc/server'
import superjson from 'superjson'
import { z } from 'zod'

enum EnumTest {
  Val1,
  Val2,
}

export const appRouter = trpc
  .router()
  .query('no-args', {
    resolve: () => [],
  })
  .query('primitive', {
    input: z.string(),
    resolve: (i) => i,
  })
  // .query("literal", {
  //   input: z.literal(22),
  //   resolve: (i) => i
  // })
  // .query("enums", {
  //   input: z.enum(["1", "2"]),
  //   resolve: (i) => i
  // })
  // .query("native enums", {
  //   input: z.nativeEnum(EnumTest),
  //   resolve: (i) => i
  // })
  // .query("optionals", {
  //   input: z.optional(z.string()),
  //   resolve: (i) => i
  // })
  // .query("nullables", {
  //   input: z.nullable(z.number()),
  //   resolve: (i) => i
  // })
  .query('objects', {
    input: z.object({
      a: z.literal(false),
      b: z.enum(['1']),
    }),
    resolve: (i) => i,
  })
  // .query("arrays", {
  //   // input: z.array(z.string()),
  //   input: z.string().array(),
  //   resolve: (i) => i
  // })
  .query('arrays', {
    input: z.array(z.union([z.string(), z.number()])),
    resolve: () => [],
  })
  .query('tuples', {
    input: z.tuple([
      z.array(z.string()),
      z.object({
        a: z.number(),
      }),
      z.union([z.string(), z.number()]),
      z.enum(['1', '2']),
    ]),
    resolve: (i) => i,
  })
  // .query("unions", {
  //   input: z.union([z.string(), z.boolean()]),
  //   resolve: (i) => i
  // })
  // .query("discriminatedUnion", {
  //   input: z.discriminatedUnion("type", [
  //     z.object({ type: z.literal("a"), a: z.string() }),
  //     z.object({ type: z.literal("b"), b: z.string() }),
  //   ]),
  //   // .parse({ type: "a", a: "abc" }),
  //   resolve: (i) => i
  // })
  // .query("records", {
  //   input: z.record(z.string(), z.number()),
  //   resolve: (i) => i
  // })
  // .query("maps", {
  //   input: z.map(z.string(), z.number()),
  //   resolve: (i) => i
  // })
  // .query("sets", {
  //   input: z.set(z.string()),
  //   resolve: (i) => i
  // })
  // .query('hello', {
  //   input: z
  //     .object({
  //       text: z.string().optional(),
  //     })
  //     .nullish(),
  //   resolve({ input }) {
  //     return {
  //       greeting: `hello ${input?.text ?? 'world'}`,
  //     }
  //   },
  // })
  // .query('hello_num', {
  //   input: z
  //     .object({
  //       text: z.number(),
  //     })
  //     .nullish(),
  //   resolve({ input }) {
  //     return {
  //       greeting: `hello ${input?.text ?? 'world'}`,
  //     }
  //   },
  // })
  // .query('subtract_nums', {
  //   input: z
  //     .object({
  //       a: z.number(),
  //       b: z.number(),
  //     }),
  //   resolve({ input }) {
  //     return {
  //       sum: input.a - input.b,
  //     }
  //   },
  // })
  // .query('nums', {
  //   // input: z.object({
  //   //   a: z.number(),
  //   // }),
  //   input: z.array(z.string()),
  //   resolve({ input }) {
  //     return {
  //       sum: input.reduce((prev, curr) => prev + curr, 0),
  //     }
  //   },
  // })
  // .query('nums1', {
  //   // input: z.object({
  //   //   a: z.number(),
  //   // }),
  //   input: z.array(z.object({})),
  //   resolve({ input }) {
  //     return {
  //       sum: input.reduce((prev, curr) => prev + curr, 0),
  //     }
  //   },
  // })
  // .query('add_nums', {
  //   input: z
  //     .object({
  //       a: z.number(),
  //       b: z.number(),
  //       nums: z.array(z.object({
  //         a: z.string().optional(),
  //         b: z.boolean(),
  //       })),
  //       nums1: z.object({
  //         test: z.boolean().optional(),
  //         test2: z.string(),
  //       }).optional(),
  //       nums2: z.array(z.string().nullable()),
  //     }),
  //   resolve({ input }) {
  //     return {
  //       sum: input.a + input.b,
  //     }
  //   },
  // })
  // .mutation('delete_last_user', {
  //   input: z.object({
  //     a: z.number(),
  //   }),
  //   resolve() {
  //     users.splice(users.length - 1, 1)
  //     return users
  //   },
  // })
  // .query('no-args', {
  //   resolve() {
  //     return 5
  //   },
  // })
  // .query('test', {
  //   input: z.enum(["test", "test1"]),
  //   resolve() {
  //     return 5
  //   },
  // })
  // .query('date', {
  //   input: z.date(),
  //   async resolve({ input }) {
  //     await new Promise(resolve => setTimeout(resolve, 1000))
  //     return { serverTime: new Date(), requestTime: input }
  //   },
  // })
  .transformer(superjson)

export type AppRouter = typeof appRouter
