import {
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { Event, EventTypeFilter, Person } from "../../../Types";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import { EditableEvent } from "./EditableEvent";

import {
  InitialState,
  RootDispatcher,
} from "../../../Store/Reducers/rootReducer";
import { useMutation } from "react-apollo";
import { CANCEL_EVENT } from "../../../Store/GQL";
import { NonEditableEvent } from "./NonEditableEvent";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    speedDial: {
      position: "absolute",
      "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
      },
      "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
        top: theme.spacing(2),
        left: theme.spacing(2),
      },
    },
    heading: {
      fontWeight: "bold",
      fontSize: theme.typography.pxToRem(16),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    contentText: {
      fontSize: theme.typography.pxToRem(15),
    },
    icon: {
      verticalAlign: "bottom",
      height: 20,
      width: 20,
    },
    details: {
      alignItems: "center",
    },
    column: {
      flexBasis: "33.33%",
    },
    largeColumn: {
      flexBasis: "100%",
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  })
);

interface Props {
  event: Event;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarMessage: Dispatch<SetStateAction<string>>;
  setSnackbarSeverity: Dispatch<
    SetStateAction<"success" | "info" | "warning" | "error" | undefined>
  >;
  filter: EventTypeFilter;
}

interface StateProps {
  person: Person;
}

function render(filter: EventTypeFilter, eventType: string) {
  switch (eventType) {
    case "draft":
      return filter.draft;
    case "guest":
      return filter.guest;
    case "host":
      return filter.host;
    default:
      return true;
  }
}

export const RenderEvent: FC<Props> = (props) => {
  const [editable, setEditable] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const event: Event = props.event;
  const classes = useStyles();

  const stateProps = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        person: { ...state.person },
      };
    }
  );

  const eventType =
    event.host.email === stateProps.person.email
      ? event.isDraft
        ? "draft"
        : "host"
      : "guest";

  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);

  const [cancelEvent] = useMutation(CANCEL_EVENT, {
    variables: {
      event_id: props.event.id,
    },
    onError(err) {
      props.setSnackbarMessage("Something went wrong!");
      props.setSnackbarSeverity("error");
      props.setSnackbarOpen(true);
    },
    onCompleted({ response }) {
      props.setSnackbarMessage(response.message);
      props.setSnackbarSeverity("success");
      props.setSnackbarOpen(true);
      rootDispatcher.cancelEvent(props.event);
    },
  });

  const actions = [
    {
      icon: <EditOutlinedIcon />,
      name: "Edit event",
      click: () => setEditable(!editable),
    },
    {
      icon: <CancelOutlinedIcon color="secondary" />,
      name: "Cancel event",
      click: () => cancelEvent(),
    },
  ];

  const handleSpeedDialClose = () => {
    setOpen(false);
  };

  const handleSpeedDialOpen = () => {
    setOpen(true);
  };

  const menu = () => {
    return !editable && event.host.id === stateProps.person.id ? (
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClose={handleSpeedDialClose}
        onOpen={handleSpeedDialOpen}
        open={open}
        direction={"left"}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.click}
          />
        ))}
      </SpeedDial>
    ) : (
      <>
        <Divider />
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
    );
  };

  return (
    <>
      {render(props.filter, eventType) ? (
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
            {editable ? (
              <EditableEvent
                event={event}
                setEditable={setEditable}
                setSnackbarOpen={props.setSnackbarOpen}
                setSnackbarSeverity={props.setSnackbarSeverity}
                setSnackbarMessage={props.setSnackbarMessage}
              />
            ) : (
              <NonEditableEvent event={event} />
            )}
          </ExpansionPanelDetails>
          {menu()}
        </ExpansionPanel>
      ) : (
        ""
      )}
    </>
  );
};
