import * as React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core";
import { Divider, Grid } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
const useStyles = makeStyles((theme) => ({
  heading: {
    fontSize: 25,
    color: "#857D7D",
    paddingLeft: 20,
    paddingBottom: 20,
  },
  divider: {
    marginBottom: 30,
    background: "#707070",
  },
}));

export default function Index(props) {
  const classes = useStyles();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: props.ModalWidth !== undefined ? props.ModalWidth : 500,
    height: props.ModalHeight != undefined ? props.ModalHeight : "auto",
    bgcolor: "background.paper",
    border: "2px ",
    borderRadius: 5,
    boxShadow: 24,
    overflow: props.Scroll === true ? "scroll" : "hidden",
    padding: 10,
  };
  return (
    <Modal
      open={props.open}
      onClose={props.close}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid container justifyContent="flex-end" alignContent="flex-end">
          <Grid
            item
            sm={6}
            lg={6}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <CancelOutlinedIcon
              fontSize="medium"
              style={{ cursor: "pointer" }}
              onClick={props.close}
            />
          </Grid>
        </Grid>
        <Typography classes={{ root: classes.heading }}>
          {props.title}
        </Typography>
        <Divider classes={{ root: classes.divider }} />
        <div style={{ paddingLeft: 20 }}>{props.children}</div>
      </Box>
    </Modal>
  );
}
