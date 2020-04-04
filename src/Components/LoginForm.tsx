import { Button, Card, Grid, TextField } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import LockIcon from "@material-ui/icons/Lock";
import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import Classes from "../App.module.css";
import { Credentials } from "../Types/index";
import { useDispatch } from "react-redux";
import { RootDispatcher } from "../Store/Reducers/rootReducer";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from "@apollo/react-hooks";
import { GET_PERSON_BY_EMAIL } from "../Store/GQL";
import CircularProgress from "@material-ui/core/CircularProgress";
import signupApi from "../api/signupApi";

interface Props {}
interface responseData {
  jwt: string;
}

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
    signupApi
      .post("/login", { email: email, password: password })
      .then(result => loginSuccess(result.data))
      .catch(error => loginFail());
  };

  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);
  const history = useHistory();

  const loginSuccess = (result: responseData) => {
    localStorage.setItem("token", result.jwt);
    history.push("/dashboard");
    getPerson();
  };

  const loginFail = () => {
    setDisplayEmailError(true);
  };

  const [getPerson, { loading, error, data }] = useLazyQuery(
    GET_PERSON_BY_EMAIL,
    {
      variables: {
        email: userCredentials.getEmail()
      },
      onCompleted() {
        rootDispatcher.updatePerson(data.person);
        history.push("/dashboard");
      }
    }
  );

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
              helperText={displayEmailError ? "Email or password wrong!" : ""}
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
        <Button
          style={{ marginLeft: "10px" }}
          className={Classes.Button}
          color="primary"
          variant="contained"
          type="submit"
          onClick={() => history.push("/password/forgot")}
        >
          Forgot password
        </Button>
      </form>
      {error ? <p>Email and/or password did not match!</p> : ""}
      {loading ? <CircularProgress /> : ""}
    </Card>
  );
};

export default LoginForm;
