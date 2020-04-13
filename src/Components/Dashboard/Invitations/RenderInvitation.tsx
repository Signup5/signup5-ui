import {useMutation, useQuery} from "@apollo/react-hooks";
import {
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, {Dispatch, FC, SetStateAction, useState} from "react";
import {GET_EVENT_BY_ID, SET_ATTENDANCE} from "../../../Store/GQL";
import {Attendance, Event, Invitation, QueryResponse} from "../../../Types";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

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
    contentText: {
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
  removeInvitation: (invitation: Invitation) => void;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarMessage: Dispatch<SetStateAction<string>>;
  setSnackbarSeverity: Dispatch<
    SetStateAction<"success" | "info" | "warning" | "error" | undefined>
  >;
}

export const RenderInvitation: FC<Props> = props => {
  const classes = useStyles();
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance>(
    Attendance.NO_RESPONSE
  );

  const [setAttendance, { loading }] = useMutation(SET_ATTENDANCE, {
    onError(err) {
      props.setSnackbarMessage(err.message);
      props.setSnackbarSeverity("error");
      props.setSnackbarOpen(true);
    },
    onCompleted({ response }) {
      props.setSnackbarMessage(response.message);
      props.setSnackbarSeverity("success");
      props.setSnackbarOpen(true);
      if (selectedAttendance !== Attendance.MAYBE) {
        props.removeInvitation(props.invitation);
      }
    }
  });

  const setAttendanceHandler = (e: Attendance) => {
    setSelectedAttendance(e);
    setAttendance({
      variables: {
        attendance: Attendance[e],
        invitation_id: props.invitation.id
      }
    });
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
            {event.date_of_event} - {event.time_of_event.substring(0, 5)}
          </Typography>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.details}>
        <Typography className={classes.contentText}>
          {event.description}
          <br />
          <a href="#secondary-heading-and-columns" className={classes.link}>
            Read more
          </a>
          <br />
          <span className={classes.secondaryHeading}>{event.location}</span>
        </Typography>

      </ExpansionPanelDetails>
      <Divider />
      <ExpansionPanelActions>
        {loading ? <CircularProgress /> : ""}
        <Button
          size="small"
          color="primary"
          onClick={() => setAttendanceHandler(Attendance.ATTENDING)}
        >
          Yes
        </Button>
        <Button
          size="small"
          color="default"
          onClick={() => setAttendanceHandler(Attendance.MAYBE)}
        >
          Maybe
        </Button>
        <Button
          size="small"
          color="secondary"
          onClick={() => setAttendanceHandler(Attendance.NOT_ATTENDING)}
        >
          No
        </Button>
      </ExpansionPanelActions>
    </ExpansionPanel>
  );
};
