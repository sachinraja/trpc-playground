import { ClientConfig } from '@trpc-playground/types'
import { render } from 'preact'
import '../../components/global.css'
// dprint-ignore
import { Playground } from '../../components/src/components/playground' 

; // eslint-disable-next-line @typescript-eslint/no-explicit-any
;((window as any).TrpcPlayground) = {
  init(element: Element, config: ClientConfig) {
    render(<Playground config={config} />, element)
  },
}
