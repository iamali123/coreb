import React, { useEffect, useState } from "react";
import Card from "../../../Components/Card";
import { makeStyles } from "@material-ui/core";
import { SelectButton } from "primereact/selectbutton";
import { Grid, Typography } from "@material-ui/core";
import ProductForm from "./Product/ProductForm";
import BreadCrumb from "../../../Components/BreadCrumb1";
import ServiceForm from "./Service/ServiceForm";
import { useLocation, useHistory, useParams } from "react-router-dom";
import Button from "../../../Components/Button";
import { AddItem, GetItems } from "../../../Api/Actions/itemActions";
import { ADD_ITEM, EDIT_ITEM, GET_ITEMS } from "../../../Redux/Constants";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import SuccessAlert from "../../../Components/Alert/SuccessAlert";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";
import BackDrop from "../../../Components/BackDrop";
import {
  productInitialValues,
  serviceInitialValues,
  productValidationSchema,
  serviceValidationSchema,
} from "../../../Schema/ProductSchema/ProductInitialValues";
import Swal from "sweetalert2";
const useStyles = makeStyles((theme) => ({
  CardrootStyle: {
    Width: 200,
    maxHeight: "100%",
    marginRight: "1%",
    paddingLeft: "3%",
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
}));
function Form() {
  const location = useLocation();
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [ItemFlag, seteItemFlag] = useState("Product");
  const options = ["Product", "Service"];
  const [Spinner, setSpinner] = useState(false);

  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  useEffect(() => {
    GetItems(companyId)
      .then((res) => {
        dispatch({ type: GET_ITEMS, payload: res.data });
      })
      .catch((error) => {});
  }, []);
  let filteritem = {};
  const items = useSelector((state) => state.itemReducer);
  const item = items?.find((e) => e.itemId === params.productId);
  if (params.productId !== null || params.productId !== undefined) {
    filteritem = items.filter((e) => e.itemId === params.productId);
  }
  useEffect(() => {
    if (filteritem.length > 0) {
      seteItemFlag(filteritem[0].type === 0 ? "Product" : "Service");
    }
  }, []);

  //***************************Setup Product Formik*****************************
  const productFormik = useFormik({
    initialValues:
      filteritem.length > 0 && filteritem[0].type === 0
        ? filteritem[0]
        : productInitialValues,
    validationSchema: productValidationSchema,
    onSubmit: (values, { resetForm }) => {
      values.type = ItemFlag === "Product" ? 0 : 1;
      values.companyId = companyId;

      if (values.itemId === "") {
        AddItemHandler(values);
      } else {
        EditItemHandler(values);
      }
    },
  });

  //***************************Setup Service Formik*****************************
  const serviceFormik = useFormik({
    initialValues:
      filteritem.length > 0 && filteritem[0].type === 1
        ? filteritem[0]
        : serviceInitialValues,
    validationSchema: serviceValidationSchema,
    onSubmit: (values, { resetForm }) => {
      values.type = ItemFlag === "Product" ? 0 : 1;
      values.companyId = companyId;
      if (values.itemId === "") {
        AddItemHandler(values);
      } else {
        EditItemHandler(values);
      }
    },
  });
  const AddItemHandler = (values) => {
    setSpinner(true);
    AddItem(values)
      .then((res) => {
        if (res.status == 200) {
          dispatch({ type: ADD_ITEM, payload: res.data });
          setSpinner(false);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Save",
            text: "Product Save Successflluy.",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            history.push(`product/productId=${res.data.itemId}`);
          }, 1200);
        }
      })
      .catch((error) => {
        setSpinner(false);
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
  };
  const EditItemHandler = (values) => {
    setSpinner(true);
    AddItem(values)
      .then((res) => {
        if (res.status == 200) {
          setSpinner(false);

          dispatch({ type: EDIT_ITEM, payload: res.data });
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Update",
            text: "Product Updated Successflluy.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        setSpinner(false);
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
  };
  return (
    <>
      <BackDrop open={Spinner} />
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
                  type: "",
                },
                {
                  title: "Product List",
                  url: "/ProductList",
                  type: "",
                },
                {
                  title: params?.productId
                    ? `Edit Product ${item?.itemName} `
                    : "New Product",
                  url: null,
                  type: "",
                },
              ]}
              show={false}
              pageName="Product"
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
                history.push("/productList");
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
              onClick={
                ItemFlag === "Product"
                  ? productFormik.handleSubmit
                  : serviceFormik.handleSubmit
              }
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
        <Grid container spacing={5} style={{ marginBottom: 5 }}>
          <Grid item xs={12} sm={8} md={10}>
            <SelectButton
              value={ItemFlag}
              options={options}
              onChange={(e) => seteItemFlag(e.value)}
            />
          </Grid>
        </Grid>

        {ItemFlag === "Product" ? (
          <ProductForm
            productFormik={productFormik}
            setShowSpinner={setSpinner}
          />
        ) : (
          <ServiceForm
            serviceFormik={serviceFormik}
            setShowSpinner={setSpinner}
          />
        )}
      </Card>
    </>
  );
}

export default Form;
