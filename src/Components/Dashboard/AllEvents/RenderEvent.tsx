import {
  Button,
  Divider,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Fab,
  Grid,
  Snackbar,
  Typography,
  withStyles
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Alert from "@material-ui/lab/Alert";
import React, {FC, useState} from "react";
import {Event, Person} from "../../../Types";
import SubjectIcon from '@material-ui/icons/Subject';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Badge from '@material-ui/core/Badge';
import {useSelector} from "react-redux";
import EditIcon from '@material-ui/icons/Edit';

import {InitialState} from "../../../Store/Reducers/rootReducer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%"
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
  const [open, setOpen] = useState<boolean>(false);
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  const [severity, setSeverity] = useState<"success" | "info" | "warning" | "error" | undefined>(undefined);

  const stateProps = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        person: {...state.person}
      };
    }
  );


  const classes = useStyles();


  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  function invitationSummary(attendance: string) {
    return event.invitations.filter(i => {
      if (i.attendance.toString() === attendance)
        return i;
    }).length

  }


  const event: Event = props.event;

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
              {event.date_of_event} - {event.time_of_event}
            </Typography>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <Grid container spacing={3}>
            {/*description start*/}
            <Grid container item xs={12} spacing={3}>
              <Grid item>
                <SubjectIcon/>
              </Grid>
              <Grid item xs={11}>
                <Typography className={classes.contentText}>
                  {showFullDescription ? event.description : event.description.substr(0, 10) + "..."}
                </Typography>
                <Button size="small"
                        onClick={() => setShowFullDescription(!showFullDescription)}> {showFullDescription ? "Show less" : "Show more"}
                </Button>
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
        </ExpansionPanelDetails>
        <Divider/>
        <ExpansionPanelActions>
          {event.host.id === stateProps.person.id ? <Fab color="primary" size="small" aria-label="edit">
              <EditIcon/>
            </Fab> :
            <>
              <Button size="small" color="primary">
                Yes
              </Button>
              <Button size="small" color="default">
                Maybe
              </Button>
              <Button size="small" color="secondary">
                No
              </Button>
            </>
          }
        </ExpansionPanelActions>
      </ExpansionPanel>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}></Alert>
      </Snackbar>
    </>
  );
};
