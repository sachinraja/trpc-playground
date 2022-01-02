import { HtmlValidTrpcPlaygroundConfig } from '@trpc-playground/types'
import { render } from 'preact'
import '../../components/global.css'
// dprint-ignore
import { Playground } from '../../components/src/components/playground' 

; // eslint-disable-next-line @typescript-eslint/no-explicit-any
;((window as any).TrpcPlayground) = {
  init(element: HTMLElement, config: string) {
    const jsonParsedConfig: HtmlValidTrpcPlaygroundConfig = JSON.parse(config)
    render(<Playground config={jsonParsedConfig} />, element)
  },
}
