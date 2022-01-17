import { PlaygroundRequestOperation } from '@trpc-playground/types'
import http from 'http'

export type NodeHTTPRequest = http.IncomingMessage & {
  method?: string
  body?: unknown
}

export type HTTPRequest = {
  method: string
  headers?: http.IncomingHttpHeaders
  body?: unknown
}

export type HTTPBody = {
  operation: PlaygroundRequestOperation
}
