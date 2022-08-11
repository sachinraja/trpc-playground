import { ChevronUpIcon } from '@heroicons/react/solid'
import { atom, useAtom, WritableAtom } from 'jotai'
import { useCallback } from 'preact/hooks'
import { Resizable } from 're-resizable'
import React from 'react'
import { typesAtom } from '../provider'
import { editorAtom, queryBuilderOpened } from '../tab/store'
import { getDefaultOperation } from './getDefaultOperation'

const generatedAtom = atom<string | null>(null)
const baseOperationNameAtom = atom<string | null>(null)
// Updates `baseOperationNameAtom` and `generatedAtom`
const operationNameAtom: WritableAtom<string | null, string> = atom(
  get => get(baseOperationNameAtom),
  (get, set, update) => {
    set(baseOperationNameAtom, update)

    const types = get(typesAtom)
    if (!types) return

    const defaultOp = getDefaultOperation({ types, operationName: update })
    if (defaultOp?.value) {
      set(generatedAtom, defaultOp.value)
    }
  },
)

export const QueryBuilder: React.FC = () => {
  const [types] = useAtom(typesAtom)
  const [queryBuilderOpen, setQueryBuilderOpened] = useAtom(queryBuilderOpened)
  const [generated] = useAtom(generatedAtom)
  const [operationName, setOperationName] = useAtom(operationNameAtom)
  const [editorView] = useAtom(editorAtom)

  // On insert btn click
  const insertGenerated = useCallback(
    () => {
      if (!operationName || !editorView) return
      const gen = getDefaultOperation({ operationName, types })
      if (!gen) return

      const { value: generated, inputLength } = gen
      const cursor = editorView.state.selection.asSingle().ranges[0]

      editorView.focus()
      // Add generated query to current line in editor
      editorView.dispatch({
        changes: {
          from: cursor.from,
          to: cursor.to,
          insert: generated,
        },
      })

      // Select generated default input so user can instantly remove/edit
      if (cursor.from + generated.length - inputLength !== cursor.from + generated.length) {
        editorView.dispatch({
          selection: {
            anchor: cursor.from + generated.length - inputLength - 1,
            head: cursor.from + generated.length - 1,
          },
        })
      }
    },
    [editorView, operationName],
  )

  if (!types) return null

  return (
    <Resizable
      enable={{ top: true }}
      maxHeight={queryBuilderOpen ? '80%' : '1.5rem'}
      minHeight='24px'
      onResizeStart={() => setQueryBuilderOpened(true)}
      minWidth='100%'
    >
      <div className={`flex flex-col overflow-hidden h-full`}>
        <div
          className='flex justify-between mx-3 pb-1 items-center h-6 cursor-pointer'
          onClick={() => setQueryBuilderOpened(open => !open)}
        >
          <p className={'text-neutral-100	mx-1 font-semibold'}>Query builder</p>
          <button>
            {queryBuilderOpen
              ? <ChevronUpIcon width={18} height={18} className='rotate-180' />
              : <ChevronUpIcon width={18} height={18} className='rotate-0' />}
          </button>
        </div>
        {queryBuilderOpen && (
          <div className='flex-1 bg-primary w-full overflow-y-auto pt-2 px-4 pb-5'>
            <span className='font-semibold'>Operations</span>
            <div className='pt-3'>
              <div className='ml-1'>
                {Object.keys({ ...types.queries, ...types.mutations }).map((opName) => (
                  <button
                    key={opName}
                    className='bg-secondary mx-1 px-2 shadow-lg mb-1'
                    style={{ color: operationName === opName ? 'white' : 'gray' }}
                    onClick={() => setOperationName(opName)}
                  >
                    {opName}
                  </button>
                ))}
              </div>
              <div className='pt-4'>
                <button
                  title='Insert snippet into editor'
                  style={{
                    opacity: operationName === null ? '0.6' : '1',
                    pointerEvents: operationName === null ? 'none' : 'all',
                  }}
                  className='bg-secondary px-2 shadow-lg mt-2 font-semibold'
                  onClick={insertGenerated}
                >
                  Insert
                </button>
                <kbd className='py-1 px-2 text-md shadow-lg'>{generated}</kbd>
              </div>
            </div>
          </div>
        )}
      </div>
    </Resizable>
  )
}
