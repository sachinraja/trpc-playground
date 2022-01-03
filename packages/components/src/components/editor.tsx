import { basicSetup } from '@codemirror/basic-setup'
import { redo } from '@codemirror/history'
import { javascript } from '@codemirror/lang-javascript'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, keymap } from '@codemirror/view'
import { atom, useAtom } from 'jotai'
import inspect from 'object-inspect'
import { useCallback, useEffect, useLayoutEffect, useMemo } from 'preact/hooks'
import CodeMirror from 'rodemirror'
import * as queryExtension from '../../../query-extension/src'
import { injectTypes, setDiagnostics, typescript } from '../../../typescript-extension/src'
import { makePlaygroundRequest } from '../playground-request'
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

    const types = await makePlaygroundRequest('getTypes')

    editorView.dispatch(injectTypes({
      '/index.d.ts': types.join('\n'),
    }))
  }, [editorView])

  const extensions = useMemo(() => [
    basicSetup,
    oneDark,
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
    </div>
  )
}
