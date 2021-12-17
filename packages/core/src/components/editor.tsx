import { basicSetup } from '@codemirror/basic-setup'
import { javascript } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { EditorState } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { useMemo } from 'react'
import CodeMirror from 'rodemirror'

const elementProps = {
  className: 'flex-1',
}
export const Editor = () => {
  const extensions = useMemo(() => [basicSetup, javascript(), oneDark], [])
  const jsonExtensions = useMemo(() => [json(), oneDark, EditorState.readOnly.of(true)], [])

  return (
    <div className='grid grid-cols-2 items-stretch bg-[#282c34]'>
      <CodeMirror extensions={extensions} elementProps={elementProps} />
      <CodeMirror
        value={JSON.stringify(elementProps, null, 2)}
        extensions={jsonExtensions}
        elementProps={elementProps}
      />
    </div>
  )
}
