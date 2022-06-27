export interface QueryBuilderState {
  operationType: string | null
  operationName: string | null
  operationTypeInObject: string | null
  inputs: QueryBuilderInput | null
  inputsType: string | null
}

export type QueryBuilderInput = { value: any; type: any }

export const defaultQueryBuilderState: QueryBuilderState = {
  operationType: null,
  operationName: null,
  operationTypeInObject: null,
  inputs: null,
  inputsType: null,
}

export enum ActionKind {
  SetOperationType = 'SET_OPERATION_TYPE',
  SetOperationName = 'SET_OPERATION_NAME',
  SetInputType = 'SET_INPUT_TYPE',
  SetValue = 'SET_VALUE',
  SetInputsType = 'SET_INPUTS_TYPE',
}

type SetTypeAction = {
  ActionKind: ActionKind.SetOperationType
  payload: { type: 'Query' | 'Mutation' | 'Subscription' }
}

type SetNameAction = {
  ActionKind: ActionKind.SetOperationName
  payload: { name: string }
}

type SetValueAction = {
  ActionKind: ActionKind.SetValue
  payload: { inputName: string; value: any }
}

type SetInputsTypeAction = {
  ActionKind: ActionKind.SetInputsType
  payload: { type: string | null }
}

type SetInputTypeAction = {
  ActionKind: ActionKind.SetInputType
  payload: { type: any; inputName: string; defaultValue?: any }
}

export type Action =
  | SetTypeAction
  | SetNameAction
  | SetInputTypeAction
  | SetValueAction
  | SetInputsTypeAction

export const reducer = (oldState: QueryBuilderState, action: Action): QueryBuilderState => {
  const state = { ...oldState }

  switch (action.ActionKind) {
    case ActionKind.SetOperationType: {
      if (action.payload.type !== state.operationType) {
        state.operationName = null
        state.inputs = null
        state.inputsType = null
      }
      state.operationType = action.payload.type

      switch (action.payload.type) {
        case 'Mutation':
          state.operationTypeInObject = 'mutations'
          break
        case 'Query':
          state.operationTypeInObject = 'queries'
          break
      }
      break
    }
    case ActionKind.SetOperationName: {
      if (action.payload.name !== state.operationName) {
        state.inputs = { value: null, type: null }
        state.inputsType = null
      }

      state.operationName = action.payload.name
      break
    }
  }

  return state
}
