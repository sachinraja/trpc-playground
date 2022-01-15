import { EditorState, Extension } from '@codemirror/state'
import { keymap as keymapFacet } from '@codemirror/view'
import { findFirstCursor } from './find-cursor'
import { Query } from './find-queries'
import { OnExecuteFacet, queryStateField } from './state'

export function runQueryUnderCursor(state: EditorState) {
  const onExecute = state.facet(OnExecuteFacet)
  if (!onExecute) {
    return false
  }

  const firstCursor = findFirstCursor(state)
  if (!firstCursor) {
    return true
  }

  let query: Query | null = null
  state
    .field(queryStateField)
    .between(firstCursor.pos, firstCursor.pos, (from, to, q) => {
      query = q.query
      return false
    })

  if (!query) {
    return true
  }

  onExecute(query)
  return true
}

/**
 * Shortcuts relating to the Query extension
 */
export function keymap(): Extension {
  return [
    keymapFacet.of([
      {
        key: 'Alt-q',
        run: ({ state }) => {
          console.log('run')
          runQueryUnderCursor(state)
          return true
        },
      },
    ]),
  ]
}
