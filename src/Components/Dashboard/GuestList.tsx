import { Card, CardContent } from "@material-ui/core";
import React, { FC } from "react";
import Classes from "../../App.module.css";

interface Props {
  guestList: Array<string>;
}

export const GuestList: FC<Props> = props => {
  return (
    <Card className={Classes.MainPaper}>
      <CardContent>
        {props.guestList.map(guest => {
          console.log(guest);
          return <p>{guest}</p>;
        })}
      </CardContent>
    </Card>
  );
};
