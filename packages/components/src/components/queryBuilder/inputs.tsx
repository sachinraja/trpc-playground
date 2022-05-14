import { useEffect, useState } from "preact/hooks"
import { Action, ActionKind } from "."

interface InputProps {
	dispatch: (action: Action) => void,
	inputName: string
}

interface TypeInputsProps extends InputProps {
	type: string,
}

const TypeInputs: React.FC<TypeInputsProps> = ({ type, dispatch, inputName }) => {
	let props = {
		dispatch,
		inputName
	}

	switch (type) {
		case "string": {
			return <StringInput {...props} />
		}
		case "number": {
			return <NumberInput {...props} />
		}
		case "boolean": {
			return <BooleanInput {...props} />
		}
	}

	return null
}

const StringInput: React.FC<InputProps> = ({ dispatch, inputName }) => {
	const [value, setValue] = useState<string>("")

	useEffect(() => {
		dispatch({ ActionKind: ActionKind.SetValue, payload: { value, inputName } })
	}, [value])

	return <input
		type="text"
		className="text-white bg-primary outline-0 border border-zinc-800 rounded-sm px-2 mx-2 h-6"
		value={value}
		onChange={(e) => setValue(e.currentTarget.value)}
	/>
}

const NumberInput: React.FC<InputProps> = ({ dispatch, inputName }) => {
	const [value, setValue] = useState<number>(0)

	useEffect(() => {
		dispatch({ ActionKind: ActionKind.SetValue, payload: { value, inputName } })
	}, [value])

	return <input
		type="number"
		className="text-white bg-primary outline-0 border border-zinc-800 rounded-sm px-2 mx-2 h-6"
		value={value}
		onChange={(e) => setValue(+e.currentTarget.value)}
	/>
}

const BooleanInput: React.FC<InputProps> = ({ dispatch, inputName }) => {
	const [value, setValue] = useState<boolean>(false)

	useEffect(() => {
		dispatch({ ActionKind: ActionKind.SetValue, payload: { value, inputName } })
	}, [value])

	return <input
		type="radio"
		className="mx-2"
		checked={value}
		onClick={() => {
			setValue((v) => !v)
		}}
	/>
}

export default TypeInputs