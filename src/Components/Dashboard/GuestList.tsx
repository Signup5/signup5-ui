import { Card, CardContent } from "@material-ui/core";
import React, { FC } from "react";

interface Props {
  guestList: Array<string>;
}

export const GuestList: FC<Props> = props => {
  return (
    <Card>
      <CardContent>
        <h2 style={{ margin: "0px" }}>Guest List</h2>
        {props.guestList.map((guest, index) => {
          return <p key={index}>{guest}</p>;
        })}
      </CardContent>
    </Card>
  );
};
