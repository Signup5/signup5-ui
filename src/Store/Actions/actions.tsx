import * as actionTypes from "./actionTypes";
import {Event, Person} from "../../Types";

export const login = (person: Person) => {
  return {type: actionTypes.LOGIN, payload: person};
};

export const logout = () => {
  return {type: actionTypes.LOGOUT, payload: {}};
};

export const updateEvent = (event: Event) => {
  return {type: actionTypes.UPDATE_EVENT, payload: event};
};

export const updateEvents = (events: Array<Event>) => {
  return {type: actionTypes.UPDATE_EVENTS, payload: events};
};

export const cancelEvent = (event: Event) => {
  return {type: actionTypes.CANCEL_EVENT, payload: event};
};

export const createEvent = (event: Event) => {
  return {type: actionTypes.CREATE_EVENT, payload: event};
};
