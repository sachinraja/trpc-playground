import { EditorView } from '@codemirror/view'

export const baseTheme = EditorView.theme({
  '&': {
    fontSize: '14px',
    fontFamily: 'JetBrains Mono',
    width: 'calc(100% - 30px)',
  },
})

export const thisTsTheme = EditorView.theme({
  '.cm-foldMarker': {
    width: '12px',
    height: '12px',
    marginLeft: '8px',

    '&.folded': {
      transform: 'rotate(-90deg)',
    },
  },
  '.cm-foldPlaceholder': { background: 'transparent', border: 'none' },

  '.cm-tooltip': {
    maxWidth: '800px',
    zIndex: '999',
  },

  '.cm-diagnostic, .cm-quickinfo-tooltip': {
    fontFamily: 'JetBrains Mono',
  },
})
