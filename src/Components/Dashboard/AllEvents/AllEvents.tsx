import {useQuery} from "@apollo/react-hooks";
import React, {Dispatch, FC, SetStateAction, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GET_HOSTED_AND_INVITED_EVENTS_BY_PERSON_ID} from "../../../Store/GQL";
import {InitialState, RootDispatcher} from "../../../Store/Reducers/rootReducer";
import {Event, EventTypeFilter, Person, QueryResponse} from "../../../Types";
import {RenderEvent} from "./RenderEvent";
import LinearProgress from "@material-ui/core/LinearProgress";
import {Grid} from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';

interface Props {
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarMessage: Dispatch<SetStateAction<string>>;
  setSnackbarSeverity: Dispatch<
    SetStateAction<"success" | "info" | "warning" | "error" | undefined>
  >;
}

interface StateProps {
  person: Person;
  events: Array<Event>;
}

export const AllEvents: FC<Props> = props => {
  const [filter, setFilter] = useState<EventTypeFilter>({host: true, guest: true, draft: true});
  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);

  const { person, events } = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        person: state.person,
        events: state.events
      };
    }
  );

  const response: QueryResponse = useQuery(
    GET_HOSTED_AND_INVITED_EVENTS_BY_PERSON_ID,
    {
      variables: {
        id: person.id
      },
      onCompleted() {
        rootDispatcher.updateEvents(response.data.events);
      },
      fetchPolicy: "cache-and-network"
    }
  );

  if (response.loading) return <LinearProgress />;
  if (response.error) {
    return <h3>No events found!</h3>;
  }

  const render = () => {
    return events.map((event, index) => {

      return (
        <RenderEvent
          filter={filter}
          key={index}
          event={event}
          setSnackbarOpen={props.setSnackbarOpen}
          setSnackbarSeverity={props.setSnackbarSeverity}
          setSnackbarMessage={props.setSnackbarMessage}
        />
      );
    });
  };

  return (
    <Grid item xs={12}>
      Filter events by:
      <Checkbox
        defaultChecked
        onChange={() => setFilter({...filter, host: !filter.host})}
        color="primary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      Host

      <Checkbox
        defaultChecked
        onChange={() => setFilter({...filter, guest: !filter.guest})}
        color="default"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      Guest

      <Checkbox
        defaultChecked
        onChange={() => setFilter({...filter, draft: !filter.draft})}
        color="secondary"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
      Draft

      <h3>Events</h3>
      {render()}
    </Grid>
  );
};
