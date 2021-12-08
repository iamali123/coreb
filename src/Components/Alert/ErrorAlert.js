import React from "react";
import Button from "../Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import Avatar from "@material-ui/core/Avatar";
import { red } from "@material-ui/core/colors";
import WarningIcon from "@material-ui/icons/Warning";
import { makeStyles } from "@material-ui/core";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    alignSelf: "center",
    color: red[700],
    marginTop: 15,
    backgroundColor: "transparent",
  },
  DialogContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  DialogContentText: {
    fontSize: 15,
    fontWeight: "600",
    color: red[500],
    textTransform: "capitalize",
  },
  DialogTitle: {
    padding: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    color: red[700],
  },
  dialogPaper: {
    width: "25%",
  },
  root: {
    fontSize: 15,
    margin: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  ActionsDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 20,
  },
}));
function ErrorAlert(props) {
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
          <WarningIcon style={{ fontSize: 50 }} />
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
        <DialogActions classes={{ root: classes.ActionsDiv }}>
          <Button
            onClick={props.onClick}
            color="secondary"
            variant="contained"
            fullWidth={false}
            size="large"
            className={classes.root}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ErrorAlert;
