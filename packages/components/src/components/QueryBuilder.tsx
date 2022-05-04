import { ChevronUpIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { useEffect, useReducer, useState } from 'preact/hooks';
import React from 'react';
import { GetTypesResponse } from '../utils/playground-request';
import { queryBuilderOpened } from './tab/store';

interface QueryBuilderProps {
  types: GetTypesResponse | null
}

let operations = ["Query", "Mutation"] as const

interface QueryBuilderState {
  operationType: string | null,
  operationName: string | null,
  inputs: { [key: string]: { value: any, type: any } }
}

const defaultQueryBuilderState: QueryBuilderState = {
  operationType: null,
  operationName: null,
  inputs: {}
}

enum ActionKind {
  SetOperationType = "SET_OPERATION_TYPE",
  SetOperationName = "SET_OPERATION_NAME",
  SetInputType = "SET_INPUT_TYPE",
  SetValue = "SET_VALUE"
}

type SetTypeAction = {
  ActionKind: ActionKind.SetOperationType,
  payload: { type: "Query" | "Mutation" }
}

type SetNameAction = {
  ActionKind: ActionKind.SetOperationName,
  payload: { name: string }
}

type SetValueAction = {
  ActionKind: ActionKind.SetValue,
  payload: { inputName: string, value: any }
}

type SetInputTypeAction = {
  ActionKind: ActionKind.SetInputType,
  payload: { type: any, inputName: string }
}

type Action =
  SetTypeAction |
  SetNameAction |
  SetInputTypeAction |
  SetValueAction

const reducer = (oldState: QueryBuilderState, action: Action): QueryBuilderState => {
  const state = { ...oldState }

  switch (action.ActionKind) {
    case ActionKind.SetOperationType: {
      state.operationType = action.payload.type
      state.operationName = null
      state.inputs = {}
      break
    }
    case ActionKind.SetOperationName: {
      state.operationName = action.payload.name
      state.inputs = {}
      break
    }
    case ActionKind.SetInputType: {
      state.inputs[action.payload.inputName] = { value: -1, type: action.payload.type }
      break
    }
    case ActionKind.SetValue: {
      state.inputs[action.payload.inputName] && (state.inputs[action.payload.inputName].value = action.payload.value)
      break
    }
  }

  return state
}

export const QueryBuilder: React.FC<QueryBuilderProps> = ({ types }) => {
  const [queryBuilderOpen, setQueryBuilderOpened] = useAtom(queryBuilderOpened)
  const [state, dispatch] = useReducer(reducer, defaultQueryBuilderState)
  console.log(types, state);

  return (
    <div className={`flex flex-col overflow-hidden max-h-60`}>
      <div className="flex justify-between mx-3 pb-1 items-center h-6">
        <p className={"text-neutral-100	mx-1 font-semibold"}>Query builder</p>
        <button onClick={() => setQueryBuilderOpened(open => !open)}>
          {
            queryBuilderOpen ?
              <ChevronUpIcon width={18} height={18} className="rotate-180" /> :
              <ChevronUpIcon width={18} height={18} className="rotate-0" />
          }
        </button>
      </div>
      {queryBuilderOpen && types &&
        <div className="flex-1 bg-primary w-full">
          <div>
            <p className="font-semibold">Operation</p>
            <div>
              {operations.map((name) =>
                <button className="bg-secondary mx-2 px-2" key={name} onClick={
                  () => dispatch({ ActionKind: ActionKind.SetOperationType, payload: { type: name } })
                }>{name}</button>
              )}
            </div>
          </div>
          {state.operationType == "Query" &&
            <div>
              <p className="font-semibold">Queries</p>
              {Object.keys(types?.queries || {}).map((queryName, idx) =>
                <button
                  key={idx}
                  onClick={() => dispatch({ ActionKind: ActionKind.SetOperationName, payload: { name: queryName } })}
                >
                  {queryName}{state.operationName === queryName && " (selected)"}
                </button>
              )}
              {state.operationName && types.queries[state.operationName] &&
                <div>
                  <p className="font-semibold">{state.operationName} Inputs</p>
                  {types.queries[state.operationName]!.properties.map(({ name, type }, idx) => {
                    if (type.length === 1 && !state.inputs[name]) dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName: name, type: type[0] } })

                    return <div key={idx} className="flex">
                      <p>{name}</p>
                      {state.inputs[name] && !["null", "undefined"].includes(state.inputs[name].type) &&
                        <TypeInputs dispatch={dispatch} inputName={name} type={state.inputs[name].type} />
                      }
                      <span>{type.map((t, i) => {
                        return <button
                          key={i}
                          onClick={() => dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName: name, type: t } })}
                          style={{ color: state.inputs[name]?.type == t ? "white" : "gray" }}
                        >
                          {t}
                        </button>
                      })}
                      </span>
                    </div>
                  })}
                </div>
              }
              <button onClick={() => {
                console.log(state);
              }}>Generate</button>
            </div>
          }
        </div>
      }
    </div>
  );
}

interface InputProps {
  dispatch: (action: Action) => void,
  inputName: string

}

interface TypeInputsProps extends InputProps {
  type: string,
}

const TypeInputs: React.FC<TypeInputsProps> = ({ type, dispatch, inputName }) => {
  let props = {
    dispatch,
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

const StringInput: React.FC<InputProps> = ({ dispatch, inputName }) => {
  const [value, setValue] = useState<string>("")

  useEffect(() => {
    dispatch({ ActionKind: ActionKind.SetValue, payload: { value, inputName } })
  }, [value])

  return <input
    type="text"
    className="text-black"
    value={value}
    onChange={(e) => setValue(e.currentTarget.value)}
  />
}

const NumberInput: React.FC<InputProps> = ({ dispatch, inputName }) => {
  const [value, setValue] = useState<number>(0)

  useEffect(() => {
    dispatch({ ActionKind: ActionKind.SetValue, payload: { value, inputName } })
  }, [value])

  return <input
    type="number"
    className="text-black"
    value={value}
    onChange={(e) => setValue(+e.currentTarget.value)}
  />
}

const BooleanInput: React.FC<InputProps> = ({ dispatch, inputName }) => {
  const [value, setValue] = useState<boolean>(false)

  useEffect(() => {
    dispatch({ ActionKind: ActionKind.SetValue, payload: { value, inputName } })
  }, [value])

  return <input
    type="radio"
    className="text-black"
    checked={value}
    onClick={() => {
      setValue((v) => !v)
    }}
  />
}