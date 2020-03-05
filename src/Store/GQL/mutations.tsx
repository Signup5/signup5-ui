import { gql } from "apollo-boost";

export const CREATE_EVENT = gql`
  mutation($eventInput: EventInput!) {
    response: createEvent(input: $eventInput) {
      event_id: id
      message
    }
  }
`;