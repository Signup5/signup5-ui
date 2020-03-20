import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Button,
  ButtonGroup,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  FormControlLabel,
  Snackbar,
  Typography,
  Divider,
  ExpansionPanelActions
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Alert from "@material-ui/lab/Alert";
import React, { FC, useState } from "react";
import { SET_ATTENDANCE } from "../../Store/GQL";
import { GET_EVENT_BY_ID } from "../../Store/GQL";
import { Attendance, Event, Invitation, QueryResponse } from "../../Types";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    heading: {
      fontWeight: "bold",
      fontSize: theme.typography.pxToRem(15)
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary
    },
    descriptionHeading: {
      fontSize: theme.typography.pxToRem(15)
    },
    icon: {
      verticalAlign: "bottom",
      height: 20,
      width: 20
    },
    details: {
      alignItems: "center"
    },
    column: {
      flexBasis: "33.33%"
    },
    largeColumn: {
      flexBasis: "66.67%"
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2)
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline"
      }
    }
  })
);

interface Props {
  invitation: Invitation;
}

export const RenderInvitation: FC<Props> = props => {
  const [open, setOpen] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "info" | "warning" | "error" | undefined
  >(undefined);

  const classes = useStyles();

  const [setAttendance] = useMutation(SET_ATTENDANCE, {
    onError(err) {
      setResponseMessage(err.message);
      setSeverity("error");
      setOpen(true);
    },
    onCompleted({ response }) {
      setResponseMessage(response.message);
      setSeverity("success");
      setOpen(true);
    }
  });

  const setAttendanceHandler = (e: Attendance) => {
    console.log(Attendance[e]);
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
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.largeColumn}>
            <Typography className={classes.heading}>{event.title}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>
              {event.date_of_event} - {event.time_of_event}
            </Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Typography className={classes.descriptionHeading}>
            {event.description}
            <br />
            <a href="#secondary-heading-and-columns" className={classes.link}>
              Read more
            </a>
            <p className={classes.secondaryHeading}>{event.location}</p>
          </Typography>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <Button size="small" color="primary" onClick={() => setAttendanceHandler(Attendance.ATTENDING)}>
            Yes
          </Button>
          <Button size="small" color="default" onClick={() => setAttendanceHandler(Attendance.MAYBE)}>
            Maybe
          </Button>
          <Button size="small" color="secondary"onClick={() => setAttendanceHandler(Attendance.NOT_ATTENDING)}>
            No
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {responseMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
