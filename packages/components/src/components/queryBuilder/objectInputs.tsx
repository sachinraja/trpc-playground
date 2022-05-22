import { Action, ActionKind, QueryBuilderInput, QueryBuilderState } from ".";
import { Property } from "../../../../types/src";
import { InputType } from "../../utils/playground-request";
import TypeInputs, { ArrayInputs } from "./inputs"

interface ObjectInputsProps {
  input: InputType
  state: QueryBuilderState
  dispatch: (action: Action) => void
}

export const ShowNoInputTypes = ["null", "undefined"]

export const ObjectInputs: React.FC<ObjectInputsProps> = ({ input, state, dispatch }) => {
  return (
    <div>
      {input?.properties.map((prop, idx) => (
        <ObjectInput
          key={idx}
          getInputFromState={(inputName) => state.inputs[inputName]}
          prop={prop}
          setInputType={
            (inputName: string, type: string) =>
              dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName, type } })
          }
          setInputValue={
            (inputName: string, value: any) =>
              dispatch({ ActionKind: ActionKind.SetValue, payload: { inputName, value } })
          }
        />
      ))}
    </div >
  )
}

interface NestedObjectProps {
  nestedProps: Property[]
  setInputType: (inputName: string, type: string) => void
  setInputValue: (inputName: string, value: any) => void
  getInputFromState: (inputName: string) => QueryBuilderInput | null
}

export const NestedObjectInputs: React.FC<NestedObjectProps> = ({ nestedProps, setInputType, setInputValue, getInputFromState }) => {
  return (
    <div className="ml-5 border-l-2 border-secondary">
      {nestedProps.map(({ name, type }, idx) => {
        const input = getInputFromState(name)
        if (type.length === 1 && !input) setInputType(name, type[0])

        return (
          <div key={idx} className="flex items-center my-1">
            <div className="h-[2px] w-5 bg-secondary mr-2" />
            {(!input || (input && ShowNoInputTypes.includes(input.type))) &&
              <p className="bg-secondary px-2 border border-zinc-800 h-6">
                {name}
              </p>
            }
            {input && !ShowNoInputTypes.includes(input.type) &&
              <TypeInputs
                dispatchValue={(value: any) => setInputValue(name, value)}
                inputName={name}
                type={input.type}
              />
            }
            <span className="ml-2">
              {type.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setInputType(name, t)}
                  style={{ color: input?.type == t ? "white" : "gray" }}
                  className="mr-2"
                >
                  {t}
                </button>
              ))}
            </span>
          </div>
        )
      })}
    </div>
  )
}

interface ObjectInputProps {
  prop: Property
  setInputType: (inputName: string, type: string) => void
  setInputValue: (inputName: string, value: any) => void
  getInputFromState: (inputName: string) => QueryBuilderInput | null
}

export const ObjectInput: React.FC<ObjectInputProps> = ({ prop, setInputType, setInputValue, getInputFromState }) => {
  const { name, type, array, nestedProps, arrayTypes } = prop

  const input = getInputFromState(name)

  if (type.length === 1 && !input) setInputType(name, type[0])

  if (array) {
    return (
      <div className="flex my-1 flex-col items-baseline">
        <div className="flex">
          <p className="bg-secondary px-2 border border-zinc-800 h-6">
            {name}
          </p>
          <span className="ml-2">
            {type.map((t, i) => (
              <button
                key={i}
                onClick={() => setInputType(name, t)}
                style={{ color: input?.type == t ? "white" : "gray" }}
                className="mr-2"
              >
                {t}
              </button>
            ))}
          </span>
        </div>
        {input && !["null", "undefined"].includes(input.type) &&
          <ArrayInputs
            dispatchValue={(value: any) => setInputValue(name, Object.assign({}, value))}
            property={prop}
            inputName={name}
            types={arrayTypes}
          />
        }
      </div>
    )
  }

  if (input?.type === "object") {
    return (
      <div className="flex my-1 flex-col items-baseline">
        <div className="flex">
          <p className="bg-secondary px-2 border border-zinc-800 h-6">
            {name}
          </p>
          <span className="ml-2">
            {type.map((t, i) => (
              <button
                key={i}
                onClick={() => setInputType(name, t)}
                style={{ color: input?.type == t ? "white" : "gray" }}
                className="mr-2"
              >
                {t}
              </button>
            ))}
          </span>
        </div>
        <NestedObjectInputs
          getInputFromState={(inputName) => getInputFromState(`${name}.${inputName}`)}
          nestedProps={nestedProps}
          setInputType={(inputName, newType) => setInputType(`${name}.${inputName}`, newType)}
          setInputValue={(inputName, newValue) => setInputValue(`${name}.${inputName}`, newValue)}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center my-1">
      {(!input || (input && ShowNoInputTypes.includes(input.type))) &&
        <p className="bg-secondary px-2 border border-zinc-800 h-6">{name}</p>
      }
      {input && !["null", "undefined"].includes(input.type) &&
        <TypeInputs
          dispatchValue={(value: any) => setInputValue(name, value)}
          inputName={name}
          type={input.type}
        />
      }
      <span className="ml-2">
        {type.map((t, i) => (
          <button
            key={i}
            onClick={() => setInputType(name, t)}
            style={{ color: input?.type == t ? "white" : "gray" }}
            className="mr-2"
          >
            {t}
          </button>
        ))}
      </span>
    </div>
  )
}