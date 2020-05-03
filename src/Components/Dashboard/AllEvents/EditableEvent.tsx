import {Button, FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField} from "@material-ui/core";
import React, {ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import {Event, GuestInput, InvitationInput, Person, QueryResponse, UpdateEventInput} from "../../../Types";
import Classes from "../../../App.module.css";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined";
import ScheduleIcon from "@material-ui/icons/Schedule";
import SubjectIcon from "@material-ui/icons/Subject";
import {KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {InitialState, RootDispatcher} from "../../../Store/Reducers/rootReducer";
import {useMutation, useQuery} from "react-apollo";
import {GET_ALL_PERSONS, UPDATE_EVENT} from "../../../Store/GQL";
import {zonedTimeToUtc} from "date-fns-tz";
import {format} from "date-fns";
import {Autocomplete} from "@material-ui/lab";

interface Props {
  event: Event;
  setEditable: Dispatch<SetStateAction<boolean>>;
  setSnackbarOpen: Dispatch<SetStateAction<boolean>>;
  setSnackbarMessage: Dispatch<SetStateAction<string>>;
  setSnackbarSeverity: Dispatch<SetStateAction<"success" | "info" | "warning" | "error" | undefined>>;
}

interface StateProps {
  host: Person
}

export const EditableEvent: FC<Props> = props => {
  const event: Event = props.event;
  const time = new Date();
  time.setHours(Number(event.time_of_event.substr(0, 2)),
    Number(event.time_of_event.substr(3, 2)),
    Number(event.time_of_event.substr(6, 2)));

  const [title, setTitle] = useState<string>(event.title);
  const [description, setDescription] = useState<string>(event.description);
  const [date_of_event, setDate_of_event] = useState<Date | null>(new Date(event.date_of_event));
  const [time_of_event, setTime_of_event] = useState<Date | null>(time);
  const [location, setLocation] = useState<string>(event.location);
  const [guestsToInvite, setGuestsToInvite] = useState<Array<GuestInput>>(event.invitations.map(e => {
    return e.guest
  }));
  const [userList, setUserList] = useState<GuestInput[]>([]);
  const [isEventSubmitted, setIsEventSubmitted] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(event.duration);

  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);

  const history = useHistory();
  const stateProps = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        host: {...state.person}
      };
    }
  );

  const response: QueryResponse = useQuery(GET_ALL_PERSONS, {
    onCompleted() {
      setUserList(response.data.getAllPersons);
    }
  });

  const [updateEvent] = useMutation(UPDATE_EVENT, {
    onError(err) {
      props.setSnackbarMessage("Something went wrong!");
      props.setSnackbarSeverity("error");
      props.setSnackbarOpen(true);
    },
    onCompleted({event}) {
      props.setSnackbarMessage("Event was successfully updated");
      props.setSnackbarSeverity("success");
      props.setSnackbarOpen(true);
      props.setEditable(false);
      rootDispatcher.updateEvent(event);
    }
  });

  function updateGuestList(guests: any) {
    setGuestsToInvite(guests.map((guest: any) => {
      return guest;
    }))
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

  const onDurationChange = (e: ChangeEvent<{ value: unknown }>) => {
    setDuration(Number(e.target.value));
  };

  const saveEvent = (isDraft: boolean) => {
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

      guestsToInvite.forEach(guest => {
        const invitation: InvitationInput = {
          guest
        };
        invitations.push(invitation);
      });

      const updateEventInput: UpdateEventInput = {
        id: event.id,
        host: {
          ...stateProps.host
        },
        title: title.trim(),
        description: description.trim(),
        date_of_event: dateString,
        time_of_event: timeString,
        duration: duration,
        location: location.trim(),
        invitations: invitations,
        isDraft: isDraft
      };

      updateEvent({variables: {updateEventInput}});
      setIsEventSubmitted(false);
    }
  };

  const today = new Date();
  const maxDate = new Date().setFullYear(today.getFullYear() + 3);

  useEffect(() => {
    if (!stateProps.host.id) {
      history.push("");
    }
  });


  return (
    <Grid container spacing={1}>
      {/*title row start*/}
      <Grid container item spacing={3}>
        <Grid item xs={true} style={{padding: "0 12px 0 14px"}}>
          <TextField
            size="medium"
            required
            className={Classes.TextField}
            id="title"
            placeholder="Add Title *"
            type="text"
            autoComplete="off"
            fullWidth={true}
            value={title}
            error={isEventSubmitted && title.length === 0}
            helperText={
              isEventSubmitted && title.length === 0 ? "Required!" : ""
            }
            onChange={onTitleChange}
            inputProps={{minLength: "1", maxLength: "140", style: {margin: "0px 20px"}}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {title.length}/140
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>
      {/*title row stop*/}

      {/*description row start*/}
      <Grid container item spacing={3}>
        <Grid item>
          <SubjectIcon
            style={{
              marginTop: "26px",
            }}
          />
        </Grid>
        <Grid item xs={true}>
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
            fullWidth={true}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {description.length}/5000
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>
      {/*description row end*/}

      {/*location row start*/}
      <Grid container item spacing={3}>
        <Grid item>
          <RoomOutlinedIcon
            style={{
              marginTop: "26px",
            }}
          />
        </Grid>
        <Grid item xs={true}>
          <TextField
            className={Classes.TextField}
            id="location"
            label="Location"
            value={location}
            fullWidth={true}
            onChange={onLocationChange}
            variant="filled"
          />
        </Grid>
      </Grid>
      {/*location row stop*/}

      {/*datetime row start*/}
      <Grid container item spacing={3}>
        <Grid item>
          <EventOutlinedIcon
            style={{
              marginTop: "26px",
            }}
          />
        </Grid>
        <Grid item xs={true}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container item spacing={3}>
              <Grid item xs={5}>
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
                  fullWidth={true}
                  maxDate={maxDate}
                  error={isEventSubmitted && !date_of_event}
                  helperText={
                    isEventSubmitted && !date_of_event ? "Required!" : ""
                  }
                  maxDateMessage="Date is too far in the future."
                  minDate={today}
                  minDateMessage="Date is in the past."
                />
              </Grid>
              <Grid item xs={5}>
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
                  fullWidth={true}
                  error={isEventSubmitted && !time_of_event}
                  helperText={
                    isEventSubmitted && !time_of_event ? "Required!" : ""
                  }
                  ampm={false}
                  keyboardIcon={<ScheduleIcon/>}
                  KeyboardButtonProps={{
                    "aria-label": "change time"
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <FormControl variant="outlined" style={{marginTop: "16px"}} fullWidth={true}>
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
              </Grid>
            </Grid>

          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
      {/*datetime row end*/}

      {/*guest row start*/}
      <Grid container item spacing={3}>
        <Grid item>
          <PeopleAltOutlinedIcon
            style={{
              marginTop: "26px"
            }}
          />
        </Grid>
        <Grid item xs={true}>

          <Autocomplete
            multiple
            id="guestListDropdown"
            options={userList}
            value={userList.filter((o1: GuestInput) => guestsToInvite.some((o2: GuestInput) => o1.email === o2.email))}
            getOptionLabel={(guest: GuestInput) => guest.first_name + " " + guest.last_name + " (" + guest.email + ")"}
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
        </Grid>

      </Grid>
      {/*guest row end*/}

      {/*button row start*/}
      <Grid container item spacing={3} justify="flex-end">
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            onClick={() => saveEvent(true)}
          >
            save
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            onClick={() => saveEvent(false)}
          >
            save and notify guests
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            onClick={() => props.setEditable(false)}
          >
            discard changes
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};