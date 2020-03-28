import DateFnsUtils from "@date-io/date-fns";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl, Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  MenuItem,
  Select,
  Snackbar,
  TextField
} from "@material-ui/core";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined";
import ScheduleIcon from "@material-ui/icons/Schedule";
import SubjectIcon from "@material-ui/icons/Subject";
import MuiAlert, {AlertProps} from "@material-ui/lab/Alert";
import {KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import React, {ChangeEvent, FC, useEffect, useState} from "react";
import {useMutation} from "react-apollo";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import Classes from "../../../App.module.css";
import {CREATE_EVENT} from "../../../Store/GQL";
import {InitialState, RootDispatcher} from "../../../Store/Reducers/rootReducer";
import {EventInput, InvitationInput, Person} from "../../../Types";
import {emailRegEx} from "../../../Utility";
import {RenderGuest} from "./RenderGuest";
import {zonedTimeToUtc} from "date-fns-tz"
import {format} from "date-fns";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface Props {
}

interface StateProps {
  host: Person;
}

export const CreateEventForm: FC<Props> = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date_of_event, setDate_of_event] = useState<Date | null>(null);
  const [time_of_event, setTime_of_event] = useState<Date | null>(null);
  const [location, setLocation] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestList, setGuestList] = useState<Array<string>>([]);
  const [isGuestSubmitted, setIsGuestSubmitted] = useState<boolean>(false);
  const [displayEmailError, setDisplayEmailError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [isEventSubmitted, setIsEventSubmitted] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(60);

  const [open, setOpen] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [severity, setSeverity] = useState<"success" | "info" | "warning" | "error" | undefined>(undefined);

  const history = useHistory();
  const stateProps = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        host: {...state.person}
      };
    }
  );

  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);

  const [createEvent] = useMutation(CREATE_EVENT, {
    onError(err) {
      setResponseMessage("Something went wrong!");
      setSeverity("error");
      setOpen(true);
    },
    onCompleted({event}) {
      setResponseMessage("Event successfully created!");
      setSeverity("success");
      setOpen(true);
      rootDispatcher.createEvent(event);
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

  const onDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const onLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const onGuestEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGuestEmail(e.target.value);
  };

  const onDurationChange = (e: ChangeEvent<{ value: unknown }>) => {
    setDuration(Number(e.target.value));
  };

  const handleSubmit = () => {
    setIsEventSubmitted(true);
    if (title.length > 0 && date_of_event != null && time_of_event != null) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const dateString = date_of_event
        ? format(zonedTimeToUtc(date_of_event, timezone), "yyyy-MM-dd")
        : "";
      const timeString = time_of_event
        ? format(zonedTimeToUtc(time_of_event, timezone), "HH:mm")
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
        host: {
          ...stateProps.host
        },
        title: title,
        description: description,
        date_of_event: dateString,
        time_of_event: timeString,
        duration: duration,
        location: location,
        invitations: invitations,
        isDraft: false
      };
      createEvent({variables: {eventInput}});
      setIsEventSubmitted(false);
    }
  };

  const addToGuestList = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsGuestSubmitted(true);
      const guests: Array<string> = guestList;

      const lowerCaseGuestList = guestList.map(email => {
        return email.toLowerCase();
      });

      if (guestEmail.match(emailRegEx)) {
        if (!lowerCaseGuestList.includes(guestEmail.toLowerCase())) {
          guests.push(guestEmail);
          setGuestEmail("");
          setGuestList(guests);
          setDisplayEmailError(false);
          setEmailError("");
          setIsGuestSubmitted(false);
        } else {
          setEmailError("Guest already invited");
          setDisplayEmailError(true);
          setIsGuestSubmitted(false);
        }
      }
    }
  };

  const changeDisplayEmailError = () => {
    if (isGuestSubmitted) {
      if (!guestEmail.match(emailRegEx)) {
        setDisplayEmailError(true);
        setEmailError("Invalid email");
      } else {
        setDisplayEmailError(false);
        setEmailError("");
      }
    }
  };

  const renderGuestList = () => {
    return guestList.map((guest, index) => {
      return (
        <RenderGuest
          guest={guest}
          removeGuest={removeGuest}
          key={index + guest}
        />
      );
    });
  };

  const removeGuest = (guest: string) => {
    setGuestList(guestList.filter(g => g !== guest));
  };

  const today = new Date();
  const maxDate = new Date().setFullYear(today.getFullYear() + 3);

  useEffect(() => {
    if (!stateProps.host.id) {
      history.push("");
    }
    changeDisplayEmailError();
  });

  return (
    <div className={Classes.MainPaper}>
      <Card className={Classes.Card}>
        <CardContent>
          <TextField
            size="medium"
            required
            className={Classes.TextField}
            id="title"
            placeholder="Add Title *"
            type="text"
            style={{width: "100%"}}
            autoComplete="off"
            value={title}
            error={isEventSubmitted && title.length === 0}
            helperText={
              isEventSubmitted && title.length === 0 ? "Required!" : ""
            }
            onChange={onTitleChange}
            inputProps={{minLength: "1", maxLength: "140"}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {title.length}/140
                </InputAdornment>
              )
            }}
          />

          <div style={{display: "flex"}}>
            <SubjectIcon
              style={{marginTop: "26px", marginRight: "14px", flexGrow: 0}}
            />

            <TextField
              className={Classes.TextField}
              id="description"
              label="Description"
              multiline
              rowsMax="10"
              value={description}
              onChange={onDescriptionChange}
              variant="outlined"
              inputProps={{maxLength: "5000"}}
              style={{flexGrow: 20}}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {description.length}/5000
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div style={{display: "flex"}}>
            <RoomOutlinedIcon
              style={{marginTop: "26px", marginRight: "14px", flexGrow: 0}}
            />
            <TextField
              className={Classes.TextField}
              id="location"
              label="Location"
              style={{flexGrow: 20}}
              value={location}
              onChange={onLocationChange}
              variant="filled"
            />
          </div>
          <div style={{display: "flex"}}>
            <EventOutlinedIcon
              style={{marginTop: "26px", marginRight: "14px", flexGrow: 0}}
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
                style={{flexGrow: 8.5}}
                maxDate={maxDate}
                error={isEventSubmitted && !date_of_event}
                helperText={
                  isEventSubmitted && !date_of_event ? "Required!" : ""
                }
                maxDateMessage="Date is too far in the future."
                minDate={today}
                minDateMessage="Date is in the past."
              />
              {/*spacer*/}
              <div style={{flexGrow: 1}}></div>

              <KeyboardTimePicker
                required
                autoOk
                variant="inline"
                label="Time"
                inputVariant="outlined"
                margin="normal"
                placeholder="Time of event"
                id="time-picker"
                value={time_of_event}
                onChange={onTimeChange}
                error={isEventSubmitted && !time_of_event}
                helperText={
                  isEventSubmitted && !time_of_event ? "Required!" : ""
                }
                ampm={false}
                keyboardIcon={<ScheduleIcon/>}
                KeyboardButtonProps={{
                  "aria-label": "change time"
                }}
                style={{flexGrow: 8.5}}
              />
              {/*spacer*/}
              <div style={{flexGrow: 1}}></div>
              <FormControl variant="outlined" style={{flexGrow: 1, marginTop: "16px"}}>
                <InputLabel id="demo-simple-select-outlined-label">Duration</InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={duration}
                  onChange={onDurationChange}
                  label="Duration"
                >

                  <MenuItem value={15}>15m</MenuItem>
                  <MenuItem value={30}>30m</MenuItem>
                  <MenuItem value={45}>45m</MenuItem>
                  <MenuItem value={60}>1h</MenuItem>
                  <MenuItem value={90}>1h30m</MenuItem>
                  <MenuItem value={120}>2h</MenuItem>
                </Select>
              </FormControl>
            </MuiPickersUtilsProvider>

          </div>


          <div style={{display: "flex"}}>
            <PeopleAltOutlinedIcon
              style={{marginTop: "26px", marginRight: "14px", flexGrow: 0}}
            />
            <TextField
              className={Classes.TextField}
              id="addGuest"
              label="Add guest"
              style={{flexGrow: 20}}
              value={guestEmail}
              onKeyUp={addToGuestList}
              onChange={onGuestEmailChange}
              error={displayEmailError}
              helperText={emailError}
              variant="filled"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {guestEmail.match(emailRegEx) ? (
                      <IconButton color="primary">
                        <KeyboardReturnIcon/>
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </InputAdornment>
                )
              }}
            />
          </div>
          <div>
            <List
              dense={true}
              style={{
                maxHeight: "150px",
                overflowY: guestList.length >= 4 ? "scroll" : "hidden"
              }}
            >
              {renderGuestList()}
            </List>
          </div>
        </CardContent>
        <CardActions>
          <Grid container item spacing={3} justify="flex-end">
            <Grid item>
              <Button
                color="primary"
                disabled
                variant="contained"
                type="submit"
                onClick={handleSubmit}
                style={{paddingRight: "12px"}}
              >
                save as draft
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                onClick={handleSubmit}
              >
                save and notify guests
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {responseMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
