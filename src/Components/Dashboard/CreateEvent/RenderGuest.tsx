import {Avatar, IconButton, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import React, {FC} from "react";

interface Props {
  guest: string;
  removeGuest: (guest: string) => void;
}

export const RenderGuest: FC<Props> = props => {
  return (
    <div style={{display: "flex", justifyContent: "flex-start"}}>
      <div
        style={{
          marginTop: "26px",
          marginRight: "14px",
          flexGrow: 0
        }}
      >
        <div style={{minWidth: "24px", maxWidth: "24px"}}/>
      </div>
      <div style={{flexGrow: 20}}>
        <ListItem style={{paddingLeft: 0}}>
          <ListItemAvatar>
            <Avatar>{props.guest.substring(0, 1).toUpperCase()}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={props.guest}/>
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              name={props.guest}
              onClick={() => props.removeGuest(props.guest)}
            >
              <ClearIcon/>
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </div>
    </div>
  );
};
