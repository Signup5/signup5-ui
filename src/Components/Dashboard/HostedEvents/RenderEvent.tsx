import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Snackbar,
  Typography,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  List,
  CardActions,
  Button
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Alert from "@material-ui/lab/Alert";
import React, { FC, useState } from "react";
import { Event, Invitation } from "../../../Types";
import Classes from "../../../App.module.css";
import EventOutlinedIcon from "@material-ui/icons/EventOutlined";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined";
import ScheduleIcon from "@material-ui/icons/Schedule";
import SubjectIcon from "@material-ui/icons/Subject";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import parse from "date-fns/parse";

interface Props {
  event: Event;
}

export const RenderEvent: FC<Props> = props => {
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<
    "success" | "info" | "warning" | "error" | undefined
  >(undefined);

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
    <>
      <ExpansionPanel>
        <ExpansionPanelSummary
          style={{
            backgroundColor: "rgba(0, 0, 0, .03)",
            borderBottom: "1px solid rgba(0, 0, 0, .125)"
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{event.title}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
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
                  style={{ width: "100%" }}
                  autoComplete="off"
                  value={event.title}
                  // error={isEventSubmitted && title.length === 0}
                  // helperText={
                  //   // isEventSubmitted && title.length === 0 ? "Required!" : ""
                  // }
                  // onChange={onTitleChange}
                  inputProps={{ minLength: "1", maxLength: "140" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {event.title.length}/140
                      </InputAdornment>
                    )
                  }}
                />

                <div style={{ display: "flex" }}>
                  <SubjectIcon
                    style={{
                      marginTop: "26px",
                      marginRight: "14px",
                      flexGrow: 0
                    }}
                  />

                  <TextField
                    className={Classes.TextField}
                    id="description"
                    label="Description"
                    multiline
                    rowsMax="10"
                    value={event.description}
                    // onChange={onDescriptionChange}
                    variant="outlined"
                    inputProps={{ maxLength: "5000" }}
                    style={{ flexGrow: 20 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {event.description.length}/5000
                        </InputAdornment>
                      )
                    }}
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <RoomOutlinedIcon
                    style={{
                      marginTop: "26px",
                      marginRight: "14px",
                      flexGrow: 0
                    }}
                  />
                  <TextField
                    className={Classes.TextField}
                    id="location"
                    label="Location"
                    style={{ flexGrow: 20 }}
                    value={event.location}
                    // onChange={onLocationChange}
                    variant="filled"
                  />
                </div>
                <div style={{ display: "flex" }}>
                  <EventOutlinedIcon
                    style={{
                      marginTop: "26px",
                      marginRight: "14px",
                      flexGrow: 0
                    }}
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
                      // maxDate={maxDate}
                      // error={isEventSubmitted && !date_of_event}
                      // helperText={
                      //   isEventSubmitted && !date_of_event ? "Required!" : ""
                      // }
                      maxDateMessage="Date is too far in the future."
                      // minDate={today}
                      minDateMessage="Date is in the past."
                    />
                    <div style={{ flexGrow: 1 }}></div>
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
                      // error={isEventSubmitted && !time_of_event}
                      // helperText={
                      //   isEventSubmitted && !time_of_event ? "Required!" : ""
                      // }
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
                    style={{
                      marginTop: "26px",
                      marginRight: "14px",
                      flexGrow: 0
                    }}
                  />
                  <TextField
                    className={Classes.TextField}
                    id="addGuest"
                    label="Add guest"
                    style={{ flexGrow: 20 }}
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
                </div>
                <div>
                  {/* <List
              dense={true}
              style={{
                maxHeight: "150px",
                overflowY: guestList.length >= 4 ? "scroll" : "hidden"
              }}
            >
              {renderGuestList()}
            </List> */}
                </div>
              </CardContent>
              <CardActions>
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  // onClick={handleSubmit}
                  style={{ marginLeft: "auto" }}
                >
                  save and notify guests
                </Button>
              </CardActions>
            </Card>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={severity}>
                {/* {responseMessage} */}
              </Alert>
            </Snackbar>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}></Alert>
      </Snackbar>
    </>
  );
};
