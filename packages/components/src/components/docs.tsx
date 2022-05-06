import React from 'react'
import { typesAtom } from './provider';
import { useAtom } from 'jotai'

interface DocsProps {
  hide: () => void
}

export const Docs: React.FC<DocsProps> = ({ hide }) => {
  const [types] = useAtom(typesAtom)

  return (
    <div onClick={hide} className="absolute h-screen top-0 p-3 z-10 overflow-hidden bg-secondary right-0 w-6/12	">
      {JSON.stringify(types)}
    </div>
  );
}