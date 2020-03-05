import { useQuery } from "@apollo/react-hooks";
import React, { Dispatch, FC, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { GET_PERSON_BY_EMAIL } from "../Store/GQL";
import { RootDispatcher } from "../Store/Reducers/rootReducer";
import { Person, QueryResponse } from "../Types";
import { useHistory } from "react-router-dom";

interface Props {
  email: String;
  password: String;
}

const ValidatePersonCredentials: FC<Props> = props => {
  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);

  const response: QueryResponse = useQuery(GET_PERSON_BY_EMAIL, {
    variables: {
      email: props.email
    }
  });

  if (response.loading) return <p>Loading...</p>;
  if (response.error) {
    return <p>Email and/or password did not match!</p>;
  }

  const person: Person = response.data.person;

  if (props.password.length >= 1) {
    rootDispatcher.updatePerson(person);
    // props.setValidCredentials(true);
  }
  return <div>{person.email}</div>;
};
export default ValidatePersonCredentials;
