import {gql} from "apollo-boost";

export const GET_PERSON_BY_EMAIL = gql`
  query getPersonByEmail($email: String!) {
    person: getPersonByEmail(email: $email) {
      id
      first_name
      last_name
      email
    }
  }
`;

export const GET_INVITATIONS_BY_GUEST_ID = gql`
  query getInvitationsByGuestId($id: Int!) {
    invitations: getInvitationsByGuestId(id: $id) {
      id
      event_id
      attendance
    }
  }
`;

export const GET_EVENT_BY_ID = gql`
  query getEventById($id: Int!) {
    event: getEventById(id: $id) {
      host {
        email
        first_name
        last_name
      }
      title
      description
      date_of_event
      time_of_event
    }
  }
`;
