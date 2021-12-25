import { basicSetup } from '@codemirror/basic-setup'
import { redo } from '@codemirror/history'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, keymap } from '@codemirror/view'
import { atom, useAtom } from 'jotai'
import { useEffect, useLayoutEffect } from 'preact/hooks'
import { useMemo } from 'react'
import CodeMirror from 'rodemirror'
import { currentTabAtom, currentTabIndexAtom, previousTabIndexAtom, tabsAtom } from './tab-store'

const elementProps = {
  className: 'flex-1',
}

const editorViewAtom = atom<EditorView | null>(null)

export const Editor = () => {
  const [editorView, setEditorView] = useAtom(editorViewAtom)
  const [, setTabs] = useAtom(tabsAtom)
  const [previousTabIndex] = useAtom(previousTabIndexAtom)
  const [currentTabIndex] = useAtom(currentTabIndexAtom)
  const [currentTab] = useAtom(currentTabAtom)

  const extensions = useMemo(() => [
    basicSetup,
    oneDark,
    javascript(),
    keymap.of([{
      run: redo,
      key: 'Mod-Shift-z',
      preventDefault: true,
    }]),
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
        value={JSON.stringify(elementProps, null, 2)}
        extensions={jsonExtensions}
      />
    </div>
  )
}
