import { ClientConfig } from '@trpc-playground/types'
import { render } from 'preact'
import './global.css'

// dprint-ignore
import { Playground } from '@trpc-playground/components' 

; // eslint-disable-next-line @typescript-eslint/no-explicit-any
;((window as any).TrpcPlayground) = {
  init(element: Element, config: ClientConfig) {
    render(<Playground config={config} />, element)
  },
}
