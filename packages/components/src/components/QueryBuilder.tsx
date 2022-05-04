import { ChevronUpIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import React from 'react';
import { GetTypesResponse } from '../utils/playground-request';
import { queryBuilderOpened } from './tab/store';

interface QueryBuilderProps {
	types: GetTypesResponse | null
}

export const QueryBuilder: React.FC<QueryBuilderProps> = ({ types }) => {
	const [queryBuilderOpen, setQueryBuilderOpened] = useAtom(queryBuilderOpened)
	console.log(types);

	return (
		<div className={`flex flex-col overflow-hidden max-h-60`}>
			<div className="flex justify-between mx-3 pb-1 items-center h-6">
				<p className={"text-neutral-100	mx-1 font-semibold"}>Query builder</p>
				<button onClick={() => setQueryBuilderOpened(open => !open)}>
					{
						queryBuilderOpen ?
							<ChevronUpIcon width={18} height={18} className="rotate-180" /> :
							<ChevronUpIcon width={18} height={18} className="rotate-0" />
					}
				</button>
			</div>
			{queryBuilderOpen &&
				<div className="flex-1 bg-primary w-full">
					{types &&
						<div>
							{/* <p>Queries: {types.queries.map((x) => )}</p> */}
							<p>Mutations: {types.mutations.join(", ")}</p>
						</div>
					}
				</div>
			}
		</div>
	);
}
