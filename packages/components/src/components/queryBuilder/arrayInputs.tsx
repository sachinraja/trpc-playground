import { PlusIcon } from "@heroicons/react/solid";
import { useEffect } from "preact/hooks";
import { QueryBuilderInput } from ".";
import { Property } from "../../utils/playground-request";
import { InputItem } from "./InputItem";

interface ArrayInputProps {
  setInputsType: (type: string) => void
  setInputType: (inputName: string, type: string) => void
  setInputValue: (inputName: string, value: any) => void
  inputValue: any
  arrayTypes: string[]
  properties: Property[]
}

export const ArrayInputs: React.FC<ArrayInputProps> = ({ setInputType, inputValue, arrayTypes, setInputValue, properties, setInputsType }) => {
  useEffect(() => {
    setInputsType("array")
    return () => { }
  }, [])

  return (
    <>
      {arrayTypes.length !== 0 &&
        <div style={{ marginLeft: "0.75rem" }} className=" border-l-2 border-secondary">
          {Object.entries(inputValue).map(([_idx, val]) => val as any).map((value, idx) => {
            if (arrayTypes.length === 1 && !value.type)
              setInputValue(idx.toString(), -1)

            return (
              <InputItem
                key={idx}
                indent={true}
                types={properties[0].arrayTypes}
                input={inputValue[idx]}
                inputType={inputValue[idx].type}
                name={idx.toString()}
                prop={properties[0]}
                setInputType={(type) => {
                  setInputType(idx.toString(), type)
                }}
                setInputValue={(newValue: any) => {
                  setInputValue(idx.toString(), newValue)
                }}
              />
            )
          })}
          <div className="flex items-center h-6 mt-3">
            <div className="h-[2px] w-5 bg-secondary mr-2" />
            <button
              title="New Item"
              className="bg-secondary p-1 rounded-md"
              onClick={() => {
                let nextIdx = Object.entries(inputValue).length

                setInputType(nextIdx.toString(), "")
              }}
            >
              <PlusIcon width={20} height={20} />
            </button>
          </div>
        </div>
      }
    </>
  )
}

interface TupleInputProps {
  setInputType: (inputName: string, type: string) => void
  setInputValue: (inputName: string, value: any) => void
  getInput: (inputName: string) => QueryBuilderInput | null
  props: Property[]
  indent?: boolean
}

export const TupleInput: React.FC<TupleInputProps> = ({ props, setInputType, getInput, setInputValue, indent = false }) => (
  <>
    {props.map((prop, idx) => (
      <InputItem
        key={idx}
        prop={prop}
        setInputType={(type) => setInputType(idx.toString(), type)}
        inputType={getInput(idx.toString())?.type}
        setInputValue={(val) => setInputValue(idx.toString(), val)}
        name={idx.toString()}
        input={getInput(idx.toString())}
        indent={indent}
        types={prop.type}
      />
    ))}
  </>
)
