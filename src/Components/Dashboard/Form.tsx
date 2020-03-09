import DateFnsUtils from "@date-io/date-fns";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Snackbar,
  TextField,
  FormControl,
  Grid,
  List,
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from "@material-ui/core";
import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined";
import ScheduleIcon from "@material-ui/icons/Schedule";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
  TimePicker,
  DatePicker
} from "@material-ui/pickers";
import React, { ChangeEvent, FC, useEffect, useState, FormEvent } from "react";
import { useMutation } from "react-apollo";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Classes from "../../App.module.css";
import { CREATE_EVENT } from "../../Store/GQL";
import { InitialState } from "../../Store/Reducers/rootReducer";
import { EventInput, InvitationInput, Person } from "../../Types";
import { emailRegEx } from "../../Utility";
import { GuestList } from "./GuestList";
import SubjectIcon from "@material-ui/icons/Subject";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import ClearIcon from "@material-ui/icons/Clear";
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface Props {}

interface StateProps {
  host: Person;
}

export const Form: FC<Props> = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date_of_event, setDate_of_event] = useState<Date | null>(null);
  const [time_of_event, setTime_of_event] = useState<Date | null>(null);
  const [location, setLocation] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestList, setGuestList] = useState<Array<string>>([]);
  const [isGuestSubmitted, setIsGuestSubmitted] = useState<boolean>(false);
  const [displayEmailError, setDisplayEmailError] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "info" | "warning" | "error" | undefined
  >(undefined);

  const history = useHistory();
  const stateProps = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        host: { id: state.person.id }
      };
    }
  );

  const [createEvent] = useMutation(CREATE_EVENT, {
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

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const onDateChange = (date: Date | null) => {
    setDate_of_event(date);
  };

  const onTimeChange = (time: Date | null) => {
    setTime_of_event(time);
  };

  const onDesciptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const onLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const onGuestEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGuestEmail(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dateString = date_of_event
      ? date_of_event.toLocaleDateString("se-SV")
      : "";
    const timeString = time_of_event
      ? time_of_event.toLocaleTimeString().substring(0, 5)
      : "";

    const invitations: Array<InvitationInput> = [];

    guestList.forEach(email => {
      const invitation: InvitationInput = {
        guest: {
          email: email
        }
      };
      invitations.push(invitation);
    });

    const eventInput: EventInput = {
      host: { id: stateProps.host.id },
      title: title,
      description: description,
      date_of_event: dateString,
      time_of_event: timeString,
      location: location,
      invitations: invitations
    };
    createEvent({ variables: { eventInput } });
  };

  const addToGuestList = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsGuestSubmitted(true);
      const guests: Array<string> = guestList;

      if (guestEmail.match(emailRegEx)) {
        guests.push(guestEmail);
        setGuestEmail("");
        setGuestList(guests);
        setDisplayEmailError(false);
        setIsGuestSubmitted(false);
      }
    }
  };

  const changeDisplayEmailError = () => {
    if (isGuestSubmitted) {
      if (!guestEmail.match(emailRegEx)) {
        setDisplayEmailError(true);
      } else {
        setDisplayEmailError(false);
      }
    }
  };

  const renderGuestList = () => {
    return guestList.map((guest, index) => {
      return (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar>{guest.substring(0, 1).toUpperCase()}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={guest} />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              name={guest}
              onClick={() => removeGuest(guest)}
            >
              <ClearIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  };

  const removeGuest = (guest: string) => {
    setGuestList(guestList.filter(g => g !== guest));
  };

  useEffect(() => {
    if (!stateProps.host.id) {
      history.push("");
    }
    changeDisplayEmailError();
  });

  return (
    <div className={Classes.MainPaper}>
      <Card>
        {/* <form onSubmit={handleSubmit} noValidate> */}
        <CardContent>
          <TextField
            size="medium"
            required
            className={Classes.TextField}
            id="title"
            placeholder="Add Title"
            type="text"
            style={{ width: "100%" }}
            autoComplete="off"
            value={title}
            onChange={onTitleChange}
            inputProps={{ min: "1", max: "140" }}
          />

          <div style={{ display: "flex" }}>
            <SubjectIcon
              style={{ marginTop: "26px", marginRight: "14px", flexGrow: 0 }}
            />

            <TextField
              className={Classes.TextField}
              id="description"
              label="Description"
              multiline
              rowsMax="10"
              value={description}
              onChange={onDesciptionChange}
              variant="outlined"
              inputProps={{ max: "5000" }}
              style={{ flexGrow: 20 }}
            />
          </div>
          <div style={{ display: "flex" }}>
            <RoomOutlinedIcon
              style={{ marginTop: "26px", marginRight: "14px", flexGrow: 0 }}
            />
            <TextField
              className={Classes.TextField}
              required
              id="location"
              label="Location"
              style={{ flexGrow: 20 }}
              value={location}
              onChange={onLocationChange}
              variant="filled"
              inputProps={{ min: "1", max: "140" }}
            />
          </div>
          <div style={{ display: "flex" }}>
            <EventOutlinedIcon
              style={{ marginTop: "26px", marginRight: "14px", flexGrow: 0 }}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                autoOk
                variant="inline"
                label="Date"
                inputVariant="outlined"
                required
                margin="normal"
                id="date-picker-dialog"
                format="yyyy-MM-dd"
                value={date_of_event}
                onChange={onDateChange}
                style={{ flexGrow: 9.5 }}
                // KeyboardButtonProps={{
                //   "aria-label": "change date"
                // }}
              />
              <div style={{ flexGrow: 1 }}></div>
              <KeyboardTimePicker
                autoOk
                variant="inline"
                required
                inputVariant="outlined"
                margin="normal"
                placeholder="Time of event"
                id="time-picker"
                value={time_of_event}
                onChange={onTimeChange}
                ampm={false}
                keyboardIcon={<ScheduleIcon />}
                KeyboardButtonProps={{
                  "aria-label": "change time"
                }}
                style={{ flexGrow: 9.5 }}
              />
            </MuiPickersUtilsProvider>
          </div>

          <div style={{ display: "flex" }}>
            <PeopleAltOutlinedIcon
              style={{ marginTop: "26px", marginRight: "14px", flexGrow: 0 }}
            />
            <TextField
              className={Classes.TextField}
              id="addGuest"
              label="Add guest"
              style={{ flexGrow: 20 }}
              value={guestEmail}
              onKeyUp={addToGuestList}
              onChange={onGuestEmailChange}
              error={displayEmailError}
              helperText={displayEmailError ? "Not a valid email!" : ""}
              variant="filled"
            />
          </div>
          <List dense={true}>{renderGuestList()}</List>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            onClick={() => handleSubmit}
            style={{ marginLeft: "auto" }}
          >
            create event
          </Button>
        </CardActions>
        {/* </form> */}
      </Card>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {responseMessage}
        </Alert>
      </Snackbar>
      {/* <GuestList guestList={guestList} /> */}
    </div>
  );
};
