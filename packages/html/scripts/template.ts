/**
 * @see https://github.com/graphql/graphql-playground/blob/main/packages/graphql-playground-html/src/render-playground-page.ts
 */
// some variables used after injection
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ClientConfig } from '@trpc-playground/types'
import { filterXSS } from 'xss'
import { RenderPlaygroundPageOptions } from '..'

const CONFIG_ID = 'playground-config'

const filter = (val: string) =>
  filterXSS(val, {
    // @ts-expect-error this is valid
    whiteList: [],
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script'],
  })

const renderConfig = (config: ClientConfig) => {
  return filterXSS(`<div id="${CONFIG_ID}">${JSON.stringify(config)}</div>`, {
    whiteList: { div: ['id'] },
  })
}

const renderPlaygroundPage = ({ version, cdnUrl, clientConfig }: RenderPlaygroundPageOptions) => {
  // only send necessary config to client
  // this must be updated with the latest properties whenever ClientConfig is updated
  const resolvedConfig: ClientConfig = {
    trpcApiEndpoint: clientConfig.trpcApiEndpoint,
    playgroundEndpoint: clientConfig.playgroundEndpoint,
    polling: clientConfig.polling,
    request: clientConfig.request,
  }

  const buildCdnUrl = (packageName: string, suffix: string) =>
    filter(`${cdnUrl}/${packageName}${version ? `@${version}` : ''}/${suffix}` || '')

  return (`<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>tRPC Playground</title>
    {scripts}
    {links}
  </head>
  <body>
    <style>
      #${CONFIG_ID} {
        display: none
      }
    </style>
    ${renderConfig(resolvedConfig)}
    <div id="app"></div>
    
    <script>
      window.addEventListener('load', function() {
        const root = document.getElementById('app');
        const configText = document.getElementById('${CONFIG_ID}').innerText;
  
        if(configText && configText.length) {
          try {
            TrpcPlayground.init(root, JSON.parse(configText));
          }
          catch(err) {
            console.error("could not find config")
          }
        }
        else {
          TrpcPlayground.init(root);
        }
      })
    </script>
  </body>
  </html>`)
}

export { renderPlaygroundPage }
