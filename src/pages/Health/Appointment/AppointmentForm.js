import React, { useEffect, useState } from "react";
import TextField from "../../../Components/TextInput";
import { useFormik } from "formik";
import Box from "@material-ui/core/Box";
import { Typography, TextareaAutosize, Backdrop } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core";
import { Divider, Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "../../../Components/DatePicker";
import dateformat from "dateformat";
import DropDownTextField from "../../../Components/Dropdown/SearchableDropdown";
import Button from "../../../Components/Button";
import { Repeat } from "../../../Enums/PatientEnum";
import BackDrop from "../../../Components/BackDrop";
import Swal from "sweetalert2";
import {
  GetAppointment,
  AddAppointment,
  GetAppointmentById,
  EditAppointment,
} from "../../../Api/Actions/Health/Appointment/AppointmentAction";
import {
  ADD_APPOINTMENT,
  EDIT_APPOINTMENT,
  GET_APPOINTMENTS,
} from "../../../Redux/Constants";
import {
  appointmentInitialValues,
  appointmentValidationSchema,
} from "../../../Schema/AppointmentSchema/InitialValues";
const useStyles = makeStyles((theme) => ({
  heading: {
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    background: "#1976D2",
    color: "#ffffff",
    fontFamily: "Roboto",
    fontWeight: 700,
    padding: 20,
    textTransform: "upperCase",
    fontSize: 20,
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
function AppointmentForm({ Open, setOpen, date, data, setdate, setdata }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [defaultAppointment, setdefaultAppointment] = useState(
    appointmentInitialValues
  );
  const [NewAppointmentTypeValue, setNewAppointmentTypeValue] = useState([]);
  const [NewDoctorValue, setNewDoctorValue] = useState([]);
  const [NewServiceValue, setNewServiceValue] = useState([]);
  const [NewPatientValue, setNewPatientValue] = useState([]);
  const [NewRepeatValue, setNewRepeatValue] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px ",
    borderRadius: 5,
    boxShadow: 24,
    overflow: "hidden",
    width: "30%",
  };
  var companyId;
  const user = useSelector((state) => state.userReducer);
  companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  const PatientsList = useSelector((patient) => patient.patientReducer).map(
    (pat) => ({
      title: pat.firstName + " " + pat.lastName,
      key: pat.id,
      value: pat.id,
    })
  );
  const AppointmentTypeList = useSelector(
    (type) => type.appointmentTypeReducer
  ).map((appType) => ({
    title: appType.appointmentName,
    key: appType.id,
    value: appType.id,
  }));
  const DoctorList = useSelector((doctor) => doctor.doctorReducer).map(
    (doc) => ({
      title: doc.firstName + " " + doc.lastName,
      key: doc.id,
      value: doc.id,
    })
  );
  const ItemList = useSelector((service) => service.itemReducer).filter(
    (e) => e.type === 1
  );
  const ServiceList = ItemList.map((ser) => ({
    title: ser?.itemCode + "-" + ser?.itemName,
    key: ser?.itemId,
    value: ser?.itemId,
  }));
  var RepeatList = Repeat.map((repeat) => ({
    title: repeat.Title,
    value: repeat.value,
    key: repeat.value,
  }));
  const AppointmentFormik = useFormik({
    initialValues: appointmentInitialValues,
    validationSchema: appointmentValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      const AppointmentObject = {
        id: values?.id ?? "",
        companyId: companyId,
        appointmentNumber: values?.appointmentNumber ?? "0",
        appointmentCode: values?.appointmentCode ?? "",
        note: values.note,
        date: dateformat(date, "yyyy-mm-dd"),
        startTime: values.startTime,
        endTime: values.endTime,
        repeat: parseInt(values.repeat),
        doctorId: values.doctorId,
        doctorName: values.doctorName,
        serviceId: values.serviceId,
        serviceName: values.serviceName,
        appointmentTypeId: values.appointmentTypeId,
        appointmentTypeName: values.appointmentTypeName,
        patientId: values.patientId,
        patientName: values.patientName,
      };
      if (AppointmentObject.id === "") {
        AddAppointment(AppointmentObject)
          .then((res) => {
            dispatch({ type: ADD_APPOINTMENT, payload: res.data });
            resetForm();
            setOpen(false);
          })
          .catch((error) => {
            if (error.response !== undefined) {
              Swal.fire({
                title: `${error?.response?.data?.title ?? "Error"}`,
                text: `${error?.response?.data?.message ?? "Error"}`,
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
      } else {
        AppointmentObject.date = dateformat(values.date, "yyyy-mm-dd");
        EditAppointment(AppointmentObject)
          .then((res) => {
            dispatch({ type: EDIT_APPOINTMENT, payload: res.data });
            resetForm();
            setOpen(false);
          })
          .catch((error) => {
            if (error.response !== undefined) {
              Swal.fire({
                title: `${error?.response?.data?.title ?? "Error"}`,
                text: `${error?.response?.data?.message ?? "Error"}`,
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
    },
  });
  useEffect(() => {
    GetAppointment(companyId)
      .then((res) => {
        if (res.status === 200) {
          dispatch({
            type: GET_APPOINTMENTS,
            payload: res.data,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);
  useEffect(() => {
    if (data === undefined || data === "") {
      updateValues();
    }
    if (data !== undefined && data !== "") {
      setIsLoading(true);
      GetAppointmentById(companyId, data?.toString())
        .then((res) => {
          if (res.status === 200) {
            AppointmentFormik.setFieldValue("doctorId", res.data.doctorId);
            AppointmentFormik.setFieldValue("doctorName", res.data.doctorName);
            AppointmentFormik.setFieldValue(
              "appointmentTypeId",
              res.data.appointmentTypeId
            );
            AppointmentFormik.setFieldValue(
              "appointmentTypeName",
              res.data.appointmentTypeName
            );
            AppointmentFormik.setFieldValue("patientId", res.data.patientId);
            AppointmentFormik.setFieldValue(
              "patientName",
              res.data.patientName
            );
            AppointmentFormik.setFieldValue("serviceId", res.data.serviceId);
            AppointmentFormik.setFieldValue(
              "serviceName",
              res.data.serviceName
            );
            AppointmentFormik.setFieldValue("repeat", res.data.repeat);
            AppointmentFormik.setFieldValue(
              "startTime",
              new Date(res.data.startTime)
                .toLocaleTimeString()
                .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
            );
            AppointmentFormik.setFieldValue(
              "endTime",
              new Date(res.data.endTime)
                .toLocaleTimeString()
                .replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
            );
            AppointmentFormik.setFieldValue("note", res.data.note);
            AppointmentFormik.setFieldValue("id", res.data.id);
            AppointmentFormik.setFieldValue("date", res.data.date);
            AppointmentFormik.setFieldValue(
              "appointmentNumber",
              res.data.appointmentNumber
            );
            AppointmentFormik.setFieldValue(
              "appointmentCode",
              res.data.appointmentCode
            );
            setdate(res.data.date);
            setIsLoading(false);
            updateValues(res.data);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.log("error", error);
        });
    }
  }, [data]);

  const updateValues = (resData) => {
    if (data) {
      const EditDoctorValue = DoctorList.filter(
        (x) => x.key.toString() === resData.doctorId.toString()
      ).map((doc) => ({
        title: doc.title,
        value: doc.value,
        key: doc.value,
      }));

      const EditAppointmentTypeValue = AppointmentTypeList.filter(
        (x) => x.key.toString() === resData.appointmentTypeId.toString()
      ).map((type) => ({
        title: type.title,
        value: type.value,
        key: type.value,
      }));
      const EditPatientValue = PatientsList.filter(
        (x) => x.key.toString() === resData.patientId.toString()
      ).map((patient) => ({
        title: patient.title,
        value: patient.value,
        key: patient.key,
      }));
      const EditRepeatValue = RepeatList.filter(
        (x) => x.key.toString() === resData.repeat.toString()
      ).map((repeat) => ({
        title: repeat.title,
        value: repeat.value,
        key: repeat.value,
      }));
      const EditServiceValue = ServiceList.filter(
        (x) => x.key.toString() === resData.serviceId.toString()
      ).map((repeat) => ({
        title: repeat.title,
        value: repeat.value,
        key: repeat.value,
      }));
      setNewDoctorValue({ ...EditDoctorValue[0] });
      setNewServiceValue({ ...EditServiceValue[0] });
      setNewAppointmentTypeValue({ ...EditAppointmentTypeValue[0] });
      setNewPatientValue({ ...EditPatientValue[0] });
      setNewRepeatValue({ ...EditRepeatValue[0] });
    } else {
      const EditRepeatValue = RepeatList.filter(
        (x) => x.key.toString() === AppointmentFormik?.values.repeat?.toString()
      ).map((repeat) => ({
        title: repeat.title,
        value: repeat.value,
        key: repeat.value,
      }));
      setNewDoctorValue([]);
      setNewAppointmentTypeValue([]);
      setNewPatientValue([]);
      setNewServiceValue([]);
      setNewRepeatValue({ ...EditRepeatValue[0] });
    }
  };
  return (
    <>
      <Modal
        open={Open}
        onClose={() => {
          setOpen(false);
          setdata(undefined);
          AppointmentFormik.resetForm();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {isLoading && <BackDrop />}
          {!isLoading && (
            <>
              <Grid container>
                <Grid item sm={12} lg={12} xl={12}>
                  {data === undefined ? (
                    <Typography classes={{ root: classes.heading }}>
                      New Appointment
                    </Typography>
                  ) : (
                    <Typography classes={{ root: classes.heading }}>
                      Edit Appointment
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <div style={{ paddingLeft: 20, marginTop: 20 }}>
                <form>
                  <Grid container>
                    <Grid item sm={12} md={6} lg={6} xl={6}>
                      <DropDownTextField
                        variant="standard"
                        id="doctorId"
                        label="Doctor *"
                        value={NewDoctorValue}
                        size="small"
                        fullWidth
                        onChange={(event, value) => {
                          AppointmentFormik.setFieldValue(
                            "doctorName",
                            value === null || value === undefined
                              ? ""
                              : value.key.toString()
                          );
                          AppointmentFormik.setFieldValue(
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
                          AppointmentFormik.touched.doctorId &&
                          Boolean(AppointmentFormik.errors.doctorId)
                        }
                        helperText={
                          AppointmentFormik.touched.doctorId &&
                          AppointmentFormik.errors.doctorId
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ marginTop: 10 }}>
                    <Grid item sm={12} md={6} lg={6} xl={6}>
                      <DropDownTextField
                        variant="standard"
                        id="appointmentTypeId"
                        label="Type *"
                        value={NewAppointmentTypeValue}
                        size="small"
                        fullWidth
                        onChange={(event, value) => {
                          AppointmentFormik.setFieldValue(
                            "appointmentTypeName",
                            value === null || value === undefined
                              ? ""
                              : value.title
                          );
                          AppointmentFormik.setFieldValue(
                            "appointmentTypeId",
                            value === null ||
                              value === undefined ||
                              value.key === null ||
                              value.key === undefined
                              ? ""
                              : value.key.toString()
                          );

                          setNewAppointmentTypeValue(
                            value === null || value === undefined ? "" : value
                          );
                        }}
                        data={AppointmentTypeList}
                        error={
                          AppointmentFormik.touched.appointmentTypeId &&
                          Boolean(AppointmentFormik.errors.appointmentTypeId)
                        }
                        helperText={
                          AppointmentFormik.touched.appointmentTypeId &&
                          AppointmentFormik.errors.appointmentTypeId
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ marginTop: 10 }}>
                    <Grid item sm={12} md={6} lg={6} xl={6}>
                      <DropDownTextField
                        variant="standard"
                        id="serviceId"
                        label="Appointment Service *"
                        value={NewServiceValue}
                        size="small"
                        fullWidth
                        onChange={(event, value) => {
                          AppointmentFormik.setFieldValue(
                            "serviceName",
                            value === null || value === undefined
                              ? ""
                              : value.title
                          );
                          AppointmentFormik.setFieldValue(
                            "serviceId",
                            value === null ||
                              value === undefined ||
                              value.key === null ||
                              value.key === undefined
                              ? ""
                              : value.key.toString()
                          );

                          setNewServiceValue(
                            value === null || value === undefined ? "" : value
                          );
                        }}
                        data={ServiceList}
                        error={
                          AppointmentFormik.touched.serviceId &&
                          Boolean(AppointmentFormik.errors.serviceId)
                        }
                        helperText={
                          AppointmentFormik.touched.serviceId &&
                          AppointmentFormik.errors.serviceId
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ marginTop: 10 }}>
                    <Grid item sm={12} md={6} lg={6} xl={6}>
                      <DropDownTextField
                        variant="standard"
                        id="patientId"
                        label="Patient *"
                        value={NewPatientValue}
                        size="small"
                        fullWidth
                        onChange={(event, value) => {
                          AppointmentFormik.setFieldValue(
                            "patientName",
                            value === null || value === undefined
                              ? ""
                              : value.title
                          );
                          AppointmentFormik.setFieldValue(
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
                          AppointmentFormik.touched.patientId &&
                          Boolean(AppointmentFormik.errors.patientId)
                        }
                        helperText={
                          AppointmentFormik.touched.patientId &&
                          AppointmentFormik.errors.patientId
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ marginTop: 10 }}>
                    <Grid item sm={12} md={6} lg={6} xl={6}>
                      <DatePicker
                        id="date"
                        label="Date"
                        defaultValue={dateformat(date, "yyyy-mm-dd")}
                        type="date"
                        size="small"
                        fullWidth
                        onChange={AppointmentFormik.handleChange}
                        error={
                          AppointmentFormik.touched.date &&
                          Boolean(AppointmentFormik.errors.date)
                        }
                        helperText={
                          AppointmentFormik.touched.date &&
                          AppointmentFormik.errors.date
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
                    <Grid item sm={5} md={5} lg={5} xl={5}>
                      <TextField
                        variant="outlined"
                        id="startTime"
                        label="Start Time"
                        value={AppointmentFormik.values.startTime}
                        onChange={AppointmentFormik.handleChange}
                        size="small"
                        defaultValue={AppointmentFormik.values.startTime}
                        fullWidth
                        type="time"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 min
                        }}
                      />
                    </Grid>
                    <Grid item sm={1} md={1} lg={1} xl={1}>
                      <Typography
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        To
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sm={5}
                      md={5}
                      lg={5}
                      xl={5}
                      style={{ marginRight: 15 }}
                    >
                      <TextField
                        variant="outlined"
                        id="endTime"
                        label="End Time"
                        value={AppointmentFormik.values.endTime}
                        defaultValue={AppointmentFormik.values.endTime}
                        onChange={AppointmentFormik.handleChange}
                        size="small"
                        fullWidth
                        type="time"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          step: 300, // 5 min
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ marginTop: 10 }}>
                    <Grid item sm={12} md={6} lg={6} xl={6}>
                      <DropDownTextField
                        variant="standard"
                        id="repeat"
                        label="Repeat"
                        value={NewRepeatValue}
                        size="small"
                        fullWidth
                        onChange={(event, value) => {
                          AppointmentFormik.setFieldValue(
                            "repeat",
                            value === null ||
                              value === undefined ||
                              value.key === null ||
                              value.key === undefined
                              ? ""
                              : value.key.toString()
                          );

                          setNewRepeatValue(
                            value === null || value === undefined ? "" : value
                          );
                        }}
                        data={RepeatList}
                        error={
                          AppointmentFormik.touched.repeat &&
                          Boolean(AppointmentFormik.errors.repeat)
                        }
                        helperText={
                          AppointmentFormik.touched.repeat &&
                          AppointmentFormik.errors.repeat
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ marginTop: 15 }}>
                    <Grid item sm={12} md={6} lg={6} xl={6}>
                      <TextareaAutosize
                        maxRows={4}
                        id="note"
                        aria-label="maximum height"
                        placeholder="Note"
                        style={{
                          height: 100,
                          fontFamily: "Roboto",
                          width: 300,
                        }}
                        value={AppointmentFormik.values.note}
                        onChange={AppointmentFormik.handleChange}
                        size="small"
                        fullWidth
                        error={
                          AppointmentFormik.touched.note &&
                          Boolean(AppointmentFormik.errors.note)
                        }
                        helperText={
                          AppointmentFormik.touched.note &&
                          AppointmentFormik.errors.note
                        }
                      />
                    </Grid>
                  </Grid>
                  <Grid container style={{ marginTop: 10, marginBottom: 10 }}>
                    <Grid container sm={12} md={12} lg={12} xl={12}>
                      <Grid item sm={6} md={4} lg={3} xl={3}>
                        <Button
                          variant="contained"
                          color="#857D7D"
                          classes={{ root: classes.CancelButtonStyle }}
                          onClick={() => {
                            setOpen(false);
                            AppointmentFormik.resetForm();
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
                      </Grid>
                      <Grid item sm={6} md={4} lg={3} xl={3}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          classes={{ root: classes.savebtnStyle }}
                          onClick={AppointmentFormik.handleSubmit}
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
                  </Grid>
                </form>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}

export default AppointmentForm;
