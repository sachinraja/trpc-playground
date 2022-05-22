import { ChevronUpIcon } from '@heroicons/react/solid';
import { Resizable } from "re-resizable"
import { useAtom } from 'jotai';
import { useEffect, useReducer, useRef, useState } from 'preact/hooks';
import React from 'react';
import { GetTypesResponse, InputType } from '../../utils/playground-request';
import { queryBuilderOpened } from '../tab/store';
import TypeInputs from "./inputs";
import { Ref } from 'preact/src';
import { ArrayInput } from './arrayInputs';
import { ObjectInputs } from './objectInputs';

interface QueryBuilderProps {
  types: GetTypesResponse | null
}

let operations = ["Query", "Mutation", "Subscription"] as const

export interface QueryBuilderState {
  operationType: string | null,
  operationName: string | null,
  operationTypeInObject: string | null,
  inputs: { [key: string]: QueryBuilderInput },
  inputsType: string | null
}

export type QueryBuilderInput = { value: any, type: any }

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
  payload: { type: any, inputName: string, defaultValue?: any }
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
      state.inputs[action.payload.inputName] = { value: action.payload.defaultValue || -1, type: action.payload.type }

      break
    }
    case ActionKind.SetValue: {
      if (state.inputs[action.payload.inputName]) {
        state.inputs[action.payload.inputName].value = action.payload.value
      }
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
  const containerRef = useRef<HTMLDivElement>() as Ref<HTMLDivElement>
  const [generated, setGenerated] = useState<string | null>(null)


  useEffect(() => {
    if (state.operationType && state.operationName) setGenerated(generate())
    else setGenerated(null)
  }, [state])

  const generate = (): string | null => {
    if (state.operationType === null || state.operationName === null || state.operationTypeInObject === null || !types) return null
    let input = (types as any)[state.operationTypeInObject]?.[state.operationName]

    let inputs: string = "",
      output: string = "await ";
    if (state.inputsType === "null") inputs += ", null"
    else if (state.inputsType === null) {

      if (!input?.array) {
        let inputsObject: string[] = []

        for (let [name, { type, value }] of Object.entries(state.inputs)) {
          if (type === "undefined") continue
          if (type === "null") inputsObject.push(`${name}: null`)
          else {
            if (type === "string")
              inputsObject.push(`${name}: "${value}"`)
            else
              inputsObject.push(`${name}: ${value}`)
          }
        }

        inputs += `, { ${inputsObject.join(", ")} }`
      } else {
        if (state.inputs[state.operationName]) {
          let arrayItems: any[] = []
          Object.entries(state.inputs[state.operationName].value || {}).forEach(([_idx, val]) => {
            arrayItems.push(val)
          })

          inputs += `, [${arrayItems.join(", ")}]`
        }
      }
    }

    switch (state.operationType) {
      case "Mutation":
        output += "mutate"
        break
      case "Query":
        output += "query"
        break
    }

    output += `('${state.operationName}'${inputs})`
    return output;
  }

  return (
    <Resizable
      enable={{ top: true }}
      maxHeight={queryBuilderOpen ? "80%" : "1.5rem"}
      minHeight="24px"
      onResizeStart={() => setQueryBuilderOpened(true)}
      minWidth="100%"
    >
      <div className={`flex flex-col overflow-hidden h-full`}
        ref={containerRef}
      >
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
              <div className="pt-3">
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
                  <Inputs dispatch={dispatch} state={state} types={types} />
                }
                <div className="pt-4" >
                  <button
                    style={{
                      opacity: state.operationType === null || state.operationName === null ? "0.6" : "1",
                      pointerEvents: state.operationType === null || state.operationName === null ? "none" : "all"
                    }}
                    className="bg-secondary px-2 shadow-lg mt-2 font-semibold"
                  >Create</button>
                  <kbd className="bg-zinc-900 py-1 px-2 text-md shadow-lg">{generated}</kbd>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </Resizable>
  );
}

interface InputsProps {
  dispatch: (action: Action) => void,
  state: QueryBuilderState,
  types: GetTypesResponse
}

const Inputs: React.FC<InputsProps> = ({ dispatch, state, types }) => {
  let input = getOperationInput(types, state.operationTypeInObject!, state.operationName!),
    noInputs = input?.properties.length === 0 && !input.array

  return (
    <div className="pt-3">
      <div className="flex">
        <p
          className="font-semibold cursor-pointer"
          onClick={() => dispatch({ ActionKind: ActionKind.SetInputsType, payload: { type: null } })}
          style={{ color: state.inputsType === null ? "white" : "gray" }}
        >{state.operationName} Inputs</p>
        {input?.rootTypes.map((rootType, idx) => (
          <div className="ml-1">
            <span
              key={idx}
              className="ml-1 text-zinc-400 text-sm cursor-pointer"
              style={{ color: state.inputsType === rootType ? "white" : "gray" }}
              onClick={() => dispatch({ ActionKind: ActionKind.SetInputsType, payload: { type: rootType } })}
            >{rootType}</span>
          </div>
        ))}
      </div>
      {noInputs && <span className="text-zinc-500">No inputs</span>}
      {state.inputsType == null && !input?.array ? (
        <ObjectInputs input={input} dispatch={dispatch} state={state} />
      ) : (
        <ArrayInput input={input} dispatch={dispatch} state={state} />
      )}
    </div>
  )
}

const getOperationsFromType = (types: GetTypesResponse, operationType: string): { [key: string]: InputType } =>
  ((types as any || {})[operationType]) || {}

const getOperationInput = (types: GetTypesResponse, operationType: string, operationName: string): InputType =>
  getOperationsFromType(types, operationType)[operationName]
