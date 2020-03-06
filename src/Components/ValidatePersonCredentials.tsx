import { useQuery } from "@apollo/react-hooks";
import React, { FC } from "react";
import { useDispatch } from "react-redux";
import { GET_PERSON_BY_EMAIL } from "../Store/GQL";
import { RootDispatcher } from "../Store/Reducers/rootReducer";
import { Person, QueryResponse } from "../Types";
import { useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

interface Props {
  email: String;
  password: String;
}

const ValidatePersonCredentials: FC<Props> = props => {
  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);
  const history = useHistory();

  const response: QueryResponse = useQuery(GET_PERSON_BY_EMAIL, {
    variables: {
      email: props.email
    }
  });

  if (response.loading) return <CircularProgress />;
  if (response.error) {
    return <p>Email and/or password did not match!</p>;
  }

  const person: Person = response.data.person;

  rootDispatcher.updatePerson(person);

  history.push("/dashboard");

  return <div>{person.email}</div>;
};
export default ValidatePersonCredentials;
