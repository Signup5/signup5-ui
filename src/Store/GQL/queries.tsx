import { gql } from "apollo-boost";

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
