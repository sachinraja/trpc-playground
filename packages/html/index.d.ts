import { ClientConfig } from '@trpc-playground/types'

export type RenderPlaygroundPageArgs = {
  version?: number
  cdnUrl?: string
  clientConfig: ClientConfig
}

declare function renderPlaygroundPage(args: RenderPlaygroundPageArgs): string

export { renderPlaygroundPage }
