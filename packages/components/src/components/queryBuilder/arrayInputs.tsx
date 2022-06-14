import { PlusIcon } from "@heroicons/react/solid";
import { useEffect } from "preact/hooks";
import { QueryBuilderInput } from ".";
import { Property } from "../../utils/playground-request";
import TypeInputs from "./inputs";
import { ObjectInputs } from './objectInputs';

interface ArrayInputProps {
  setInputsType: (type: string) => void
  setInputType: (inputName: string, type: string) => void
  setInputValue: (inputName: string, value: any) => void
  inputValue: any
  arrayTypes: string[]
  properties: Property[]
}

export const ArrayInputs: React.FC<ArrayInputProps> = ({ setInputType, inputValue, arrayTypes, setInputValue, properties, setInputsType }) => {
  // console.log(inputValue);
  useEffect(() => {
    setInputsType("array")
    return () => { }
  }, [])

  return (
    <div>
      {arrayTypes.length !== 0 &&
        <div style={{ marginLeft: "0.75rem" }} className=" border-l-2 border-secondary">
          {Object.entries(inputValue).map(([_idx, val]) => val as any).map((value, idx) => {
            if (arrayTypes.length === 1 && !value.type) {
              setInputValue(idx.toString(), -1)
            }

            return <TupleItem
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
              key={idx}
            />
          })}
          <div className="flex items-center h-6 mt-3">
            <div className="h-[2px] w-5 bg-secondary mr-2" />
            <button
              title="New Item"
              className="bg-secondary p-1 rounded-md"
              onClick={() => {
                let nextIdx = Object.entries(inputValue).length

                setInputType(nextIdx.toString(), "")
                // setInputValue(nextIdx.toString(), -1)
              }}
            >
              <PlusIcon width={20} height={20} />
            </button>
          </div>
        </div>}
    </div>
  )
}

interface TupleInputProps {
  setInputType: (inputName: string, type: string) => void
  setInputValue: (inputName: string, value: any) => void
  getInput: (inputName: string) => QueryBuilderInput | null
  props: Property[]
}

export const TupleInput: React.FC<TupleInputProps> = ({ props, setInputType, getInput, setInputValue }) => {
  return (
    <div>
      {props.map((prop, idx) => (
        <TupleItem
          key={idx}
          prop={prop}
          setInputType={(type) => setInputType(idx.toString(), type)}
          inputType={getInput(idx.toString())?.type}
          setInputValue={(val) => setInputValue(idx.toString(), val)}
          name={idx.toString()}
          input={getInput(idx.toString())}
          indent={false}
          types={prop.type}
        />
      ))}
    </div>
  )
}

interface TupleItemProps {
  prop: Property,
  setInputType: (type: string) => void,
  setInputValue: (value: string) => void,
  input: QueryBuilderInput | null
  inputType: string
  name: string
  indent: boolean
  types: string[]
}

export const TupleItem: React.FC<TupleItemProps> = ({ prop, setInputType, inputType, setInputValue, name, input, indent, types }) => {
  const { properties } = prop

  useEffect(() => {
    types.length === 1 && inputType !== types[0] && setInputType(types[0])
    return () => { }
  }, [])


  return (
    <div className="flex my-1 items-center">
      {indent && <div className="h-[2px] w-5 bg-secondary mr-2" />}
      {inputType ? (
        <div>
          {inputType === "array" ? (
            <div>
              <div className="flex">
                <p className="bg-secondary px-2 border border-zinc-800 h-6 w-fit">
                  {name}
                </p>
                <TupleItemTypeSelection
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
                <TupleItemTypeSelection
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
      {!["array", "object"].includes(inputType) && (
        <TupleItemTypeSelection
          types={types}
          setType={(type) => setInputType(type)}
          selectedType={inputType}
        />
      )}
    </div>
  )
}

interface TypeItemTypeSelectionProps {
  types: string[]
  setType: (type: string) => void
  selectedType: string
}

const TupleItemTypeSelection: React.FC<TypeItemTypeSelectionProps> = ({ types, setType, selectedType }) => {
  return (
    <span className="ml-2 flex">
      {types.map((t, i) => (
        <button
          key={i}
          onClick={() => setType(t)}
          style={{ color: selectedType == t ? "white" : "gray" }}
          className="mr-2"
        >
          {t}
        </button>
      ))}
    </span>

  )
}