import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Button from "../../../../Components/Button";
import { Grid, Typography } from "@material-ui/core";
import BackDrop from "../../../../Components/BackDrop";
import Card from "../../../../Components/Card";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useHistory, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MiniSideBar from "./MiniSideBar";
import { faPen, faPlus } from "@fortawesome/free-solid-svg-icons";
import PatientDetailPage from "../MiniAsidePages/PatientDetailPage";
import Header from "./Header";
import {
  ContactType,
  Gender,
  ReminderType,
} from "../../../../Enums/PatientEnum";
import { GetPatients } from "../../../../Api/Actions/Health/Patient/PatientActions";
import { GET_PATIENTS } from "../../../../Redux/Constants";
const useStyles = makeStyles((theme) => ({
  CardrootStyle: {
    Width: 200,
    maxHeight: "100%",
    marginRight: "1%",
    paddingLeft: "2%",
    marginTop: "1%",
    marginBottom: "3%",
    height: "100%",
  },

  CancelButtonStyle: {
    marginRight: 20,
    backgroundColor: "#D4D4D4",
  },
  HeaderButtonStyle: {
    backgroundColor: "#D4D4D4",
  },

  MedicalAlertButtonStyle: {
    marginRight: 20,
    backgroundColor: "#1976D2",
  },

  savebtnStyle: {
    backgroundColor: "#1976D2",
    padding: "8px 30px",
  },
}));
function PatientDetail() {
  const [ShowSpinner, setShowSpinner] = useState(false);
  const [Patient, setPatient] = useState();
  const location = useLocation();
  const dispatch = useDispatch();
  const params = useParams();
  const classes = useStyles();
  const user = useSelector((state) => state.userReducer);
  let companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  useEffect(() => {
    setShowSpinner(true);
    GetPatients(companyId)
      .then((res) => {
        setPatient(res?.data?.find((e) => e.id === params?.PatientId));
        setShowSpinner(false);
      })
      .catch((error) => { });
  }, []);
  let PatientNumberType = ContactType.find(
    (e) => e.value.toString() === Patient?.numberType?.toString() ?? 0
  )?.Title;
  let PatientGender = Gender.find(
    (e) => e.value.toString() === Patient?.gender?.toString() ?? 0
  )?.Title;
  let PatientReminder = ReminderType.find(
    (e) =>
      e?.value?.toString() ===
      Patient?.patientCommunicationPreferenceModel[0]?.reminderType?.toString() ??
      0
  )?.Title;
  const Patients = useSelector((state) => state.patientReducer).find(
    (e) => e.id === params.PatientId
  );

  return (
    <>
      <BackDrop open={ShowSpinner} />
      <Header
        items={[
          {
            title: `Welcome ${user?.UserState?.username ?? user?.username ?? ""
              } to CoreB`,
            url: null,
            type: "",
          },
          {
            title: "Patient Detail",
            url: null,
            type: "",
          },
          {
            title: Patients?.firstName ?? "",
            url: null,
            type: "",
          },
        ]}
      />
      <Card root={classes.CardrootStyle}>
        <Grid container>
          <Grid item sm={6} md={6} lg={6} xl={6}>
            <Button
              variant="contained"
              color="primary"
              classes={{ root: classes.MedicalAlertButtonStyle }}
              onClick={() => {
                history.push(`/PatientInvoice`);
              }}
              size="large"
            >
              <FontAwesomeIcon
                icon={faPlus}
                fontSize="medium"
                color="#ffffff"
                cursor="pointer"
                title="Print"
              />{" "}
              <Typography
                style={{
                  fontFamily: "Roboto",
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
              >
                Add Medical Alert
              </Typography>
            </Button>
          </Grid>
        </Grid>

        <Grid container style={{ borderTop: "1px solid black", marginTop: 5, height: "100%" }}>
          <Grid
            item
            sm={3}
            lg={2}
            md={3}
            xl={2}
            style={{ paddingLeft: 5, borderRight: "1px solid black", height: "100%" }}
          >
            <MiniSideBar />
          </Grid>
          <Grid item sm={9} lg={9} md={9} xl={9} style={{ paddingLeft: 5 }}>
            <PatientDetailPage
              patientData={Patient}
              numberType={PatientNumberType}
              PatientGender={PatientGender}
              PatientReminder={PatientReminder}
            />
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

export default PatientDetail;
