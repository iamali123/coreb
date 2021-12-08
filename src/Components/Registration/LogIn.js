import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Alert from "../Alert/ErrorAlert";
import TextField from "../TextInput";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { Link, useHistory } from "react-router-dom";
import { Login } from "../../Api/Actions/registrationActions";
import { ADD_USER } from "../../Redux/Constants";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import BackDrop from "../BackDrop/index";
import Cookies from "universal-cookie";
import Button from "../Button";
import Card from "../Card";
import * as Yup from "yup";
import jwtDecode from "jwt-decode";
import ConfirmationAlert from "../Alert/ConfirmationAlert";
import SuccessAlert from "../Alert/SuccessAlert";
import ErrorAlert from "../Alert/ErrorAlert";
import LogoImage from "../../assets/images/Logo.png";
import "./LoginStyle.css";
import Swal from "sweetalert2";
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  label: {
    fontSize: 15,
    textTransform: "uppercase",
    fontFamily: "Roboto",
  },
  root: {
    background: "#1976D2",
    color: "white",
    height: 30,
    padding: "20px 30px",
  },
  floatingLabelFocusStyle: {
    color: "black",
  },
}));
const validationSchema = Yup.object().shape({
  password: Yup.string().required("Password is required").label("Password"),
  Email: Yup.string()
    .email("The email is invalid ")
    .required("Email is Required")
    .label("Email"),
});

export default function LogIn() {
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const cookies = new Cookies();
  const [Spinner, setSpinner] = useState(false);
  const date = new Date();
  //date.setTime(date.getTime() + 1440 * 60 * 1000);
  date.setDate(date.getDate() + 1);
  const formik = useFormik({
    initialValues: {
      Email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      SignIn(values);
      resetForm();
    },
  });
  const SignIn = (values) => {
    setSpinner(true);
    Login(values)
      .then((res) => {
        if (res.status === 200) {
          const userData = jwtDecode(res.data.token);
          cookies.set("user", userData, { expires: date });
          dispatch({ type: ADD_USER, payload: userData });
          setSpinner(false);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Login Successfully",
            showConfirmButton: false,
            timer: 1000,
          });
          setTimeout(() => {
            history.push("/Dashboard");
          }, 1000);
        }
      })
      .catch((error) => {
        setSpinner(false);
        if (error.response !== undefined) {
          Swal.fire({
            title: `${error.response.data.title}`,
            text: `${error.response.data.message}`,
            icon: "error",
            showConfirmButton: true,
          });
        } else {
          Swal.fire({
            title: "Error",
            text: `Network Error`,
            icon: "error",
            showConfirmButton: true,
          });
        }
      });
  };

  return (
    <div className="login-page">
      <Container component="main" maxWidth="xs" className="container">
        <BackDrop open={Spinner} />
        <div className={classes.paper}>
          <img
            src={LogoImage}
            alt={"Coreb Logo"}
            width={250}
            style={{ marginBottom: 15 }}
          />
          <form onSubmit={formik.handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="Email"
              label="Email"
              autoFocus
              value={formik.values.Email}
              onChange={formik.handleChange}
              error={formik.touched.Email && Boolean(formik.errors.Email)}
              helperText={formik.touched.Email && formik.errors.Email}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Grid></Grid>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 10,
              }}
            >
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                style={{ color: "#AEA9A9", fontFamily: "Roboto" }}
              />
              <Link
                href="#"
                variant="body2"
                style={{
                  color: "#AEA9A9",
                  fontFamily: "Roboto",
                  fontWeight: "normal",
                  textDecoration: "none",
                }}
              >
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              fullWidth={true}
              variant="contained"
              color="primary"
              className={classes.submit}
              classes={{ label: classes.label, root: classes.root }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Typography style={{}}>
                  Don't have an account?
                  <Link
                    to="/SignUpScreen"
                    variant="body2"
                    style={{
                      color: "#1976D2",
                      fontFamily: "Roboto",
                      fontWeight: "normal",
                    }}
                  >
                    {" Sign Up"}
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
}
