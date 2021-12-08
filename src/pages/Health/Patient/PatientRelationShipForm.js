import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../../Components/Modal";
import { Grid, Typography } from "@material-ui/core";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/core";
import DropDownTextField from "../../../Components/Dropdown/SearchableDropdown";
import { PatientRelationShips } from "../../../Enums/PatientEnum";
import Button from "../../../Components/Button";
import { patientRelationShipModel } from "../../../Schema/Paitent/InitialValues";
const useStyles = makeStyles((theme) => ({
  CancelButtonStyle: {
    marginRight: 20,
    backgroundColor: "#D4D4D4",
  },
  savebtnStyle: {
    backgroundColor: "#1976D2",
    padding: "8px 30px",
  },
}));
function PatientRelationShipForm({
  run,
  close,
  SelectedData,
  open,
  PatientRelations,
  setPatientRelations,
}) {
  const classes = useStyles();
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

  var EditPatientRelation;
  var EditRelation;
  const [NewPatientValue, setNewPatientValue] = useState(
    EditPatientRelation === undefined ? [] : EditPatientRelation[0]
  );
  const [NewRelationValue, setNewRelationValue] = useState(
    EditPatientRelation === undefined ? [] : EditPatientRelation[0]
  );
  useEffect(() => {
    EditPatientRelation = PatientsList.filter(
      (x) => x.key.toString() === formik.values.patientId.toString()
    ).map((patient) => ({
      title: patient.title,
      value: patient.value,
      key: patient.key,
    }));
    EditRelation = RelationShip.filter(
      (x) => x.key.toString() === formik.values.relationShips.toString()
    ).map((relation) => ({
      title: relation.title,
      value: relation.value,
      key: relation.key,
    }));

    setNewPatientValue(EditPatientRelation[0]);
    setNewRelationValue(EditRelation[0]);
  }, [run]);
  const formik = useFormik({
    initialValues:
      SelectedData !== "" ? SelectedData : patientRelationShipModel,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      if (SelectedData === "") {
        if (values.patientId !== "" && values.relationShips !== "") {
          let patient = PatientsList.find((e) => e.key === values.patientId);
          let relation = RelationShip.find(
            (e) => e.key.toString() === values.relationShips.toString()
          );
          let isDuplicateEntry = PatientRelations.filter(
            (patient) => patient.patientId === values.patientId
          ).length;
          if (isDuplicateEntry === 0) {
            setPatientRelations([
              ...PatientRelations,
              {
                patientId: values.patientId,
                relativeName: patient.title,
                relation: relation.title,
                relationShips: values.relationShips,
              },
            ]);
          }
        }
      } else {
        let isDuplicateEntry = PatientRelations.filter(
          (patient) => patient.patientId === values.patientId
        ).length;
        if (isDuplicateEntry > 0) {
          setPatientRelations(
            PatientRelations.map((patient) => {
              if (patient.patientId === values.patientId) {
                let getpatient = PatientsList.find(
                  (e) => e.key === values.patientId
                );
                let getrelation = RelationShip.find(
                  (e) => e.key.toString() === values.relationShips.toString()
                );
                patient.relativeName = getpatient.title;
                patient.relation = getrelation.title;
                patient.relationShips = values.relationShips;
                return {
                  ...patient,
                };
              } else {
                return patient;
              }
            })
          );
        } else {
          if (values.patientId !== "" && values.relationShips !== "") {
            setPatientRelations(
              PatientRelations.map((patient) => {
                if (patient.patientId === values.patientId) {
                  let getpatient = PatientsList.find(
                    (e) => e.key === values.patientId
                  );
                  let getrelation = RelationShip.find(
                    (e) => e.key.toString() === values.relationShips.toString()
                  );
                  patient.relativeName = getpatient.title;
                  patient.relation = getrelation.title;
                  return {
                    ...patient,
                  };
                } else {
                  let getpatient = PatientsList.find(
                    (e) => e.key === values.patientId
                  );
                  let getrelation = RelationShip.find(
                    (e) => e.key.toString() === values.relationShips.toString()
                  );
                  patient.relativeName = getpatient.title;
                  patient.relation = getrelation.title;
                  return patient;
                }
              })
            );
          }
        }
      }
      close(false);
    },
  });
  return (
    <Modal
      open={open}
      title={SelectedData === "" ? "Add RelationShip" : "Edit RelatioShip"}
      close={close}
    >
      <form className={{}} onSubmit={formik.handleSubmit}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid xs={12} sm={5} md={5} lg={5}>
            <DropDownTextField
              variant="standard"
              id="patientId"
              label="Patients *"
              value={NewPatientValue}
              size="small"
              fullWidth
              onChange={(event, value) => {
                formik.setFieldValue(
                  "patientId",
                  value === null || value === undefined
                    ? ""
                    : value.key.toString()
                );
                formik.setFieldValue(
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
                formik.touched.patientId && Boolean(formik.errors.patientId)
              }
              helperText={formik.touched.patientId && formik.errors.patientId}
            />
          </Grid>
          <Grid xs={12} sm={5} md={5} lg={5}>
            <DropDownTextField
              variant="standard"
              id="relationShips"
              label="RelationShip *"
              value={NewRelationValue}
              size="small"
              fullWidth
              onChange={(event, value) => {
                formik.setFieldValue(
                  "relationShips",
                  value === null || value === undefined
                    ? ""
                    : value.key.toString()
                );
                formik.setFieldValue(
                  "relationShips",
                  value === null ||
                    value === undefined ||
                    value.key === null ||
                    value.key === undefined
                    ? ""
                    : value.key.toString()
                );

                setNewRelationValue(
                  value === null || value === undefined ? "" : value
                );
              }}
              data={RelationShip}
              error={
                formik.touched.relationShips &&
                Boolean(formik.errors.relationShips)
              }
              helperText={
                formik.touched.relationShips && formik.errors.relationShips
              }
            />
          </Grid>
        </Grid>

        <Grid container style={{ marginTop: 30 }} justifyContent="flex-end">
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
                close();
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
              {SelectedData === "" ? (
                <Typography
                  style={{
                    fontFamily: "Roboto",
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Save
                </Typography>
              ) : (
                <Typography
                  style={{
                    fontFamily: "Roboto",
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Update
                </Typography>
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
}

export default PatientRelationShipForm;
