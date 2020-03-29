import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import jwt from "jsonwebtoken";

interface Props {
  [x: string]: any;
}
interface ParentCompProps {
  childComp?: React.ReactNode;
}
export const ProtectedRoute: FC<Props> = props => {
  const { Component } = props;
  const token = localStorage.getItem("token");

  const verifyToken = () => {
    if (token === null) {
      return false;
    }
    try {
      console.log(token);

      jwt.verify(token, "hohohju", { algorithms: ["HS512"] });
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  };

  const result = verifyToken();
  console.log(result);
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
