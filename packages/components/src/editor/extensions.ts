import { autocompletion } from '@codemirror/autocomplete'
import { closeBrackets } from '@codemirror/closebrackets'
import { highlightActiveLineGutter } from '@codemirror/gutter'
import { history } from '@codemirror/history'
import { javascript } from '@codemirror/lang-javascript'
import { indentOnInput } from '@codemirror/language'
import { bracketMatching } from '@codemirror/matchbrackets'
import { rectangularSelection } from '@codemirror/rectangular-selection'
import { highlightSelectionMatches } from '@codemirror/search'
import { EditorState, Extension } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { drawSelection, dropCursor, highlightActiveLine, highlightSpecialChars } from '@codemirror/view'
import * as queryExtension from '@trpc-playground/query-extension'
import { tsTheme, typescript } from '@trpc-playground/typescript-extension'
import { baseKeymap } from './keymap'
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
  baseKeymap(),
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
  queryExtension.gutter(),
  queryExtension.lineNumbers(),
  queryExtension.keymap(),
  typescript(),
]
