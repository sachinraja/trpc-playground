import { autocompletion, completionKeymap } from '@codemirror/autocomplete'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets'
import { defaultKeymap } from '@codemirror/commands'
import { commentKeymap } from '@codemirror/comment'
import { highlightActiveLineGutter } from '@codemirror/gutter'
import { history, historyKeymap } from '@codemirror/history'
import { redo } from '@codemirror/history'
import { javascript } from '@codemirror/lang-javascript'
import { indentOnInput } from '@codemirror/language'
import { lintKeymap } from '@codemirror/lint'
import { bracketMatching } from '@codemirror/matchbrackets'
import { rectangularSelection } from '@codemirror/rectangular-selection'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { EditorState, Extension } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { drawSelection, dropCursor, highlightActiveLine, highlightSpecialChars, keymap } from '@codemirror/view'
import * as queryExtension from '@trpc-playground/query-extension'
import { tsTheme, typescript } from '@trpc-playground/typescript-extension'
import { baseTheme, thisTsTheme } from './theme'

const basicSetup: Extension = [
  highlightActiveLineGutter(),
  highlightSpecialChars(),
  history(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  bracketMatching(),
  closeBrackets(),
  autocompletion(),
  rectangularSelection(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    ...commentKeymap,
    ...completionKeymap,
    ...lintKeymap,
  ]),
]

export const baseExtension: Extension = [
  baseTheme,
  oneDark,
]

export const tsExtension: Extension = [
  basicSetup,
  baseExtension,
  thisTsTheme,
  tsTheme,
  javascript({ typescript: true }),
  keymap.of([{
    run: redo,
    key: 'Mod-Shift-z',
    preventDefault: true,
  }]),
  queryExtension.gutter(),
  queryExtension.lineNumbers(),
  typescript(),
]
