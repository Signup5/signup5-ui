import {
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
  withStyles
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Alert from "@material-ui/lab/Alert";
import React, {Dispatch, FC, SetStateAction, useState} from "react";
import {Event, Person} from "../../../Types";
import SubjectIcon from '@material-ui/icons/Subject';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Badge from '@material-ui/core/Badge';
import {useDispatch, useSelector} from "react-redux";
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import {EditableEvent} from "./EditableEvent"

import {InitialState, RootDispatcher, rootReducer} from "../../../Store/Reducers/rootReducer";
import Classes from "../../../App.module.css";
import {useMutation} from "react-apollo";
import {CANCEL_EVENT, UPDATE_EVENT} from "../../../Store/GQL";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
    },
    speedDial: {
      position: 'absolute',
      '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
      },
      '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
        top: theme.spacing(2),
        left: theme.spacing(2),
      },
    },
    heading: {
      fontWeight: "bold",
      fontSize: theme.typography.pxToRem(16)
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
      flexBasis: "100%"
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

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: -4,
      top: 8,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }),
)(Badge);

interface Props {
  event: Event;
}

interface StateProps {
  person: Person;
}

export const RenderEvent: FC<Props> = props => {
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  const [severity, setSeverity] = useState<"success" | "info" | "warning" | "error" | undefined>(undefined);
  const [editable, setEditable] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string>("");

  const stateProps = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        person: {...state.person}
      };
    }
  );

  const [cancelEvent] = useMutation(CANCEL_EVENT, {
    variables: {
      event_id: props.event.id
    },
    onError(err) {
      setResponseMessage("Something went wrong!");
      setSeverity("error");
      setOpen(true);
    },
    onCompleted({response}) {
      console.log(response)
      setResponseMessage(response.message);
      setSeverity("success");
      setOpen(true);
      rootDispatcher.cancelEvent(props.event);
    }
  });

  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);

  const actions = [
    {icon: <EditOutlinedIcon/>, name: 'Edit event', click: () => setEditable(!editable)},
    {icon: <PersonAddOutlinedIcon/>, name: 'Add guest(s)', click: () => alert("Under construction")},
    {
      icon: <CancelOutlinedIcon color="secondary"/>,
      name: 'Cancel event',
      click: () => cancelEvent()
    }
  ];

  const hostMenu = () => {
    return !editable && event.host.id === stateProps.person.id ?
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        icon={<SpeedDialIcon/>}
        onClose={handleSpeedDialClose}
        onOpen={handleSpeedDialOpen}
        open={open}
        direction={"left"}
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.click}
          />
        ))}
      </SpeedDial> : ""
  };

  const guestMenu = () => {
    return event.host.id !== stateProps.person.id ?
      <>
        <Divider/>
        <ExpansionPanelActions>
          <Button disabled size="small" color="primary">
            Yes
          </Button>
          <Button disabled size="small" color="default">
            Maybe
          </Button>
          <Button disabled size="small" color="secondary">
            No
          </Button>
        </ExpansionPanelActions>
      </>
      :
      <></>
  };

  const classes = useStyles();

  const handleSnackbarClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  function invitationSummary(attendance: string) {
    return event.invitations.filter(i => {
      return i.attendance.toString() === attendance
    }).length
  }

  const event: Event = props.event;

  const handleSpeedDialClose = () => {
    setOpen(false);
  };

  const handleSpeedDialOpen = () => {
    setOpen(true);
  };

  const displayedEvent = () => {
    return <Grid container spacing={3}>
      {/*description start*/}
      <Grid container item xs={12} spacing={3}>
        <Grid item>
          <SubjectIcon/>
        </Grid>
        <Grid item xs={11}>
          {editable ? <TextField
            className={Classes.TextField}
            id="description"
            label="Description"
            multiline
            rowsMax="10"
            variant="outlined"
            inputProps={{maxLength: "5000"}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  5/50
                </InputAdornment>
              )
            }}
          /> : <Typography className={classes.contentText}>
            {showFullDescription ? event.description : event.description.substr(0, 400) + (event.description.length > 400 ? "..." : "")}
          </Typography>}
          {event.description.length < 400 ? "" :
            <Button size="small"
                    onClick={() => setShowFullDescription(!showFullDescription)}> {showFullDescription ? "Show less" : "Show more"}
            </Button>}

        </Grid>
      </Grid>
      {/*description end*/}

      {/*location start*/}
      <Grid container item xs={12} spacing={3}>
        <Grid item>
          <LocationOnOutlinedIcon/>
        </Grid>
        <Grid item xs={11}>
          <Typography className={classes.contentText}>
            {event.location}
          </Typography>

        </Grid>
      </Grid>
      {/*location end*/}

      {/**invitation summary start*/}
      <Grid container item xs={12} spacing={3}>
        <Grid item>
          <PeopleAltOutlinedIcon/>
        </Grid>
        <Grid item xs={11}>
          <Typography className={classes.contentText}>
            <StyledBadge badgeContent={invitationSummary("ATTENDING")} color="primary"
                         style={{marginLeft: "18px"}}>
              <Button size="small">
                Attending
              </Button>
            </StyledBadge>
            <StyledBadge badgeContent={invitationSummary("MAYBE")} color="primary" style={{marginLeft: "18px"}}>
              <Button size="small">
                Maybe
              </Button>
            </StyledBadge>
            <StyledBadge badgeContent={invitationSummary("NOT_ATTENDING")} color="primary"
                         style={{marginLeft: "18px"}}>
              <Button size="small">
                Not Attending
              </Button>
            </StyledBadge>
            <StyledBadge badgeContent={invitationSummary("NO_RESPONSE")} color="secondary"
                         style={{marginLeft: "18px"}}>
              <Button size="small">
                No Response
              </Button>
            </StyledBadge>
          </Typography>

        </Grid>
      </Grid>
      {/**invitation summary end*/}

    </Grid>
  };

  return (
    <>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon/>}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.largeColumn}>
            <Typography className={classes.heading}>{event.title}</Typography>
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading}>
              {event.date_of_event} - {event.time_of_event.substring(0,5)}
            </Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          {editable ? <EditableEvent event={event} setEditable={setEditable}/> : displayedEvent()}
        </ExpansionPanelDetails>
        {hostMenu()}
        {guestMenu()}

      </ExpansionPanel>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={severity}></Alert>
      </Snackbar>
    </>
  )
}