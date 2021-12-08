import React from "react";
import { AddUnit, GetUnits, EditUnit } from "../../../Api/Actions/unitActions";
import { GET_UNITS, ADD_UNITS, EDIT_UNITS } from "../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../../Components/Modal";
import Grid from "@material-ui/core/Grid";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "../../../Components/TextInput";
import Button from "../../../Components/Button";
function UnitForm(props) {
  const dispatch = useDispatch();
  var companyId;
  const userRecord = useSelector((state) => state.userReducer);
  companyId = userRecord?.UserState?.companyId ?? userRecord.companyId;
  React.useEffect(() => {
    GetUnits(companyId)
      .then((res) => {
        dispatch({ type: GET_UNITS, payload: res.data });
      })
      .catch((error) => {});
  }, []);
  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required().label("Full Name"),
    shortName: Yup.string().required().label("Short Name"),
  });
  let initialValues = {
    id: "",
    fullName: "",
    shortName: "",
  };
  if (props.SelectedData !== "") {
    initialValues = {
      id: props.SelectedData.id,
      fullName: props.SelectedData.FullName,
      shortName: props.SelectedData.ShortName,
    };
  }
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      props.close(false);
      let unit = {
        id: "",
        fullName: values.fullName,
        shortName: values.shortName,
        companyId: companyId,
      };
      if (props.SelectedData !== "") {
        unit = {
          id: props.SelectedData.id,
          fullName: values.fullName,
          shortName: values.shortName,
          companyId: companyId,
        };
        EditUnit(unit)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: EDIT_UNITS, payload: res.data });
              props.setshowSuccessAlert(true);
            }
          })
          .catch((error) => {
            props.setErrorMessage({
              message: error.response.data.message,
              title: error.response.data.title,
            });
            props.setshowErrorAlert(true);
          });
        props.setSelectedData("");
      } else {
        AddUnit(unit).then((res) => {
          if (res.status === 200) {
            dispatch({ type: ADD_UNITS, payload: res.data });
          }
        });
      }
    },
  });

  return (
    <Modal
      open={props.open}
      title={props.SelectedData === "" ? "Add Unit" : "Edit Unit"}
      close={props.close}
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid item container spacing={3}>
          <Grid item sm={6}>
            <TextField
              variant="outlined"
              id="fullName"
              label="Full Name"
              autoFocus
              value={formik.values.fullName}
              onChange={formik.handleChange}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              variant="outlined"
              id="shortName"
              label="Short Name"
              value={formik.values.shortName}
              onChange={formik.handleChange}
              error={
                formik.touched.shortName && Boolean(formik.errors.shortName)
              }
              helperText={formik.touched.shortName && formik.errors.shortName}
            />
          </Grid>
          <Grid item sm={4}></Grid>
          <Grid item sm={4}>
            {props.SelectedData === "" ? (
              <Button
                type="submit"
                fullWidth={false}
                variant="contained"
                color="primary"
                size="medium"
              >
                Add
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth={false}
                variant="contained"
                color="primary"
                size="medium"
              >
                Update
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
}

export default UnitForm;
