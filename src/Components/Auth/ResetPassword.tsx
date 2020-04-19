import { Button, Grid, TextField, Snackbar } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import Classes from "../../App.module.css";
import { useHistory } from "react-router-dom";
import signupApi from "../../api/signupApi";

interface Props {
  [x: string]: any;
}
export const ResetPassword: FC<Props> = (props) => {
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayPasswordError, setDisplayPasswordError] = useState<boolean>(
    false
  );
  const [open, setOpen] = useState<boolean>(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [severity, setSeverity] = useState<
    "success" | "info" | "warning" | "error" | undefined
  >(undefined);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const history = useHistory();
  const token = props.match.params.token;
  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const resetPasswordSucess = () => {
    setResponseMessage(
      "You have now changed your password, you will be redirected to the startpage in 5 seconds"
    );
    setSeverity("success");
    setTimeout(function () {
      history.push("/");
    }, 5000);
    setOpen(true);
  };

  const resetPasswordFail = (error: any) => {
    alert(error.response.data);
    history.push("/");
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setDisplayPasswordError(true);
    }
    signupApi
      .post("/password/new", {
        password: password,
        token: token,
      })
      .then(() => resetPasswordSucess())
      .catch((error) => resetPasswordFail(error.response.data));
  };
  return (
    <div>
      <h2>Reset password</h2>
      <form onSubmit={handleSubmit} noValidate>
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={1}>
            <LockOutlinedIcon
              style={{ marginTop: "20px", paddingRight: "30px" }}
            />
          </Grid>
          <Grid item xs={11}>
            <TextField
              required
              className={Classes.InputField}
              label="New password"
              onChange={onPasswordChange}
              name="new-password"
              type="password"
              value={password}
            />
          </Grid>
        </Grid>

        <br />
        <Grid container spacing={1} alignItems="flex-end">
          <Grid item xs={1}>
            <LockOutlinedIcon
              style={{ marginTop: "18px", marginRight: "200px" }}
            />
          </Grid>
          <Grid item xs={11}>
            <TextField
              required
              className={Classes.InputField}
              label="Confirm new password"
              onChange={onConfirmPasswordChange}
              name="confirm-password"
              type="password"
              error={displayPasswordError}
              helperText={
                displayPasswordError ? "This does not match password!" : ""
              }
              value={confirmPassword}
            />
          </Grid>
        </Grid>
        <Button
          className={Classes.Button}
          color="primary"
          variant="contained"
          type="submit"
          onClick={() => handleSubmit}
        >
          Reset
        </Button>
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {responseMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
