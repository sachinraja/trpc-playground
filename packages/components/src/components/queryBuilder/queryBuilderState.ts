export interface QueryBuilderState {
  operationType: string | null
  operationName: string | null
  operationTypeInObject: string | null
}

export const defaultQueryBuilderState: QueryBuilderState = {
  operationType: null,
  operationName: null,
  operationTypeInObject: null,
}

export enum ActionKind {
  SetOperationType = 'SET_OPERATION_TYPE',
  SetOperationName = 'SET_OPERATION_NAME',
}

type SetTypeAction = {
  ActionKind: ActionKind.SetOperationType
  payload: { type: 'Query' | 'Mutation' }
}

type SetNameAction = {
  ActionKind: ActionKind.SetOperationName
  payload: { name: string }
}

export type Action = SetTypeAction | SetNameAction

export const reducer = (oldState: QueryBuilderState, action: Action): QueryBuilderState => {
  const state = { ...oldState }

  switch (action.ActionKind) {
    case ActionKind.SetOperationType: {
      if (action.payload.type !== state.operationType) {
        state.operationName = null
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
      state.operationName = action.payload.name
      break
    }
  }

  return state
}
