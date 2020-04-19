import {gql} from "apollo-boost";

export const GET_ALL_PERSONS = gql`
query {
    getAllPersons {
        id
        email
        first_name
        last_name
    }
}
`;

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

export const GET_UPCOMING_UNREPLIED_INVITATIONS_BY_GUEST_ID = gql`
  query getUpcomingUnRepliedInvitationsByGuestId($id: Int!) {
    invitations: getUpcomingUnRepliedInvitationsByGuestId(id: $id) {
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
      duration
      location
      isDraft
    }
  }
`;

export const GET_HOSTED_AND_INVITED_EVENTS_BY_PERSON_ID = gql`
  query ($id: Int!) {
    events: getHostedAndInvitedEventsByPersonId(id: $id) {
      id
      host {
        id
        email
        first_name
        last_name
      }
      title
      description
      date_of_event
      time_of_event
      duration
      location
      isDraft
      invitations {
        id
        guest {
          id
          email
          first_name
          last_name
        }
        attendance
      }
    }
  }
`;

export const GET_EVENTS_BY_HOST_ID = gql`
  query getEventsByHostId($id: Int!) {
    events: getEventsByHostId(id: $id) {
      id
      host {
        id
        email
        first_name
        last_name
      }
      title
      description
      date_of_event
      time_of_event
      duration
      location
      isDraft
      invitations {
        id
        guest {
          id
          email
          first_name
          last_name
        }
        attendance
      }
    }
  }
`;