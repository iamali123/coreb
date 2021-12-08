import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../../Components/Modal";
import Grid from "@material-ui/core/Grid";
import { useLocation, useParams, useHistory } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "../../../Components/TextInput";
import Button from "../../../Components/Button";
import { Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import CardImage from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import BlankImage from "../../../assets/images/BlankImage.png";
import BreadCrumb from "../../../Components/BreadCrumb";
import Card from "../../../Components/Card";
import ConfirmationAlert from "../../../Components/Alert/ConfirmationAlert";
import SuccessAlert from "../../../Components/Alert/SuccessAlert";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";
import BackDrop from "../../../Components/BackDrop";
import "./customerStyle.css";
import DropDownTextField from "../../../Components/Dropdown/SearchableDropdown";
import {
  customerInitialValues,
  customerValidationSchema,
} from "../../../Schema/CustomerSchema/InitialValues";
import {
  AddCustomer,
  EditCustomer,
} from "../../../Api/Actions/customerActions";
import { ADD_CUSTOMER, EDIT_CUSTOMER } from "../../../Redux/Constants";
const useStyles = makeStyles((theme) => ({
  divider: {
    background: "#707070",
  },
  dismissBtn: {
    backgroundColor: "#D4D4D4",
  },
  saveBtn: {
    backgroundColor: "#1976D2",
  },
  ImageRootStyle: {
    height: 180,
    margin: "0 auto",
  },
  ImageFooterStyle: {
    paddingTop: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTop: "2px solid #707070",
  },
  addNewImageBtnStyle: {
    backgroundColor: "#1976D2",
  },
  cancelImageBtnStyle: {
    backgroundColor: "#D4D4D4",
    color: "#857D7D",
    padding: "3px 5px",
  },
  CardRoot: {
    width: "99%",
    marginTop: 50,
  },
  CancelButtonStyle: {
    marginRight: 20,
    backgroundColor: "#D4D4D4",
  },
  savebtnStyle: {
    backgroundColor: "#1976D2",
    padding: "8px 30px",
  },
  CardrootStyle: {
    Width: 200,
    maxHeight: "100%",
    marginRight: "1%",
    paddingLeft: "3%",
    marginTop: "1%",
    marginBottom: "3%",
  },
}));
function Form() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const params = useParams();
  const location = useLocation();
  const history = useHistory();
  var companyId;
  var customerId = params.Customer;
  const userRecord = useSelector((state) => state.userReducer);
  companyId = userRecord?.UserState?.companyId ?? userRecord.companyId;

  const customerRecords = useSelector((state) => state.customerReducer).filter(
    (customer) => customer.customerId === customerId
  );
  // Use of Formik
  const formik = useFormik({
    initialValues:
      customerRecords.length !== 0 ? customerRecords[0] : customerInitialValues,
    validationSchema: customerValidationSchema,
    onSubmit: (values, { resetForm }) => {
      values.companyId = companyId;

      if (values.customerId === "") {
        setShowSpinner(true);
        AddCustomer(values)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: ADD_CUSTOMER, payload: res.data });
              setshowSuccessAlert(true);
              setShowSpinner(false);
              setTimeout(() => {
                history.push("/CustomerList");
              }, 1200);
            }
          })
          .catch((error) => {
            if (error.response === undefined) {
              setErrorMessage({ message: "Network Error" });
            } else {
              setErrorMessage(error.response.data);
            }
            setShowSpinner(false);
            setshowErrorAlert(true);
          });
      } else {
        setShowSpinner(true);
        EditCustomer(values)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: EDIT_CUSTOMER, payload: res.data });
              setShowSpinner(false);
              setshowSuccessAlert(true);
              setTimeout(() => {
                history.push("/CustomerList");
              }, 1200);
            }
          })
          .catch((error) => {
            if (error.response === undefined) {
              setErrorMessage({ message: "Network Error" });
            } else {
              setErrorMessage({ message: error.response.data });
            }
            setShowSpinner(false);
            setshowErrorAlert(true);
          });
      }
    },
  });
  var countryRecord = useSelector((state) => state.countryReducer).map(
    (country) => ({
      title: country.countryName,
      value: country.countryId,
      key: country.countryId,
    })
  );
  const EditCountryValue = countryRecord
    .filter((x) => x.key === formik.values.countryId)
    .map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
    }));
  const [newCountryValue, setnewCountryValue] = useState(EditCountryValue[0]);
  const [showSuccessAlert, setshowSuccessAlert] = useState(false);
  const [showErrorAlert, setshowErrorAlert] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState({});
  const [ShowSpinner, setShowSpinner] = useState(false);

  return (
    <>
      <BackDrop open={ShowSpinner} />

      {showSuccessAlert && (
        <SuccessAlert
          message="Updated SuccessFully"
          title="Success"
          open={SuccessAlert}
          onClick={setshowSuccessAlert}
        />
      )}
      {showErrorAlert && (
        <ErrorAlert
          open={setshowErrorAlert}
          onClick={() => {
            setshowErrorAlert(false);
          }}
          title={ErrorMessage.title}
          message={ErrorMessage.message}
        />
      )}
      <form onSubmit={formik.handleSubmit}>
        <Card root={classes.CardRoot}>
          <Grid container spacing={3}>
            <Grid item sm={6} xs={6} md={6}>
              <BreadCrumb pathname={location.pathname} show={false} />
            </Grid>

            <Grid
              item
              sm={6}
              xs={6}
              md={6}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignSelf: "flex-end",
              }}
            >
              <Button
                variant="contained"
                color="#857D7D"
                classes={{ root: classes.CancelButtonStyle }}
                onClick={() => {
                  history.push("/CustomerList");
                }}
                size="large"
              >
                <Typography
                  style={{
                    fontFamily: "Roboto",
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </Typography>
              </Button>
              <Button
                variant="contained"
                color="primary"
                classes={{ root: classes.savebtnStyle }}
                size="large"
                onClick={formik.handleSubmit}
              >
                <Typography
                  style={{
                    fontFamily: "Roboto",
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Save
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Card>
        <Card root={classes.CardrootStyle}>
          <Grid
            container
            spacing={2}
            style={{ backgroundColor: "#e7e7e9", marginTop: 50 }}
          >
            <Grid sm={12} xs={12} md={12} lg={12}>
              <Typography
                style={{
                  color: "#212529",
                  padding: 10,
                  fontFamily: "Roboto",
                  fontWeight: "bold",
                }}
              >
                Customer Details
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <div style={{ width: "60%" }}>
              <Grid container spacing={2} style={{ marginTop: 50 }}>
                <Grid item sm={8} xs={8} md={8} lg={6}>
                  <TextField
                    variant="outlined"
                    id="customerCode"
                    label="Code *"
                    autoFocus
                    fullWidth
                    value={formik.values.customerCode}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.customerCode &&
                      Boolean(formik.errors.customerCode)
                    }
                    helperText={
                      formik.touched.customerCode && formik.errors.customerCode
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: 40 }}>
                <Grid item sm={8} xs={8} md={8} lg={6}>
                  <TextField
                    variant="outlined"
                    id="customerName"
                    label="Name *"
                    fullWidth
                    value={formik.values.customerName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.customerName &&
                      Boolean(formik.errors.customerName)
                    }
                    helperText={
                      formik.touched.customerName && formik.errors.customerName
                    }
                  />
                </Grid>
              </Grid>
            </div>

            <div style={{ width: "40%" }}>
              <Grid container justifyContent="center" style={{ marginTop: 15 }}>
                <Grid md={10} lg={6} xs={12}>
                  <CardImage>
                    <CardActionArea>
                      <CardMedia
                        classes={{ root: classes.ImageRootStyle }}
                        image={BlankImage}
                      />
                    </CardActionArea>

                    <CardActions classes={{ root: classes.ImageFooterStyle }}>
                      <Button
                        size="medium"
                        color="#D4D4D4"
                        variant="contained"
                        classes={{ root: classes.cancelImageBtnStyle }}
                      >
                        Remove
                      </Button>
                      <label
                        htmlFor="file-upload"
                        className="custom-file-upload-Customer"
                      >
                        Upload
                      </label>
                      <input id="file-upload" type="file" onChange={() => {}} />
                    </CardActions>
                  </CardImage>
                </Grid>
              </Grid>
            </div>
          </Grid>

          <Grid
            container
            spacing={2}
            style={{ backgroundColor: "#e7e7e9", marginTop: 20 }}
          >
            <Grid sm={12} xs={12} md={12} lg={12}>
              <Typography
                style={{
                  color: "#212529",
                  padding: 10,
                  fontFamily: "Roboto",
                  fontWeight: "bold",
                }}
              >
                Address
              </Typography>
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: 20, paddingRight: 10 }}>
            <Grid item xs={12} md={8} lg={4} sm={8}>
              <TextField
                variant="outlined"
                id="address"
                label="Street Address"
                fullWidth
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            style={{ marginTop: 10, paddingLeft: 10 }}
          >
            <Grid lg={2} md={6} sm={6} xs={8}>
              <DropDownTextField
                variant="standard"
                id="country"
                label="Country"
                value={newCountryValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  formik.setFieldValue(
                    "countryId",
                    value === 0 ||
                      value === undefined ||
                      value === null ||
                      value.key === undefined ||
                      value.key === null
                      ? ""
                      : value.key.toString()
                  );
                  formik.setFieldValue(
                    "countryName",
                    value === 0 ||
                      value === undefined ||
                      value === null ||
                      value.title === undefined ||
                      value.title === null
                      ? ""
                      : value.title
                  );
                  setnewCountryValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={countryRecord}
                error={
                  formik.touched.countryId && Boolean(formik.errors.countryId)
                }
                helperText={formik.touched.countryId && formik.errors.countryId}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            style={{ marginTop: 30, paddingLeft: 10 }}
          >
            <Grid lg={2} md={6} sm={6} xs={6}>
              <TextField
                variant="outlined"
                id="city"
                label="City"
                fullWidth
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            style={{ marginTop: 30, paddingLeft: 10 }}
          >
            <Grid lg={2} md={6} sm={6} xs={6}>
              <TextField
                variant="outlined"
                id="postalCode"
                label="Postal Code"
                fullWidth
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                error={
                  formik.touched.postalCode && Boolean(formik.errors.postalCode)
                }
                helperText={
                  formik.touched.postalCode && formik.errors.postalCode
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            style={{ backgroundColor: "#e7e7e9", marginTop: 20 }}
          >
            <Grid sm={12} xs={12} md={12} lg={12}>
              <Typography
                style={{
                  color: "#212529",
                  padding: 10,
                  fontFamily: "Roboto",
                  fontWeight: "bold",
                }}
              >
                Company Details
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} style={{ marginTop: 20 }}>
            <Grid item sm={12} md={6} lg={2} xs={12}>
              <TextField
                variant="outlined"
                id="contactPerson"
                label="Name *"
                fullWidth
                value={formik.values.contactPerson}
                onChange={formik.handleChange}
                error={
                  formik.touched.contactPerson &&
                  Boolean(formik.errors.contactPerson)
                }
                helperText={
                  formik.touched.contactPerson && formik.errors.contactPerson
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginTop: 10 }}>
            <Grid item sm={12} md={6} lg={2} xs={12}>
              <TextField
                variant="outlined"
                id="contact"
                label="Phone"
                fullWidth
                value={formik.values.contact}
                onChange={formik.handleChange}
                error={formik.touched.contact && Boolean(formik.errors.contact)}
                helperText={formik.touched.contact && formik.errors.contact}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            style={{ marginTop: 10, paddingRight: 10 }}
          >
            <Grid item sm={6} md={6} lg={4} xs={12}>
              <TextField
                variant="outlined"
                id="email"
                label="Email address"
                fullWidth
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} style={{ marginTop: 10 }}>
            <Grid item sm={12} md={6} lg={2} xs={12}>
              <TextField
                variant="outlined"
                id="website"
                label="Website"
                fullWidth
                value={formik.values.website}
                onChange={formik.handleChange}
                error={formik.touched.website && Boolean(formik.errors.website)}
                helperText={formik.touched.website && formik.errors.website}
              />
            </Grid>
          </Grid>
        </Card>
      </form>
    </>
  );
}

export default Form;
