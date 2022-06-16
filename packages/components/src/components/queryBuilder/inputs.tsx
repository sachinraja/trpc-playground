import { Action, ActionKind, QueryBuilderState } from "."
import { GetTypesResponse } from "../../utils/playground-request"
import { ArrayInputs, TupleInput } from "./arrayInputs"
import { getOperationInput } from "./getOperation"
import { InputItem } from "./InputItem"
import { ObjectInputs } from "./objectInputs"

interface InputsProps {
	dispatch: (action: Action) => void,
	state: QueryBuilderState,
	types: GetTypesResponse
}

export const Inputs: React.FC<InputsProps> = ({ dispatch, state, types }) => {
	let input = getOperationInput(types, state.operationTypeInObject!, state.operationName!),
		noInputs = input?.properties.length === 0 && !input.array && !input.tuple && input.type.length === 0

	return (
		<div className="pt-3">
			<div className="flex">
				<p
					className="font-semibold cursor-pointer"
					onClick={() => dispatch({ ActionKind: ActionKind.SetInputsType, payload: { type: null } })}
					style={{ color: state.inputsType === null ? "white" : "gray" }}
				>{state.operationName} Inputs</p>
				{input.array || input.tuple || input.properties.length !== 0 && input?.type.map((rootType, idx) => (
					<div className="ml-1">
						<span
							key={idx}
							className="ml-1 text-zinc-400 text-sm cursor-pointer"
							style={{ color: state.inputsType === rootType ? "white" : "gray" }}
							onClick={() => dispatch({ ActionKind: ActionKind.SetInputsType, payload: { type: rootType } })}
						>{rootType}</span>
					</div>
				))}
			</div>
			{noInputs && <span className="text-zinc-500">No inputs</span>}
			{state.inputsType == null && input?.array ? (
				<ArrayInputs
					properties={[input]}
					setInputsType={(type: string) => {
						// dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName: state.operationName!, type } })
					}}
					setInputType={(inputName: string, type: string) => {
						dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName, type } })
					}}
					setInputValue={(inputName, value) => {
						dispatch({ ActionKind: ActionKind.SetValue, payload: { inputName, value } })
					}}
					arrayTypes={input.arrayTypes}
					inputValue={state.inputs || {}}
				/>
			) : input?.tuple ? (
				<TupleInput
					getInput={(inputName) => state.inputs?.[inputName]}
					props={input.properties}
					setInputType={(inputName, type) => {
						dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName, type } })
					}}
					setInputValue={(inputName, value) => {
						dispatch({ ActionKind: ActionKind.SetValue, payload: { inputName, value } })
					}}
				/>
			) : input.properties.length !== 0 ? (
				<ObjectInputs
					indent={false}
					getInputFromState={(inputName) => state.inputs[inputName]}
					props={input.properties}
					setInputType={(inputName, type) => dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName, type } })}
					setInputValue={(inputName, value) => dispatch({ ActionKind: ActionKind.SetValue, payload: { inputName, value } })}
				/>
			) : !noInputs && (
				<InputItem
					indent={false}
					input={state.inputs[state.operationName!]}
					inputType={state.inputs[state.operationName!]?.type}
					name="input"
					prop={input}
					types={input.type}
					setInputType={(type) => dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName: state.operationName!, type } })}
					setInputValue={(value) => dispatch({ ActionKind: ActionKind.SetValue, payload: { inputName: state.operationName!, value } })}
				/>
			)}
		</div>
	)
}