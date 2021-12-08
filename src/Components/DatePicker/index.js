import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

export default function Index(props) {
  return (
    <TextField
      {...props}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
}
