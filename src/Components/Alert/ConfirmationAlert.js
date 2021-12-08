import React from "react";
import Button from "../Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    alignSelf: "center",
    color: "#fbbe88",
    marginTop: 15,
    backgroundColor: "transparent",
  },
  DialogContent: {
    display: "flex",

    flexDirection: "row",
    justifyContent: "center",
  },
  DialogContentText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#78898c",
    textTransform: "capitalize",
  },
  DialogTitle: {
    padding: 0,
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    color: "#48586a",
  },
  dialogPaper: {
    width: "25%",
  },
  root: {
    fontSize: 15,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 20,
  },
}));
function ConfirmationAlert(props) {
  const classes = useStyles();
  return (
    <div>
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        onClose={props.onClick}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <Avatar className={classes.large}>
          <ErrorOutlineIcon style={{ fontSize: 70 }} />
        </Avatar>
        <DialogTitle classes={{ root: classes.DialogTitle }}>
          {props.title}
        </DialogTitle>
        <DialogContent classes={{ root: classes.DialogContent }}>
          <DialogContentText
            id="alert-dialog-slide-description"
            classes={{ root: classes.DialogContentText }}
          >
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions classes={{ root: classes.button }}>
          <Button
            onClick={props.onClose}
            color="primary"
            variant="outlined"
            fullWidth={false}
            className={classes.root}
            size="large"
          >
            Cancel
          </Button>
          <Button
            onClick={props.onClick}
            color="secondary"
            variant="contained"
            fullWidth={false}
            className={classes.root}
            size="large"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmationAlert;
