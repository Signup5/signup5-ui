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
    response: updateEvent(input: $updateEventInput) {
      message
    }
  }
`;