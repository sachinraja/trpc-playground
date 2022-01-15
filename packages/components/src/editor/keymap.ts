import { completionKeymap } from '@codemirror/autocomplete'
import { closeBracketsKeymap } from '@codemirror/closebrackets'
import { defaultKeymap } from '@codemirror/commands'
import { commentKeymap } from '@codemirror/comment'
import { foldKeymap } from '@codemirror/fold'
import { historyKeymap, redo } from '@codemirror/history'
import { lintKeymap } from '@codemirror/lint'
import { searchKeymap } from '@codemirror/search'
import { Extension } from '@codemirror/state'
import { keymap as keymapFacet } from '@codemirror/view'

export const baseKeymap = (): Extension => [
  keymapFacet.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...commentKeymap,
    ...completionKeymap,
    ...foldKeymap,
    ...lintKeymap,
    ...historyKeymap,
    {
      run: redo,
      key: 'Mod-Shift-z',
      preventDefault: true,
    },
  ]),
]
