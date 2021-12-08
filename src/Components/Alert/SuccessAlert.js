import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    alignSelf: "center",
    color: "#89d086",
    marginTop: 20,
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
    padding: 25,
  },
  DialogTitle: {
    padding: 0,
    marginTop: 25,
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
function SuccessAlert(props) {
  const classes = useStyles();
  React.useEffect(() => {
    setTimeout(props.onClick, 1200);
  }, []);
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
          <CheckCircleOutlineOutlinedIcon style={{ fontSize: 70 }} />
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
      </Dialog>
    </div>
  );
}

export default SuccessAlert;
