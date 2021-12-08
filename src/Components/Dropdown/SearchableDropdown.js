import React, { useState } from "react";
import TextField from "../TextInput";
import { Autocomplete, createFilterOptions } from "@material-ui/lab";
import Button from "../Button";
import { makeStyles } from "@material-ui/core";
import { Grid } from "@material-ui/core";
import AddSharpIcon from "@material-ui/icons/AddSharp";
function SearchableDropdowns(props) {
  const classes = useStyles();
  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.title,
  });
  return (
    <Autocomplete
      id="combo-box-demo"
      value={props.value}
      options={[{ title: "", key: "0", value: "0" }, ...props.data]}
      getOptionLabel={(option) => option.title}
      filterOptions={filterOptions}
      renderOption={(option, { selected }) => {
        if (option.value === "0" && props.showAddButton) {
          return (
            <Grid container justifyContent="flex-end">
              <Button
                color="primary"
                variant="contained"
                onClick={() => {
                  props.ShowForm(true);
                }}
                classes={{ root: classes.AddNewBtn }}
              >
                <AddSharpIcon /> {props.DropDowntitle}
              </Button>
            </Grid>
          );
        } else {
          return option.title;
        }
      }}
      onChange={props.onChange}
      renderInput={(params) => {
        return <TextField {...params} {...props} />;
      }}
    />
  );
}
const useStyles = makeStyles((theme) => ({
  AddNewBtn: {
    backgroundColor: "#1976D2",
  },
}));
export default SearchableDropdowns;
