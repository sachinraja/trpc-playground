import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { history } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { bracketMatching, indentOnInput } from '@codemirror/language'
import { highlightSelectionMatches } from '@codemirror/search'
import { EditorState, Extension } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  drawSelection,
  dropCursor,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  rectangularSelection,
} from '@codemirror/view'
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
