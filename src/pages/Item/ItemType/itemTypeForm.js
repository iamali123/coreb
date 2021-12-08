import React from "react";
import { AddUnit, GetUnits, EditUnit } from "../../../Api/Actions/unitActions";
import {
  GET_UNITS,
  ADD_UNITS,
  EDIT_UNITS,
  EDIT_PRODUCT_TYPE,
  ADD_PRODUCT_TYPE,
  GET_PRODUCT_TYPE,
} from "../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../../Components/Modal";
import Grid from "@material-ui/core/Grid";
import { useFormik } from "formik";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/core";
import TextField from "../../../Components/TextInput";
import Button from "../../../Components/Button";
import {
  AddProductType,
  EditProductType,
  GetProductType,
} from "../../../Api/Actions/productTypeActions";
function ItemTypeForm(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  var companyId;
  const userRecord = useSelector((state) => state.userReducer);
  companyId = userRecord?.UserState?.companyId ?? userRecord.companyId;
  React.useEffect(() => {
    GetProductType(companyId)
      .then((res) => {
        dispatch({ type: GET_PRODUCT_TYPE, payload: res.data });
      })
      .catch((error) => {});
  }, []);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("please enter the product type").label("name"),
  });
  let initialValues = {
    id: "",
    name: "",
  };
  if (props.SelectedData !== "") {
    initialValues = {
      id: props.SelectedData.id,
      name: props.SelectedData.name,
    };
  }
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      props.close(false);
      let type = {
        id: "",
        name: values.name,
        companyId: companyId,
      };
      if (props.SelectedData !== "") {
        type = {
          id: props.SelectedData.id,
          name: values.name,
          companyId: companyId,
        };
        EditProductType(type)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: EDIT_PRODUCT_TYPE, payload: res.data });
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
        AddProductType(type).then((res) => {
          if (res.status === 200) {
            dispatch({ type: ADD_PRODUCT_TYPE, payload: res.data });
          }
        });
      }
    },
  });

  return (
    <Modal
      open={props.open}
      title={
        props.SelectedData === "" ? "Add Product Type" : "Edit Product Type"
      }
      close={props.close}
    >
      <form className={{}} onSubmit={formik.handleSubmit}>
        <Grid container spacing={3} justifyContent="flex-end">
          <Grid item sm={12} md={12} lg={12}>
            <TextField
              variant="outlined"
              id="name"
              label="Product Type *"
              autoFocus
              value={formik.values.name}
              onChange={formik.handleChange}
              fullWidth
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end">
          <Grid sm={12} md={6} lg={5}>
            {props.SelectedData === "" ? (
              <Button
                type="submit"
                fullWidth={false}
                variant="contained"
                color="primary"
                size="medium"
                classes={{ root: classes.AddProductStyle }}
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
                classes={{ root: classes.AddProductStyle }}
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
const useStyles = makeStyles((theme) => ({
  AddProductStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignSelf: "center",
    marginTop: "20%",
  },
}));
export default ItemTypeForm;
