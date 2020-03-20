import {useQuery} from "@apollo/react-hooks";
import React, {FC, useState} from "react";
import {Invitation, Person, QueryResponse} from "../../Types";
import {RenderInvitation} from "./RenderInvitation";
import {InitialState} from "../../Store/Reducers/rootReducer";
import {useSelector} from "react-redux";
import {GET_UPCOMING_UNREPLIED_INVITATIONS_BY_GUEST_ID} from "../../Store/GQL";

interface Props {
}

interface StateProps {
  person: Person;
}

export const RenderInvitationList: FC<Props> = () => {
  // const [invitations, setInvitations] = useState<Array<Invitation>>([]);

  const stateProps = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        person: state.person
      };
    }
  );

  const response: QueryResponse = useQuery(GET_UPCOMING_UNREPLIED_INVITATIONS_BY_GUEST_ID, {
    variables: {
      id: stateProps.person.id
    },
  });

  if (response.loading) return <p>Loading...</p>;
  if (response.error) {
    return <p>No events found.</p>;
  }

  // setInvitations(response.data.invitations);
const invitations: Array<Invitation> = response.data.invitations;
  const render = () => {
    return invitations.map((invitation:Invitation, index:number) => {
      return <RenderInvitation key={index} invitation={invitation}/>;
    });
  };

  return (
    <div style={{flexGrow: 2}}>
      <h4>Your invitations</h4>
      {render()}
    </div>
  );
};