import {gql} from "apollo-boost";

export const CREATE_EVENT = gql`
  mutation($eventInput: EventInput!) {
    response: createEvent(input: $eventInput) {
      event_id: id
      message
    }
  }
`;
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
