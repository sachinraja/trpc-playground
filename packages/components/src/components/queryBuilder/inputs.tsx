import { useEffect, useState } from "preact/hooks"

interface InputProps {
  dispatchValue: (value: any) => void,
  inputName: string
}

interface TypeInputsProps extends InputProps {
  type: string,
}

const TypeInputs: React.FC<TypeInputsProps> = ({ type, dispatchValue, inputName, }) => {
  let props = {
    dispatchValue,
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

const StringInput: React.FC<InputProps> = ({ dispatchValue, inputName }) => {
  const [value, setValue] = useState<string>("")

  useEffect(() => {
    dispatchValue(value)
  }, [value])

  return (
    <div className="border border-zinc-800 rounded-sm h-6 flex w-64">
      <p className="bg-secondary px-2 border-r border-zinc-800">
        {inputName}
      </p>
      <input
        type="text"
        className="text-white bg-primary outline-0 pl-2"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </div>
  )
}

const NumberInput: React.FC<InputProps> = ({ dispatchValue, inputName }) => {
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
        onChange={(e) => setValue(+e.currentTarget.value)}
      />
    </div>
  )
}

const BooleanInput: React.FC<InputProps> = ({ dispatchValue, inputName }) => {
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
          onClick={() => setValue((v) => !v)}
        />
        <span className="ml-1">
          {value ? "True" : "False"}
        </span>
      </div>
    </div>
  )
}

export default TypeInputs