import { Extension, Facet } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import debounce from 'lodash/debounce'
import noop from 'lodash/noop'
import over from 'lodash/over'

/**
 * A Facet that stores all registered `onChange` callbacks
 */
export type OnChange = (code: string, view: EditorView) => void
const OnChangeFacet = Facet.define<OnChange, OnChange>({
  combine: input => {
    // If multiple `onChange` callbacks are registered, chain them (call them one after another)
    return over(input)
  },
})

/**
 * An extension that calls a (debounced) function when the editor content changes
 */
export const onChangeCallback = (onChange?: OnChange): Extension => {
  return [
    OnChangeFacet.of(debounce(onChange || noop, 300)),
    EditorView.updateListener.of(({ view, docChanged }) => {
      if (docChanged) {
        // Call the onChange callback
        const content = view.state.sliceDoc(0)
        const onChange = view.state.facet(OnChangeFacet)
        onChange(content, view)
      }
    }),
  ]
}
