import { Action, ActionKind, QueryBuilderState } from ".";
import { InputType } from "../../utils/playground-request";
import TypeInputs, { ArrayInputs } from "./inputs"


interface ObjectInputsProps {
  input: InputType
  state: QueryBuilderState
  dispatch: (action: Action) => void
}

export const ObjectInputs: React.FC<ObjectInputsProps> = ({ input, state, dispatch }) => {
  return (
    <div>
      {input?.properties.map(({ name, type, array, nestedProps, arrayTypes }, idx) => {
        if (type.length === 1 && !state.inputs[name]) dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName: name, type: type[0] } })

        return !array ? (
          <div key={idx} className="flex items-center my-1">
            <p>{name}:</p>
            {state.inputs[name] && !["null", "undefined"].includes(state.inputs[name].type) &&
              <TypeInputs
                dispatchValue={(value: any) => {
                  dispatch({ ActionKind: ActionKind.SetValue, payload: { inputName: name, value } })
                }}
                inputName={name}
                type={state.inputs[name].type}
              />
            }
            <span className="ml-2">
              {type.map((t, i) => (
                <button
                  key={i}
                  onClick={() => dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName: name, type: t } })}
                  style={{ color: state.inputs[name]?.type == t ? "white" : "gray" }}
                  className="mr-2"
                >
                  {t}
                </button>
              ))}
            </span>
          </div>
        ) :
          <div key={idx} className="flex my-1 flex-col items-baseline">
            <div className="flex">
              <p>{name}:</p>
              <span className="ml-2">
                {type.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName: name, type: t } })}
                    style={{ color: state.inputs[name]?.type == t ? "white" : "gray" }}
                    className="mr-2"
                  >
                    {t}
                  </button>
                ))}
              </span>
            </div>
            {state.inputs[name] && !["null", "undefined"].includes(state.inputs[name].type) &&
              <ArrayInputs
                dispatchValue={(value: any) => {
                  dispatch({ ActionKind: ActionKind.SetValue, payload: { inputName: name, value: Object.assign({}, value) } })
                }}
                inputName={name}
                types={arrayTypes}
              />
            }
          </div>
      })}
    </div >
  )
}