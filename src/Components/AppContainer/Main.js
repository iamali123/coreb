import React from "react";
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
  content: {},
}));
const Main = ({ content }) => {
  const classes = useStyles();
  return <main className={classes.content}>{content}</main>;
};

export default Main;
