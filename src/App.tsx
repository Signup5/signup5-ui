import React, { FC, useState } from "react";
import { Route, Switch } from "react-router-dom";
import Classes from "./App.module.css";
import SignupLogo from "./Components/Icons/SignupLogo";
import LoginForm from "./Components/LoginForm";
import ResetPassword from "./Components/ResetPassword";
import PasswordLink from "./Components/PasswordLink";
import { CreateEventForm } from "./Components/Dashboard/CreateEvent";
import { Dashboard } from "./Components/Dashboard";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import { Button, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  root: {
    background: "#f08700",
    position: "absolute",
    right: "30px"
  }
});

const App: FC = () => {
  const [showLogoutButton, setShowLogoutButton] = useState<boolean>(false);
  const history = useHistory();
  const classes = useStyles();
  const logout = () => {
    localStorage.setItem("person", "");
    localStorage.setItem("token", "");
    setShowLogoutButton(false);
    history.push("/");
  };

  const logoutButton = () => {
    if (showLogoutButton) {
      return (
        <Button
          size="large"
          classes={{
            root: classes.root // class name, e.g. `classes-nesting-root-x`
          }}
          onClick={() => logout()}
        >
          Logout
        </Button>
      );
    }
  };
  return (
    <div className={Classes.App}>
      <div className={Classes.AppHeader}>
        <SignupLogo />
        {logoutButton()}
      </div>
      <div className={Classes.AppMainContent}>
        <Switch>
          <Route exact path="/">
            <LoginForm />
          </Route>
          <ProtectedRoute
            path="/dashboard"
            Component={Dashboard}
            setShowLogoutButton={setShowLogoutButton}
          />

          <ProtectedRoute
            path="/create_event"
            setShowLogoutButton={setShowLogoutButton}
            Component={CreateEventForm}
          />
          <Route
            path="/password/new/:token"
            render={props => <ResetPassword {...props} />}
          />
          <Route path="/password/forgot">
            <PasswordLink />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default App;
