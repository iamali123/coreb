import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { SelectButton } from "primereact/selectbutton";
import { Grid, Typography } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import TextField from "../../../../Components/TextInput";
import DropDownTextField from "../../../../Components/Dropdown/SearchableDropdown";
import Button from "../../../../Components/Button";
import { AddItem, GetItems } from "../../../../Api/Actions/itemActions";
import { ADD_ITEM, EDIT_ITEM, GET_ITEMS } from "../../../../Redux/Constants";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import ErrorAlert from "../../../../Components/Alert/ErrorAlert";
import Modal from "../../../../Components/Modal";
import {
  productInitialValues,
  serviceInitialValues,
  productValidationSchema,
  serviceValidationSchema,
} from "../../../../Schema/ProductSchema/ProductInitialValues";
import ProductDetail from "../Product/_ProductDetailForm/ProductDetail";
import ServiceDetail from "../Service/_ServiceDetailForm/ServiceDetail";
import UnitForm from "../../Units/UnitForm";
import CategoryForm from "../../Category/CategoryForm";
import ItemTypeForm from "../../ItemType/itemTypeForm";
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
function ProductFormModal(props) {
  const history = useHistory();
  const params = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [ItemFlag, seteItemFlag] = useState("Product");
  const options = ["Product", "Service"];
  const [showSuccessAlert, setshowSuccessAlert] = useState(false);
  const [showErrorAlert, setshowErrorAlert] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState({});
  const [ShowSpinner, setShowSpinner] = useState(false);

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
  if (params.productId !== null || params.productId !== undefined) {
    filteritem = items.filter((e) => e.itemId === params.productId);
  }
  useEffect(() => {
    if (filteritem.length > 0) {
      seteItemFlag(filteritem[0].type === 0 ? "Product" : "Service");
    }
  }, []);
  //*************************************GET Units Record in UnitReducer*************************/
  var unitRecord = useSelector((state) => state.unitReducer).map((unit) => ({
    title: unit.fullName,
    value: unit.id,
    key: unit.id,
  }));
  var CategoryRecord = useSelector((state) => state.categoryReducer).map(
    (category) => ({
      title: category.title,
      value: category.id,
      key: category.id,
    })
  );
  var ProductTypeRecord = useSelector((state) => state.productTypeReducer).map(
    (type) => ({
      title: type.name,
      value: type.id,
      key: type.id,
    })
  );

  //***************************Setup Product Formik*****************************
  const productFormik = useFormik({
    initialValues: filteritem.length > 0 ? filteritem[0] : productInitialValues,
    validationSchema: productValidationSchema,
    onSubmit: (values, { resetForm }) => {
      values.type = ItemFlag === "Product" ? 0 : 1;
      values.companyId = user.companyId;
      AddItemHandler(values);
    },
  });

  //***************************Setup Service Formik*****************************
  const serviceFormik = useFormik({
    initialValues: serviceInitialValues,
    validationSchema: serviceValidationSchema,
    onSubmit: (values, { resetForm }) => {
      values.type = ItemFlag === "Product" ? 0 : 1;
      values.companyId = user.companyId;
      AddItemHandler(values);
    },
  });

  const EditUnitValue = unitRecord
    .filter((x) => x.key === productFormik.values.itemUnit)
    .map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
    }));

  const [newUnitValue, setNewUnitValue] = useState(EditUnitValue[0]);
  const [ShowUnitForm, setShowUnitForm] = useState(false);
  const [ShowCategoryForm, setShowCategoryForm] = useState(false);
  const [ShowProductTypeForm, setShowProductTypeForm] = useState(false);
  const [SelectedData, setSelectedData] = useState("");

  const AddItemHandler = (values) => {
    AddItem(values)
      .then((res) => {
        if (res.status == 200) {
          dispatch({ type: ADD_ITEM, payload: res.data });
          props.close();
        }
      })
      .catch((error) => {
        if (error.response === undefined) {
          setErrorMessage({ message: "Network Error" });
        } else {
          setErrorMessage(error.response.data);
        }
        setShowSpinner(false);
        setshowErrorAlert(true);
      });
  };

  return (
    <>
      {showErrorAlert && (
        <ErrorAlert
          open={setshowErrorAlert}
          onClick={() => {
            setshowErrorAlert(false);
          }}
          title={ErrorMessage.title}
          message={ErrorMessage.message}
        />
      )}
      {ShowUnitForm === true && (
        <UnitForm
          open={ShowUnitForm}
          close={() => {
            setShowUnitForm(false);
          }}
          setShowUnitForm={setShowUnitForm}
          SelectedData={SelectedData}
        />
      )}
      {ShowCategoryForm === true && (
        <CategoryForm
          open={ShowCategoryForm}
          close={() => {
            setShowCategoryForm(false);
          }}
          SelectedData={SelectedData}
          setShowCategoryForm={setShowCategoryForm}
        />
      )}
      {ShowProductTypeForm === true && (
        <ItemTypeForm
          open={ShowProductTypeForm}
          close={() => {
            setShowProductTypeForm(false);
          }}
          SelectedData={SelectedData}
          setSelectedData={setSelectedData}
          setShowProductTypeForm={setShowProductTypeForm}
        />
      )}
      {ItemFlag === "Product" ? (
        <Modal
          open={props.open}
          Scroll={true}
          title={props.SelectedData === "" ? "Add Product " : "Edit  Product "}
          close={props.close}
          ModalWidth={"50%"}
          ModalHeight={"75%"}
        >
          <Grid container spacing={2} style={{ margin: 5, marginBottom: 2 }}>
            <Grid item sm={6} md={6} lg={6}>
              <SelectButton
                value={ItemFlag}
                options={options}
                onChange={(e) => seteItemFlag(e.value)}
              />
            </Grid>
          </Grid>
          <form onSubmit={productFormik.handleSubmit}>
            <Grid
              container
              spacing={2}
              style={{ backgroundColor: "#e7e7e9", marginTop: 10 }}
            >
              <Grid sm={12} xs={10} md={10} lg={12}>
                <Typography
                  style={{
                    color: "#212529",
                    padding: 10,
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  Product Details
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid container spacing={2} style={{ marginTop: 50 }}>
                <Grid item sm={8} xs={8} md={8} lg={8}>
                  <TextField
                    variant="outlined"
                    id="itemCode"
                    label="Product Code *"
                    autoFocus
                    value={productFormik.values.itemCode}
                    onChange={productFormik.handleChange}
                    size="small"
                    fullWidth
                    error={
                      productFormik.touched.itemCode &&
                      Boolean(productFormik.errors.itemCode)
                    }
                    helperText={
                      productFormik.touched.itemCode &&
                      productFormik.errors.itemCode
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: 20 }}>
                <Grid item sm={8} xs={8} md={8} lg={8}>
                  <TextField
                    variant="outlined"
                    id="itemName"
                    label="Product Name *"
                    value={productFormik.values.itemName}
                    onChange={productFormik.handleChange}
                    size="small"
                    fullWidth
                    error={
                      productFormik.touched.itemName &&
                      Boolean(productFormik.errors.itemName)
                    }
                    helperText={
                      productFormik.touched.itemName &&
                      productFormik.errors.itemName
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={5} style={{ marginBottom: 5 }}>
                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                  <DropDownTextField
                    variant="standard"
                    id="itemUnit"
                    label="Product Unit *"
                    value={newUnitValue}
                    showAddButton
                    size="small"
                    fullWidth
                    DropDowntitle="Add Unit"
                    onChange={(event, value) => {
                      productFormik.setFieldValue(
                        "itemUnit",
                        value === 0 ||
                          value === undefined ||
                          value === null ||
                          value.key === undefined ||
                          value.key === null
                          ? ""
                          : value.key.toString()
                      );
                      productFormik.setFieldValue(
                        "itemUnitTitle",
                        value === 0 ||
                          value === undefined ||
                          value === null ||
                          value.title === undefined ||
                          value.title === null
                          ? ""
                          : value.title
                      );
                      setNewUnitValue(
                        value === null || value === undefined ? "" : value
                      );
                    }}
                    data={unitRecord}
                    ShowForm={setShowUnitForm}
                    formik={productFormik}
                    error={
                      productFormik.touched.itemUnit &&
                      Boolean(productFormik.errors.itemUnit)
                    }
                    helperText={
                      productFormik.touched.itemUnit &&
                      productFormik.errors.itemUnit
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <ProductDetail
              formik={productFormik}
              CategoryRecord={CategoryRecord}
              ProductTypeRecord={ProductTypeRecord}
              setShowCategoryForm={setShowCategoryForm}
              setShowProductTypeForm={setShowProductTypeForm}
            />
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
      ) : (
        <Modal
          open={props.open}
          Scroll={true}
          title={props.SelectedData === "" ? "Add Service " : "Edit  Service "}
          close={props.close}
          ModalWidth={"50%"}
          ModalHeight={"75%"}
        >
          <Grid container spacing={2} style={{ margin: 5, marginBottom: 2 }}>
            <Grid item sm={6} md={6} lg={6}>
              <SelectButton
                value={ItemFlag}
                options={options}
                onChange={(e) => seteItemFlag(e.value)}
              />
            </Grid>
          </Grid>
          <form onSubmit={serviceFormik.handleSubmit}>
            <Grid
              container
              spacing={2}
              style={{ backgroundColor: "#e7e7e9", marginTop: 10 }}
            >
              <Grid sm={12} xs={10} md={10} lg={12}>
                <Typography
                  style={{
                    color: "#212529",
                    padding: 10,
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  Service Details
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid container spacing={2} style={{ marginTop: 50 }}>
                <Grid item sm={8} xs={8} md={8} lg={8}>
                  <TextField
                    variant="outlined"
                    id="itemCode"
                    label="Product Code *"
                    autoFocus
                    value={serviceFormik.values.itemCode}
                    onChange={serviceFormik.handleChange}
                    size="small"
                    fullWidth
                    error={
                      serviceFormik.touched.itemCode &&
                      Boolean(serviceFormik.errors.itemCode)
                    }
                    helperText={
                      serviceFormik.touched.itemCode &&
                      serviceFormik.errors.itemCode
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} style={{ marginTop: 20 }}>
                <Grid item sm={8} xs={8} md={8} lg={8}>
                  <TextField
                    variant="outlined"
                    id="itemName"
                    label="Product Name *"
                    value={serviceFormik.values.itemName}
                    onChange={serviceFormik.handleChange}
                    size="small"
                    fullWidth
                    error={
                      serviceFormik.touched.itemName &&
                      Boolean(serviceFormik.errors.itemName)
                    }
                    helperText={
                      serviceFormik.touched.itemName &&
                      serviceFormik.errors.itemName
                    }
                  />
                </Grid>
              </Grid>
              <Grid container spacing={5} style={{ marginBottom: 5 }}>
                <Grid item xs={12} sm={8} md={8} lg={8} xl={8}>
                  <DropDownTextField
                    variant="standard"
                    id="itemUnit"
                    label="Product Unit *"
                    value={newUnitValue}
                    showAddButton
                    size="small"
                    fullWidth
                    DropDowntitle="Add Unit"
                    onChange={(event, value) => {
                      serviceFormik.setFieldValue(
                        "itemUnit",
                        value === 0 ||
                          value === undefined ||
                          value === null ||
                          value.key === undefined ||
                          value.key === null
                          ? ""
                          : value.key.toString()
                      );
                      serviceFormik.setFieldValue(
                        "itemUnitTitle",
                        value === 0 ||
                          value === undefined ||
                          value === null ||
                          value.title === undefined ||
                          value.title === null
                          ? ""
                          : value.title
                      );
                      setNewUnitValue(
                        value === null || value === undefined ? "" : value
                      );
                    }}
                    data={unitRecord}
                    ShowForm={setShowUnitForm}
                    formik={serviceFormik}
                    error={
                      serviceFormik.touched.itemUnit &&
                      Boolean(serviceFormik.errors.itemUnit)
                    }
                    helperText={
                      serviceFormik.touched.itemUnit &&
                      serviceFormik.errors.itemUnit
                    }
                  />
                </Grid>
              </Grid>
            </Grid>

            <ServiceDetail
              formik={serviceFormik}
              CategoryRecord={CategoryRecord}
              ProductTypeRecord={ProductTypeRecord}
              setShowCategoryForm={setShowCategoryForm}
              setShowProductTypeForm={setShowProductTypeForm}
            />
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
      )}
    </>
  );
}

export default ProductFormModal;
