import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import React, {FC} from "react";
import SignupLogo from "../Icons/SignupLogo";
import {Button, Typography} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {InitialState, RootDispatcher} from "../../Store/Reducers/rootReducer";
import {Person} from "../../Types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontWeight: "bold",
      fontSize: theme.typography.pxToRem(16),
      display: "inline-block",
      marginRight: "24px"
    }
  })
);

interface StateProps {
  person: Person;
}

export const Header: FC = () => {
  const {person} = useSelector<InitialState, StateProps>(
    (state: InitialState) => {
      return {
        person: state.person,
      };
    }
  );
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const rootDispatcher = new RootDispatcher(dispatch);

  const logout = () => {
    localStorage.clear();
    rootDispatcher.logout();
    history.push("/");
  };

  return (
  <div style={{display: "flex", justifyContent: "space-between"}}>
    <SignupLogo />
    {person.email? <div >
        <Typography className={classes.heading}>
          {person.email}
        </Typography>

        <Button
          id="logoutButton"
          size="large"
          onClick={() => logout()}
          variant="contained"
          color="secondary"
        >
          Logout
        </Button>
      </div>:
      ""}
  </div>
  )
};