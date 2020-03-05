import { Action, Reducer, Dispatch } from "redux";
import { Person } from "../../Types";
import * as ActionType from "../Actions/actionTypes";

export interface InitialState {
  person: Person;
}

export const initialState: InitialState = {
  person: {} as Person
};

export interface DispatchAction extends Action {
  payload: Partial<InitialState>;
}

export const rootReducer: Reducer<InitialState, DispatchAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case ActionType.UPDATE_PERSON:
      return { ...state, person: action.payload.person || ({} as Person) };

    default:
      return state;
  }
};

export class RootDispatcher {
  private readonly dispatch: Dispatch<DispatchAction>;

  constructor(dispatch: Dispatch<DispatchAction>) {
    this.dispatch = dispatch;
  }

  updatePerson = (person: Person) =>
    this.dispatch({ type: ActionType.UPDATE_PERSON, payload: { person } });
}
