import { PlusIcon, XIcon } from "@heroicons/react/solid"
import { useEffect, useState } from "preact/hooks"
import { Property } from "../../utils/playground-request"
import { ObjectInput, ShowNoInputTypes } from "./objectInputs"

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

interface ArrayTypeInputsProps extends InputProps {
  types: string[],
  property: Property
}
type ArrayItem = { value: any, type: string };

export const ArrayInputs: React.FC<ArrayTypeInputsProps> = ({ inputName, dispatchValue, types, property }) => {
  const [items, setItems] = useState<ArrayItem[]>([])

  useEffect(() => {
    dispatchValue(items)
  }, [items])

  if (types.length === 0) return null

  if (types.includes("object")) {
    return (
      <div className="border-l-2 border-secondary py-0 ml-5">
        {items.map(({ type, value }, idx) => (
          <div key={idx}>
            <ArrayItem
              key={idx}
              idx={idx}
              type={type}
              value={value}
              nestedProps={property.nestedProps}
              remove={() => {
                items.splice(idx, 1)
                setItems([...items])
              }}
              setItem={
                (newItem: ArrayItem) => setItems((i) => {
                  i[idx] && (i[idx] = newItem)
                  return [...i]
                })
              }
              types={types}
            />
          </div>
        ))}
        <div className="flex items-center h-6 mt-3">
          <div className="h-[2px] w-5 bg-secondary mr-2" />
          <button
            title="New Item"
            className="bg-secondary p-1 rounded-md"
            onClick={() => {
              setItems(i => [...i, { value: -1, type: types[0] }])
            }}
          >
            <PlusIcon width={20} height={20} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border-l-2 border-secondary py-0 ml-5">
      {items.map(({ type, value }, idx) => (
        <ArrayItem
          key={idx}
          idx={idx}
          type={type}
          value={value}
          remove={() => {
            items.splice(idx, 1)
            setItems([...items])
          }}
          setItem={
            (newItem: ArrayItem) => setItems((i) => {
              i[idx] && (i[idx] = newItem)
              return [...i]
            })
          }
          types={types}
        />
      ))}
      <div className="flex items-center h-6 mt-3">
        <div className="h-[2px] w-5 bg-secondary mr-2" />
        <button
          title="New Item"
          className="bg-secondary p-1 rounded-md"
          onClick={() => {
            setItems(i => [...i, { value: -1, type: types[0] }])
          }}
        >
          <PlusIcon width={20} height={20} />
        </button>
      </div>
    </div>
  )
}

interface ArrayItemProps {
  type: string,
  value: any,
  setItem: (item: ArrayItem) => void
  remove: () => void
  types: string[]
  idx: number,
  nestedProps?: Property[]
}

const ArrayItem: React.FC<ArrayItemProps> = ({ type, value, setItem, types, idx, remove, nestedProps = [] }) => {
  return (
    <div className="flex mt-1 flex-col">
      <div className="flex items-center">
        <div className="h-[2px] w-5 bg-secondary mr-2" />
        {ShowNoInputTypes.includes(type) || type === "object" &&
          <p className="bg-secondary px-2 border border-zinc-800 h-6">
            {idx}
          </p>
        }
        {!ShowNoInputTypes.includes(type) && type !== "object" &&
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
        <button
          onClick={remove}
          className="ml-2 opacity-40 hover:opacity-100 transition"
        >
          <XIcon width={20} height={20} />
        </button>
      </div>
      {type === "object" && (
        <div className="ml-10 border-l-2 border-secondary">
          {nestedProps.map((prop, idx) => (
            <div key={idx} className="flex items-center">
              <div className="h-[2px] w-5 bg-secondary mr-2" />
              <ObjectInput
                prop={prop}
                setInputType={(inputName, newType) => {
                  const newItem = {
                    type,
                    value: {
                      ...value,
                      [inputName]: { value: -1, type: newType }
                    }
                  }
                  setItem(newItem)
                }}
                setInputValue={(inputName, newValue) => {
                  const newItem = {
                    type,
                    value: {
                      ...value,
                      [inputName]: { ...value[inputName], value: newValue }
                    }
                  }
                  setItem(newItem)
                }}
                getInputFromState={(inputName) => {
                  if (value == -1) return null

                  if (value[inputName]) {
                    return value[inputName]
                  }
                  return null
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TypeInputs