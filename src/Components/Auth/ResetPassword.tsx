import {Button, Grid, TextField} from "@material-ui/core";
import LockIcon from "@material-ui/icons/Lock";
import React, {ChangeEvent, FC, FormEvent, useState} from "react";
import Classes from "../../App.module.css";
import {useHistory} from "react-router-dom";
import signupApi from "../../api/signupApi";

interface Props {
  [x: string]: any;
}
export const ResetPassword: FC<Props> = props => {
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayPasswordError, setDisplayPasswordError] = useState<boolean>(
    false
  );
  const history = useHistory();
  const token = props.match.params.token;
  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const resetPasswordSucess = () => {
    alert(
      "You have now changed your password, you will be redirected to login page"
    );
    history.push("/");
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
        token: token
      })
      .then(() => resetPasswordSucess())
      .catch(error => resetPasswordFail(error.response.data));
  };
  return (
    <div>
      <form onSubmit={handleSubmit} noValidate className={Classes.LoginForm}>
        <h2>Reset password</h2>
        <Grid container spacing={1} alignItems="flex-start">
          <Grid item xs={1}>
            <LockIcon style={{ marginTop: "18px", marginRight: "200px" }} />
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
            <LockIcon style={{ marginTop: "18px", marginRight: "200px" }} />
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
        <br />
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
    </div>
  );
};