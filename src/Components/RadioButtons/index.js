import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Grid } from '@material-ui/core';
export default function Index(props) {
    const [value, setValue] = React.useState(props.filterName[0]);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <FormControl component="fieldset">
            <RadioGroup
                aria-label="anonymous"
                name="anonymous"
                row
                value={props.filterValue}
                onChange={props.FilterHandler}
            >
                {props.filterName !== undefined &&
          props.filterName.map((item, index) => {
              return (
                  <FormControlLabel
                      key={index}
                      value={item}
                      control={<Radio />}
                      label={item}
                  />
              );
          })}
            </RadioGroup>
        </FormControl>
    );
}
