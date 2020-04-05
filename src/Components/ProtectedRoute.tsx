import React, { FC } from "react";
import { Route, Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";

interface Props {
  setShowLogoutButton: Function;
  [x: string]: any;
}
export const ProtectedRoute: FC<Props> = props => {
  const { Component } = props;
  const token = localStorage.getItem("token");

  const verifyToken = () => {
    if (token === null) {
      return false;
    }
    try {
      jwt.verify(token, "hohohju", { algorithms: ["HS512"] });
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  };

  const result = verifyToken();
  if (result) {
    props.setShowLogoutButton(true);
  }
  return (
    <Route
      render={props =>
        result ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};
