import { closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { defaultKeymap, historyKeymap, redo } from '@codemirror/commands'
import { foldKeymap } from '@codemirror/language'
import { lintKeymap } from '@codemirror/lint'
import { searchKeymap } from '@codemirror/search'
import { Extension } from '@codemirror/state'
import { keymap as keymapFacet } from '@codemirror/view'

export const baseKeymap = (): Extension => [
  keymapFacet.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
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
