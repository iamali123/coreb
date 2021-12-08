import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Button from "../../../Components/Button";
import { Grid, Typography, TextareaAutosize } from "@material-ui/core";
import TextField from "../../../Components/TextInput";
import DropDownTextField from "../../../Components/Dropdown/SearchableDropdown";
import BackDrop from "../../../Components/BackDrop";
import Card from "../../../Components/Card";
import BreadCrumb from "../../../Components/BreadCrumb1";
import { useDispatch, useSelector } from "react-redux";
import PatientInvoiceItems from "./PatientInvoiceItems";
import { useLocation, useParams, useHistory } from "react-router-dom";
import {
  AddPatientInvoice,
  EditPatientInvoice,
  GetPatientInvoiceByAppointmentId,
  GetPatientInvoiceById,
} from "../../../Api/Actions/Health/Invoice/PatientInvoiceAction";
import DatePicker from "../../../Components/DatePicker";
import dateformat from "dateformat";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import {
  patientInvoiceInitialValues,
  patientInvoiceValidationSchema,
} from "../../../Schema/PatientInvoiceSchema/InitialValues";
import {
  ADD_PATIENT_INVOICE,
  EDIT_PATIENT_INVOICE,
} from "../../../Redux/Constants";
const useStyles = makeStyles((theme) => ({
  CardrootStyle: {
    Width: 200,
    maxHeight: "100%",
    marginRight: "1%",
    paddingLeft: "2%",
    marginTop: "1%",
    marginBottom: "3%",
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
}));
function PatientInvoice() {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [InvoiceItems, setInvoiceItems] = useState([]);
  const [formValue, setFormValue] = useState(patientInvoiceInitialValues);
  const [NewDoctorValue, setNewDoctorValue] = useState([]);
  const [NewPatientValue, setNewPatientValue] = useState([]);
  const [NewAppointmentValue, setNewAppointmentValue] = useState([]);
  const [ShowSpinner, setShowSpinner] = useState(false);
  const user = useSelector((state) => state.userReducer);
  let AppointmentId = params?.AppointmentId ?? 0;
  let InvoiceId = params?.EditPatientInvoiceId ?? 0;
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;

  const DoctorList = useSelector((doctor) => doctor.doctorReducer).map(
    (doc) => ({
      title: doc.firstName + " " + doc.lastName,
      key: doc.id,
      value: doc.id,
    })
  );
  const PatientsList = useSelector((patient) => patient.patientReducer).map(
    (pat) => ({
      title: pat.firstName + " " + pat.lastName,
      key: pat.id,
      value: pat.id,
    })
  );
  const AppointmentList = useSelector((app) => app.appointmentReducer).map(
    (appointment) => ({
      title:
        appointment.appointmentCode +
        "  " +
        dateformat(appointment.date, "dd mmm yyyy") +
        "  " +
        dateformat(appointment.startTime, "hh : MM tt") +
        " - " +
        dateformat(appointment.endTime, "hh : MM tt"),
      key: appointment.id,
      value: appointment.id,
    })
  );
  useEffect(() => {
    if (AppointmentId !== 0) {
      GetPatientInvoiceByAppointmentId(companyId, AppointmentId)
        .then((res) => {
          if (res.status === 200) {
            setInvoiceItems(res?.data?.items ?? []);
            setFormValue(res.data);
            updateValues(res.data);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
    if (InvoiceId !== 0) {
      GetPatientInvoiceById(companyId, InvoiceId)
        .then((res) => {
          if (res.status === 200) {
            setInvoiceItems(res?.data?.items ?? []);
            setFormValue(res.data);
            updateValues(res.data);
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, []);
  // useEffect(() => {
  // }, [formValue, DoctorList]);

  const patientInvoiceFormik = useFormik({
    initialValues: formValue,
    validationSchema: patientInvoiceValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      values.items = InvoiceItems;
      let InvoiceObject = {
        id: values.id !== undefined ? values.id : "",
        companyId: companyId,
        patient_InvoiceNumber: values.patient_InvoiceNumber,
        patient_InvoiceCode: values.patient_InvoiceCode,
        patient_InvoiceDate: values.patient_InvoiceDate,
        appointmentId: values.appointmentId,
        patientId: values.patientId,
        patientName: values.patientName,
        doctorId: values.doctorId,
        doctorName: values.doctorName,
        discount: values.discount,
        discountAmount: values.discountAmount,
        gross: values.gross,
        taxId: values.taxId,
        tax: values.tax,
        taxAmount: values.taxAmount,
        totalAmount: values.totalAmount,
        netAmount: values.netAmount,
        items: values.items,
      };
      if (InvoiceObject.items.length > 0) {
        if (InvoiceObject.id === "") {
          setShowSpinner(true);
          AddPatientInvoice(InvoiceObject)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: ADD_PATIENT_INVOICE, payload: res.data });
                setShowSpinner(false);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Saved",
                  text: "Invoice Save SuccessFully",
                  showConfirmButton: false,
                  timer: 1500,
                });
                resetForm();
                values.patientId = "";
                values.doctorId = "";
                updateValues(values);
                setTimeout(() => {
                  history.push(`/PatientInvoice`);
                }, 1200);
              }
            })
            .catch((error) => {
              Swal.fire({
                title: `${error.response.data.title}`,
                text: `${error.response.data.message}`,
                icon: "error",
                showConfirmButton: true,
              });
              setShowSpinner(false);
            });
        } else {
          setShowSpinner(true);
          EditPatientInvoice(InvoiceObject)
            .then((res) => {
              dispatch({ type: EDIT_PATIENT_INVOICE, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Invoice Update SuccessFully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              values.patientId = "";
              values.doctorId = "";
              updateValues(values);
              setTimeout(() => {
                history.push(`/PatientInvoice`);
              }, 1200);
            })
            .catch((error) => {
              Swal.fire({
                title: `${error.response.data.title}`,
                text: `${error.response.data.message}`,
                icon: "error",
                showConfirmButton: true,
              });
              setShowSpinner(false);
            });
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "Please add Sales Order Material ",
          icon: "error",
          showConfirmButton: true,
        });
      }
    },
  });
  const calculation = (values) => {
    let disPercent = values.discount;
    let disAmount = 0;
    let gross = 0;
    let taxPer = values.tax;
    let taxAmount = 0;
    let netAmount = 0;
    let sum = 0;
    if (InvoiceItems.length > 0) {
      sum = InvoiceItems.map((o) => o.totalPrice).reduce((a, c) => {
        return a + c;
      });
    }
    patientInvoiceFormik.setFieldValue("totalAmount", sum);
    let amount = sum;

    if (values.discount != null && values.discount != 0) {
      disPercent = values.discount;
    }
    gross = amount;
    if (amount > 0 && disPercent > 0) {
      disAmount = amount * (disPercent / 100);
      gross = amount - disAmount;
    }
    netAmount = gross;
    if (values.tax > 0 && gross > 0) {
      taxPer = values.tax;
      taxAmount = gross * (taxPer / 100);
      netAmount = gross + taxAmount;
    }
    patientInvoiceFormik.setFieldValue("discountAmount", disAmount);
    patientInvoiceFormik.setFieldValue("gross", gross);
    patientInvoiceFormik.setFieldValue("taxAmount", taxAmount);
    patientInvoiceFormik.setFieldValue("netAmount", netAmount);
  };
  useEffect(() => {
    if (InvoiceItems.length > 0) {
      calculation(patientInvoiceFormik.values);
    }
  }, [InvoiceItems]);
  const updateValues = (resData) => {
    const EditDoctorValue = DoctorList.filter(
      (x) => x.key.toString() === resData.doctorId.toString()
    ).map((doc) => ({
      title: doc.title,
      value: doc.value,
      key: doc.value,
    }));
    const EditAppointValue = AppointmentList.filter(
      (x) => x.key.toString() === resData.appointmentId.toString()
    ).map((app) => ({
      title: app.title,
      value: app.value,
      key: app.value,
    }));
    const EditPatientValue = PatientsList.filter(
      (x) => x.key.toString() === resData.patientId.toString()
    ).map((pat) => ({
      title: pat.title,
      value: pat.value,
      key: pat.value,
    }));
    setNewDoctorValue({ ...EditDoctorValue[0] });
    setNewPatientValue({ ...EditPatientValue[0] });
    setNewAppointmentValue({ ...EditAppointValue[0] });
  };

  return (
    <>
      <BackDrop open={ShowSpinner} />
      <Card root={classes.CardRoot}>
        <Grid container spacing={3}>
          <Grid item sm={6} xs={6} md={6}>
            <BreadCrumb
              items={[
                {
                  title: `Welcome ${
                    user?.UserState?.username ?? user?.username ?? ""
                  } to CoreB`,
                  url: "/",
                },
                {
                  title: "Patient Invoice List",
                  url: "/PatientInvoice",
                },
                {
                  title: params?.EditPatientInvoiceId
                    ? "Edit Invoice"
                    : "New Invoice",
                },
              ]}
              show={false}
            />
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
                history.push(`/PatientInvoice`);
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
              onClick={patientInvoiceFormik.handleSubmit}
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
        <form onSubmit={patientInvoiceFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="patient_InvoiceCode"
                label="Invoice Code"
                InputProps={{
                  readOnly: true,
                }}
                value={patientInvoiceFormik.values.patient_InvoiceCode}
                onChange={patientInvoiceFormik.handleChange}
                size="small"
                fullWidth
                error={
                  patientInvoiceFormik.touched.patient_InvoiceCode &&
                  Boolean(patientInvoiceFormik.errors.patient_InvoiceCode)
                }
                helperText={
                  patientInvoiceFormik.touched.patient_InvoiceCode &&
                  patientInvoiceFormik.errors.patient_InvoiceCode
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="doctorId"
                label="Doctor *"
                value={NewDoctorValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  patientInvoiceFormik.setFieldValue(
                    "doctorName",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  patientInvoiceFormik.setFieldValue(
                    "doctorId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );

                  setNewDoctorValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={DoctorList}
                error={
                  patientInvoiceFormik.touched.doctorId &&
                  Boolean(patientInvoiceFormik.errors.doctorId)
                }
                helperText={
                  patientInvoiceFormik.touched.doctorId &&
                  patientInvoiceFormik.errors.doctorId
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginTop: 20 }}
          >
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="patientId"
                label="Patient *"
                value={NewPatientValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  patientInvoiceFormik.setFieldValue(
                    "patientName",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  patientInvoiceFormik.setFieldValue(
                    "patientId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );

                  setNewPatientValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={PatientsList}
                error={
                  patientInvoiceFormik.touched.patientId &&
                  Boolean(patientInvoiceFormik.errors.patientId)
                }
                helperText={
                  patientInvoiceFormik.touched.patientId &&
                  patientInvoiceFormik.errors.patientId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="appointmentId"
                label="Appointment *"
                value={NewAppointmentValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  patientInvoiceFormik.setFieldValue(
                    "doctorName",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  patientInvoiceFormik.setFieldValue(
                    "appointmentId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );

                  setNewAppointmentValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={AppointmentList}
                error={
                  patientInvoiceFormik.touched.appointmentId &&
                  Boolean(patientInvoiceFormik.errors.appointmentId)
                }
                helperText={
                  patientInvoiceFormik.touched.appointmentId &&
                  patientInvoiceFormik.errors.appointmentId
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginTop: 20 }}
          >
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DatePicker
                id="patient_InvoiceDate"
                label="Created Date"
                defaultValue={dateformat(
                  patientInvoiceFormik.values.patient_InvoiceDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={patientInvoiceFormik.handleChange}
                error={
                  patientInvoiceFormik.touched.patient_InvoiceDate &&
                  Boolean(patientInvoiceFormik.errors.patient_InvoiceDate)
                }
                helperText={
                  patientInvoiceFormik.touched.patient_InvoiceDate &&
                  patientInvoiceFormik.errors.patient_InvoiceDate
                }
              />
            </Grid>
          </Grid>
          <PatientInvoiceItems
            InvoiceItems={InvoiceItems}
            setInvoiceItems={setInvoiceItems}
          />
          <>
            <Grid container justifyContent="flex-end" style={{ marginTop: 20 }}>
              <Grid
                sm={2}
                md={2}
                lg={2}
                alignItems="center"
                style={{
                  backgroundColor: "#F2EDED",
                  alignSelf: "center",
                  padding: 10,
                  borderBottom: "1px solid #707070",
                }}
              >
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    textTransform: "capitalize",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  sub-total
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="totalAmount"
                  value={patientInvoiceFormik.values.totalAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    patientInvoiceFormik.touched.totalAmount &&
                    Boolean(patientInvoiceFormik.errors.totalAmount)
                  }
                  helperText={
                    patientInvoiceFormik.touched.totalAmount &&
                    patientInvoiceFormik.errors.totalAmount
                  }
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid
                sm={2}
                md={2}
                lg={2}
                alignItems="center"
                style={{
                  backgroundColor: "#F2EDED",
                  alignSelf: "center",
                  padding: 10,
                  borderBottom: "1px solid #707070",
                }}
              >
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    textTransform: "capitalize",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  discount%
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="discount"
                  name="discount"
                  value={
                    patientInvoiceFormik.values.discount != 0
                      ? patientInvoiceFormik.values.discount
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var v = parseInt(x.target.value, 10);
                    if (v >= 0 && v <= 100) {
                      patientInvoiceFormik.setFieldValue("discount", v);
                    } else {
                      patientInvoiceFormik.setFieldValue("discount", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(patientInvoiceFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    patientInvoiceFormik.touched.discount &&
                    Boolean(patientInvoiceFormik.errors.discount)
                  }
                  helperText={
                    patientInvoiceFormik.touched.discount &&
                    patientInvoiceFormik.errors.discount
                  }
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid
                sm={2}
                md={2}
                lg={2}
                alignItems="center"
                style={{
                  backgroundColor: "#F2EDED",
                  alignSelf: "center",
                  padding: 10,
                  borderBottom: "1px solid #707070",
                }}
              >
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    textTransform: "capitalize",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  tax%
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="tax"
                  value={
                    patientInvoiceFormik.values.tax != 0
                      ? patientInvoiceFormik.values.tax
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var t = parseInt(x.target.value, 10);
                    if (t >= 0 && t <= 100) {
                      patientInvoiceFormik.setFieldValue("tax", t);
                    } else {
                      patientInvoiceFormik.setFieldValue("tax", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(patientInvoiceFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    patientInvoiceFormik.touched.tax &&
                    Boolean(patientInvoiceFormik.errors.tax)
                  }
                  helperText={
                    patientInvoiceFormik.touched.tax &&
                    patientInvoiceFormik.errors.tax
                  }
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid
                sm={2}
                md={2}
                lg={2}
                alignItems="center"
                style={{
                  backgroundColor: "#F2EDED",
                  alignSelf: "center",
                  padding: 10,
                  borderBottom: "1px solid #707070",
                }}
              >
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    textTransform: "capitalize",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  grand-total
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="netAmount"
                  value={patientInvoiceFormik.values.netAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    patientInvoiceFormik.touched.netAmount &&
                    Boolean(patientInvoiceFormik.errors.netAmount)
                  }
                  helperText={
                    patientInvoiceFormik.touched.netAmount &&
                    patientInvoiceFormik.errors.netAmount
                  }
                />
              </Grid>
            </Grid>
          </>
        </form>
      </Card>
    </>
  );
}
export default PatientInvoice;
