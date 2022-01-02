import { appRouter } from '@server/router'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { resolveTypes } from '../../trpc-playground/src'

export function middleware(request: NextRequest) {
  // create an instance of the class to access the public methods. This uses `next()`,
  // you could use `redirect()` or `rewrite()` as well
  const response = NextResponse.next()
  console.log(request.method, request.url)
  if (request.url === '/' && request.method === 'POST') {
    const types = resolveTypes(appRouter)
    return NextResponse.json(types)
  }

  return response
}
