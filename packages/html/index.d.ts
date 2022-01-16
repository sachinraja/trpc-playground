import { ClientConfig, RenderOptions } from '@trpc-playground/types'

export type RenderPlaygroundPageOptions = {
  clientConfig: ClientConfig
} & {
  version?: RenderOptions['version']
  cdnUrl: NonNullable<RenderOptions['cdnUrl']>
}

declare function renderPlaygroundPage(args: RenderPlaygroundPageOptions): string

export { renderPlaygroundPage }
