import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles, Typography, Grid, Divider } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DropDownTextField from "../../../Components/Dropdown/SearchableDropdown";
import Button from "../../../Components/Button";
import { SelectButton } from "primereact/selectbutton";
import { useHistory } from "react-router-dom";
import {
  faPen,
  faTrash,
  faClock,
  faCalendar,
  faUser,
  faUserDoctor,
  faEnvelope,
  faPhone,
  faMoneyBill1Wave,
  faCalendarCheck,
  faNotesMedical,
  faCancel,
  faRemove,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import dateformat from "dateformat";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { DELETE_APPOINTMENT, EDIT_APPOINTMENT } from "../../../Redux/Constants";
import {
  DeleteAppointment,
  UpdateAppointmentStatus,
} from "../../../Api/Actions/Health/Appointment/AppointmentAction";
import "./style.css";
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
  },
  MeetingHeading: {
    color: "#000000",
    marginLeft: 15,
    overflow: "hidden",
    fontSize: "1rem",
    fontFamily: "Roboto",
    fontWeight: 700,
    lineHeight: 1.6,
    textOverflow: "ellipsis",
    letterSpacing: "0.0075em",
  },
  DateHeding: {
    fontSize: "13px",
    boxSizing: "border-box",
    fontFamily: "Roboto",
    fontWeight: 400,
    lineHeight: 1.43,
    paddingTop: "8px",
    letterSpacing: "0.01071em",
    color: "#ffffff",
    paddingLeft: 5,
  },
  NoteHeading: {
    fontSize: 12,
    boxSizing: "border-box",
    fontFamily: "Roboto",
    fontWeight: 400,
    lineHeight: 1.43,
    paddingTop: 10,
    letterSpacing: "0.01071em",
    color: "#000000",
  },
  DoctorHeading: {
    color: "#ffffff",
    paddingLeft: 5,
    paddingTop: 10,
    textTransform: "capitalize",
    fontFamily: "Roboto",
    fontSize: 13,
  },
  TimeHeading: {
    fontSize: "13px",
    boxSizing: "border-box",
    fontFamily: "Roboto",
    fontWeight: 400,
    lineHeight: 1.43,
    paddingTop: "8px",
    letterSpacing: "0.01071em",
  },
  ButtonStyle: {
    marginLeft: 15,
  },
}));
function AppointmentInfo(props) {
  const dispatch = useDispatch();
  const history = useHistory();

  const classes = useStyles();
  var companyId;
  const user = useSelector((state) => state.userReducer);
  companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  const [AppointmentStatus, setAppointmentStatus] = useState("Not Arrived");

  const options = ["Arrived", "Not Arrived"];
  useEffect(() => {
    if (props?.Info?.event?._def?.extendedProps?.appointmentStatus) {
      setAppointmentStatus("Arrived");
    }
  }, [props?.Info?.event?._def?.extendedProps?.appointmentStatus]);
  const SelectedAppointment = useSelector((e) => e.appointmentReducer).find(
    (f) => f.id === props?.Info?.event?._def?.publicId ?? ""
  );
  const DeleteAppointmentHandler = () => {
    let deletedId = props?.Info?.event?._def?.publicId ?? "";
    if (deletedId !== undefined) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          DeleteAppointment(deletedId)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: DELETE_APPOINTMENT, payload: res.data });
                props.setOpen(false);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Deleted!",
                  text: "Your file has been deleted.",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            })
            .catch((error) => {
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
      });
    }
  };
  const changeStatusHandler = (e) => {
    let status = 0;
    let updatedAppointmentId = props?.Info?.event?._def?.publicId;
    setAppointmentStatus(e.value);
    if (e.value === "Arrived") status = 1;
    else status = 0;
    UpdateAppointmentStatus(companyId, updatedAppointmentId, status)
      .then((res) => {
        if (res.status === 200) {
          dispatch({ type: EDIT_APPOINTMENT, payload: res.data });
        }
      })
      .catch((error) => {
        console.log("eror", error);
      });
  };

  const style = {
    position: "absolute",
    top: "40%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px ",
    borderRadius: 5,
    boxShadow: 24,
    overflow: "hidden",
    width: "30%",
  };
  return (
    <div>
      <Modal
        open={props.Open}
        onClose={() => {
          props.setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Grid
            container
            style={{
              backgroundColor: "#1976D2",
              paddingBottom: 5,
            }}
          >
            <Grid item sm={12} md={12} lg={12} xl={12}>
              <Typography
                style={{
                  paddingTop: 15,
                  paddingLeft: 30,
                  color: "#ffffff",
                  textTransform: "capitalize",
                  fontSize: 20,
                  fontFamily: "Roboto",
                  borderBottom: "1px solid #ffffff",
                }}
              >
                {props?.Info?.event?._def?.extendedProps?.appointmentType ?? ""}
              </Typography>
            </Grid>
            <Grid container>
              <Grid
                item
                sm={1}
                md={1}
                lg={1}
                style={{
                  marginTop: 10,
                  justifyContent: "flex-end",
                  display: "flex",
                }}
              >
                <FontAwesomeIcon
                  icon={faUserDoctor}
                  size="sm"
                  color="#757575"
                  cursor="pointer"
                  style={{ color: "#ffffff" }}
                />
              </Grid>
              <Grid item sm={8} md={8} lg={8} xl={8}>
                <Typography classes={{ root: classes.DoctorHeading }}>
                  {props?.Info?.event?._def?.extendedProps?.doctorName ?? ""}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                item
                sm={1}
                md={1}
                lg={1}
                style={{
                  marginTop: 10,
                  justifyContent: "flex-end",
                  display: "flex",
                }}
              >
                <FontAwesomeIcon
                  icon={faClock}
                  size="sm"
                  cursor="pointer"
                  style={{ color: "#ffffff" }}
                />
              </Grid>
              <Grid item sm={8} md={8} lg={8} xl={8}>
                <Typography classes={{ root: classes.DateHeding }}>
                  Appointment Time :{" "}
                  {dateformat(SelectedAppointment?.startTime, "hh:MM tt") ?? ""}{" "}
                  -{dateformat(SelectedAppointment?.endTime, "hh:MM tt") ?? ""}{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                item
                sm={1}
                md={1}
                lg={1}
                style={{
                  marginTop: 10,
                  justifyContent: "flex-end",
                  display: "flex",
                }}
              >
                <FontAwesomeIcon
                  icon={faCalendar}
                  size="sm"
                  cursor="pointer"
                  style={{ color: "#ffffff" }}
                />
              </Grid>
              <Grid item sm={8} md={8} lg={8} xl={8}>
                <Typography classes={{ root: classes.DateHeding }}>
                  Appointment Created :{" "}
                  {dateformat(
                    props?.Info?.event?._instance?.range?.start,
                    "dd-mmm-yyyy"
                  ) ?? ""}{" "}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <div style={{ marginLeft: 20, marginTop: 5, marginBottom: 20 }}>
            <Grid container>
              <Grid item sm={12} md={12} lg={12} style={{ marginTop: 10 }}>
                <Typography classes={{ root: classes.MeetingHeading }}>
                  Patient Detail
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                item
                sm={1}
                md={1}
                lg={1}
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  size="sm"
                  color="#1976D2"
                  cursor="pointer"
                />
              </Grid>
              <Grid item sm={10} md={10} lg={10}>
                <Typography classes={{ root: classes.NoteHeading }}>
                  {props?.Info?.event?._def?.title ?? ""}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                item
                sm={1}
                md={1}
                lg={1}
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  size="sn"
                  color="#1976D2"
                  cursor="pointer"
                />
              </Grid>

              <Grid item sm={10} md={10} lg={10}>
                <Typography classes={{ root: classes.NoteHeading }}>
                  {props?.Info?.event?._def?.extendedProps?.email ?? ""}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid
                item
                sm={1}
                md={1}
                lg={1}
                style={{
                  marginTop: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FontAwesomeIcon
                  icon={faPhone}
                  size="sm"
                  color="#1976D2"
                  cursor="pointer"
                />
              </Grid>

              <Grid item sm={10} md={10} lg={10}>
                <Typography classes={{ root: classes.NoteHeading }}>
                  {props?.Info?.event?._def?.extendedProps?.phoneNumber ?? ""}
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item sm={12} md={12} lg={12} style={{ marginTop: 10 }}>
                <Typography classes={{ root: classes.MeetingHeading }}>
                  Appointment Status
                </Typography>
                <Grid container style={{ marginTop: 10, marginLeft: 15 }}>
                  <Grid item sm={10} md={6} lg={5}>
                    <SelectButton
                      style={{}}
                      value={AppointmentStatus}
                      options={options}
                      onChange={changeStatusHandler}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid container style={{ marginTop: 10 }}>
              <Grid item xs={12} sm={8} md={5} lg={3} xl={3}>
                <Button
                  variant="contained"
                  color="#DFDFDF"
                  classes={{ root: classes.ButtonStyle }}
                  size="small"
                  fullWidth
                  onClick={() => {
                    history.push(
                      `/PatientInvoice/AppointmentId=${SelectedAppointment.id}`
                    );
                  }}
                >
                  <Typography
                    style={{
                      paddingRight: 3,
                      textTransform: "capitalize",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#1976D2",
                    }}
                  >
                    Payment
                  </Typography>
                  <FontAwesomeIcon
                    icon={faMoneyBill1Wave}
                    size="sm"
                    color="#1976D2"
                    cursor="pointer"
                  />
                </Button>
              </Grid>
            </Grid>
            <Grid container style={{ marginTop: 10 }}>
              <Grid item xs={12} sm={8} md={4} lg={3} xl={3}>
                <Button
                  variant="contained"
                  color="#DFDFDF"
                  classes={{ root: classes.ButtonStyle }}
                  size="small"
                  fullWidth
                >
                  <Typography
                    style={{
                      paddingRight: 3,
                      textTransform: "capitalize",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#1976D2",
                    }}
                  >
                    Treatment Note
                  </Typography>
                  <FontAwesomeIcon
                    icon={faNotesMedical}
                    size="sm"
                    color="#1976D2"
                    cursor="pointer"
                  />
                </Button>
              </Grid>
            </Grid>
            <Grid
              container
              style={{ marginTop: 10 }}
              justifyContent="space-between"
            >
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
                  <Button
                    variant="contained"
                    color="#DFDFDF"
                    classes={{ root: classes.ButtonStyle }}
                    size="small"
                    fullWidth
                    onClick={() => {
                      props.setOpenAppointmentForm(true);
                      props.setOpen(false);
                      props.setdata(props?.Info?.event?._def?.publicId ?? "");
                    }}
                  >
                    <Typography
                      style={{
                        paddingRight: 3,
                        textTransform: "capitalize",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#1976D2",
                      }}
                    >
                      Edit
                    </Typography>
                    <FontAwesomeIcon
                      icon={faPen}
                      size="sm"
                      color="#1976D2"
                      cursor="pointer"
                    />
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
                  <Button
                    variant="contained"
                    color="#DFDFDF"
                    classes={{ root: classes.ButtonStyle }}
                    size="small"
                    fullWidth
                  >
                    <Typography
                      style={{
                        paddingRight: 3,
                        textTransform: "capitalize",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#1976D2",
                      }}
                    >
                      Book Appointment
                    </Typography>
                    <FontAwesomeIcon
                      icon={faCalendarCheck}
                      size="sm"
                      color="#1976D2"
                      cursor="pointer"
                    />
                  </Button>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={4}
                  lg={2}
                  xl={2}
                  style={{ marginRight: 3 }}
                >
                  <Button
                    variant="contained"
                    color="#DFDFDF"
                    classes={{ root: classes.ButtonStyle }}
                    size="small"
                    onClick={DeleteAppointmentHandler}
                  >
                    <Typography
                      style={{
                        paddingRight: 3,
                        textTransform: "capitalize",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#1976D2",
                      }}
                    >
                      Delete
                    </Typography>
                    <FontAwesomeIcon
                      icon={faTrash}
                      size="sm"
                      color="#1976D2"
                      cursor="pointer"
                    />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid container style={{ marginTop: 20 }}>
              <Grid
                container
                sm={12}
                md={12}
                lg={12}
                xl={12}
                justifyContent="flex-end"
              >
                <Grid item sm={6} md={4} lg={2} xl={2}>
                  <Button
                    variant="contained"
                    color="#857D7D"
                    classes={{ root: classes.CancelButtonStyle }}
                    onClick={() => {
                      props.setOpen(false);
                    }}
                    size="small"
                  >
                    <Typography
                      style={{
                        fontFamily: "Roboto",
                        fontSize: 12,
                        fontWeight: "bold",
                        marginRight: 3,
                      }}
                    >
                      Cancel
                    </Typography>
                    <FontAwesomeIcon
                      icon={faRemove}
                      size="sm"
                      color="#857D7D"
                      cursor="pointer"
                    />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default AppointmentInfo;
