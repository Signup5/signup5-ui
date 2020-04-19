import { Button, Grid, TextField, Snackbar } from "@material-ui/core";
import MailOutlineOutlinedIcon from "@material-ui/icons/MailOutlineOutlined";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";
import Classes from "../../App.module.css";
import signupApi from "../../api/signupApi";

interface Props {
  [x: string]: any;
}
export const PasswordLink: FC<Props> = (props) => {
  const [email, setEmail] = useState<string>("");
  const [displayEmailError, setDisplayEmailError] = useState<boolean>(false);
  const history = useHistory();
  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

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

  const sendEmailSuccess = () => {
    setResponseMessage(
      "You have now got a link in your email inbox and will get redirected to the startpage in 5 seconds"
    );
    setSeverity("success");
    setTimeout(function () {
      history.push("/");
    }, 5000);
    setOpen(true);
  };

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const sendPasswordFail = (error: any) => {
    setDisplayEmailError(true);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signupApi
      .post("/password/reset", {
        email: email,
      })
      .then(() => sendEmailSuccess())
      .catch((error) => sendPasswordFail(error));
  };
  return (
    <div>
      <h2>Write your email below. You will get a link sent to you</h2>
      <form onSubmit={handleSubmit} noValidate className={Classes.LoginForm}>
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={1}>
            <MailOutlineOutlinedIcon
              style={{ marginTop: "20px", paddingRight: "30px" }}
            />
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
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {responseMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};
