import { useEffect, useState } from "preact/hooks"
import { Action, ActionKind } from "."

interface InputProps {
  // dispatch: (action: Action) => void,
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
    // dispatch({ ActionKind: ActionKind.SetValue, payload: { value, inputName } })
  }, [value])

  return <input
    type="text"
    className="text-white bg-primary outline-0 border border-zinc-800 rounded-sm px-2 mx-2 h-6"
    value={value}
    onChange={(e) => setValue(e.currentTarget.value)}
  />
}

const NumberInput: React.FC<InputProps> = ({ dispatchValue, inputName }) => {
  const [value, setValue] = useState<number>(0)

  useEffect(() => {
    dispatchValue(value)
    // dispatch({ ActionKind: ActionKind.SetValue, payload: { value, inputName } })
  }, [value])

  return <input
    type="number"
    className="text-white bg-primary outline-0 border border-zinc-800 rounded-sm px-2 mx-2 h-6"
    value={value}
    onChange={(e) => setValue(+e.currentTarget.value)}
  />
}

const BooleanInput: React.FC<InputProps> = ({ dispatchValue, inputName }) => {
  const [value, setValue] = useState<boolean>(false)

  useEffect(() => {
    dispatchValue(value)
    // dispatch({ ActionKind: ActionKind.SetValue, payload: { value, inputName } })
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

interface ArrayTypeInputsProps extends InputProps {
  types: string[],
}
type ArrayItem = { value: any, type: string };

export const ArrayInputs: React.FC<ArrayTypeInputsProps> = ({ inputName, dispatchValue, types }) => {
  const [items, setItems] = useState<ArrayItem[]>([])

  useEffect(() => {
    dispatchValue(items)
  }, [items])

  if (types.length === 0) return null

  if (types.includes("object")) return <div>Object</div>

  return (
    <div className="pl-10">
      {items.map(({ type, value }, idx) => (
        <ArrayItem
          key={idx}
          idx={idx}
          type={type}
          value={value}
          setItem={
            (newItem: ArrayItem) => setItems((i) => {
              i[idx] && (i[idx] = newItem)
              return [...i]
            })
          }
          types={types}
        />
      ))}
      <br />
      <button onClick={() => {
        setItems(i => [...i, { value: -1, type: types[0] }])
      }}>New</button>
    </div>
  )
}

interface ArrayItemProps {
  type: string,
  value: any,
  setItem: (item: ArrayItem) => void
  types: string[]
  idx: number
}

const ArrayItem: React.FC<ArrayItemProps> = ({ type, value, setItem, types, idx }) => {
  return (
    <div className="flex">
      {idx}:
      {!["null", "undefined"].includes(type) &&
        <TypeInputs
          dispatchValue={(value: any) => setItem({ type, value })}
          inputName={idx.toString()}
          type={type}
        />
      }
      <span className="flex">{types.map((t) =>
        <p
          onClick={() => setItem({ value, type: t })}
          className="cursor-pointer ml-2"
          style={{ color: type === t ? "white" : "gray" }}
        >{t}</p>
      )}</span>
    </div>
  )
}

export default TypeInputs