import {Action, ErrorActionTypes} from '@app/store/actions/error.action';

export interface ErrorState {
  error: any;
}

const initialState: ErrorState = {
  error: null,
};

export const errorReducer: ( state: ErrorState, action: Action ) => ErrorState = (
  state = initialState,
  action: Action,
) => {
  switch ( action.type ) {
    case ErrorActionTypes.ADD_ERRROR:
      return {
        ...state,
        error: action.payload,
      };
      break;
    case ErrorActionTypes.REMOVE_ERROR:
      return {
        ...state,
        error: null,
      };
      break;
    default:
      return  state;
  }
};


