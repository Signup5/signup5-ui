import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import jwt from "jsonwebtoken";

export const ProtectedRoute: React.SFC<RouteProps> = ({
  component: Component,
  ...rest
}: {
  component: React.ComponentType<RouteProps>;
}) => {
  const token = localStorage.getItem("token");
  const verifyToken = () => {
    if (token === null) {
      return false;
    }
    try {
      jwt.verify(token, "hohohju");
    } catch (error) {
      return false;
    }
    return true;
  };
  const result = verifyToken();
  return (
    <Route
      {...rest}
      render={props =>
        result ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};
