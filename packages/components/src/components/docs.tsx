import { QueryDefaultAndType, ResolvedRouterSchema } from '@trpc-playground/types'
import { useAtom } from 'jotai'
import React from 'react'
import { typesAtom } from './provider'
import { SidebarOverlay } from './sidebarOverlay'

interface DocsProps {
  hide: () => void
}

export const Docs: React.FC<DocsProps> = ({ hide }) => {
  const [types] = useAtom<ResolvedRouterSchema | null>(typesAtom)

  return (
    <SidebarOverlay hide={hide}>
      {types && (
        <>
          <DocsForOperationType
            label='Queries'
            operations={types.queries}
          />
          <DocsForOperationType
            label='Mutations'
            operations={types.mutations}
          />
        </>
      )}
    </SidebarOverlay>
  )
}

interface DocsForOperationTypeProps {
  label: string
  operations: QueryDefaultAndType
}

const DocsForOperationType: React.FC<DocsForOperationTypeProps> = ({ label, operations }) => (
  <div>
    <h1 className='text-2xl font-semibold bg-primary p-3 sticky top-0 shadow-md'>
      {label}
      <span className='ml-2 text-gray-500 font-normal'>{Object.keys(operations).length}</span>
    </h1>
    {Object.entries(operations).map(([name, def]) => (
      <div className='py-2 px-3 border-b-2 border-primary' key={name}>
        <span className='text-xl font-semibold'>{name}</span>
        <pre className='text-gray-300'>
          {def.type}
        </pre>
      </div>
    ))}
  </div>
)
