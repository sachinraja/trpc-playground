import { EditorSelection, Extension } from '@codemirror/state'
import { EditorView, gutter, GutterMarker } from '@codemirror/view'
import { isCursorInRange } from './find-cursor'
import { Query } from './find-queries'
import { OnErrorFacet, OnExecuteFacet, queryStateField } from './state'

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

/**
 * A GutterMarker that shows line numbers
 */
class LineNumberMarker extends GutterMarker {
  private number: number
  public elementClass: string

  constructor(number: number) {
    super()

    this.number = number
    this.elementClass = 'cm-lineNumbers'
  }

  eq(other: LineNumberMarker) {
    return this.number === other.number
  }

  toDOM() {
    const widget = document.createElement('div')
    widget.classList.add('cm-gutterElement')
    widget.textContent = `${this.number}`
    return widget
  }
}

/**
 * A GutterMarker that shows a "run query" button
 */
class RunQueryMarker extends GutterMarker {
  private number: number
  private active: boolean
  public elementClass: string

  constructor(number: number, active: boolean) {
    super()

    this.number = number
    this.active = active
    this.elementClass = 'cm-lineNumbers'
  }

  eq(other: RunQueryMarker) {
    return this.number === other.number && this.active === other.active
  }

  toDOM() {
    const runButton = document.createElement('button')
    // Feathericons: play-circle
    const svg = document.createElementNS(SVG_NAMESPACE, 'svg')
    svg.setAttribute('xmlns', SVG_NAMESPACE)
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('fill', 'none')

    const circle = document.createElementNS(SVG_NAMESPACE, 'path')
    circle.setAttribute('fill-rule', 'evenodd')
    circle.setAttribute('clip-rule', 'evenodd')
    circle.setAttribute(
      'd',
      'M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12Z',
    )
    circle.setAttribute('fill', 'currentColor')
    svg.appendChild(circle)

    // Play button
    const path = document.createElementNS(SVG_NAMESPACE, 'path')
    path.setAttribute('fill-rule', 'evenodd')
    path.setAttribute('clip-rule', 'evenodd')
    path.setAttribute(
      'd',
      'M9.52814 7.11833C9.8533 6.94431 10.2478 6.96338 10.5547 7.16795L16.5547 11.168C16.8329 11.3534 17 11.6656 17 12C17 12.3344 16.8329 12.6466 16.5547 12.8321L10.5547 16.8321C10.2478 17.0366 9.8533 17.0557 9.52814 16.8817C9.20298 16.7077 9 16.3688 9 16V8C9 7.63121 9.20298 7.29235 9.52814 7.11833Z',
    )
    path.setAttribute('fill', 'white')
    svg.appendChild(path)

    runButton.appendChild(svg)
    runButton.classList.add('cm-gutterElement')
    runButton.classList.add('cm-queryRunButton')
    if (this.active) {
      runButton.classList.add('active')
    }

    return runButton
  }
}

export function lineNumbers(): Extension {
  return [
    gutter({
      lineMarker: (view, _line) => {
        const line = view.state.doc.lineAt(_line.from)

        // Assume this line should have a line number
        let marker: LineNumberMarker | RunQueryMarker = new LineNumberMarker(
          line.number,
        )

        view.state
          .field(queryStateField)
          .between(line.from, line.to, (from, to) => {
            // If this is the first line of a query, change the line number to a button
            const queryLineStart = view.state.doc.lineAt(from)
            if (queryLineStart.number === line.number) {
              marker = new RunQueryMarker(
                queryLineStart.number,
                isCursorInRange(view.state, line.from, to), // If the cursor is inside a query, change the button to `active`
              )
            }
          })

        return marker
      },
      domEventHandlers: {
        click: (view, line, event) => {
          const targetElement = event.target as HTMLDivElement
          const targetParentElement = targetElement.parentNode as HTMLDivElement
          if (
            !targetElement?.classList?.contains('cm-queryRunButton')
            && targetParentElement?.classList?.contains('cm-lineNumbers')
          ) {
            // Clicking on a line number should not execute the query
            return false
          }

          // Make cursor jump to this line
          if (!isCursorInRange(view.state, line.from, line.to)) {
            view.dispatch({
              selection: EditorSelection.single(line.from, line.from),
            })
          }

          const onExecute = view.state.facet(OnExecuteFacet)
          const onError = view.state.facet(OnErrorFacet)
          if (!onExecute) {
            return false
          }

          let query: Query | null = null
          let initArgs: Promise<void>
          view.state
            .field(queryStateField)
            .between(line.from, line.to, (from, to, q) => {
              initArgs = q.init()
              query = q.query
              return false
            })

          if (!query) {
            return false
          }

          initArgs!.then(() => onExecute(query!)).catch((e) => {
            if (onError) return onError(e)
            throw e
          })
          return true
        },
      },
    }),

    // Gutter line marker styles
    EditorView.baseTheme({
      '.cm-gutter': {
        backgroundColor: 'var(--primary-color)',
      },
      '.cm-lineNumbers': {
        display: 'flex',
        '& .cm-gutterElement': {
          padding: '0 8px 0 0',
        },
      },
      '.cm-gutterElement': {
        userSelect: 'none',
        backgroundColor: 'var(--primary-color)',
      },
      '.cm-queryRunButton': {
        cursor: 'pointer',
        width: '24px',
        height: '24',
        backgroundColor: 'var(--primary-color)',
        color: '#E2E8F0', /* blueGray-200 */

        '&:hover': {
          color: '#16A34A', /* green-600 */
        },
        '&.active': {
          color: '#22C55E', /* green-500 */

          '&:hover': {
            color: '#16A34A', /* green-600 */
          },
        },
      },
    }),
  ]
}
