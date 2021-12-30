import { basicSetup } from '@codemirror/basic-setup'
import { redo } from '@codemirror/history'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, keymap } from '@codemirror/view'
import { atom, useAtom } from 'jotai'
import inspect from 'object-inspect'
import { useEffect, useLayoutEffect } from 'preact/hooks'
import { useMemo } from 'react'
import CodeMirror from 'rodemirror'
import * as queryExtension from '../../../query-extension/src'
import { client } from './playground/provider'
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
  const [jsonValue, setJsonValue] = useAtom(jsonValueAtom)

  const extensions = useMemo(() => [
    basicSetup,
    oneDark,
    javascript(),
    keymap.of([{
      run: redo,
      key: 'Mod-Shift-z',
      preventDefault: true,
    }]),
    queryExtension.state({
      async onExecute(query) {
        const firstArg = query.args[0]
        if (typeof firstArg !== 'string') return

        const args = [firstArg, query.args[1]] as const
        try {
          if (query.operation === 'query') {
            console.log(query)
            // @ts-expect-error not possible to type args here, they could be anything
            const response = await client.query(...args)
            return setJsonValue(printObject(response))
          } else if (query.operation === 'mutate') {
            // @ts-expect-error not possible to type args here, they could be anything
            await client.mutation(...args)
          }
        } catch (e) {
          return setJsonValue(printObject(e))
        }
      },
    }),
    queryExtension.gutter(),
    queryExtension.lineNumbers(),
  ], [])
  const jsonExtensions = useMemo(() => [json(), oneDark, EditorState.readOnly.of(true)], [])

  useLayoutEffect(() => {
    if (!editorView || (previousTabIndex === currentTabIndex)) return

    setTabs((tabs) => {
      const newTabs = [...tabs]

      newTabs[previousTabIndex].doc = editorView.state.doc.toString()

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

  return (
    <div className='grid grid-cols-2 items-stretch z-30'>
      <CodeMirror
        extensions={extensions}
        onEditorViewChange={(editorView) => setEditorView(editorView)}
      />
      <CodeMirror
        value={jsonValue}
        selection={{ head: 0, anchor: 0 }}
        extensions={jsonExtensions}
      />
    </div>
  )
}
