import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  InputAdornment,
  Snackbar,
  TextField,
} from "@material-ui/core";
import RoomOutlinedIcon from "@material-ui/icons/RoomOutlined";
import SubjectIcon from "@material-ui/icons/Subject";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React, { ChangeEvent, FC, useState } from "react";
import { useMutation } from "react-apollo";
import { useDispatch, useSelector } from "react-redux";
import Classes from "../../../App.module.css";
import LockIcon from "@material-ui/icons/Lock";
import { CREATE_PERSON } from "../../../Store/GQL";
import {
  InitialState,
  RootDispatcher,
} from "../../../Store/Reducers/rootReducer";
import {
  EventInput,
  InvitationInput,
  Person,
  PersonInput,
} from "../../../Types";
import { emailRegEx } from "../../../Utility";
import { zonedTimeToUtc } from "date-fns-tz";
import { format } from "date-fns";
import PersonIcon from "@material-ui/icons/Person";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface Props {}

interface StateProps {
  host: Person;
}

export const CreatePerson: FC<Props> = () => {
  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isEventSubmitted, setIsEventSubmitted] = useState<boolean>(false);
  const [displayEmailError, setDisplayEmailError] = useState<boolean>(false);
  const [displayFirstNameError, setDisplayFirstNameError] = useState<boolean>(
    false
  );
  const [displayLastNameError, setDisplayLastNameError] = useState<boolean>(
    false
  );
  const [displayPasswordError, setDisplayPasswordError] = useState<boolean>(
    false
  );

  const [open, setOpen] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "info" | "warning" | "error" | undefined
  >(undefined);

  const stateProps = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        host: { ...state.person },
      };
    }
  );

  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);

  const [createPerson] = useMutation(CREATE_PERSON, {
    onError(err) {
      setResponseMessage("Something went wrong!");
      setSeverity("error");
      setOpen(true);
    },
    onCompleted({ event }) {
      setResponseMessage("Person successfully created!");
      setSeverity("success");
      setOpen(true);
    },
  });

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onFirstNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const onLastNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };
  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (isDraft: boolean) => {
    if (validateInputFields()) {
      const person: PersonInput = {
        email: email,
        first_name: firstName,
        last_name: lastName,
        password: password,
      };
      createPerson({ variables: { person } });
      console.log("WORKS");
    }

    setIsEventSubmitted(true);

    setIsEventSubmitted(false);
  };

  const validateInputFields = () => {
    let returnValue = true;
    if (!emailRegEx.test(email)) {
      setDisplayEmailError(true);
      returnValue = false;
    } else {
      setDisplayEmailError(false);
    }
    if (firstName === "") {
      setDisplayFirstNameError(true);
      returnValue = false;
    } else {
      setDisplayFirstNameError(false);
    }
    if (lastName === "") {
      setDisplayLastNameError(true);
      returnValue = false;
    } else {
      setDisplayLastNameError(false);
    }
    if (password === "") {
      setDisplayPasswordError(true);
      returnValue = false;
    } else {
      setDisplayPasswordError(false);
    }
    return returnValue;
  };

  return (
    <div className={Classes.MainPaper}>
      <Card className={Classes.Card}>
        <CardContent>
          <div style={{ display: "flex" }}>
            <MailOutlineIcon
              style={{ marginTop: "26px", marginRight: "14px", flexGrow: 0 }}
            />

            <TextField
              className={Classes.TextField}
              id="email"
              label="Email"
              multiline
              rowsMax="10"
              value={email}
              onChange={onEmailChange}
              variant="outlined"
              inputProps={{ maxLength: "250" }}
              style={{ flexGrow: 20 }}
              error={displayEmailError}
              helperText={displayEmailError ? "Email was not valid!" : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {email.length}/250
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div style={{ display: "flex" }}>
            <PersonIcon
              style={{ marginTop: "26px", marginRight: "14px", flexGrow: 0 }}
            />
            <TextField
              className={Classes.TextField}
              id="firstName"
              label="First name"
              multiline
              rowsMax="10"
              value={firstName}
              onChange={onFirstNameChange}
              variant="outlined"
              inputProps={{ maxLength: "250" }}
              style={{ flexGrow: 20 }}
              error={displayFirstNameError}
              helperText={
                displayFirstNameError ? "First name cannot be empty!" : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {firstName.length}/250
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div style={{ display: "flex" }}>
            <PersonIcon
              style={{ marginTop: "26px", marginRight: "14px", flexGrow: 0 }}
            />
            <TextField
              className={Classes.TextField}
              id="lastName"
              label="Last name"
              multiline
              rowsMax="10"
              value={lastName}
              onChange={onLastNameChange}
              variant="outlined"
              inputProps={{ maxLength: "250" }}
              style={{ flexGrow: 20 }}
              error={displayLastNameError}
              helperText={
                displayLastNameError ? "Last name cannot be empty!" : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {lastName.length}/250
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div style={{ display: "flex" }}>
            <LockIcon
              style={{ marginTop: "26px", marginRight: "14px", flexGrow: 0 }}
            />
            <TextField
              className={Classes.TextField}
              id="password"
              label="Password"
              multiline
              rowsMax="10"
              value={password}
              onChange={onPasswordChange}
              variant="outlined"
              inputProps={{ maxLength: "250" }}
              style={{ flexGrow: 20 }}
              error={displayPasswordError}
              helperText={
                displayPasswordError ? "Password cannot be empty!" : ""
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {password.length}/250
                  </InputAdornment>
                ),
              }}
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
                onClick={() => handleSubmit(false)}
              >
                Create person
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
