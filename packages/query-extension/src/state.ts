import { RangeSet } from '@codemirror/rangeset'
import { Extension, StateField } from '@codemirror/state'
import { findQueries, QueryRangeValue } from './find-queries'

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

export const state = (): Extension => {
  return [queryStateField]
}
