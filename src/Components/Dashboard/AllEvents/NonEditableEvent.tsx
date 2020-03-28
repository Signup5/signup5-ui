import {Button, Grid, Typography, withStyles} from "@material-ui/core";
import React, {FC, useState} from "react";
import {Event} from "../../../Types";
import SubjectIcon from '@material-ui/icons/Subject';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined';
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Badge from '@material-ui/core/Badge';

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

export const NonEditableEvent: FC<Props> = props => {
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  const event: Event = props.event;
  const classes = useStyles();

  function invitationSummary(attendance: string) {
    return event.invitations.filter(i => {
      return i.attendance.toString() === attendance
    }).length
  }

  const descriptionArea = () => {
    return <>
      <Typography className={classes.contentText}>
        {showFullDescription ? event.description : event.description.substr(0, 400) + (event.description.length > 400 ? "..." : "")}
      </Typography>
      {event.description.length < 400 ? "" :
        <Button size="small"
                onClick={() => setShowFullDescription(!showFullDescription)}> {showFullDescription ? "Show less" : "Show more"}
        </Button>}
    </>
  };

  return (
    <Grid container spacing={3}>
      {/*description start*/}
      <Grid container item xs={12} spacing={3}>
        <Grid item>
          <SubjectIcon/>
        </Grid>
        <Grid item xs={11}>
          {descriptionArea()}
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
  )
};