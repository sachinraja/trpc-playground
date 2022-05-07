import React from 'react'
import { typesAtom } from './provider';
import { useAtom } from 'jotai'
import { GetTypesResponse } from '../utils/playground-request';

interface DocsProps {
  hide: () => void
}

export const Docs: React.FC<DocsProps> = ({ hide }) => {
  const [types] = useAtom<GetTypesResponse | null>(typesAtom)

  return (
    <div onClick={hide} className="absolute h-screen z-10 overflow-hidden bg-[#00000055] inset-0 w-full">
      <div onClick={(e) => e.stopPropagation()} className="absolute h-screen top-0 z-10 overflow-auto bg-secondary right-0 w-4/12	">
        <div>
          <h1 className="text-2xl font-semibold bg-primary p-3">Queries</h1>
          <div className="py-2 px-3">
            {JSON.stringify(types?.queries)}
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold bg-primary p-3">Mutations</h1>
          <div className="py-2 px-3">
            {JSON.stringify(types?.mutations)}
          </div>
        </div>
      </div>
    </div>
  );
}