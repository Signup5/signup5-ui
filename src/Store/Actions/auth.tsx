import * as actionTypes from "./actionTypes";

type Person = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export const updatePerson = (person: Person) => {
  return { type: actionTypes.UPDATE_PERSON, payload: person };
};


