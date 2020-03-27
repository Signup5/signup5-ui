import {useQuery} from "@apollo/react-hooks";
import React, {FC, useEffect, useState} from "react";
import {Invitation, Person, QueryResponse} from "../../../Types";
import {RenderInvitation} from "./RenderInvitation";
import {InitialState} from "../../../Store/Reducers/rootReducer";
import {useSelector} from "react-redux";
import {GET_UPCOMING_UNREPLIED_INVITATIONS_BY_GUEST_ID} from "../../../Store/GQL";

interface Props {
}

interface StateProps {
  person: Person;
}

export const InvitationList: FC<Props> = () => {
  const [invitations, setInvitations] = useState<Array<Invitation>>([]);

  const removeInvitation = (invitation: Invitation) => {
    setInvitations(invitations.filter(i => i.id !== invitation.id))
  };

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

  useEffect(() => {
    if (!response.loading && response.data)
      setInvitations(response.data.invitations);
  }, [response.loading, response.data]);

  if (response.loading) return <p>Loading...</p>;
  if (response.error) {
    return <p>No invitations found.</p>;
  }

  const render = () => {
    return invitations.map((invitation:Invitation, index:number) => {
      return <RenderInvitation key={index} invitation={invitation} removeInvitation={removeInvitation}/>;
    });
  };

  return (
    <div style={{flexGrow: 6, marginLeft: "23px"}}>
      <h4>Your invitations</h4>
      {render()}
    </div>
  );
};