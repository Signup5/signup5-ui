import { Button, Card, Grid, TextField } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";
import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import Classes from "../App.module.css";
import { Credentials } from "../Types/index";
import { emailRegEx } from "../Utility";
import ValidatePersonCredentials from "./ValidatePersonCredentials";

interface Props {}

const LoginForm: FC<Props> = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userCredentials] = useState<Credentials>(new Credentials("", ""));
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [updateState, setUpdateState] = useState<boolean>(false);
  const [displayEmailError, setDisplayEmailError] = useState<boolean>(false);
  const [displayPasswordError, setDisplayPasswordError] = useState<boolean>(
    false
  );

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    userCredentials.setEmail(email);
    userCredentials.setPassword(password);
    setUpdateState(!updateState);
  };

  const changeDisplayEmailError = () => {
    if (isFormSubmitted) {
      if (!email.match(emailRegEx)) {
        setDisplayEmailError(true);
      } else {
        setDisplayEmailError(false);
      }
    }
  };
  const changeDisplayPasswordError = () => {
    if (isFormSubmitted) {
      if (password.length <= 3) {
        setDisplayPasswordError(true);
      } else {
        setDisplayPasswordError(false);
      }
    }
  };

  useEffect(() => {
    changeDisplayEmailError();
    changeDisplayPasswordError();
  });

  return (
    <Card className={Classes.MainPaper}>
      <form onSubmit={handleSubmit} noValidate className={Classes.LoginForm}>
        <h2>Sign in</h2>
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={1}>
            <AccountCircle style={{ marginTop: "16px" }} />
          </Grid>
          <Grid item xs={11}>
            <TextField
              required
              className={Classes.InputField}
              label="Email"
              onChange={onEmailChange}
              name="email"
              type="email"
              error={displayEmailError}
              helperText={displayEmailError ? "Not a valid email!" : ""}
              value={email}
            />
          </Grid>
        </Grid>

        <br />
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item xs={1}>
            <LockIcon />
          </Grid>
          <Grid item xs={11}>
            <TextField
              required
              className={Classes.InputField}
              label="Password"
              onChange={onPasswordChange}
              name="password"
              type="password"
              error={displayPasswordError}
              helperText={
                displayPasswordError
                  ? "Password should be at least 4 characters!"
                  : ""
              }
              value={password}
            />
          </Grid>
        </Grid>
        <br />
        <Button
          className={Classes.Button}
          color="primary"
          variant="contained"
          type="submit"
          onClick={() => handleSubmit}
        >
          Sign in
        </Button>
      </form>
      {userCredentials.isEmailValidFormat() &&
      userCredentials.isPasswordValidFormat() ? (
        <ValidatePersonCredentials
          email={userCredentials.getEmail()}
          password={userCredentials.getPassword()}
        />
      ) : (
        ""
      )}
    </Card>
  );
};

export default LoginForm;
