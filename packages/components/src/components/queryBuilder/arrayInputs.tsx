import { PlusIcon } from "@heroicons/react/solid";
import { useEffect } from "preact/hooks";
import { Action, ActionKind, QueryBuilderInput, QueryBuilderState } from ".";
import { InputType, Property } from "../../utils/playground-request";
import TypeInputs from "./inputs";
import { ObjectInputs } from './objectInputs';

interface ArrayInputProps {
  input: InputType,
  state: QueryBuilderState,
  dispatch: (action: Action) => void
}

export const ArrayInput: React.FC<ArrayInputProps> = ({ input, state, dispatch }) => {
  useEffect(() => {
    dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName: state.operationName!, type: "array" } })
    return () => { }
  }, [])

  return (
    <div>
      <span>Array</span>
      {input?.arrayTypes.length !== 0 &&
        <div className="ml-5 border-l-2 border-secondary">
          {state.operationName && Object.entries(state.inputs[state.operationName]?.value || {}).map(([idx, value]: [any, any]) => {
            if (input?.arrayTypes.length === 1 && !value.type && state.operationName) {
              const newValue = { ...state.inputs[state.operationName].value, [idx]: { value: -1, type: input.arrayTypes[0] } }

              dispatch({ ActionKind: ActionKind.SetValue, payload: { inputName: state.operationName, value: newValue } })
            }

            return (
              <div key={idx} className="my-1 flex items-center">
                <div className="h-[2px] w-5 bg-secondary mr-2" />
                <TypeInputs
                  dispatchValue={(val) => {
                    if (!state.operationName || !state.inputs[state.operationName]) return
                    const newValue = { ...state.inputs[state.operationName].value, [idx]: { value: val, type: value.type } }

                    dispatch({ ActionKind: ActionKind.SetValue, payload: { inputName: state.operationName, value: newValue } })
                  }}
                  inputName={idx}
                  type={input?.arrayTypes[0]!}
                />
                <span className="ml-2">
                  {input?.arrayTypes.map((t, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (!state.operationName || !state.inputs[state.operationName]) return
                        const newValue = { ...state.inputs[state.operationName].value, [idx]: { ...value, type: t } }

                        dispatch({ ActionKind: ActionKind.SetValue, payload: { inputName: state.operationName, value: newValue } })
                      }}
                      style={{ color: state.inputs[state.operationName!]?.value[idx].type == t ? "white" : "gray" }}
                      className="mr-2"
                    >
                      {t}
                    </button>
                  ))}
                </span>
              </div>
            )
          })}
          <div className="flex items-center h-6 mt-3">
            <div className="h-[2px] w-5 bg-secondary mr-2" />
            <button
              title="New Item"
              className="bg-secondary p-1 rounded-md"
              onClick={() => {
                if (!state.operationName || !state.inputs[state.operationName]) return
                let nextIdx = Object.entries(state.inputs[state.operationName].value).length

                const newValue = { ...state.inputs[state.operationName].value, [nextIdx]: -1 }

                dispatch({ ActionKind: ActionKind.SetValue, payload: { inputName: state.operationName, value: newValue } })
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
}

export const TupleItem: React.FC<TupleItemProps> = ({ prop, setInputType, inputType, setInputValue, name, input, indent }) => {
  const { type: types, nestedProps } = prop

  useEffect(() => {
    types.length === 1 && setInputType(types[0])
    return () => { }
  }, [])

  return (
    <div className="flex my-1 items-center">
      {indent && <div className="h-[2px] w-5 bg-secondary mr-2" />}
      {inputType ? (
        <div>
          {inputType === "array" ? (
            <div>array</div>
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
                props={nestedProps}
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
              dispatchValue={(val) => {
                setInputValue(val)
              }}
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