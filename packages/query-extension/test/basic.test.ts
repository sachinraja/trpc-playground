import { expect, test } from 'vitest'

test("message contains 'Hello'", () => {
  expect('Hello World').toContain('Hello')
})
