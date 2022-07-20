import { useAtom } from 'jotai'
import React from 'react'
import { GetTypesResponse } from '../utils/playground-request'
import { typesAtom } from './provider'
import { XIcon } from "@heroicons/react/solid"

interface DocsProps {
  hide: () => void
}

export const Docs: React.FC<DocsProps> = ({ hide }) => {
  const [types] = useAtom<GetTypesResponse | null>(typesAtom)

  return (
    <div onClick={hide} className='absolute h-screen z-10 overflow-hidden bg-[#00000055] inset-0 w-full'>
      <div
        onClick={(e) => e.stopPropagation()}
        className='absolute h-screen top-0 z-10 overflow-auto bg-secondary right-0 w-4/12	'
      >
        {types && (
          <>
            <div>
              <div className='bg-primary p-3 sticky top-0 shadow-md flex justify-between items-center'>
                <h1 className='text-2xl font-semibold'>
                  Settings
                </h1>
                <button onClick={hide}>
                  <XIcon
                    width={20}
                    height={20}
                    className="text-neutral-300 hover:text-white transition-colors"
                  />
                </button>
              </div>
              {Object.entries(types.queries).map(([name, def]) => (
                <div className='py-2 px-3 border-b-2 border-primary'>
                  <span className="text-xl font-semibold">{name}</span>
                  <kbd>
                    <pre className="text-gray-300">
                      {def.type}
                    </pre>
                  </kbd>
                </div>
              ))}
            </div>
            <div>
              <h1 className='text-2xl font-semibold bg-primary p-3 sticky top-0 shadow-md'>
                Mutations
                <span className="ml-2 text-gray-500 font-normal">{Object.keys(types.mutations).length}</span>
              </h1>
              {Object.entries(types.mutations).map(([name, def]) => (
                <div className='py-2 px-3 border-b-2 border-primary'>
                  <span className="text-xl font-semibold">{name}</span>
                  <kbd>
                    <pre className="text-gray-300">
                      {def.type}
                    </pre>
                  </kbd>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
