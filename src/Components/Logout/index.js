import * as React from "react";
import { Button, MenuItem, Menu } from "@material-ui/core";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useHistory } from "react-router";
import Cookies from "universal-cookie";
import { useDispatch } from "react-redux";
import { REMOVE_USER } from "../../Redux/Constants";
export default function Index() {
  const history = useHistory();
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const logoutHandler = () => {
    cookies.remove("user");
    dispatch({ type: REMOVE_USER, payload: null });
    history.push("/Login");
  };
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <Button
            variant="contained"
            color="secondary"
            {...bindTrigger(popupState)}
          >
            Options
          </Button>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={popupState.close}>Profile</MenuItem>
            <MenuItem onClick={popupState.close}>My account</MenuItem>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
