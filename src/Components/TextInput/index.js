import React from 'react';
import TextField from '@material-ui/core/TextField';
function Index(props) {
    return (
        <TextField
            label={props.label}
            {...props}
            onChange={props.onChange}
            size="small"
        />
    );
}

export default Index;
