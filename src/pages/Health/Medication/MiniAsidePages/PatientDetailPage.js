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
  faEnvelope,
  faGenderless,
  faHistory,
  faHome,
  faInfoCircle,
  faMapPin,
  faPen,
  faPhone,
  faUser,
  faUserClock,
  faUserMd,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../../../Components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import dateformat from "dateformat";
import { useParams, useHistory } from "react-router-dom";
import React from "react";
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
    margin: 15,
  },
  EditButtonStyle: {
    backgroundColor: "#D4D4D4",
  },
}));
function PatientDetailPage(props) {
  const classes = useStyles();
  let param = useParams();
  const history = useHistory();

  return (
    <>
      <CssBaseline />
      <Grid container style={{ marginTop: 5 }}>
        <Grid
          container
          sm={12}
          lg={12}
          xl={12}
          md={12}
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Grid
            item
            sm={6}
            md={5}
            lg={4}
            xl={3}
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: 5,
            }}
          >
            <Button
              variant="contained"
              color="#857D7D"
              classes={{ root: classes.EditButtonStyle }}
              onClick={() => {
                window.open(`/Patient/PatientId=${param.PatientId}`, "_blank");
              }}
              size="small"
            >
              <FontAwesomeIcon
                icon={faPen}
                fontSize="medium"
                color="#000000"
                cursor="pointer"
                title="Edit"
              />
              <Typography
                style={{
                  fontFamily: "Roboto",
                  fontSize: 15,
                  fontWeight: "bold",
                  paddingLeft: 3,
                }}
              >
                Edit
              </Typography>
            </Button>
          </Grid>
          <Grid item sm={6} md={5} lg={4} xl={3}>
            <Button
              variant="contained"
              color="primary"
              classes={{ root: classes.EditButtonStyle }}
              onClick={() => { }}
              size="small"
            >
              <FontAwesomeIcon
                icon={faHistory}
                fontSize="medium"
                color="#000000"
                cursor="pointer"
                title="History"
              />
              <Typography
                style={{
                  fontFamily: "Roboto",
                  fontSize: 15,
                  fontWeight: "bold",
                  color: "#000000",
                }}
              >
                History
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Container classes={{ root: classes.ContainerStyle }}>
        <Grid container>
          <Grid item sm={12} md={12} lg={12} xl={12}>
            <Typography
              variant="h5"
              style={{
                color: "#1976D2",
                fontWeight: "bold",
              }}
            >
              Contact Information
              <FontAwesomeIcon
                icon={faAddressCard}
                size="md"
                color="#1976D2"
                title="Contact Information"
                style={{ marginLeft: 5 }}
              />
            </Typography>

            <Divider
              style={{ border: "1px solid black", width: "100% !important" }}
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
              <Typography variant="p" classes={{ root: classes.HeadingStyle }}>
                <FontAwesomeIcon
                  icon={faPhone}
                  size="md"
                  color="#1976D2"
                  title="Contact Information"
                  style={{ marginRight: 5 }}
                />
                Phone Number
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
                {props?.patientData?.contactNumber +
                  "(" +
                  props?.numberType +
                  ")" ?? "N/A"}
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
              <Typography variant="p" classes={{ root: classes.HeadingStyle }}>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  size="md"
                  color="#1976D2"
                  title="Contact Information"
                  style={{ marginRight: 5 }}
                />
                Email Address
              </Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sm={5}
              lg={4}
              md={5}
              xl={3}
              classes={{ root: classes.InfoStyle }}
            >
              <Typography variant="p">
                {" "}
                {props?.patientData?.email ?? "N/A"}
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
              <Typography variant="p" classes={{ root: classes.HeadingStyle }}>
                <FontAwesomeIcon
                  icon={faHome}
                  size="md"
                  color="#1976D2"
                  title="Contact Information"
                  style={{ marginRight: 5 }}
                />
                Address
              </Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sm={5}
              lg={5}
              md={5}
              xl={4}
              classes={{ root: classes.InfoStyle }}
            >
              <Typography variant="p">
                {props?.patientData?.streetAddress ?? "N/A"},
                {props?.patientData?.state ?? "N/A"}
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
              <Typography variant="p" classes={{ root: classes.HeadingStyle }}>
                <FontAwesomeIcon
                  icon={faMapPin}
                  size="md"
                  color="#1976D2"
                  title="Contact Information"
                  style={{ marginRight: 5 }}
                />
                Postal Code
              </Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sm={5}
              lg={4}
              md={5}
              xl={3}
              classes={{ root: classes.InfoStyle }}
            >
              <Typography variant="p">
                {props?.patientData?.postalCode ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Container classes={{ root: classes.ContainerStyle }}>
        <Grid container>
          <Grid item sm={12} md={12} lg={12} xl={12}>
            <Typography
              variant="h5"
              style={{
                color: "#1976D2",
                fontWeight: "bold",
              }}
            >
              General Information
              <FontAwesomeIcon
                icon={faInfoCircle}
                size="md"
                color="#1976D2"
                title="General Information"
                style={{ marginLeft: 5 }}
              />
            </Typography>
            <Divider
              style={{ border: "1px solid black", width: "100% !important" }}
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
              <Typography variant="p" classes={{ root: classes.HeadingStyle }}>
                <FontAwesomeIcon
                  icon={faUser}
                  size="md"
                  color="#1976D2"
                  title="Patient Name"
                  style={{ marginRight: 5 }}
                />
                Name
              </Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sm={5}
              lg={4}
              md={5}
              xl={3}
              classes={{ root: classes.InfoStyle }}
            >
              <Typography variant="p">
                {props?.patientData?.firstName ?? "N/A"}
                {props?.patientData?.lastName ?? "N/A"}
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
              <FontAwesomeIcon
                icon={faGenderless}
                size="md"
                color="#1976D2"
                title="Gender"
                style={{ marginRight: 5 }}
              />
              <Typography variant="p" classes={{ root: classes.HeadingStyle }}>
                Gender
              </Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sm={5}
              lg={4}
              md={5}
              xl={3}
              classes={{ root: classes.InfoStyle }}
            >
              <Typography variant="p">
                {props?.PatientGender ?? "N/A"}
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
              <Typography variant="p" classes={{ root: classes.HeadingStyle }}>
                <FontAwesomeIcon
                  icon={faBirthdayCake}
                  size="md"
                  color="#1976D2"
                  title="Date Of Birth"
                  style={{ marginRight: 5 }}
                />
                DOB
              </Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sm={5}
              lg={4}
              md={5}
              xl={3}
              classes={{ root: classes.InfoStyle }}
            >
              <Typography variant="p">
                {dateformat(props?.patientData?.dateOfBirth, "dd mmm,yyyy") ??
                  "N/A"}
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
              <Typography variant="p" classes={{ root: classes.HeadingStyle }}>
                <FontAwesomeIcon
                  icon={faUserMd}
                  size="md"
                  color="#1976D2"
                  title="Occupation"
                  style={{ marginRight: 5 }}
                />
                Occupation
              </Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sm={5}
              lg={4}
              md={5}
              xl={3}
              classes={{ root: classes.InfoStyle }}
            >
              <Typography variant="p">
                {props?.patientData?.occupation ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Container classes={{ root: classes.ContainerStyle }} style={{ paddingBottom: 24 }}>
        <Grid container>
          <Grid item sm={12} md={12} lg={12} xl={12}>
            <Typography
              variant="h5"
              style={{
                color: "#1976D2",
                fontWeight: "bold",
              }}
            >
              Communication Preference
              <FontAwesomeIcon
                icon={faBell}
                size="md"
                color="#1976D2"
                title="Communication Preference"
                style={{ marginLeft: 5 }}
              />
            </Typography>
            <Divider
              style={{ border: "1px solid black", width: "100% !important" }}
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
            <Grid item xs={5} sm={5} lg={5} md={5} xl={5}>
              <Typography variant="p" classes={{ root: classes.HeadingStyle }}>
                <FontAwesomeIcon
                  icon={faUserClock}
                  size="md"
                  color="#1976D2"
                  title="Automated reminder type"
                  style={{ marginRight: 5 }}
                />
                Automated reminder type
              </Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sm={5}
              lg={4}
              md={5}
              xl={3}
              classes={{ root: classes.InfoStyle }}
            >
              <Typography variant="p">
                {props?.PatientReminder ?? "N/A"}
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
            <Grid item xs={8} sm={8} lg={8} md={8} xl={8}>
              <Typography variant="p" classes={{ root: classes.HeadingStyle }}>
                <FontAwesomeIcon
                  icon={faUserClock}
                  size="md"
                  color="#1976D2"
                  title="Receive bookings through email"
                  style={{ marginRight: 5 }}
                />
                Receive bookings through email
              </Typography>
            </Grid>
            <Grid
              item
              xs={5}
              sm={5}
              lg={4}
              md={5}
              xl={3}
              classes={{ root: classes.InfoStyle }}
            >
              <Typography variant="p">
                {props?.patientData?.patientCommunicationPreferenceModel[0]
                  ?.allowMarketingMessagesEmail === true
                  ? "Yes"
                  : "No" ?? "N/A"}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default PatientDetailPage;
