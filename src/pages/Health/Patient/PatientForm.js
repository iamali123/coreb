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
import { useLocation, useParams, useHistory } from "react-router-dom";
import DatePicker from "../../../Components/DatePicker";
import dateformat from "dateformat";
import Checkbox from "@material-ui/core/Checkbox";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import AddIcon from "@material-ui/icons/Add";
import PatientRelationShipForm from "./PatientRelationShipForm";
import {
  PatientInitailValues,
  PatientInformationSchema,
} from "../../../Schema/Paitent/InitialValues";
import {
  ContactType,
  Gender,
  PatientRelationShips,
  ReminderType,
} from "../../../Enums/PatientEnum";
import {
  AddPatient,
  EditPatientAction,
} from "../../../Api/Actions/Health/Patient/PatientActions";
import { ADD_PATIENT, EDIT_PATIENT } from "../../../Redux/Constants";
import PatientContactInformationForm from "./PatientContactInformationForm";
import PatientRelationShipList from "./PatientRelationShipList";
import RadioButtons from "../../../Components/RadioButtons";
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
  AddBtnStyle: {
    backgroundColor: "#1976D2",
  },
}));
const PatientForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  var PatientId;

  if (params.PatientId !== null || params.PatientId !== undefined) {
    PatientId = params.PatientId;
  }

  const [ShowSpinner, setShowSpinner] = useState(false);
  const [PatientRelations, setPatientRelations] = useState([]);
  const [PrivacyPolicy, setPrivacyPolicy] = useState(false);
  const [BookingConfirmationchecked, setBookingConfirmationChecked] =
    useState(false);
  const [MarketingMessageschecked, setMarketingMessagesChecked] =
    useState(false);
  const [run, setrun] = useState(false);
  const user = useSelector((state) => state.userReducer);
  const [SelectedData, setSelectedData] = useState("");
  const [ShowModel, setShowModel] = useState(false);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  var EditGenderValue;
  var EditReminderValue;
  var EditPatient;

  const [filterValue, setFilterValue] = useState("No");
  const filterNames = ["No", "Yes"];

  const FilterPrivacyHandler = (event) => {
    setFilterValue(event.target.value);
    if (event.target.value === "Yes") {
      setPrivacyPolicy(1);
    } else {
      setPrivacyPolicy(0);
    }
  };
  var GenderList = Gender.map((gender) => ({
    title: gender.Title,
    value: gender.value,
    key: gender.value,
  }));
  var ReminderList = ReminderType.map((reminder) => ({
    title: reminder.Title,
    value: reminder.value,
    key: reminder.value,
  }));
  if (PatientId !== undefined) {
    EditPatient = useSelector((state) => state.patientReducer).find(
      (e) => e.id == PatientId
    );
  }
  const PatientsList = useSelector((patient) => patient.patientReducer).map(
    (pat) => ({
      title: pat.firstName + " " + pat.lastName,
      key: pat.id,
      value: pat.id,
    })
  );
  const RelationShip = PatientRelationShips.map((relation) => ({
    title: relation.Title,
    key: relation.value,
    value: relation.value,
  }));
  useEffect(() => {
    if (EditPatient !== undefined) {
      let relationShipList = EditPatient.patientRelationShipModel.map(
        (patient) => {
          let getpatient = PatientsList.find(
            (e) => e.key === patient.patientId
          );
          let getrelation = RelationShip.find(
            (e) => e.key.toString() === patient.relationShips.toString()
          );
          return {
            id: patient.id,
            patientId: patient.patientId,
            relativeName: getpatient.title,
            relation: getrelation.title,
            relationShips: patient.relationShips,
          };
        }
      );
      setPatientRelations(relationShipList);
      setPrivacyPolicy(
        patientFormik?.values?.patientPrivacyPolicieModel[0]
          ?.privacyPolicyStatus === true
          ? 1
          : 0
      );
      setFilterValue(
        patientFormik?.values?.patientPrivacyPolicieModel[0]
          ?.privacyPolicyStatus === true
          ? "Yes"
          : "No"
      );
      setBookingConfirmationChecked(
        patientFormik?.values?.patientCommunicationPreferenceModel[0]
          ?.allowBookingConfirmationEmail ?? false
      );
      setMarketingMessagesChecked(
        patientFormik?.values?.patientCommunicationPreferenceModel[0]
          ?.allowMarketingMessagesEmail ?? false
      );
      setrun(!run);
    }
  }, [EditPatient]);
  const [NewReminderValue, setNewReminderValue] = useState(
    EditReminderValue === undefined ? [] : EditReminderValue[0]
  );
  const patientFormik = useFormik({
    initialValues:
      EditPatient !== undefined ? EditPatient : PatientInitailValues,
    validationSchema: PatientInformationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      let relationShipObject = PatientRelations.map((e) => ({
        id: e.id === undefined ? "0" : e.id,
        relationShips: parseInt(e.relationShips),
        patientId: e.patientId,
      }));

      let PatientObject = {
        id: values.id === "" ? "" : values.id,
        patientNumber: values.patientNumber,
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth,
        cnic: values.cnic,
        gender: parseInt(values.gender),
        occupation: values.occupation,
        age: values.age.toString(),
        numberType: parseInt(values.numberType),
        contactNumber: values.contactNumber,
        email: values.email,
        streetAddress: values.streetAddress,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        countryId: values.countryId,
        countryName: values.countryName,
        companyId: companyId,
        patientRelationShipModel: relationShipObject,
        patientPrivacyPolicieModel: [
          {
            id: values.patientPrivacyPolicieModel[0]?.id ?? "0",
            privacyPolicyStatus: PrivacyPolicy === 0 ? false : true,
            patientId: values.id !== "" ? values.id : "0",
          },
        ],
        patientCommunicationPreferenceModel: [
          {
            id: EditPatient?.patientCommunicationPreferenceModel[0]?.id ?? "0",
            allowBookingConfirmationEmail:
              values.allowBookingConfirmationEmail === undefined
                ? BookingConfirmationchecked
                : values.allowBookingConfirmationEmail,
            allowMarketingMessagesEmail:
              values.allowMarketingMessagesEmail === undefined
                ? MarketingMessageschecked
                : values.MarketingMessageschecked,
            reminderType: parseInt(
              values.reminderType === undefined
                ? NewReminderValue.key
                : values.reminderType
            ),
            patientId: values.id !== "" ? values.id : "0",
          },
        ],
      };
      if (PatientObject.id === "") {
        setShowSpinner(true);
        AddPatient(PatientObject)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: ADD_PATIENT, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Patient Save SuccessFully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push({
                  pathname: `/PatientDetails/PatientId=${res.data.id}`,
                  patientId: res.data.id,
                });
              }, 1200);
            }
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
            setShowSpinner(false);
          });
      } else {
        setShowSpinner(true);
        EditPatientAction(PatientObject)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: EDIT_PATIENT, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Patient Update SuccessFully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push({
                  pathname: `/PatientDetails/PatientId=${res.data.id}`,
                  patientId: res.data.id,
                });
              }, 1200);
            }
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
            setShowSpinner(false);
          });
      }
    },
  });
  const [NewGenderValue, setNewGenderValue] = useState(
    EditGenderValue === undefined ? [] : EditGenderValue[0]
  );

  useEffect(() => {
    EditGenderValue = GenderList.filter(
      (x) => x.key.toString() === patientFormik.values.gender.toString()
    ).map((gender) => ({
      title: gender.title,
      value: gender.value,
      key: gender.value,
    }));
    if (
      patientFormik.values.patientCommunicationPreferenceModel === undefined
    ) {
      EditReminderValue = ReminderList.filter(
        (x) => x.key.toString() === patientFormik.values.reminderType.toString()
      ).map((reminder) => ({
        title: reminder.title,
        value: reminder.value,
        key: reminder.value,
      }));
    } else {
      EditReminderValue = ReminderList.filter(
        (x) =>
          x.key.toString() ===
          patientFormik.values.patientCommunicationPreferenceModel[0].reminderType.toString()
      ).map((reminder) => ({
        title: reminder.title,
        value: reminder.value,
        key: reminder.value,
      }));
    }

    setNewGenderValue(EditGenderValue[0]);
    setNewReminderValue(EditReminderValue[0]);
  }, [run]);
  const ModalCloseHandler = () => {
    setShowModel(false);
    setSelectedData("");
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
                  title: "Patient List",
                  url: "/Patient",
                },
                {
                  title: params?.PatientId ? "Edit Patient" : "New Patient",
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
                history.push(`/Patient`);
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
              onClick={patientFormik.handleSubmit}
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
        <form onSubmit={patientFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="patientNumber"
                label="Patient Number"
                InputProps={{
                  readOnly: true,
                }}
                value={patientFormik.values.patientNumber}
                onChange={patientFormik.handleChange}
                size="small"
                fullWidth
                error={
                  patientFormik.touched.patientNumber &&
                  Boolean(patientFormik.errors.patientNumber)
                }
                helperText={
                  patientFormik.touched.patientNumber &&
                  patientFormik.errors.patientNumber
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="cnic"
                label="CNIC"
                value={patientFormik.values.cnic}
                onChange={patientFormik.handleChange}
                size="small"
                fullWidth
                error={
                  patientFormik.touched.cnic &&
                  Boolean(patientFormik.errors.cnic)
                }
                helperText={
                  patientFormik.touched.cnic && patientFormik.errors.cnic
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
              <TextField
                variant="outlined"
                id="firstName"
                label="First Name *"
                value={patientFormik.values.firstName}
                onChange={patientFormik.handleChange}
                size="small"
                fullWidth
                error={
                  patientFormik.touched.firstName &&
                  Boolean(patientFormik.errors.firstName)
                }
                helperText={
                  patientFormik.touched.firstName &&
                  patientFormik.errors.firstName
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="lastName"
                label="Last Name *"
                value={patientFormik.values.lastName}
                onChange={patientFormik.handleChange}
                size="small"
                fullWidth
                error={
                  patientFormik.touched.lastName &&
                  Boolean(patientFormik.errors.lastName)
                }
                helperText={
                  patientFormik.touched.lastName &&
                  patientFormik.errors.lastName
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
                id="dateOfBirth"
                label="Date Of Birth"
                defaultValue={dateformat(
                  patientFormik.values.dateOfBirth,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={patientFormik.handleChange}
                onBlur={(e) => {
                  var dob = new Date(patientFormik.values.dateOfBirth);
                  var diff_ms = Date.now() - dob.getTime();
                  var age_dt = new Date(diff_ms);
                  patientFormik.setFieldValue(
                    "age",
                    Math.abs(age_dt.getUTCFullYear() - 1970)
                  );
                }}
                error={
                  patientFormik.touched.dateOfBirth &&
                  Boolean(patientFormik.errors.dateOfBirth)
                }
                helperText={
                  patientFormik.touched.dateOfBirth &&
                  patientFormik.errors.dateOfBirth
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="age"
                label="Age"
                value={patientFormik.values.age}
                onChange={patientFormik.handleChange}
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                error={
                  patientFormik.touched.age && Boolean(patientFormik.errors.age)
                }
                helperText={
                  patientFormik.touched.age && patientFormik.errors.age
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
                id="gender"
                label="Gender"
                value={NewGenderValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  patientFormik.setFieldValue(
                    "gender",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  patientFormik.setFieldValue(
                    "gender",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );

                  setNewGenderValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={GenderList}
                error={
                  patientFormik.touched.gender &&
                  Boolean(patientFormik.errors.gender)
                }
                helperText={
                  patientFormik.touched.gender && patientFormik.errors.gender
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="occupation"
                label="Occupation"
                value={patientFormik.values.occupation}
                onChange={patientFormik.handleChange}
                size="small"
                fullWidth
                error={
                  patientFormik.touched.occupation &&
                  Boolean(patientFormik.errors.occupation)
                }
                helperText={
                  patientFormik.touched.occupation &&
                  patientFormik.errors.occupation
                }
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={12} md={12} lg={12} style={{ marginTop: 20 }}>
              <Typography
                style={{ fontFamily: "Roboto", fontSize: 24, color: "#393939" }}
              >
                Contact Information
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ border: "2px solid #1976D2" }}
            ></Grid>
          </Grid>
          <PatientContactInformationForm
            patientFormik={patientFormik}
            run={run}
            setrun={setrun}
          />
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginTop: 20 }}
          >
            <Grid xs={12} sm={5} md={5} lg={5}>
              <Typography
                style={{
                  fontFamily: "Roboto",
                  fontSize: 24,
                  color: "#393939",
                }}
              >
                Related Patients
              </Typography>
            </Grid>
            <Grid
              xs={12}
              sm={5}
              md={5}
              lg={5}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                classes={{ root: classes.AddBtnStyle }}
                size="large"
                onClick={() => {
                  setShowModel(true);
                }}
              >
                <AddIcon fontSize="small" />

                <Typography
                  style={{
                    fontFamily: "Roboto",
                    fontSize: 15,
                    textTransform: "capitalize",
                  }}
                >
                  Add RelationShip
                </Typography>
              </Button>
            </Grid>
          </Grid>

          <Grid container style={{ marginTop: 3 }}>
            <Grid
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ border: "2px solid #1976D2" }}
            ></Grid>
          </Grid>
          <PatientRelationShipList
            patientFormik={patientFormik}
            PatientRelations={PatientRelations}
            setPatientRelations={setPatientRelations}
            run={run}
            setrun={setrun}
            SelectedData={SelectedData}
            setSelectedData={setSelectedData}
            close={ModalCloseHandler}
            open={setShowModel}
          />
          {ShowModel === true && (
            <PatientRelationShipForm
              run={run}
              setrun={setrun}
              PatientRelations={PatientRelations}
              setPatientRelations={setPatientRelations}
              close={ModalCloseHandler}
              open={ShowModel}
              SelectedData={SelectedData}
              setSelectedData={setSelectedData}
            />
          )}
          <Grid container>
            <Grid xs={12} sm={12} md={12} lg={12} style={{ marginTop: 20 }}>
              <Typography
                style={{ fontFamily: "Roboto", fontSize: 24, color: "#393939" }}
              >
                Privacy Policy
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ border: "2px solid #1976D2" }}
            ></Grid>
          </Grid>
          <Grid container style={{ marginTop: 20 }}>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <Typography
                style={{ fontFamily: "Roboto", fontSize: 16, color: "#857D7D" }}
              >
                Does the patient consent to our privacy policy?
              </Typography>
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: 20 }}>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <RadioButtons
                filterName={filterNames}
                filterValue={filterValue}
                FilterHandler={FilterPrivacyHandler}
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid xs={12} sm={12} md={12} lg={12} style={{ marginTop: 20 }}>
              <Typography
                style={{ fontFamily: "Roboto", fontSize: 24, color: "#393939" }}
              >
                Communication Preference
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              xs={12}
              sm={12}
              md={12}
              lg={12}
              style={{ border: "2px solid #1976D2" }}
            ></Grid>
          </Grid>
          <Grid container style={{ marginTop: 20 }}>
            <Grid container xs={12} sm={8} md={8} lg={8}>
              <Grid xs={12} sm={1} md={1} lg={1}>
                <Checkbox
                  checked={BookingConfirmationchecked}
                  onChange={(e) => {
                    setBookingConfirmationChecked(e.target.checked);
                  }}
                  inputProps={{ "aria-label": "secondary  checkbox" }}
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6} style={{ marginTop: 10 }}>
                <Typography
                  style={{
                    fontFamily: "Roboto",
                    fontSize: 16,
                    color: "#857D7D",
                  }}
                >
                  Receive booking confirmation through Email Address
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginTop: 20, marginLeft: 15 }}
          >
            <Grid xs={12} sm={3} md={3} lg={3}>
              <DropDownTextField
                variant="standard"
                id="reminderType"
                label="Automated Reminder Type"
                value={NewReminderValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  patientFormik.setFieldValue(
                    "reminderType",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  patientFormik.setFieldValue(
                    "reminderType",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );

                  setNewReminderValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={ReminderList}
              />
            </Grid>
          </Grid>
          <Grid container style={{ marginTop: 20 }}>
            <Grid container xs={12} sm={8} md={8} lg={8}>
              <Grid xs={12} sm={1} md={1} lg={1}>
                <Checkbox
                  checked={MarketingMessageschecked}
                  onChange={(e) => {
                    setMarketingMessagesChecked(e.target.checked);
                  }}
                  inputProps={{ "aria-label": "secondary  checkbox" }}
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6} style={{ marginTop: 10 }}>
                <Typography
                  style={{
                    fontFamily: "Roboto",
                    fontSize: 16,
                    color: "#857D7D",
                  }}
                >
                  Receive marketing messages through Email Address
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Card>
    </>
  );
};

export default PatientForm;
