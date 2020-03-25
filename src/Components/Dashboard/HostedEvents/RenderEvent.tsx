import {Button, Grid, InputAdornment, Snackbar, TextField} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import React, {FC, useState} from "react";
import {Event} from "../../../Types";
import Classes from "../../../App.module.css";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined";
import ScheduleIcon from "@material-ui/icons/Schedule";
import SubjectIcon from "@material-ui/icons/Subject";
import {KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import parse from "date-fns/parse";

interface Props {
  event: Event;
}

export const RenderEvent: FC<Props> = props => {
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<"success" | "info" | "warning" | "error" | undefined>(undefined);

  const initTime = parse(props.event.time_of_event, "HH:mm:ss", new Date());
  const [date_of_event, setDate_of_event] = useState<Date | null>(new Date(props.event.date_of_event));
  const [time_of_event, setTime_of_event] = useState<Date | null>(new Date(initTime));


  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onDateChange = (date: Date | null) => {
    setDate_of_event(date);
  };

  const onTimeChange = (time: Date | null) => {
    setTime_of_event(time);
  };

  const event: Event = props.event;

  return (
    <Grid container spacing={1}>
      {/*title row start*/}
      <Grid container item spacing={3}>
        <Grid xs={true} style={{padding: "0 12px 0 14px"}}>
          <TextField
            size="medium"
            required
            className={Classes.TextField}
            id="title"
            placeholder="Add Title *"
            type="text"
            autoComplete="off"
            fullWidth={true}
            value={event.title}
            // error={isEventSubmitted && title.length === 0}
            // helperText={
            //   // isEventSubmitted && title.length === 0 ? "Required!" : ""
            // }
            // onChange={onTitleChange}
            inputProps={{minLength: "1", maxLength: "140", style: {margin: "0px 20px"}}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {event.title.length}/140
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
            value={event.description}
            // onChange={onDescriptionChange}
            variant="outlined"
            inputProps={{maxLength: "5000"}}
            fullWidth={true}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {event.description.length}/5000
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
            value={event.location}
            fullWidth={true}
            // onChange={onLocationChange}
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
              <Grid item xs={6}>
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
                  // maxDate={maxDate}
                  // error={isEventSubmitted && !date_of_event}
                  // helperText={
                  //   isEventSubmitted && !date_of_event ? "Required!" : ""
                  // }
                  maxDateMessage="Date is too far in the future."
                  // minDate={today}
                  minDateMessage="Date is in the past."
                />
              </Grid>
              <Grid item xs={6}>
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
                  // error={isEventSubmitted && !time_of_event}
                  // helperText={
                  //   isEventSubmitted && !time_of_event ? "Required!" : ""
                  // }
                  ampm={false}
                  keyboardIcon={<ScheduleIcon/>}
                  KeyboardButtonProps={{
                    "aria-label": "change time"
                  }}
                />
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
          <TextField
            className={Classes.TextField}
            id="addGuest"
            label="Add guest"
            fullWidth={true}
            // value={guestEmail}
            // onKeyUp={addToGuestList}
            // onChange={onGuestEmailChange}
            // error={displayEmailError}
            // helperText={emailError}
            variant="filled"
            // InputProps={{
            //   endAdornment: (
            //     <InputAdornment position="end">
            //       {guestEmail.match(emailRegEx) ? (
            //         <IconButton color="primary">
            //           <KeyboardReturnIcon/>
            //         </IconButton>
            //       ) : (
            //         ""
            //       )}
            //     </InputAdornment>
            //   )
            // }}
          />
        </Grid>
      </Grid>
      {/*guest row end*/}

      {/* <List
              dense={true}
              style={{
                maxHeight: "150px",
                overflowY: guestList.length >= 4 ? "scroll" : "hidden"
              }}
            >
              {renderGuestList()}
            </List> */}

      {/*button row start*/}
      <Grid container item spacing={3} justify="flex-end">
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={true}
            // onClick={handleSubmit}
          >
            save draft
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={true}
            // onClick={handleSubmit}
          >
            save and notify guests
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={true}
            // onClick={handleSubmit}
          >
            discard changes
          </Button>
        </Grid>
      </Grid>

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {/* {responseMessage} */}
        </Alert>
      </Snackbar>
    </Grid>


  );
};
