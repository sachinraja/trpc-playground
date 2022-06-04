import { QueryBuilderInput } from ".";
import { Property } from "../../utils/playground-request";
import { TupleItem } from "./arrayInputs";
import TypeInputs, { ArrayInputs } from "./inputs";

interface ObjectInputsProps {
  props: Property[]
  setInputType: (inputName: string, type: string) => void
  setInputValue: (inputName: string, value: any) => void
  getInputFromState: (inputName: string) => QueryBuilderInput | null
  indent: boolean
}

export const ShowNoInputTypes = ["null", "undefined"]

export const ObjectInputs: React.FC<ObjectInputsProps> = ({ props, setInputType, setInputValue, getInputFromState, indent }) => {
  return (
    <div className="border-secondary" style={{ marginLeft: indent ? "0.75rem" : "0", borderLeftWidth: indent ? "2px" : 0 }}>
      {props.map((prop, idx) => (
        <TupleItem
          indent={indent}
          input={getInputFromState(prop.name)}
          inputType={getInputFromState(prop.name)?.type}
          name={prop.name}
          prop={prop}
          setInputType={(type) => setInputType(prop.name, type)}
          setInputValue={(value) => setInputValue(prop.name, value)}
        />
        // <ObjectInput
        //   indent={indent}
        //   key={idx}
        //   getInputFromState={(inputName) => getInputFromState(inputName)}
        //   prop={prop}
        //   setInputType={
        //     (inputName: string, type: string) =>
        //       setInputType(inputName, type)
        //   }
        //   setInputValue={
        //     (inputName: string, value: any) =>
        //       setInputValue(inputName, value)
        //   }
        // />
      ))}
    </div>
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
  indent: boolean
  prop: Property
  setInputType: (inputName: string, type: string) => void
  setInputValue: (inputName: string, value: any) => void
  getInputFromState: (inputName: string) => QueryBuilderInput | null
}

export const ObjectInput: React.FC<ObjectInputProps> = ({ prop, setInputType, setInputValue, getInputFromState, indent }) => {
  const { name, type, array, nestedProps, arrayTypes } = prop

  const input = getInputFromState(name)

  if (type.length === 1 && !input) setInputType(name, type[0])

  if (array) {
    return (
      <div className="flex my-1 flex-col items-baseline">
        <div className="flex">
          {indent && <div className="h-[2px] w-5 bg-secondary mr-2" />}
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
          {indent && <div className="h-[2px] w-5 bg-secondary mr-2" />}
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
      {indent && <div className="h-[2px] w-5 bg-secondary mr-2" />}
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