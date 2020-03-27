import {useQuery} from "@apollo/react-hooks";
import React, {FC} from "react";
import {useDispatch, useSelector} from "react-redux";
import {GET_HOSTED_AND_INVITED_EVENTS_BY_PERSON_ID} from "../../../Store/GQL";
import {InitialState, RootDispatcher} from "../../../Store/Reducers/rootReducer";
import {Event, Person, QueryResponse} from "../../../Types";
import {RenderEvent} from "./RenderEvent";
import LinearProgress from '@material-ui/core/LinearProgress';
import {Grid} from "@material-ui/core";

interface Props {
}

interface StateProps {
  person: Person;
  events: Array<Event>
}

export const AllEvents: FC<Props> = () => {
  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);

  const {person, events} = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        person: state.person,
        events: state.events
      };
    }
  );

  const response: QueryResponse = useQuery(GET_HOSTED_AND_INVITED_EVENTS_BY_PERSON_ID, {
    variables: {
      id: person.id
    }, onCompleted() {
      rootDispatcher.updateEvents(response.data.events);
    }
  });

  if (response.loading) return  <LinearProgress />;
  if (response.error) {
    return <h3>No events found!</h3>;
  }

  const render = () => {
    return events.map((event, index) => {
      return <RenderEvent key={index} event={event} />;
    });
  };

  return (
    <Grid item xs={12}>
      <h3>Events</h3>
      {render()}
    </Grid>
  );
};
