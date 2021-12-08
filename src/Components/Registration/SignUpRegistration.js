import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import DropDownTextField from "../Dropdown/SearchableDropdown";
import { useLocation, Link, useHistory } from "react-router-dom";
import {
  RegisterOrganization,
  SendVerificationCode,
  getOrganizationCategories,
  getOrganizationSubCategories,
  getOrganizationType,
  Login,
} from "../../Api/Actions/registrationActions";
import { useFormik } from "formik";
import BackDrop from "../BackDrop";
import * as Yup from "yup";
import jwtDecode from "jwt-decode";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import Cookies from "universal-cookie";
import { ADD_USER } from "../../Redux/Constants";

const validationSchema = Yup.object().shape({
  userName: Yup.string().required().label("UserName"),
  organizationName: Yup.string().required().label("OrganizationName"),
  organizationTypeId: Yup.string().required().label("Type"),
  organizationCategoryId: Yup.string().required().label("Category"),
  companyCategoryId: Yup.string().required().label("CompanyCategory"),
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

const SignUpRegistration = () => {
  const classes = useStyles();

  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  const cookies = new Cookies();
  const [Spinner, setSpinner] = useState(false);
  const date = new Date();
  date.setDate(date.getDate() + 1);

  let [Email, setEmail] = React.useState(location?.propsData?.email ?? "");
  let [Password, setPassword] = React.useState(
    location?.propsData?.password ?? ""
  );
  let [OrganizationType, setOrganizationTypeList] = useState([]);
  let [OrganizationCategory, setOrganizationCategoryList] = useState([]);
  let [OrganizationSubCategories, setgetOrganizationSubCategories] = useState(
    []
  );

  useEffect(() => {
    getOrganizationType()
      .then((res) => {
        if (res.status === 200) {
          setOrganizationTypeList(res.data);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
    getOrganizationCategories()
      .then((res) => {
        if (res.status === 200) {
          setOrganizationCategoryList(res.data);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
    getOrganizationSubCategories()
      .then((res) => {
        if (res.status === 200) {
          setgetOrganizationSubCategories(res.data);
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }, []);

  var OrganizationTypeList = OrganizationType.map((o) => ({
    title: o.typeName,
    name: o.typeName,
    value: o.organizationTypeId,
    key: o.organizationTypeId,
  }));

  var OrganizationCategoryList = OrganizationCategory.map((o) => ({
    title: o.companyCategoryName,
    name: o.companyCategoryName,
    value: o.companyCategoryId,
    key: o.companyCategoryId,
  }));

  var CompanyCategoryList = OrganizationSubCategories.map((o) => ({
    title: o.organizationCategoryName,
    name: o.organizationCategoryName,
    value: o.organizationCategoryId,
    key: o.organizationCategoryId,
  }));

  const [NewOrganizationTypeValue, setNewOrganizationTypeValue] = useState([]);
  const [NewOrganizationCategoryValue, setNewOrganizationCategoryValue] =
    useState([]);
  const [NewCompanyCategoryValue, setNewCompanyCategoryValue] = useState([]);

  const formik = useFormik({
    initialValues: {
      // email: "",
      // password: "",
      // signUpSource: "",

      organizationName: "",
      organizationCode: "",
      organizationDescription: "",
      organizationTypeId: "",
      organizationCategoryId: "",
      partnerId: "1",
      username: "",
      email: "",
      phone: "03117752858",
      password: "",
      companyCategoryId: "",
      signUpSource: "",
      GUID: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      values.email = Email;
      values.password = Password;
      setSpinner(true);
      RegisterOrganization(values)
        .then((response) => {
          if (response.status === 200) {
            resetForm();
            Login(response.data.token)
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
          }
        })
        .catch((err) => {
          console.log("Error", err.response);
        });
    },
  });
  return (
    <>
      <Container component="main" maxWidth="xs">
        <BackDrop open={Spinner} />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="userName"
                  label="User Name"
                  name="userName"
                  autoComplete="userName"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.userName && Boolean(formik.errors.userName)
                  }
                  helperText={formik.touched.userName && formik.errors.userName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="organizationName"
                  label="Organization Name"
                  id="organizationName"
                  autoComplete="organizationName"
                  value={formik.values.organizationName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.organizationName &&
                    Boolean(formik.errors.organizationName)
                  }
                  helperText={
                    formik.touched.organizationName &&
                    formik.errors.organizationName
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <DropDownTextField
                  variant="standard"
                  id="organizationTypeId"
                  label="Type *"
                  value={NewOrganizationTypeValue}
                  size="small"
                  fullWidth
                  onChange={(event, value) => {
                    formik.setFieldValue(
                      "organizationTypeId",
                      value === null || value === undefined
                        ? ""
                        : value.key.toString()
                    );

                    setNewOrganizationTypeValue(
                      value === null || value === undefined ? "" : value
                    );
                  }}
                  data={OrganizationTypeList}
                  error={
                    formik.touched.organizationTypeId &&
                    Boolean(formik.errors.organizationTypeId)
                  }
                  helperText={
                    formik.touched.organizationTypeId &&
                    formik.errors.organizationTypeId
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <DropDownTextField
                  variant="standard"
                  id="organizationCategoryId"
                  label="Type *"
                  value={NewOrganizationCategoryValue}
                  size="small"
                  fullWidth
                  onChange={(event, value) => {
                    formik.setFieldValue(
                      "organizationCategoryId",
                      value === null || value === undefined
                        ? ""
                        : value.key.toString()
                    );

                    setNewOrganizationCategoryValue(
                      value === null || value === undefined ? "" : value
                    );
                  }}
                  data={OrganizationCategoryList}
                  error={
                    formik.touched.organizationCategoryId &&
                    Boolean(formik.errors.organizationCategoryId)
                  }
                  helperText={
                    formik.touched.organizationCategoryId &&
                    formik.errors.organizationCategoryId
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <DropDownTextField
                  variant="standard"
                  id="companyCategoryId"
                  label="Company Category *"
                  value={NewCompanyCategoryValue}
                  size="small"
                  fullWidth
                  onChange={(event, value) => {
                    formik.setFieldValue(
                      "companyCategoryId",
                      value === null || value === undefined
                        ? ""
                        : value.key.toString()
                    );

                    setNewCompanyCategoryValue(
                      value === null || value === undefined ? "" : value
                    );
                  }}
                  data={CompanyCategoryList}
                  error={
                    formik.touched.companyCategoryId &&
                    Boolean(formik.errors.companyCategoryId)
                  }
                  helperText={
                    formik.touched.companyCategoryId &&
                    formik.errors.companyCategoryId
                  }
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
    </>
  );
};

export default SignUpRegistration;
