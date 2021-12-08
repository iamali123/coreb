import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from "@material-ui/core";
const useStyles = makeStyles((theme) => ({
    CardContent: {
        height: "100%"
    }
}));
export default function Index(props) {
    const classes = useStyles();
    return (
        <Card className={props.root} variant="outlined">
            <CardContent classes={{ root: classes.CardContent }}>{props.children}</CardContent>
        </Card>
    );
}
