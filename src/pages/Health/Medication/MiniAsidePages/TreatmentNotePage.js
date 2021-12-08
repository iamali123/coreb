import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Swal from "sweetalert2";

import {
  DELETE_TREATMENT_NOTE,
  GET_TREATMENT_NOTES_SUMMARY,
  DELETE_TREATMENT_NOTE_SUMMARY,
  GET_TREATMENT_NOTES,
} from "../../../../Redux/Constants";
import {
  GetTreatmentNoteSummary,
  DeleteTreatmentNote,
  GetTreatmentNote,
} from "../../../../Api/Actions/Health/TreatmentNote/treatmentNoteAction";
import {
  CssBaseline,
  Container,
  Typography,
  Grid,
  Divider,
  makeStyles,
} from "@material-ui/core";
import {
  faAddressCard,
  faBell,
  faBirthdayCake,
  faComment,
  faCopy,
  faEnvelope,
  faGenderless,
  faHistory,
  faHome,
  faInfoCircle,
  faKitMedical,
  faMapPin,
  faPen,
  faPhone,
  faPlus,
  faTrash,
  faUser,
  faUserClock,
  faUserDoctor,
  faUserMd,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../../../Components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dateformat from "dateformat";
import BackDrop from "../../../../Components/BackDrop";

const useStyles = makeStyles((theme) => ({
  HeadingStyle: {
    color: "#1976D2",
    fontWeight: "bold",
  },
  InfoStyle: {
    color: "#000000",
  },
  ContainerStyle: {
    border: "1px solid black",
    height: "25vh",
    margin: 15,
  },
  EditButtonStyle: {
    backgroundColor: "#D4D4D4",
  },
}));
function TreatmentNotePage(props) {
  const classes = useStyles();
  let params = useParams();
  let history = useHistory();
  const dispatch = useDispatch();
  const [ShowSpinner, setShowSpinner] = useState(false);
  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  useEffect(() => {
    GetTreatmentNoteSummary(companyId, params?.PatientId)
      .then((res) => {
        if (res.status === 200) {
          dispatch({ type: GET_TREATMENT_NOTES_SUMMARY, payload: res.data });
        }
      })
      .catch((error) => {
        console.log("Error", error);
      });
    GetTreatmentNote(companyId)
      .then((res) => {
        if (res.status === 200) {
          dispatch({ type: GET_TREATMENT_NOTES, payload: res.data });
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, []);
  const TreatmentNoteSummary = useSelector(
    (note) => note.treatmentNoteSummaryReducer
  ).map((item) => ({
    ...item,
    medicine: Array.prototype.map
      .call(item.medicine, function (item) {
        return item.itemDetailName;
      })
      .join(","),
  }));
  const DeleteNoteHandler = (note) => {
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
        setShowSpinner(true);
        DeleteTreatmentNote(note?.id)
          .then((res) => {
            if (res.status === 200) {
              dispatch({
                type: DELETE_TREATMENT_NOTE_SUMMARY,
                payload: res.data,
              });
              dispatch({ type: DELETE_TREATMENT_NOTE, payload: res.data });
              setShowSpinner(false);
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
            setShowSpinner(false);
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
  };
  return (
    <>
      <BackDrop open={ShowSpinner} />
      <Grid container justifyContent="flex-end" alignItems="center">
        <Grid item sm={6} lg={6} md={6} xl={6} style={{ marginTop: 10 }}>
          <Button
            variant="contained"
            color="#857D7D"
            classes={{ root: classes.EditButtonStyle }}
            onClick={() => {
              history.push(
                `/TreatmentNotes/TreatmentNoteForm/PatientId=${params.PatientId}`
              );
            }}
            size="small"
          >
            <FontAwesomeIcon
              icon={faPlus}
              fontSize="medium"
              color="#000000"
              cursor="pointer"
              title="Add TreatmentNote"
            />
            <Typography
              style={{
                fontFamily: "Roboto",
                fontSize: 15,
                fontWeight: "bold",
                paddingLeft: 3,
              }}
            >
              Add Treatment Note
            </Typography>
          </Button>
        </Grid>
      </Grid>
      {TreatmentNoteSummary?.map((note, index) => {
        return (
          <>
            <Container classes={{ root: classes.ContainerStyle }}>
              <Grid container>
                <Grid item sm={6} md={6} lg={6} xl={6}>
                  <Typography
                    variant="h5"
                    style={{
                      color: "#1976D2",
                      fontWeight: "bold",
                    }}
                  >
                    {note?.consultationType ?? "N/A"}
                  </Typography>
                </Grid>
                <Grid
                  container
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Grid item sm={6} lg={5} md={6} xl={2}>
                    <FontAwesomeIcon
                      icon={faPen}
                      size="lg"
                      color="#1976D2"
                      title="Edit TreatmentNote"
                      style={{ marginRight: 10, cursor: "pointer" }}
                      onClick={() => {
                        history.push({
                          pathname: `/TreatmentNotes/TreatmentNoteForm/PatientId=${params.PatientId}`,
                          noteId: note?.id,
                        });
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      size="lg"
                      color="#1976D2"
                      title="Delete TreatmentNote"
                      onClick={() => {
                        DeleteNoteHandler(note);
                      }}
                      style={{ marginRight: 10, cursor: "pointer" }}
                    />

                    <FontAwesomeIcon
                      icon={faCopy}
                      size="lg"
                      color="#1976D2"
                      title=" Copy TreatmentNote"
                      style={{ cursor: "pointer" }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item sm={12} lg={12} md={12} xl={12}>
                  <Divider
                    style={{
                      border: "1px solid black",
                      width: "100% !important",
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid
                  container
                  xs={10}
                  sm={10}
                  md={10}
                  lg={8}
                  xl={6}
                  justifyContent="space-between"
                  style={{ marginTop: 15 }}
                >
                  <Grid item xs={5} sm={5} lg={4} md={5} xl={3}>
                    <Typography
                      variant="p"
                      classes={{ root: classes.HeadingStyle }}
                    >
                      <FontAwesomeIcon
                        icon={faUserDoctor}
                        size="md"
                        color="#1976D2"
                        title="Contact Information"
                        style={{ marginRight: 5 }}
                      />
                      Doctor Name
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={5}
                    sm={5}
                    lg={5}
                    md={6}
                    xl={4}
                    classes={{ root: classes.InfoStyle }}
                  >
                    <Typography variant="p">
                      {note?.doctorName ?? "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container>
                <Grid
                  container
                  xs={10}
                  sm={10}
                  md={10}
                  lg={8}
                  xl={6}
                  justifyContent="space-between"
                  style={{ marginTop: 15 }}
                >
                  <Grid item xs={5} sm={5} lg={4} md={5} xl={3}>
                    <Typography
                      variant="p"
                      classes={{ root: classes.HeadingStyle }}
                    >
                      <FontAwesomeIcon
                        icon={faComment}
                        size="md"
                        color="#1976D2"
                        title="Present Complain"
                        style={{ marginRight: 5 }}
                      />
                      Present Complain
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={5}
                    sm={5}
                    lg={5}
                    md={6}
                    xl={4}
                    classes={{ root: classes.InfoStyle }}
                  >
                    <Typography variant="p">
                      {note?.description ?? "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container>
                <Grid
                  container
                  xs={12}
                  sm={12}
                  md={10}
                  lg={8}
                  xl={8}
                  justifyContent="space-between"
                  style={{ marginTop: 15 }}
                >
                  <Grid item xs={6} sm={6} lg={6} md={6} xl={6}>
                    <Typography
                      variant="p"
                      classes={{ root: classes.HeadingStyle }}
                    >
                      <FontAwesomeIcon
                        icon={faKitMedical}
                        size="md"
                        color="#1976D2"
                        title="Medicine"
                        style={{ marginRight: 5 }}
                      />
                      Medication
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    sm={6}
                    lg={6}
                    md={6}
                    xl={6}
                    classes={{ root: classes.InfoStyle }}
                  >
                    <Typography variant="p">
                      {note?.medicine ?? "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </>
        );
      })}
    </>
  );
}

export default TreatmentNotePage;
