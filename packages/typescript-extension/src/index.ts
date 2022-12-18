import { autocompletion, completeFromList, CompletionContext, CompletionResult } from '@codemirror/autocomplete'
import { javascript } from '@codemirror/lang-javascript'
import { Diagnostic, linter, setDiagnostics as cmSetDiagnostics } from '@codemirror/lint'
import { EditorState, Extension, StateEffect, StateField, TransactionSpec } from '@codemirror/state'
import { EditorView, hoverTooltip, Tooltip } from '@codemirror/view'
import throttle from 'lodash/throttle'
import { DiagnosticCategory, displayPartsToString, flattenDiagnosticMessageText } from 'typescript'
import { onChangeCallback } from './change-callback'
import { FileMap, TypescriptProject } from './project'

export { TypescriptProject }
export type { FileMap }

/**
 * This file exports an extension that makes Typescript language services work. This includes:
 *
 * 1. A StateField that holds an instance of a `TypescriptProject` (used to communicate with tsserver)
 * 2. A StateField that stores ranges for lint diagostics (used to cancel hover tooltips if a lint diagnistic is also present at the position)
 * 3. A `javascript` extension, that provides syntax highlighting and other simple JS features.
 * 4. An `autocomplete` extension that provides tsserver-backed completions, powered by the `completionSource` function
 * 5. A `linter` extension that provides tsserver-backed type errors, powered by the `lintDiagnostics` function
 * 6. A `hoverTooltip` extension that provides tsserver-backed type information on hover, powered by the `hoverTooltip` function
 * 7. An `updateListener` (facet) extension, that ensures that the editor's view is kept in sync with tsserver's view of the file
 * 8. A StateEffect that lets a consumer inject custom types into the `TypescriptProject`
 *
 * The "correct" way to read this file is from bottom to top.
 */

/**
 * A State field that represents the Typescript project that is currently "open" in the EditorView
 */
const tsStateField = StateField.define<TypescriptProject>({
  create(state) {
    return new TypescriptProject(state.sliceDoc(0))
  },

  update(ts, transaction) {
    // For all transactions that run, this state field's value will only "change" if a `injectTypesEffect` StateEffect is attached to the transaction
    transaction.effects.forEach(e => {
      if (e.is(injectTypesEffect)) {
        ts.injectTypes(e.value)
      }
    })

    return ts
  },

  compare() {
    // There must never be two instances of this state field
    return true
  },
})

/**
 * A CompletionSource that returns completions to show at the current cursor position (via tsserver)
 */
const completionSource = async (
  ctx: CompletionContext,
): Promise<CompletionResult | null> => {
  const { state, pos } = ctx
  const ts = state.field(tsStateField)

  try {
    const completions = (await ts.lang()).getCompletionsAtPosition(
      ts.entrypoint,
      pos,
      {},
    )
    if (!completions) {
      return null
    }

    return completeFromList(
      completions.entries.map((c) => ({
        type: c.kind,
        label: c.name,
        boost: 1 / Number(c.sortText),
      })),
    )(ctx)
  } catch (e) {
    return null
  }
}

/**
 * A LintSource that returns lint diagnostics across the current editor view (via tsserver)
 */
const lintDiagnostics = async (state: EditorState): Promise<Diagnostic[]> => {
  const ts = state.field(tsStateField)
  const diagnostics = (await ts.lang()).getSemanticDiagnostics(ts.entrypoint)

  return diagnostics
    .filter(d => d.start !== undefined && d.length !== undefined)
    .map(d => {
      let severity: 'info' | 'warning' | 'error' = 'info'
      if (d.category === DiagnosticCategory.Error) {
        severity = 'error'
      } else if (d.category === DiagnosticCategory.Warning) {
        severity = 'warning'
      }

      return {
        from: d.start!, // `!` is fine because of the `.filter()` before the `.map()`
        to: d.start! + d.length!, // `!` is fine because of the `.filter()` before the `.map()`
        severity,
        message: flattenDiagnosticMessageText(d.messageText, '\n', 0),
      }
    })
}

/**
 * A HoverTooltipSource that returns a Tooltip to show at a given cursor position (via tsserver)
 */
const hoverTooltipSource = async (
  state: EditorState,
  pos: number,
): Promise<Tooltip | null> => {
  const ts = state.field(tsStateField)

  const quickInfo = (await ts.lang()).getQuickInfoAtPosition(
    ts.entrypoint,
    pos,
  )
  if (!quickInfo) {
    return null
  }

  return {
    pos,
    create() {
      const dom = document.createElement('div')
      dom.setAttribute('class', 'cm-quickinfo-tooltip')
      dom.textContent = displayPartsToString(quickInfo.displayParts)
        + (quickInfo.documentation?.length
          ? '\n' + displayPartsToString(quickInfo.documentation)
          : '')

      return {
        dom,
      }
    },
    above: false, // HACK: This makes it so lint errors show up on TOP of this, so BOTH quickInfo and lint tooltips don't show up at the same time
  }
}

/**
 * A TransactionSpec that can be dispatched to add new types to the underlying tsserver instance
 */
const injectTypesEffect = StateEffect.define<FileMap>()
export function injectTypes(types: FileMap): TransactionSpec {
  return {
    effects: [injectTypesEffect.of(types)],
  }
}

/**
 * A TransactionSpec that can be dispatched to force re-calculation of lint diagnostics
 */
export async function setDiagnostics(
  state: EditorState,
): Promise<TransactionSpec> {
  const diagnostics = await lintDiagnostics(state)
  return cmSetDiagnostics(state, diagnostics)
}

/**
 * A (throttled) function that updates the view of the currently open "file" on TSServer
 */
const updateTSFileThrottled = throttle((code: string, view: EditorView) => {
  const ts = view.state.field(tsStateField)

  // Don't `await` because we do not want to block
  ts.env().then(env => env.updateFile(ts.entrypoint, code || ' ')) // tsserver deletes the file if the text content is empty; we can't let that happen
}, 100)

// Export a function that will build & return an Extension
export function typescript(): Extension {
  return [
    tsStateField,
    javascript({ typescript: true, jsx: false }),
    autocompletion({
      activateOnTyping: true,
      maxRenderedOptions: 30,
      override: [completionSource],
    }),
    linter(view => lintDiagnostics(view.state)),
    hoverTooltip((view, pos) => hoverTooltipSource(view.state, pos), {
      hideOnChange: true,
    }),
    EditorView.updateListener.of(({ view, docChanged }) => {
      // We're not doing this in the `onChangeCallback` extension because we do not want TS file updates to be debounced (we want them throttled)

      if (docChanged) {
        // Update tsserver's view of this file
        updateTSFileThrottled(view.state.sliceDoc(0), view)
      }
    }),
    onChangeCallback(async (_code, view) => {
      // No need to debounce here because this callback is already debounced

      // Re-compute lint diagnostics via tsserver
      view.dispatch(await setDiagnostics(view.state))
    }),
  ]
}

export { tsTheme } from './theme'
