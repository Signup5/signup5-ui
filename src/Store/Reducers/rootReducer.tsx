import {Action, Dispatch, Reducer} from "redux";
import {Event, Person} from "../../Types";
import * as ActionType from "../Actions/actionTypes";

export interface InitialState {
  person: Person;
  events: Array<Event>;
}

function getPersonFromLocalStorage<Person>() {
  return localStorage.getItem("person")? JSON.parse(localStorage.getItem("person") as string): {} as Person
}

export const initialState: InitialState = {
  person: getPersonFromLocalStorage(),
  events: []
};

export const emptyState: InitialState = {
  person: {} as Person,
  events: []
};

export interface DispatchAction extends Action {
  payload: any;
}

export const rootReducer: Reducer<InitialState, DispatchAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case ActionType.LOGIN:
      return {...state, person: action.payload.person || {} as Person};

    case ActionType.LOGOUT:
      return {...emptyState};

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
            return action.payload.event;
          return event
        })
      };

    case ActionType.CREATE_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload.event]
      };

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

  login = (person: Person) =>
    this.dispatch({type: ActionType.LOGIN, payload: {person}});

  logout = () =>
    this.dispatch({type: ActionType.LOGOUT, payload: {}});

  updateEvents = (events: Array<Event>) =>
    this.dispatch({type: ActionType.UPDATE_EVENTS, payload: {events}});

  updateEvent = (event: Event) =>
    this.dispatch({type: ActionType.UPDATE_EVENT, payload: {event}});

  createEvent = (event: Event) =>
    this.dispatch({type: ActionType.CREATE_EVENT, payload: {event}});

  cancelEvent = (event: Event) =>
    this.dispatch({type: ActionType.CANCEL_EVENT, payload: {event}});
}
