import {Action, Dispatch, Reducer} from "redux";
import {Person, Event} from "../../Types";
import * as ActionType from "../Actions/actionTypes";

export interface InitialState {
  person: Person;
  events: Array<Event>;
}

export const initialState: InitialState = {
  person: {} as Person,
  events: []
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
      return {...state, person: action.payload.person || {} as Person};

    case ActionType.UPDATE_EVENTS:
      return {...state, events: action.payload.events || []};

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
    this.dispatch({type: ActionType.UPDATE_PERSON, payload: {person}});

  updateEvents = (events: Array<Event>) =>
    this.dispatch({type: ActionType.UPDATE_EVENTS, payload: {events}});
}
