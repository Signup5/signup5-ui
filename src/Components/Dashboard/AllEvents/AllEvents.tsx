import { useQuery } from "@apollo/react-hooks";
import React, { FC } from "react";
import { useSelector } from "react-redux";
import { GET_HOSTED_AND_INVITED_EVENTS_BY_PERSON_ID } from "../../../Store/GQL";
import { InitialState } from "../../../Store/Reducers/rootReducer";
import { Event, Person, QueryResponse } from "../../../Types";
import { RenderEvent } from "./RenderEvent";
import LinearProgress from '@material-ui/core/LinearProgress';

interface Props {}

interface StateProps {
  person: Person;
}

export const AllEvents: FC<Props> = () => {
  const stateProps = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        person: state.person
      };
    }
  );

  const response: QueryResponse = useQuery(GET_HOSTED_AND_INVITED_EVENTS_BY_PERSON_ID, {
    variables: {
      id: stateProps.person.id
    }
  });

  if (response.loading) return  <LinearProgress />;
  if (response.error) {
    return <h3>No events found!</h3>;
  }
  const events: Array<Event> = response.data.events;

  const render = () => {
    return events.map((event, index) => {
      return <RenderEvent key={index} event={event} />;
    });
  };

  return (
    <div style={{flexGrow: 6}}>
      <h3>Events</h3>
      {render()}
    </div>
  );
};
