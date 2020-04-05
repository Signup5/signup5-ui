import React, {FC} from "react";
import {Redirect, Route} from "react-router-dom";
import jwt from "jsonwebtoken";

interface Props {
  [x: string]: any;
}

export const ProtectedRoute: FC<Props> = props => {
  const {Component} = props;
  const token = localStorage.getItem("token");

  const verifyToken = () => {
    if (token === null) {
      return false;
    }
    try {
      jwt.verify(token, "hohohju", {algorithms: ["HS512"]});
    } catch (error) {
      return false;
    }
    return true;
  };
  return (
    <Route
      render={props =>
        verifyToken() ?
          <Component/>
          :
          <Redirect
            to={{
              pathname: "/",
              state: {from: props.location}
            }}
          />
      }
    />
  );
};
