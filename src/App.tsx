import React, {FC, useEffect} from "react";
import {useSelector} from "react-redux";
import {Route, useHistory} from "react-router-dom";
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
  const {person} = useSelector<InitialState, StateProps>((state: InitialState) => {
    return {
      person: state.person
    };
  });

  const history = useHistory();

  useEffect(() => {
    if (!person.id) history.push("")

  },[person, history]);

  return (
    <div className={Classes.App}>
      <div className={Classes.AppHeader}>
        <SignupLogo/>
      </div>
      <div className={Classes.AppMainContent}>
          <Route exact path="/">
            <LoginForm/>
          </Route>
          <Route path="/dashboard">
            <Dashboard/>
          </Route>
          <Route path="/create_event">
            <CreateEventForm/>
          </Route>
      </div>
    </div>
  );
};

export default App;