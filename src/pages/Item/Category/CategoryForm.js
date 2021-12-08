import React from "react";
import { ADD_CATEGORY, EDIT_CATEGORY } from "../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../../Components/Modal";
import Grid from "@material-ui/core/Grid";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "../../../Components/TextInput";
import Button from "../../../Components/Button";
import {
  AddCategory,
  EditCategory,
} from "../../../Api/Actions/categoryActions";
function CategoryForm(props) {
  const dispatch = useDispatch();
  var companyId;
  const userRecord = useSelector((state) => state.userReducer);
  companyId = userRecord?.UserState?.companyId ?? userRecord.companyId;
  const validationSchema = Yup.object().shape({
    title: Yup.string().required().label("Category Name"),
    description: Yup.string().required().label("Description"),
  });
  let initialValues = {
    id: "",
    title: "",
    description: "",
  };
  if (props.SelectedData !== "") {
    initialValues = {
      id: props.SelectedData.id,
      title: props.SelectedData.title,
      description: props.SelectedData.description,
    };
  }
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      props.close(false);
      let category = {
        id: "",
        title: values.title,
        description: values.description,
        companyId: companyId,
      };
      if (props.SelectedData !== "") {
        category = {
          id: props.SelectedData.id,
          title: values.title,
          description: values.description,
          companyId: companyId,
        };
        EditCategory(category)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: EDIT_CATEGORY, payload: res.data });
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
        AddCategory(category).then((res) => {
          if (res.status === 200) {
            dispatch({ type: ADD_CATEGORY, payload: res.data });
          }
        });
      }
    },
  });

  return (
    <Modal
      open={props.open}
      title={props.SelectedData === "" ? "Add Category" : "Edit Category"}
      close={props.close}
    >
      <form className={{}} onSubmit={formik.handleSubmit}>
        <Grid item container spacing={3}>
          <Grid item sm={6}>
            <TextField
              variant="outlined"
              id="title"
              label="Category Name"
              autoFocus
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>
          <Grid item sm={6}>
            <TextField
              variant="outlined"
              id="description"
              label="Description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid>
          <Grid item sm={4}></Grid>
          <Grid item sm={5}>
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

export default CategoryForm;
