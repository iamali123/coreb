import React, { useState } from "react";
import {
  AddVariant,
  GetVariants,
  EditVariant,
} from "../../../../Api/Actions/variantActions";
import {
  GET_VARIANTS,
  ADD_VARIANT,
  DELETE_VARIANT,
  EDIT_VARIANT,
} from "../../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import Modal from "../../../../Components/Modal";
import Grid from "@material-ui/core/Grid";
import { useLocation, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "../../../../Components/TextInput";
import Button from "../../../../Components/Button";
import { Chips } from "primereact/chips";
import { Typography, Divider } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import Swal from "sweetalert2";
const useStyles = makeStyles((theme) => ({
  divider: {
    background: "#707070",
  },
  dismissBtn: {
    backgroundColor: "#D4D4D4",
  },
  saveBtn: {
    backgroundColor: "#1976D2",
  },
}));
function VariantForm(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const params = useParams();
  var companyId;
  var itemId;
  const userRecord = useSelector((state) => state.userReducer);
  companyId = userRecord?.UserState?.companyId ?? userRecord.companyId;

  if (params.productId !== null || params.productId !== undefined) {
    itemId = params.productId;
  }

  React.useEffect(() => {
    GetVariants(companyId, itemId)
      .then((res) => {
        dispatch({ type: GET_VARIANTS, payload: res.data });
      })
      .catch((error) => {});
  }, []);

  const validationSchema = Yup.object().shape({
    attributeName: Yup.string().required().label("Attribute Name"),
  });

  //Default Initial Values of Item Variants
  let initialValues = {
    id: "",
    attributeName: "",
    companyId: "",
    itemId: "",
    itemVariantValues: [],
  };
  // Set Initial Values in Edit Case of Item Variant

  if (props.SelectedData !== "") {
    initialValues = {
      id: props.SelectedData.id,
      attributeName: props.SelectedData.AttributeName,
      companyId: companyId,
      itemId: props.SelectedData.ItemId,
      itemVariantValues: props.SelectedData.ItemVariantValues.map((e) => {
        return e.valueName;
      }),
    };
  }
  // Use of Formik
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      let variants = [];
      if (props.SelectedData) {
        variants = values.itemVariantValues.map((item) => {
          const attributeValueObject =
            props.SelectedData.ItemVariantValues.find((attributeValue) => {
              if (attributeValue.valueName === item) {
                return true;
              } else {
                return false;
              }
            });
          return {
            valueName: item,
            valueId: attributeValueObject ? attributeValueObject.valueId : 0,
          };
        });
      } else {
        variants = values.itemVariantValues.map((item) => {
          return {
            valueName: item,
            valueId: 0,
          };
        });
      }
      props.close(false);
      let variant = {
        id: "",
        AttributeName: values.attributeName,
        companyId: companyId,
        itemId: itemId,
        itemVariantValues: variants,
      };
      if (props.SelectedData !== "") {
        variant = {
          id: props.SelectedData.id,
          attributeName: values.attributeName,
          companyId: values.companyId,
          itemId: values.itemId,
          itemVariantValues: variants,
        };
        props.setShowSpinner(true);
        EditVariant(variant)
          .then((res) => {
            if (res.status === 200) {
              props.setShowSpinner(false);
              dispatch({ type: EDIT_VARIANT, payload: res.data });
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Variant Edit Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((error) => {
            props.setShowSpinner(false);
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
        props.setSelectedData("");
      } else {
        props.setShowSpinner(true);
        AddVariant(variant)
          .then((res) => {
            props.setShowSpinner(false);
            if (res.status === 200) {
              dispatch({ type: ADD_VARIANT, payload: res.data });
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Variant Saved Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((error) => {
            props.setShowSpinner(false);
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
    },
  });

  return (
    <Modal
      open={props.open}
      title={props.SelectedData === "" ? "Add Attribute " : "Edit  Attribute "}
      close={props.close}
      ModalWidth={"50%"}
    >
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={8} lg={6}>
            <TextField
              variant="outlined"
              id="attributeName"
              label="Attribute"
              autoFocus
              fullWidth
              required
              value={formik.values.attributeName}
              onChange={formik.handleChange}
              error={
                formik.touched.attributeName &&
                Boolean(formik.errors.attributeName)
              }
              helperText={
                formik.touched.attributeName && formik.errors.attributeName
              }
            />
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item sm={12} md={12} lg={12}>
            <Typography style={{ color: "#857D7D", fontFamily: "Roboto" }}>
              Value
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Divider classes={{ root: classes.divider }} />
            <Typography
              style={{
                color: "#000000",
                fontFamily: "Roboto",
                fontWeight: "bold",
                fontSize: 18,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: "#F2EDED",
                padding: 10,
              }}
            >
              {"Attribute"}
            </Typography>
            <Divider classes={{ root: classes.divider }} />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item sm={12} md={12} lg={12} className="card p-fluid">
            <Chips
              value={formik.values.itemVariantValues}
              style={{ textTransform: "upperCase" }}
              onChange={(e) => {
                var variants = [];
                variants =
                  formik.values.itemVariantValues !== undefined &&
                  formik.values.itemVariantValues.map((e) => {
                    return e.toUpperCase();
                  });

                var IsVariantArrtibuteExist =
                  variants !== undefined &&
                  variants.includes(
                    ...e.value.map((e) => e.toUpperCase()).slice(-1)
                  );
                if (IsVariantArrtibuteExist === false) {
                  formik.setFieldValue("itemVariantValues", e.value);
                }
              }}
              onRemove={(e) => {
                formik.setFieldValue(
                  "itemVariantValues",
                  formik.values.itemVariantValues.filter(
                    (value) => value !== e.value[0]
                  )
                );
              }}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="flex-end" spacing={2}>
          <Grid
            item
            sm={6}
            lg={6}
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={props.close}
              fullWidth={false}
              variant="contained"
              color="default"
              size="medium"
              classes={{ root: classes.dismissBtn }}
              style={{
                paddingLeft: 15,
                paddingRight: 15,
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              Dismiss
            </Button>
            <Button
              type="submit"
              fullWidth={false}
              variant="contained"
              color="primary"
              size="medium"
              classes={{ root: classes.saveBtn }}
              style={{
                paddingLeft: 25,
                paddingRight: 25,
                marginLeft: 10,
                marginBottom: 10,
                marginTop: 10,
              }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Modal>
  );
}

export default VariantForm;
