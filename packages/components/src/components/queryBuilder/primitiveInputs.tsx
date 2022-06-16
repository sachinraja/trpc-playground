import { useEffect, useState } from "preact/hooks"

interface InputProps {
  dispatchValue: (value: any) => void,
  inputName: string
}

interface TypeInputsProps extends InputProps {
  type: string,
  literalValue: any
  enumValues: any[] | null
}

const TypeInputs: React.FC<TypeInputsProps> = ({ type, dispatchValue, inputName, enumValues, literalValue }) => {
  const [canDispatch, setCanDispatch] = useState(true)
  let props = {
    dispatchValue,
    inputName
  }

  useEffect(() => {
    if (literalValue != null) {
      dispatchValue!(literalValue)
      setCanDispatch(false)
    } else setCanDispatch(true)

    return () => { }
  }, [literalValue])

  switch (type) {
    case "string": {
      return <StringInput {...props} canDispatch={canDispatch} enumValues={enumValues} literalValue={literalValue} />
    }
    case "number": {
      return <NumberInput {...props} canDispatch={canDispatch} enumValues={enumValues} literalValue={literalValue} />
    }
    case "boolean": {
      return <BooleanInput {...props} canDispatch={canDispatch} enumValues={enumValues} literalValue={literalValue} />
    }
  }

  return null
}

interface TypeInput extends InputProps {
  canDispatch: boolean,
  enumValues: any[] | null
  literalValue: any
}

const StringInput: React.FC<TypeInput> = ({ dispatchValue, inputName, canDispatch, enumValues, literalValue }) => {
  const [value, setValue] = useState<string>(literalValue ?? (enumValues != null ? enumValues[0] : ""))
  // console.log(inputName, enumValues, canDispatch);

  useEffect(() => {
    dispatchValue(value)
  }, [value])

  return (
    <div className="border border-zinc-800 rounded-sm h-6 flex w-64">
      <p className="bg-secondary px-2 border-r border-zinc-800">
        {inputName}
      </p>
      {enumValues != null ? (
        <select
          className="text-white bg-primary outline-0 pl-2 w-full"
          onChange={(e) => canDispatch && setValue(e.currentTarget.value)}
        >
          {enumValues.map((val, idx) => (
            <option key={idx} value={val}>{val}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          className="text-white bg-primary outline-0 pl-2"
          value={value}
          disabled={!canDispatch}
          onChange={(e) => canDispatch && setValue(e.currentTarget.value)}
        />
      )}
    </div>
  )
}

const NumberInput: React.FC<TypeInput> = ({ dispatchValue, inputName, canDispatch }) => {
  const [value, setValue] = useState<number>(0)

  useEffect(() => {
    dispatchValue(value)
  }, [value])

  return (
    <div className="border border-zinc-800 rounded-sm h-6 flex w-64">
      <p className="bg-secondary px-2 border-r border-zinc-800">
        {inputName}
      </p>
      <input
        type="number"
        className="text-white bg-primary outline-0 pl-2 flex-1"
        value={value}
        onChange={(e) => canDispatch && setValue(+e.currentTarget.value)}
      />
    </div>
  )
}

const BooleanInput: React.FC<TypeInput> = ({ dispatchValue, inputName, canDispatch }) => {
  const [value, setValue] = useState<boolean>(false)

  useEffect(() => {
    dispatchValue(value)
  }, [value])

  return (
    <div className="border border-zinc-800 rounded-sm h-6 flex w-64 items-center">
      <p className="bg-secondary px-2 border-r border-zinc-800">
        {inputName}
      </p>
      <div className="flex items-center justify-center flex-1">
        <input
          type="radio"
          className="text-white bg-primary outline-0 pl-2"
          checked={value}
          onClick={() => canDispatch && setValue((v) => !v)}
        />
        <span className="ml-1">
          {value ? "True" : "False"}
        </span>
      </div>
    </div>
  )
}

export default TypeInputs