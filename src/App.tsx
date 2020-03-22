import React, {FC} from "react";
import {useSelector} from "react-redux";
import {BrowserRouter, Route} from "react-router-dom";
import Classes from "./App.module.css";
import SignupLogo from "./Components/Icons/SignupLogo";
import LoginForm from "./Components/LoginForm";
import {InitialState} from "./Store/Reducers/rootReducer";
import {Person} from "./Types";
import {CreateEventForm} from "./Components/Dashboard/CreateEvent";
import {Dashboard} from "./Components/Dashboard";

interface StateProps {
  person: Person;
}

const App: FC = () => {
  useSelector<InitialState, StateProps>((state: InitialState) => {
    return {
      person: state.person
    };
  });

  return (
    <div className={Classes.App}>
      <div className={Classes.AppHeader}>
        <SignupLogo/>
      </div>
      {/*<div className={Classes.AppSidebar}/>*/}
      <div className={Classes.AppMainContent}>
        <BrowserRouter>
          <Route exact path="/">
            <LoginForm/>
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/create_event">
            <CreateEventForm/>
          </Route>
        </BrowserRouter>
      </div>

      <div className={Classes.AppFooter}/>
    </div>
  );
};

export default App;
