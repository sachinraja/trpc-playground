import { useEffect } from "preact/hooks"
import { QueryBuilderState, Action, ActionKind } from "."
import TypeInputs from "./inputs"
import { InputType } from "../../utils/playground-request"

interface ArrayInputProps {
  input: InputType,
  state: QueryBuilderState,
  dispatch: (action: Action) => void
}

export const ArrayInput: React.FC<ArrayInputProps> = ({ input, state, dispatch }) => {
  useEffect(() => {
    dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName: state.operationName!, defaultValue: { 0: -1 }, type: "array" } })
    return () => { }
  }, [])

  return (
    <div>
      {input?.arrayTypes.length !== 0 &&
        <div>
          <span>Array</span>
          {state.operationName && Object.entries(state.inputs[state.operationName]?.value || {}).map(([idx, value]) => {
            return <div key={idx}>{idx}:
              <TypeInputs
                dispatchValue={(value) => {
                  if (!state.operationName || !state.inputs[state.operationName]) return
                  const newValue = { ...state.inputs[state.operationName].value, [idx]: value }

                  dispatch({ ActionKind: ActionKind.SetValue, payload: { inputName: state.operationName, value: newValue } })
                }}
                inputName={state.operationName!}
                type={input?.arrayTypes[0]!}
              />
            </div>
          })}
          <button onClick={() => {
            if (!state.operationName || !state.inputs[state.operationName]) return
            let nextIdx = Object.entries(state.inputs[state.operationName].value).length

            const newValue = { ...state.inputs[state.operationName].value, [nextIdx]: -1 }

            dispatch({ ActionKind: ActionKind.SetValue, payload: { inputName: state.operationName, value: newValue } })
          }}>+</button>
        </div>}
    </div>
  )
}

