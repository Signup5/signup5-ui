import * as actionTypes from "./actionTypes";
import {Person, Event} from "../../Types";

export const updatePerson = (person: Person) => {
  return {type: actionTypes.UPDATE_PERSON, payload: person};
};

export const updateEvent = (event: Event) => {
  return {type: actionTypes.UPDATE_EVENT, payload: event};
};

export const updateEvents = (events: Array<Event>) => {
  return {type: actionTypes.UPDATE_EVENTS, payload: events};
};
