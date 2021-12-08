import React from "react";
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
import { Link } from "react-router-dom";
import { Register } from "../../Api/Actions/registrationActions";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  companyName: Yup.string().required().label("Company Name"),
  companyDescription: Yup.string().label("Description"),
  username: Yup.string().required().label("Username"),
  email: Yup.string().required().email().label("Email"),
  phone: Yup.string().required().label("Phone"),
  password: Yup.string().required().min(5).label("Password"),
  companyType: Yup.number().default(0).required().label("Company Type"),
});
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
const signUpHandler = (values) => {
  Register(values);
};
export default function SignUp() {
  const classes = useStyles();
  const formik = useFormik({
    initialValues: {
      companyDescription: "",
      companyName: "",
      email: "",
      password: "",
      phone: "+92-311-7752858",
      username: "",
      categoryId: "6051e899ab68a04ebe14733b",
      companyType: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      signUpHandler(values);
      resetForm();
    },
  });
  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} lg={12}>
              <FormControl>
                <TextField
                  autoComplete="fname"
                  name="companyName"
                  variant="outlined"
                  id="companyName"
                  label="CompanyName"
                  autoFocus
                  value={formik.values.companyName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.companyName &&
                    Boolean(formik.errors.companyName)
                  }
                  helperText={
                    formik.touched.companyName && formik.errors.companyName
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} lg={12}>
              <InputLabel id="demo-simple-select-label">
                Company Type
              </InputLabel>
              <Select
                label="Company Type"
                id="Company Type"
                name="Company Type"
                value={formik.values.companyType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.companyType &&
                  Boolean(formik.errors.companyType)
                }
                helperText={
                  formik.touched.companyType && formik.errors.companyType
                }
                style={{ width: "100%" }}
              >
                <MenuItem value={0}>Manufacturing</MenuItem>
                <MenuItem value={1}>Distributor</MenuItem>
                <MenuItem value={2}>Service</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <MuiPhoneNumber
                name="Phone"
                id="Phone"
                label="Phone Number"
                defaultCountry={"pk"}
                style={{ width: "100%" }}
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                id="username"
                required
                fullWidth
                label="UserName"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/Login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
