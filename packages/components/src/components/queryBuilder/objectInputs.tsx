import { QueryBuilderInput } from ".";
import { Property } from "../../utils/playground-request";
import { TupleItem } from "./arrayInputs";

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
          types={prop.type}
          indent={indent}
          input={getInputFromState(prop.name)}
          inputType={getInputFromState(prop.name)?.type}
          name={prop.name}
          prop={prop}
          setInputType={(type) => setInputType(prop.name, type)}
          setInputValue={(value) => setInputValue(prop.name, value)}
        />
      ))}
    </div>
  )
}