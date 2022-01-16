import { EditorState, Extension } from '@codemirror/state'
import { keymap as keymapFacet } from '@codemirror/view'
import { findFirstCursor } from './find-cursor'
import { Query } from './find-queries'
import { OnErrorFacet, OnExecuteFacet, queryStateField } from './state'

export function runQueryUnderCursor(state: EditorState) {
  const onExecute = state.facet(OnExecuteFacet)
  const onError = state.facet(OnErrorFacet)

  if (!onExecute) {
    return false
  }

  const firstCursor = findFirstCursor(state)
  if (!firstCursor) {
    return true
  }

  let query: Query | null = null
  let initArgs: Promise<void>
  state
    .field(queryStateField)
    .between(firstCursor.pos, firstCursor.pos, (from, to, q) => {
      initArgs = q.init()
      query = q.query
      return false
    })

  if (!query) {
    return true
  }

  initArgs!.then(() => onExecute(query!)).catch((e) => {
    if (onError) return onError(e)
    throw e
  })

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
          runQueryUnderCursor(state)
          return true
        },
      },
    ]),
  ]
}
