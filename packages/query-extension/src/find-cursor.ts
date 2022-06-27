import { EditorState } from '@codemirror/state'

export function findFirstCursor(state: EditorState) {
  // A SelectionRange is a cursor. Even if the user has a "selection", their cursor is still at the edge of the selection
  const cursors = state.selection.asSingle().ranges
  return { pos: cursors[0].head }
}

export function isCursorInRange(state: EditorState, from: number, to: number) {
  const cursor = findFirstCursor(state)
  return (cursor?.pos >= from && cursor?.pos <= to) || false
}
