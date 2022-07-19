import { ChevronUpIcon } from '@heroicons/react/solid'
import { useAtom, atom } from 'jotai'
import { useCallback, useEffect, useReducer, useRef } from 'preact/hooks'
import { Ref } from 'preact/src'
import { Resizable } from 're-resizable'
import React from 'react'
import { GetTypesResponse, QueryDefaultAndType } from '../../utils/playground-request'
import { editorAtom, queryBuilderOpened } from '../tab/store'
import { generate } from './generate'
import { ActionKind, defaultQueryBuilderState, reducer } from './queryBuilderState'

interface QueryBuilderProps {
  types: GetTypesResponse | null
}

const generatedAtom = atom<string | null>(null)

const operations = ['Query', 'Mutation'] as const

export const QueryBuilder: React.FC<QueryBuilderProps> = ({ types }) => {
  const [queryBuilderOpen, setQueryBuilderOpened] = useAtom(queryBuilderOpened)
  const [state, dispatch] = useReducer(reducer, defaultQueryBuilderState)
  const containerRef = useRef<HTMLDivElement>() as Ref<HTMLDivElement>
  const [generated, setGenerated] = useAtom(generatedAtom)

  const [editorView] = useAtom(editorAtom)

  useEffect(() => {
    if (state.operationType && state.operationName) {
      const newGenerated = generate({ state, types })
      if (newGenerated?.generated)
        setGenerated(newGenerated.generated)
    }
    else setGenerated(null)
  }, [state])

  const insertGenerated = useCallback(
    () => {
      const gen = generate({ state, types })
      if (!editorView || !gen) return

      const { generated, inputLength } = gen
      const line = editorView.state.doc.lineAt(editorView.state.selection.main.head)

      editorView.focus()
      // Add generated query to next line in editor
      editorView.dispatch({
        changes: {
          from: line.from,
          to: line.to,
          insert: `${line.text}\n${generated}`,
        },
      })

      // Select default generated input so user can instantly remove/edit
      if (line.to + generated.length - inputLength !== line.to + generated.length)
        editorView.dispatch({
          selection: {
            anchor: line.to + generated.length - inputLength,
            head: line.to + generated.length
          }
        })
    },
    [editorView, state],
  )

  return (
    <Resizable
      enable={{ top: true }}
      maxHeight={queryBuilderOpen ? '80%' : '1.5rem'}
      minHeight='24px'
      onResizeStart={() => setQueryBuilderOpened(true)}
      minWidth='100%'
    >
      <div
        className={`flex flex-col overflow-hidden h-full`}
        ref={containerRef}
      >
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
        {queryBuilderOpen && types
          && (
            <div className='flex-1 bg-primary w-full overflow-y-auto pt-2 px-4 pb-5'>
              <div className='pb-3'>
                <p className='font-semibold'>Operation</p>
                <div>
                  {operations.map((op) => (
                    <button
                      className='bg-secondary mx-2 px-2 shadow-lg'
                      style={{ color: state.operationType === op ? 'white' : 'gray' }}
                      key={op}
                      onClick={() => dispatch({ ActionKind: ActionKind.SetOperationType, payload: { type: op } })}
                    >
                      {op}
                    </button>
                  ))}
                </div>
              </div>
              {state.operationTypeInObject
                && (
                  <div className='pt-3'>
                    <p className='font-semibold'>{state.operationType}</p>
                    <div className='ml-1'>
                      {Object.keys(getOperationsFromType(types, state.operationTypeInObject)).map((opName, idx) => (
                        <button
                          key={idx}
                          className='bg-secondary mx-1 px-2 shadow-lg mb-1'
                          style={{ color: state.operationName === opName ? 'white' : 'gray' }}
                          onClick={() =>
                            dispatch({ ActionKind: ActionKind.SetOperationName, payload: { name: opName } })}
                        >
                          {opName}
                        </button>
                      ))}
                    </div>
                    <div className='pt-4'>
                      <button
                        style={{
                          opacity: state.operationType === null || state.operationName === null ? '0.6' : '1',
                          pointerEvents: state.operationType === null || state.operationName === null ? 'none' : 'all',
                        }}
                        onClick={insertGenerated}
                        className='bg-secondary px-2 shadow-lg mt-2 font-semibold'
                      >
                        Create
                      </button>
                      <kbd className='bg-zinc-900 py-1 px-2 text-md shadow-lg'>{generated}</kbd>
                    </div>
                  </div>
                )}
            </div>
          )}
      </div>
    </Resizable>
  )
}

const getOperationsFromType = (types: GetTypesResponse, operationType: string): QueryDefaultAndType =>
  ((types as any || {})[operationType]) || {}
