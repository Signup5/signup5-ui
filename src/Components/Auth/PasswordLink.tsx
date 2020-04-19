import {Button, Grid, TextField} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import React, {ChangeEvent, FC, FormEvent, useState} from "react";
import {useHistory} from "react-router-dom";
import Classes from "../../App.module.css";
import signupApi from "../../api/signupApi";

interface Props {
  [x: string]: any;
}
export const PasswordLink: FC<Props> = props => {
  const [email, setEmail] = useState<string>("");
  const [displayEmailError, setDisplayEmailError] = useState<boolean>(false);
  const history = useHistory();
  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const sendEmailSuccess = () => {
    alert("You have now got a link in your email inbox");
    history.push("/");
  };

  const sendPasswordFail = (error: any) => {
    setDisplayEmailError(true);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupApi
      .post("/password/reset", {
        email: email
      })
      .then(() => sendEmailSuccess())
      .catch(error => sendPasswordFail(error));
  };
  return (
    <div>
      <form onSubmit={handleSubmit} noValidate className={Classes.LoginForm}>
        <h2>Write your email below. You will get a link sent to you</h2>
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={1}>
            <AccountCircle style={{ marginTop: "16px" }} />
          </Grid>
          <Grid item xs={11}>
            <TextField
              required
              className={Classes.InputField}
              label="Email"
              onChange={onPasswordChange}
              name="email"
              value={email}
              error={displayEmailError}
              helperText={displayEmailError ? "Not a valid email!" : ""}
            />
          </Grid>
        </Grid>

        <br />
        <br />
        <Button
          className={Classes.Button}
          color="primary"
          variant="contained"
          type="submit"
          onClick={() => handleSubmit}
        >
          Send link
        </Button>
      </form>
    </div>
  );
};
