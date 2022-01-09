import { basicSetup } from '@codemirror/basic-setup'
import { redo } from '@codemirror/history'
import { javascript } from '@codemirror/lang-javascript'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, keymap } from '@codemirror/view'
import * as queryExtension from '@trpc-playground/query-extension'
import { injectTypes, setDiagnostics, tsTheme, typescript } from '@trpc-playground/typescript-extension'
import { atom, useAtom } from 'jotai'
import inspect from 'object-inspect'
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'preact/hooks'
import CodeMirror from 'rodemirror'
import { transform } from 'sucrase-browser'
import { baseTheme } from '../base-theme'
import { makePlaygroundRequest } from '../playground-request'
import { maskedEval } from '../utils/masked-eval'
import { configAtom, trpcClientAtom } from './provider'
import { currentTabAtom, currentTabIndexAtom, previousTabIndexAtom, tabsAtom } from './tab-store'

const printObject = (obj: unknown) => inspect(obj, { indent: 2 })
const editorViewAtom = atom<EditorView | null>(null)
const jsonValueAtom = atom(printObject({ foo: 'bar' }))

export const Editor = () => {
  const [editorView, setEditorView] = useAtom(editorViewAtom)
  const [, setTabs] = useAtom(tabsAtom)
  const [previousTabIndex] = useAtom(previousTabIndexAtom)
  const [currentTabIndex] = useAtom(currentTabIndexAtom)
  const [currentTab] = useAtom(currentTabAtom)
  const [responseObjectValue, setResponseObjectValue] = useAtom(jsonValueAtom)
  const [trpcClient] = useAtom(trpcClientAtom)
  const [config] = useAtom(configAtom)

  const refreshTypes = useCallback(async () => {
    if (!editorView) return

    const types = await makePlaygroundRequest('getTypes', {
      playgroundEndpoint: config.playgroundEndpoint,
    })

    editorView.dispatch(injectTypes({
      '/index.d.ts': types.join('\n'),
    }))
  }, [editorView])

  const extensions = useMemo(() => [
    basicSetup,
    oneDark,
    baseTheme,
    tsTheme,
    javascript({ typescript: true }),
    keymap.of([{
      run: redo,
      key: 'Mod-Shift-z',
      preventDefault: true,
    }]),
    queryExtension.state({
      async onExecute(query) {
        const firstArg = query.args[0]
        if (typeof firstArg !== 'string') return

        // force type to satisfy trpc args because it cannot infer types from router
        const args = [firstArg, query.args[1]] as unknown as [string, undefined]

        try {
          if (query.operation === 'query') {
            const response = await trpcClient.query(...args)
            return setResponseObjectValue(printObject(response))
          } else if (query.operation === 'mutate') {
            await trpcClient.mutation(...args)
          }
        } catch (e) {
          return setResponseObjectValue(printObject(e))
        }
      },
    }),
    queryExtension.gutter(),
    queryExtension.lineNumbers(),
    typescript(),
  ], [])
  const jsonExtensions = useMemo(() => [javascript(), oneDark, EditorState.readOnly.of(true)], [])

  useLayoutEffect(() => {
    if (!editorView || (previousTabIndex === currentTabIndex)) return

    setTabs((tabs) => {
      const newTabs = [...tabs]
      newTabs[previousTabIndex] = { ...newTabs[previousTabIndex], doc: editorView.state.doc.toString() }

      return newTabs
    })
  }, [editorView, previousTabIndex, currentTabIndex, currentTab, setTabs])

  useEffect(() => {
    if (!editorView) return

    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: currentTab.doc,
      },
    })
  }, [editorView, currentTab])

  useEffect(() => {
    refreshTypes()
    // no need to refresh types anymore
    if (config.refreshTypesTimeout === null || !editorView) return

    const refreshTypesTimeoutMs = config.refreshTypesTimeout

    let refreshTypesTimeoutId = setTimeout(async function recursiveRefreshTypes() {
      await refreshTypes()
      // refresh ts linter diagnostics after types are refreshed
      editorView.dispatch(await setDiagnostics(editorView.state))

      refreshTypesTimeoutId = setTimeout(recursiveRefreshTypes, refreshTypesTimeoutMs)
    }, refreshTypesTimeoutMs)

    return () => clearTimeout(refreshTypesTimeoutId)
  }, [editorView])

  return (
    <div className='grid grid-cols-2 items-stretch z-30'>
      <CodeMirror
        extensions={extensions}
        onEditorViewChange={(editorView) => setEditorView(editorView)}
      />
      <CodeMirror
        value={responseObjectValue}
        selection={{ head: 0, anchor: 0 }}
        extensions={jsonExtensions}
      />
      <button
        onClick={async () => {
          if (!editorView) return

          // if the code exited because a failed query
          let didQueryFail = false

          const queryResponses: unknown[] = []
          try {
            // transform imports because export {} does not make sense in eval function
            const transformed = transform(editorView?.state.doc.toString(), { transforms: ['typescript', 'imports'] })

            await maskedEval(transformed.code, {
              async query(path: string, args: never) {
                try {
                  const response = await trpcClient.query(path, args)
                  queryResponses.push(response)
                  return response
                } catch (e) {
                  // add error response before throwing
                  queryResponses.push(e)
                  didQueryFail = true
                  throw e
                }
              },
            })
          } catch (e) {
            // if the query failed, the response object is already set
            if (!didQueryFail) return setResponseObjectValue(printObject(e))
          }

          const responseObjectValue = `${queryResponses.map((response) => printObject(response)).join(',\n\n')}`
          setResponseObjectValue(responseObjectValue)
        }}
      >
        Run All Queries
      </button>
    </div>
  )
}
