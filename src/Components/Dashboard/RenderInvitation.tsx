import {useMutation, useQuery} from "@apollo/react-hooks";
import {
  Button,
  ButtonGroup,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControlLabel,
  Snackbar,
  Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Alert from "@material-ui/lab/Alert";
import React, {FC, useState} from "react";
import {SET_ATTENDANCE} from "../../Store/GQL/mutations";
import {GET_EVENT_BY_ID} from "../../Store/GQL/queries";
import {Attendance, Event, Invitation, QueryResponse} from "../../Types";

interface Props {
  invitation: Invitation;
}

export const RenderInvitation: FC<Props> = props => {
  const [open, setOpen] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [severity, setSeverity] = useState<"success" | "info" | "warning" | "error" | undefined>(undefined);

  const [setAttendance] = useMutation(SET_ATTENDANCE, {
    onError(err) {
      setResponseMessage(err.message);
      setSeverity("error");
      setOpen(true);
    },
    onCompleted({response}) {
      setResponseMessage(response.message);
      setSeverity("success");
      setOpen(true);
    }
  });

  const setAttendanceHandler = (e: Attendance) => {
    setAttendance({
      variables: {
        attendance: Attendance[e],
        invitation_id: props.invitation.id
      }
    });
  };
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const response: QueryResponse = useQuery(GET_EVENT_BY_ID, {
    variables: {
      id: props.invitation.event_id
    }
  });

  if (response.loading) return <p>Loading...</p>;
  if (response.error) {
    return <p>ERROR</p>;
  }

  const event: Event = response.data.event;

  return (
    <>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{event.title}</Typography>
          <FormControlLabel
            aria-label="Acknowledge"
            onClick={event => event.stopPropagation()}
            onFocus={event => event.stopPropagation()}
            control={
              <ButtonGroup
                variant="text"
                color="primary"
                aria-label="text primary button group"
              >
                <Button
                  color="primary"
                  onClick={() => setAttendanceHandler(Attendance.ATTENDING)}
                >
                  Yes
                </Button>
                <Button
                  color="default"
                  onClick={() => setAttendanceHandler(Attendance.MAYBE)}
                >
                  Maybe
                </Button>
                <Button
                  color="secondary"
                  onClick={() => setAttendanceHandler(Attendance.NOT_ATTENDING)}
                >
                  No
                </Button>
              </ButtonGroup>
            }
            label=""
          />
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          description: {event.description} <br/>
          date: {event.date_of_event} <br/>
          time: {event.time_of_event} <br/>
          location: {event.location} <br/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {responseMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
