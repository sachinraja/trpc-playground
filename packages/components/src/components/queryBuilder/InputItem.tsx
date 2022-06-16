import { useEffect } from "react"
import { QueryBuilderInput } from "."
import { Property } from "../../utils/playground-request"
import { ArrayInputs, TupleInput } from "./arrayInputs"
import TypeInputs from "./primitiveInputs"
import { ObjectInputs } from "./objectInputs"

interface InputItemProps {
	prop: Property,
	setInputType: (type: string) => void,
	setInputValue: (value: string) => void,
	input: QueryBuilderInput | null
	inputType: string
	name: string
	indent: boolean
	types: string[]
}

export const InputItem: React.FC<InputItemProps> = ({ prop, setInputType, inputType, setInputValue, name, input, indent, types }) => {
	const { properties } = prop
	// console.log(prop, inputType);

	useEffect(() => {
		// console.log(prop, types, inputType);
		types.length === 1 && inputType !== types[0] && setInputType(types[0])
	}, [])

	return (
		<div className="flex my-1 items-center">
			{indent && <div className="h-[2px] w-5 bg-secondary mr-2" />}
			{inputType ? (
				<div>
					{inputType === "tuple" ? (
						<div>
							<div className="flex">
								<p className="bg-secondary px-2 border border-zinc-800 h-6 w-fit">
									{name}
								</p>
								<InputItemTypeSelection
									types={types}
									setType={(type) => setInputType(type)}
									selectedType={inputType}
								/>
							</div>
							<div style={{ marginLeft: "0.75rem" }} className=" border-l-2 border-secondary">
								<TupleInput
									props={properties}
									setInputType={(inputName, type) => {
										if (!input) return

										const newValue = { ...input.value, [inputName]: { type } }
										setInputValue(newValue)
									}}
									setInputValue={(inputName, value) => {
										if (!input) return

										const newValue = { ...input.value, [inputName]: { ...input.value[inputName], value } }
										setInputValue(newValue)
									}}
									getInput={(inputName) => input?.value[inputName]}
									indent={true}
								/>
							</div>
						</div>
					) : inputType === "array" ? (
						<div>
							<div className="flex">
								<p className="bg-secondary px-2 border border-zinc-800 h-6 w-fit">
									{name}
								</p>
								<InputItemTypeSelection
									types={types}
									setType={(type) => setInputType(type)}
									selectedType={inputType}
								/>
							</div>
							<ArrayInputs
								setInputsType={(type) => {
								}}
								arrayTypes={prop.arrayTypes}
								inputValue={input?.value}
								properties={[prop]}
								setInputType={(inputName, type) => {
									if (!input) return

									const newValue = { ...input.value, [inputName]: { type } }
									setInputValue(newValue)
								}}
								setInputValue={(inputName, value) => {
									if (!input) return

									const newInputValue = { ...input.value, [inputName]: { ...input.value[inputName], value } };
									setInputValue(newInputValue)
								}}
							/>
						</div>
					) : inputType === "object" ? (
						<div>
							<div className="flex">
								<p className="bg-secondary px-2 border border-zinc-800 h-6 w-fit">
									{name}
								</p>
								<InputItemTypeSelection
									types={types}
									setType={(type) => setInputType(type)}
									selectedType={inputType}
								/>
							</div>
							<ObjectInputs
								getInputFromState={(inputName) => input?.value[inputName]}
								props={properties}
								setInputType={(inputName, type) => {
									if (!input) return
									const newInputValue = { ...input.value, [inputName]: { ...input.value[inputName], type } };
									setInputValue(newInputValue)
								}}
								setInputValue={(inputName, value) => {
									if (!input) return
									const newInputValue = { ...input.value, [inputName]: { ...input.value[inputName], value } };
									setInputValue(newInputValue)
								}}
								indent={true}
							/>
						</div>
					) : (
						<TypeInputs
							dispatchValue={
								(val) => {
									setInputValue(val)
								}
							}
							literalValue={prop.literalValue}
							enumValues={prop.enumValues}
							inputName={name}
							type={inputType}
						/>
					)}
				</div>
			) : (
				<p className="bg-secondary px-2 border border-zinc-800 h-6">
					{name}
				</p>
			)}
			{!["array", "object", "tuple"].includes(inputType) && (
				<InputItemTypeSelection
					types={types}
					setType={(type) => setInputType(type)}
					selectedType={inputType}
				/>
			)}
		</div>
	)
}

interface InputItemTypeSelectionProps {
	types: string[]
	setType: (type: string) => void
	selectedType: string
}

const InputItemTypeSelection: React.FC<InputItemTypeSelectionProps> = ({ types, setType, selectedType }) => (
	<span className="ml-2 flex">
		{types.map((t, i) => (
			<button
				key={i}
				onClick={() => setType(t)}
				style={{ color: selectedType == t ? "white" : "gray" }}
				className="mr-2"
			>{t}</button>
		))}
	</span>
)
