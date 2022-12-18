import { Extension, Facet, RangeSet, StateField } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import noop from 'lodash/noop'
import over from 'lodash/over'
import { findFirstCursor } from './find-cursor'
import { findQueries, Query, QueryRangeValue } from './find-queries'

/**
 * Facet to allow configuring query execution callback
 */
export type OnExecute = (query: Query) => void
export const OnExecuteFacet = Facet.define<OnExecute, OnExecute>({
  combine: input => {
    // If multiple `onExecute` callbacks are registered, chain them (call them one after another)
    return over(input)
  },
})

/**
 * Facet to handle errors
 */
export type OnError = (error: Error) => void
export const OnErrorFacet = Facet.define<OnError, OnError>({
  combine: input => {
    // If multiple `onError` callbacks are registered, chain them (call them one after another)
    return over(input)
  },
})

/**
 * Facet to allow configuring query enter callback
 */
export type OnEnterQuery = (query: Query) => void
export const OnEnterQueryFacet = Facet.define<OnEnterQuery, OnEnterQuery>({
  combine: input => {
    // If multiple `onEnterQuery` callbacks are registered, chain them (call them one after another)
    return over(input)
  },
})

/**
 * Facet to allow configuring query leave callback
 */
export type OnLeaveQuery = () => void
export const OnLeaveQueryFacet = Facet.define<OnLeaveQuery, OnLeaveQuery>({
  combine: input => {
    // If multiple `onLeaveQuery` callbacks are registered, chain them (call them one after another)
    return over(input)
  },
})

/**
 * State field that tracks which ranges are queries.
 * We don't store a DecorationSet directly in the StateField because we need to be able to find the `text` of a query
 */
export const queryStateField = StateField.define<
  RangeSet<QueryRangeValue>
>({
  create(state) {
    return findQueries(state)
  },

  update(value, transaction) {
    if (transaction.docChanged) {
      return findQueries(transaction.state)
    }

    return value
  },
})

/**
 * An extension that enables query tracking
 */
export function state(config: {
  onExecute?: OnExecute
  onError?: OnError
  onEnterQuery?: OnEnterQuery
  onLeaveQuery?: OnLeaveQuery
}): Extension {
  return [
    OnExecuteFacet.of(config.onExecute || noop),
    OnErrorFacet.of(config.onError || noop),
    OnEnterQueryFacet.of(config.onEnterQuery || noop),
    OnLeaveQueryFacet.of(config.onLeaveQuery || noop),
    queryStateField,
    EditorView.updateListener.of(({ view }) => {
      const onEnterQuery = view.state.facet(OnEnterQueryFacet)
      const onLeaveQuery = view.state.facet(OnLeaveQueryFacet)

      const cursor = findFirstCursor(view.state)
      const line = view.state.doc.lineAt(cursor.pos)

      let lineHasQuery = false
      view.state
        .field(queryStateField)
        .between(line.from, line.to, (from, to, value) => {
          lineHasQuery = true
          onEnterQuery(value.query)
        })

      if (!lineHasQuery) {
        onLeaveQuery()
      }
    }),
  ]
}
