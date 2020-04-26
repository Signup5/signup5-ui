import DateFnsUtils from "@date-io/date-fns";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@material-ui/core";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined";
import ScheduleIcon from "@material-ui/icons/Schedule";
import SubjectIcon from "@material-ui/icons/Subject";
import MuiAlert, {AlertProps} from "@material-ui/lab/Alert";
import {KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider,} from "@material-ui/pickers";
import React, {ChangeEvent, FC, useState} from "react";
import {useMutation, useQuery} from "react-apollo";
import {useDispatch, useSelector} from "react-redux";
import Classes from "../../../App.module.css";
import {CREATE_EVENT, GET_ALL_PERSONS} from "../../../Store/GQL";
import {InitialState, RootDispatcher,} from "../../../Store/Reducers/rootReducer";
import {EventInput, GuestInput, InvitationInput, Person, QueryResponse,} from "../../../Types";
import {zonedTimeToUtc} from "date-fns-tz";
import {format} from "date-fns";
import {Autocomplete} from "@material-ui/lab";

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
  const [isEventSubmitted, setIsEventSubmitted] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(60);
  const [open, setOpen] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [severity, setSeverity] = useState<"success" | "info" | "warning" | "error" | undefined>(undefined);
  const [guestsToInvite, setGuestsToInvite] = useState<GuestInput[]>([]);
  const [userList, setUserList] = useState<GuestInput[]>([]);
  const [initialUserList, setInitialUserList] = useState<GuestInput[]>([]);
  const [userListDefaultValue, setUserListDefaultValue] = useState<GuestInput[]>([]);
  const [validTimeFormat, setValidTimeFormat] = useState<boolean>(true);
  const [dateIsInThePast, setDateIsInThePast] = useState<boolean>(false);
  const [dateIsInTheFuture, setDateIsInTheFuture] = useState<boolean>(false);

  const stateProps = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        host: {...state.person},
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
    },
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
    setDateIsInThePast(isDateInThePast(date));
    isValidDate(date) && !dateIsInThePast ? setDate_of_event(date) : setDate_of_event(null);
  };

  function isDateInThePast(date: Date | null) {
    const now = new Date();

    if (date instanceof Date && !isNaN(date.getDate())) {
      return !isNaN(date.getDate()) && (date < now);
    } else {
      return false;
    }
  }

  const onTimeChange = (time: Date | null) => {
    setValidTimeFormat(isValidTime(time_of_event))
    isValidTime(time) ? setTime_of_event(time) : setTime_of_event(null)
  };

  const onDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const onLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const onDurationChange = (e: ChangeEvent<{ value: unknown }>) => {
    setDuration(Number(e.target.value));
  };

  function updateGuestList(guests: any) {
    const addedGuests = guests.map((guest: any) => {
      return guest;
    });

    setGuestsToInvite(addedGuests);
    setUserListDefaultValue(addedGuests);
  }

  function isValidDate(date: Date | null) {
    if (date instanceof Date) {
      const now = new Date();
      return !isNaN(date.getDate()) && (date > now);
    } else {
      return false;
    }
  }

  function isValidTime(time: Date | null) {
    return time instanceof Date && !isNaN(time.getTime())
  }


  const handleSubmit = (isDraft: boolean) => {
    setIsEventSubmitted(true);
    if (title.length > 0 && date_of_event != null && isValidTime(time_of_event)) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const dateString = date_of_event
        ? format(zonedTimeToUtc(date_of_event, timezone), "yyyy-MM-dd")
        : "";
      const timeString = time_of_event
        ? format(zonedTimeToUtc(time_of_event, timezone), "HH:mm")
        : "";

      const invitations: Array<InvitationInput> = [];

      guestsToInvite.forEach((guest: GuestInput) => {
        const invitation: InvitationInput = {
          guest: {
            email: guest.email,
          },
        };
        invitations.push(invitation);
      });

      const eventInput: EventInput = {
        host: {
          ...stateProps.host,
        },
        title: title,
        description: description,
        date_of_event: dateString,
        time_of_event: timeString,
        duration: duration,
        location: location,
        invitations: invitations,
        isDraft: isDraft,
        isCanceled: false,
      };
      createEvent({variables: {eventInput}});
      setIsEventSubmitted(false);
      setGuestsToInvite([]);
      setTitle("");
      setDescription("");
      setDuration(60);
      setLocation("")
      setTime_of_event(null)
      setDate_of_event(null);
      setUserList(initialUserList)
      setUserListDefaultValue([]);
    }
  };

  const response: QueryResponse = useQuery(GET_ALL_PERSONS, {
    onCompleted() {
      const initialList = response.data.getAllPersons;
      setUserList(initialList);
      setInitialUserList(initialList);
    }
  });

  if (response.loading) return <p>Loading...</p>;

  const today = new Date();
  const maxDate = new Date().setFullYear(today.getFullYear() + 3);

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
              ),
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
                ),
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
              inputProps={{maxLength: "100"}}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {location.length}/100
                  </InputAdornment>
                ),
              }}
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
                style={{flexGrow: 8.5}}
                maxDate={maxDate}
                onChange={onDateChange}
                error={isEventSubmitted && !date_of_event}
                helperText={
                  isEventSubmitted && !date_of_event ? dateIsInThePast ? "Date can not be in the past!" : "A valid date is required" : ""
                }
                minDate={today}
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
                  isEventSubmitted && !time_of_event ? !validTimeFormat ? "Invalid time format!" : "Required!" : ""
                }
                ampm={false}
                keyboardIcon={<ScheduleIcon/>}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
                style={{flexGrow: 8.5}}
              />
              {/*spacer*/}
              <div style={{flexGrow: 1}}></div>
              <FormControl
                variant="outlined"
                style={{flexGrow: 1, marginTop: "16px"}}
              >
                <InputLabel id="demo-simple-select-outlined-label">
                  Duration
                </InputLabel>
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

            <Autocomplete
              multiple
              id="guestListDropdown"
              options={userList}
              getOptionLabel={(guest: GuestInput) =>
                guest.first_name +
                " " +
                guest.last_name +
                " (" +
                guest.email +
                ")"
              }
              value={userListDefaultValue}
              style={{flexGrow: 20}}
              filterSelectedOptions
              onChange={(event, value) => updateGuestList(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Add guests"
                  placeholder="Add new guest"
                />
              )}
            />
          </div>
        </CardContent>
        <CardActions>
          <Grid container item spacing={3} justify="flex-end">
            <Grid item>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                onClick={() => handleSubmit(true)}
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
                onClick={() => handleSubmit(false)}
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
