import React, { useState } from "react";
import { Grid, Container } from "@material-ui/core";
import { Link, useLocation, useParams } from "react-router-dom";
function MiniAside() {
  const location = useLocation();
  let params = useParams();

  return (
    <>
      <Grid container style={{ marginTop: 20 }}>
        <Grid
          container
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Grid item sm={12} md={12} lg={12} xl={12}>
            <Link
              to={`/PatientDetails/PatientId=${params.PatientId}`}
              style={{
                textDecoration: "none",
                color:
                  location.pathname.match("/PatientDetails") !== null
                    ? "#1976D2"
                    : "#000000",
              }}
            >
              Patient Detail
            </Link>
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
          style={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Grid item sm={12} md={12} lg={12} xl={12}>
            <Link
              to={`/TreatmentNotes/PatientId=${params.PatientId}`}
              style={{
                textDecoration: "none",
                color:
                  location.pathname.match("/TreatmentNotes") !== null
                    ? "#1976D2"
                    : "#000000",
              }}
            >
              Treatment Note
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: 20 }}>
        <Grid
          container
          sm={5}
          md={5}
          lg={1}
          xl={1}
          style={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Grid item sm={6} md={6} lg={6} xl={6}>
            <Link
              to={`/PatientFiles/PatientId=${params.PatientId}`}
              style={{
                textDecoration: "none",
                color:
                  location.pathname.match("/PatientFiles") !== null
                    ? "#1976D2"
                    : "#000000",
              }}
            >
              Files
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: 20 }}>
        <Grid
          container
          sm={5}
          md={1}
          lg={1}
          xl={1}
          style={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Grid item sm={6} md={6} lg={6} xl={6}>
            <Link
              to={`/Appointments/PatientId=${params.PatientId}`}
              style={{
                textDecoration: "none",
                color:
                  location.pathname.match("/Appointments") !== null
                    ? "#1976D2"
                    : "#000000",
              }}
            >
              Appointment
            </Link>
          </Grid>
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: 20 }}>
        <Grid
          container
          sm={5}
          md={1}
          lg={1}
          xl={1}
          style={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Grid item sm={6} md={6} lg={6} xl={6}>
            <Link
              to={`/PatientInvoices/PatientId=${params.PatientId}`}
              style={{
                textDecoration: "none",
                color:
                  location.pathname.match("/PatientInvoices") !== null
                    ? "#1976D2"
                    : "#000000",
              }}
            >
              Invoices
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default MiniAside;
