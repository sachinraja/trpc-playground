import { ChevronUpIcon } from '@heroicons/react/solid';
import { useAtom } from 'jotai';
import { useReducer } from 'preact/hooks';
import React from 'react';
import { GetTypesResponse, InputType } from '../../utils/playground-request';
import { queryBuilderOpened } from '../tab/store';
import TypeInputs from "./inputs";

interface QueryBuilderProps {
  types: GetTypesResponse | null
}

let operations = ["Query", "Mutation", "Subscription"] as const

interface QueryBuilderState {
  operationType: string | null,
  operationName: string | null,
  operationTypeInObject: string | null,
  inputs: { [key: string]: { value: any, type: any } },
  inputsType: string | null
}

const defaultQueryBuilderState: QueryBuilderState = {
  operationType: null,
  operationName: null,
  operationTypeInObject: null,
  inputs: {},
  inputsType: null
}

export enum ActionKind {
  SetOperationType = "SET_OPERATION_TYPE",
  SetOperationName = "SET_OPERATION_NAME",
  SetInputType = "SET_INPUT_TYPE",
  SetValue = "SET_VALUE",
  SetInputsType = "SET_INPUTS_TYPE"
}

type SetTypeAction = {
  ActionKind: ActionKind.SetOperationType,
  payload: { type: "Query" | "Mutation" | "Subscription" }
}

type SetNameAction = {
  ActionKind: ActionKind.SetOperationName,
  payload: { name: string }
}

type SetValueAction = {
  ActionKind: ActionKind.SetValue,
  payload: { inputName: string, value: any }
}

type SetInputsTypeAction = {
  ActionKind: ActionKind.SetInputsType,
  payload: { type: string | null }
}

type SetInputTypeAction = {
  ActionKind: ActionKind.SetInputType,
  payload: { type: any, inputName: string }
}

export type Action =
  SetTypeAction |
  SetNameAction |
  SetInputTypeAction |
  SetValueAction |
  SetInputsTypeAction

const reducer = (oldState: QueryBuilderState, action: Action): QueryBuilderState => {
  const state = { ...oldState }

  switch (action.ActionKind) {
    case ActionKind.SetOperationType: {
      if (action.payload.type !== state.operationType) {
        state.operationName = null
        state.inputs = {}
        state.inputsType = null
      }
      state.operationType = action.payload.type

      switch (action.payload.type) {
        case "Mutation":
          state.operationTypeInObject = "mutations"
          break
        case "Query":
          state.operationTypeInObject = "queries"
          break
        case "Subscription":
          state.operationTypeInObject = "subscriptions"
          break
      }
      break
    }
    case ActionKind.SetOperationName: {
      if (action.payload.name !== state.operationName) {
        state.inputs = {}
        state.inputsType = null
      }

      state.operationName = action.payload.name
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
    case ActionKind.SetInputsType: {
      if (state.inputsType != action.payload.type) state.inputs = {}
      state.inputsType = action.payload.type
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
    <div className={`flex flex-col overflow-hidden`} style={{ height: queryBuilderOpen ? "20rem" : "1.5rem" }}>
      <div
        className="flex justify-between mx-3 pb-1 items-center h-6 cursor-pointer"
        onClick={() => setQueryBuilderOpened(open => !open)}
      >
        <p className={"text-neutral-100	mx-1 font-semibold"}>Query builder</p>
        <button>
          {
            queryBuilderOpen ?
              <ChevronUpIcon width={18} height={18} className="rotate-180" /> :
              <ChevronUpIcon width={18} height={18} className="rotate-0" />
          }
        </button>
      </div>
      {queryBuilderOpen && types &&
        <div className="flex-1 bg-primary w-full overflow-y-auto pt-2 px-4 pb-5">
          <div className="pb-3">
            <p className="font-semibold">Operation</p>
            <div>
              {operations.map((op) =>
                <button
                  className="bg-secondary mx-2 px-2 shadow-lg"
                  style={{ color: state.operationType === op ? "white" : "gray" }}
                  key={op}
                  onClick={
                    () => dispatch({ ActionKind: ActionKind.SetOperationType, payload: { type: op } })
                  }
                >{op}</button>
              )}
            </div>
          </div>
          {state.operationTypeInObject &&
            <div>
              <p className="font-semibold">{state.operationType}</p>
              <div className="ml-1">
                {Object.keys(getOperationsFromType(types, state.operationTypeInObject)).map((opName, idx) =>
                  <button
                    key={idx}
                    className="bg-secondary mx-1 px-2 shadow-lg mb-1"
                    style={{ color: state.operationName === opName ? "white" : "gray" }}
                    onClick={() => dispatch({ ActionKind: ActionKind.SetOperationName, payload: { name: opName } })}
                  >
                    {opName}
                  </button>
                )}
              </div>
              {state.operationName && getOperationsFromType(types, state.operationTypeInObject) &&
                <div>
                  <div className="flex">
                    <p
                      className="font-semibold cursor-pointer"
                      onClick={() => dispatch({ ActionKind: ActionKind.SetInputsType, payload: { type: null } })}
                      style={{ color: state.inputsType === null ? "white" : "gray" }}
                    >{state.operationName} Inputs</p>
                    <div className="ml-1">
                      {getOperationInput(types, state.operationTypeInObject, state.operationName)?.rootTypes.map((rootType, idx) => (
                        <span
                          key={idx}
                          className="ml-1 text-zinc-400 text-sm cursor-pointer"
                          style={{ color: state.inputsType === rootType ? "white" : "gray" }}
                          onClick={() => dispatch({ ActionKind: ActionKind.SetInputsType, payload: { type: rootType } })}
                        >{rootType}</span>
                      ))}
                    </div>
                  </div>
                  {getOperationInput(types, state.operationTypeInObject, state.operationName)?.properties.length === 0 &&
                    <span className="text-zinc-500">No inputs</span>
                  }
                  {state.inputsType == null &&
                    getOperationInput(types, state.operationTypeInObject, state.operationName)?.properties.map(({ name, type }, idx) => {
                      if (type.length === 1 && !state.inputs[name]) dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName: name, type: type[0] } })

                      return <div key={idx} className="flex items-center my-1">
                        <p>{name}:</p>
                        {state.inputs[name] && !["null", "undefined"].includes(state.inputs[name].type) &&
                          <TypeInputs dispatch={dispatch} inputName={name} type={state.inputs[name].type} />
                        }
                        <span className="ml-2">
                          {type.map((t, i) => {
                            return <button
                              key={i}
                              onClick={() => dispatch({ ActionKind: ActionKind.SetInputType, payload: { inputName: name, type: t } })}
                              style={{ color: state.inputs[name]?.type == t ? "white" : "gray" }}
                              className="mr-2"
                            >
                              {t}
                            </button>
                          })}
                        </span>
                      </div>
                    })}
                </div>
              }
              <button
                className="bg-secondary px-2 shadow-lg mt-2"
                onClick={() => {
                  console.log(state);
                }}
              >Generate</button>
            </div>
          }
        </div>
      }
    </div>
  );
}

const getOperationsFromType = (types: GetTypesResponse, operationType: string): { [key: string]: InputType } =>
  ((types as any || {})[operationType]) || {}

const getOperationInput = (types: GetTypesResponse, operationType: string, operationName: string): InputType =>
  (((types as any || {})[operationType]) || {})[operationName]
