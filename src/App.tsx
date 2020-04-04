import React, { FC, useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, useHistory, Switch } from "react-router-dom";
import Classes from "./App.module.css";
import SignupLogo from "./Components/Icons/SignupLogo";
import LoginForm from "./Components/LoginForm";
import ResetPassword from "./Components/ResetPassword";
import PasswordLink from "./Components/PasswordLink";
import { InitialState } from "./Store/Reducers/rootReducer";
import { Person } from "./Types";
import { CreateEventForm } from "./Components/Dashboard/CreateEvent";
import { Dashboard } from "./Components/Dashboard";
import { ProtectedRoute } from "./Components/ProtectedRoute";

interface StateProps {
  person: Person;
}

const App: FC = () => {
  // const { person } = useSelector<InitialState, StateProps>(
  //   (state: InitialState) => {
  //     return {
  //       person: state.person
  //     };
  //   }
  // );
  //
  // const history = useHistory();

  return (
    <div className={Classes.App}>
      <div className={Classes.AppHeader}>
        <SignupLogo />
      </div>
      <div className={Classes.AppMainContent}>
        <Switch>
          <Route exact path="/">
            <LoginForm />
          </Route>
          <ProtectedRoute path="/dashboard" Component={Dashboard} />
          <ProtectedRoute path="/create_event" Component={CreateEventForm} />
          <Route
            path="/password/new/:token"
            render={props => <ResetPassword {...props} />}
          />
          <Route path="/password/forgot">
            <PasswordLink />
          </Route>
          <ProtectedRoute path="/test" component={Dashboard} />
        </Switch>
      </div>
    </div>
  );
};

export default App;
