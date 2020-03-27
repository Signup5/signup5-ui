import {gql} from "apollo-boost";

export const SET_ATTENDANCE = gql`
  mutation($attendance: Attendance!, $invitation_id: Int!) {
    response: setAttendance(
      attendance: $attendance
      invitation_id: $invitation_id
    ) {
      message
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation($eventInput: EventInput!) {
    response: createEvent(input: $eventInput) {
      message
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation($updateEventInput: UpdateEventInput!) {
    event: updateEvent(input: $updateEventInput) {
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
        guest {
          email
          first_name
          last_name
        }
        attendance
      }
    }
  }
`;

export const CANCEL_EVENT = gql`
  mutation($event_id: Int!) {
    response: cancelEvent(event_id: $event_id) {
      message
    }
  }
`;