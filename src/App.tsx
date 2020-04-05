import React, {FC} from "react";
import {Route, Switch} from "react-router-dom";
import Classes from "./App.module.css";
import {LoginForm, PasswordLink, ResetPassword} from "./Components/Auth";
import {CreateEventForm} from "./Components/Dashboard/CreateEvent";
import {Dashboard} from "./Components/Dashboard";
import {ProtectedRoute} from "./Components/ProtectedRoute";
import {Header} from "./Components/Header"

const App: FC = () => {
  return (
    <div className={Classes.App}>
      <div className={Classes.AppHeader}>
        <Header />
      </div>
      <div className={Classes.AppMainContent}>
        <Switch>
          <Route exact path="/">
            <LoginForm/>
          </Route>
          <ProtectedRoute
            path="/dashboard"
            Component={Dashboard}
          />
          <ProtectedRoute
            path="/create_event"
            Component={CreateEventForm}
          />
          <Route
            path="/password/new/:token"
            render={props => <ResetPassword {...props} />}
          />
          <Route path="/password/forgot">
            <PasswordLink/>
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default App;
