import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import Button from "../../../../Components/Button";
import { Grid, Typography, CssBaseline } from "@material-ui/core";
import BackDrop from "../../../../Components/BackDrop";
import Card from "../../../../Components/Card";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useHistory, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MiniSideBar from "./MiniSideBar";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TreatmentNotePage from "../MiniAsidePages/TreatmentNotePage";
import Header from "./Header";
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
function TreatmentNote() {
  const [ShowSpinner, setShowSpinner] = useState(false);
  const history = useHistory();
  const classes = useStyles();
  const param = useParams();
  const Patient = useSelector((state) => state.patientReducer).find(
    (e) => e.id === param.PatientId
  );
  const user = useSelector((state) => state.userReducer);

  return (
    <>
      <BackDrop open={ShowSpinner} />
      <CssBaseline />
      <Header
        items={[
          {
            title: `Welcome ${user?.UserState?.username ?? user?.username ?? ""
              } to CoreB`,
            url: null,
            type: "",
          },
          {
            title: "TreatmentNote",
            url: null,
            type: "",
          },
          {
            title: Patient?.firstName ?? "",
            url: null,
            type: "",
          },
        ]}
      />
      <Card root={classes.CardrootStyle}>
        <Grid container >
          <Grid item sm={12} md={6} lg={6} xl={6}>
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
            <TreatmentNotePage />
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

export default TreatmentNote;
