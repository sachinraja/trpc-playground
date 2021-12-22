import { basicSetup } from '@codemirror/basic-setup'
import { redo } from '@codemirror/history'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, keymap } from '@codemirror/view'
import { useEffect, useState } from 'preact/hooks'
import { useMemo } from 'react'
import CodeMirror from 'rodemirror'
import { useTabStore } from './tab-store'

const elementProps = {
  className: 'flex-1',
}

export const Editor = () => {
  const [editorView, setEditorView] = useState<EditorView>()
  const { tabs, setTabs, previousTabIndex, currentTabIndex, currentTabId } = useTabStore()
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

  const [currentValue, setCurrentValue] = useState(tabs[currentTabIndex].doc)

  useEffect(() => {
    if (!editorView) return

    const newTabs = [...tabs]

    if (currentTabIndex !== previousTabIndex) {
      newTabs[previousTabIndex].doc = editorView.state.doc.toString()
    }

    setTabs(newTabs)
    setCurrentValue(tabs[currentTabIndex].doc)
  }, [editorView, previousTabIndex, currentTabIndex, currentTabId, setTabs])

  return (
    <div className='grid grid-cols-2 items-stretch z-30'>
      <CodeMirror
        selection={{ head: 0, anchor: 0 }}
        value={currentValue}
        extensions={extensions}
        onEditorViewChange={(editorView) => {
          setEditorView(editorView)
        }}
      />
      <CodeMirror
        value={JSON.stringify(elementProps, null, 2)}
        extensions={jsonExtensions}
      />
    </div>
  )
}
