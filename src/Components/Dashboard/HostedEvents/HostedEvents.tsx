import {useQuery} from "@apollo/react-hooks";
import React, {FC} from "react";
import {useSelector} from "react-redux";
import {GET_EVENTS_BY_HOST_ID} from "../../../Store/GQL";
import {InitialState} from "../../../Store/Reducers/rootReducer";
import {Event, Person, QueryResponse} from "../../../Types";
import {RenderEvent} from "./RenderEvent";

interface Props {}

interface StateProps {
  person: Person;
}

export const HostedEvents: FC<Props> = () => {
  const stateProps = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        person: state.person
      };
    }
  );

  const response: QueryResponse = useQuery(GET_EVENTS_BY_HOST_ID, {
    variables: {
      id: stateProps.person.id
    }
  });

  if (response.loading) return <p>Loading...</p>;
  if (response.error) {
    return <p>No events found!</p>;
  }

  const events: Array<Event> = response.data.events;

  console.log(stateProps.person);

  const render = () => {
    return events.map((event, index) => {return ""      // return <RenderEvent key={index} event={event} />;
    });
  };

  return (
    <div>
      <ul style={{ margin: "0px", padding: "0px" }}>{render()}</ul>
    </div>
  );
};
