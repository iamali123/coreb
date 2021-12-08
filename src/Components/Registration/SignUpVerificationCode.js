import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MuiPhoneNumber from "material-ui-phone-number";
import { Link, useLocation, useHistory } from "react-router-dom";
import {
  Register,
  SendVerificationCode,
} from "../../Api/Actions/registrationActions";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Countdown from "react-countdown";
import dateFormat from "dateformat";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignUpVerfication = (props) => {
  const location = useLocation();
  const history = useHistory();
  const [VerficationCode, setVerficationCode] = React.useState(
    location?.propsData?.verificationCode ?? ""
  ); //React.useState();
  let [Hours, setHours] = React.useState(
    location?.propsData?.hours ?? new Date()
  );
  let [Minutes, setMinutes] = React.useState(location?.propsData?.mintues ?? 0);
  const [Email, setUserEmail] = React.useState(
    location?.propsData?.email ?? ""
  );
  const [Password, setUserPassword] = React.useState(
    location?.propsData?.password ?? ""
  );

  const classes = useStyles();

  const [state, setState] = React.useState({
    email: "",
    password: "",
  });

  const formik = useFormik({
    initialValues: {
      setCode: "",
    },
    //validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      var date = new Date();
      var StartTime = new Date();
      var EndTime = new Date(Hours);

      if (values.setCode == VerficationCode && StartTime <= EndTime) {
        history.push({
          pathname: `/SignUpRegistration`,
          propsData: {
            email: Email,
            password: Password,
          },
        });
        resetForm();
      } else {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Expired",
          text: "Verfication code expire!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },
  });

  const Completionist = () => (
    <span style={{ color: "red" }}>Code time expired!</span>
  );

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <Completionist />;
    } else {
      return (
        <span>
          {minutes}:{seconds}
        </span>
      );
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Enter the verfication code
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="setCode"
                label="Verification Code"
                type="password"
                name="setCode"
                autoComplete="setCode"
                value={formik.values.setCode}
                onChange={formik.handleChange}
                error={formik.touched.setCode && Boolean(formik.errors.setCode)}
                helperText={formik.touched.setCode && formik.errors.setCode}
              />
              <>
                <Countdown date={new Date(Hours)} renderer={renderer} />
              </>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Verfiy
          </Button>
        </form>
      </div>
    </Container>
  );
};
export default SignUpVerfication;
