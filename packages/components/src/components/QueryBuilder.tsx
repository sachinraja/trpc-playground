import React from 'react'
import { useAtom } from 'jotai'
import { queryBuilderOpened } from './tab/store';
import { ChevronUpIcon } from '@heroicons/react/solid'

interface QueryBuilderProps {

}

export const QueryBuilder: React.FC<QueryBuilderProps> = ({ }) => {
	const [queryBuilderOpen, setQueryBuilderOpened] = useAtom(queryBuilderOpened)

	return (
		<div className={`h-${queryBuilderOpen ? 60 : 6} flex flex-col max-h-${queryBuilderOpen ? 60 : 6} overflow-hidden`}>
			<div className="flex justify-between mx-3 pb-1 items-center ">
				<p className={"text-neutral-100	mx-1 font-semibold"}>Query builder</p>
				<button onClick={() => setQueryBuilderOpened(open => !open)}>
					<ChevronUpIcon width={18} height={18} className={`rotate-${queryBuilderOpen ? 180 : 0}`} />
				</button>
			</div>
			<div className="flex-1 bg-primary">
			</div>
		</div>
	);
}