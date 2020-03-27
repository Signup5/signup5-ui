import {Action, Dispatch, Reducer} from "redux";
import {Event, Person} from "../../Types";
import * as ActionType from "../Actions/actionTypes";

export interface InitialState {
  person: Person;
  events: Array<Event>;
}

export const initialState: InitialState = {
  person: {} as Person,
  events: [],
};

export interface DispatchAction extends Action {
  payload: any;
}

export const rootReducer: Reducer<InitialState, DispatchAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case ActionType.UPDATE_PERSON:
      return {...state, person: action.payload.person || {} as Person};

    case ActionType.CANCEL_EVENT:
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload.event?.id)
      };

    case ActionType.UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map(event => {
          if (event.id === action.payload.event?.id)
            return action.payload.event
          return event
        })
      }

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

  updateEvent = (event: Event) => {
    this.dispatch({type: ActionType.UPDATE_EVENT, payload: {event}})
  }

  cancelEvent = (event: Event) => {
    this.dispatch({type: ActionType.CANCEL_EVENT, payload: {event}})
  }
}
