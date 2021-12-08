import React, { useState, useEffect, useRef } from "react";
import {
  patientInvoiceInitialValues,
  patientInvoiceItemInitilaValues,
  patientInvoiceItemValidationSchema,
} from "../../../Schema/PatientInvoiceSchema/InitialValues";
import TextField from "../../../Components/TextInput";
import { GET_BOM_MATERIALS } from "../../../Redux/Constants";
import DropDownTextField from "../../../Components/Dropdown/SearchableDropdown";
import Button from "../../../Components/Button";
import { makeStyles, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import PatientInvoiceItemList from "./PatientInvoiceItemList";
import Grid from "@material-ui/core/Grid";
function PatientInvoiceItems(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  //Decleartion of Refs
  const qtyRef = useRef();
  const priceRef = useRef();
  const totalPriceRef = useRef();
  //Decleartion of Formik
  const itemDetailFormik = useFormik({
    initialValues: patientInvoiceItemInitilaValues,
    validationSchema: patientInvoiceItemValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      let isDuplicateEntry = props.InvoiceItems.filter(
        (material) => material.itemDetailId === values.itemDetailId
      ).length;
      if (isDuplicateEntry > 0) {
        props.setInvoiceItems(
          props.InvoiceItems.map((material) => {
            if (material.itemDetailId === values.itemDetailId) {
              return {
                ...material,
                ...values,
              };
            } else {
              return material;
            }
          })
        );
        resetForm();
        updateValues();
      } else {
        props.setInvoiceItems([...props.InvoiceItems, values]);
        resetForm();
        updateValues();
      }
    },
  });
  const [NewMaterialValue, setNewMaterialValue] = useState([]);
  const ItemList = useSelector((service) =>
    service.itemReducer.map((item) => ({
      title: item?.itemCode + "-" + item?.itemName,
      key: item?.itemId,
      value: item?.itemId,
      unitPrice: item?.salePrice ?? 0,
      code: item?.itemCode,
    }))
  );
  const updateValues = (resData) => {
    if (resData) {
      const EditMaterialValue = ItemList.filter(
        (x) => x.key.toString() === resData.itemDetailId.toString()
      ).map((item) => ({
        title: item.title,
        value: item.value,
        key: item.value,
      }));
      setNewMaterialValue({ ...EditMaterialValue[0] });
    } else {
      setNewMaterialValue([]);
    }
  };
  const EditInvoiceItemDetail = (rowData) => {
    itemDetailFormik.setFieldValue("itemDetailId", rowData.itemDetailId);
    itemDetailFormik.setFieldValue("itemDetailName", rowData.itemDetailName);
    itemDetailFormik.setFieldValue("itemDetailCode", rowData.itemDetailCode);
    itemDetailFormik.setFieldValue(
      "patientInvoiceId",
      rowData.patientInvoiceId
    );
    itemDetailFormik.setFieldValue("quantity", rowData.quantity);
    itemDetailFormik.setFieldValue("unitPrice", rowData.unitPrice);
    itemDetailFormik.setFieldValue("totalPrice", rowData.totalPrice);
    itemDetailFormik.setFieldValue("description", rowData.description);
    itemDetailFormik.setFieldValue("id", rowData.id);
    updateValues(rowData);
  };
  useEffect(() => {
    itemDetailFormik.setFieldValue(
      "totalPrice",
      itemDetailFormik.values.quantity * itemDetailFormik.values.unitPrice
    );
  }, [itemDetailFormik.values.quantity, itemDetailFormik.values.unitPrice]);
  return (
    <>
      <form onSubmit={itemDetailFormik.handleSubmit}>
        <Grid
          container
          style={{ marginTop: 20 }}
          justifyContent="space-between"
        >
          <Grid xs={2} sm={2} md={2} lg={2}>
            <DropDownTextField
              variant="standard"
              id="itemDetailId"
              label="Product Name"
              value={NewMaterialValue}
              size="small"
              fullWidth
              onChange={(event, value) => {
                itemDetailFormik.setFieldValue(
                  "itemDetailId",
                  value === null || value === undefined
                    ? ""
                    : value.key.toString()
                );
                itemDetailFormik.setFieldValue(
                  "unitPrice",
                  value === null || value === undefined ? 0 : value.unitPrice
                );

                itemDetailFormik.setFieldValue(
                  "itemDetailName",
                  value === null || value === undefined ? "" : value.title
                );
                itemDetailFormik.setFieldValue(
                  "itemDetailCode",
                  value === null || value === undefined ? "" : value.code
                );
                itemDetailFormik.setFieldValue(
                  "description",
                  value === null || value === undefined ? "" : value.title
                );
                setNewMaterialValue(
                  value === null || value === undefined ? "" : value
                );

                qtyRef.current && qtyRef.current.focus();
              }}
              data={ItemList}
              error={
                itemDetailFormik.touched.itemDetailId &&
                Boolean(itemDetailFormik.errors.itemDetailId)
              }
              helperText={
                itemDetailFormik.touched.itemDetailId &&
                itemDetailFormik.errors.itemDetailId
              }
            />
          </Grid>
          <Grid xs={2} sm={2} md={2} lg={2}>
            <TextField
              variant="standard"
              id="description"
              label="Description"
              value={itemDetailFormik.values.description}
              onChange={itemDetailFormik.handleChange}
              size="small"
              fullWidth
              error={
                itemDetailFormik.touched.description &&
                Boolean(itemDetailFormik.errors.description)
              }
              helperText={
                itemDetailFormik.touched.description &&
                itemDetailFormik.errors.description
              }
            />
          </Grid>

          <Grid xs={2} sm={2} md={2} lg={2}>
            <TextField
              variant="standard"
              id="quantity"
              label="Quantity"
              placeholder="0"
              value={
                itemDetailFormik.values.quantity != 0
                  ? itemDetailFormik.values.quantity
                  : ""
              }
              onChange={itemDetailFormik.handleChange}
              onKeyDown={(event) => {
                const ENTER_KEY = 13;
                if (event.keyCode === ENTER_KEY) {
                  priceRef.current && priceRef.current.focus();
                }
              }}
              size="small"
              fullWidth
              error={
                itemDetailFormik.touched.quantity &&
                Boolean(itemDetailFormik.errors.quantity)
              }
              helperText={
                itemDetailFormik.touched.quantity &&
                itemDetailFormik.errors.quantity
              }
              inputRef={qtyRef}
            />
          </Grid>
          <Grid xs={2} sm={2} md={2} lg={2}>
            <TextField
              variant="standard"
              id="unitPrice"
              label="Unit Price"
              placeholder="0"
              value={
                itemDetailFormik.values.unitPrice != 0
                  ? itemDetailFormik.values.unitPrice
                  : ""
              }
              onChange={itemDetailFormik.handleChange}
              onKeyDown={(event) => {
                const ENTER_KEY = 13;
                if (event.keyCode === ENTER_KEY) {
                  totalPriceRef.current && totalPriceRef.current.focus();
                }
              }}
              size="small"
              fullWidth
              error={
                itemDetailFormik.touched.unitPrice &&
                Boolean(itemDetailFormik.errors.unitPrice)
              }
              helperText={
                itemDetailFormik.touched.unitPrice &&
                itemDetailFormik.errors.unitPrice
              }
              inputRef={priceRef}
            />
          </Grid>
          <Grid xs={2} sm={2} md={2} lg={2}>
            <TextField
              variant="standard"
              id="totalPrice"
              label="Total Price"
              value={itemDetailFormik.values.totalPrice}
              onChange={itemDetailFormik.handleChange}
              onKeyDown={(event) => {
                const ENTER_KEY = 13;
                if (event.keyCode === ENTER_KEY) {
                  itemDetailFormik.handleSubmit();
                }
              }}
              size="small"
              fullWidth
              error={
                itemDetailFormik.touched.totalPrice &&
                Boolean(itemDetailFormik.errors.totalPrice)
              }
              helperText={
                itemDetailFormik.touched.totalPrice &&
                itemDetailFormik.errors.totalPrice
              }
              inputRef={totalPriceRef}
            />
          </Grid>
          <Grid item sm={1} md={1} lg={1} style={{ paddingTop: 15 }}>
            <Button
              variant="contained"
              color="primary"
              classes={{ root: classes.AddNewBtnStyle }}
              onClick={itemDetailFormik.handleSubmit}
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
      <PatientInvoiceItemList
        InvoiceItems={props.InvoiceItems}
        setInvoiceItems={props.setInvoiceItems}
        EditInvoiceItemDetail={EditInvoiceItemDetail}
      />
    </>
  );
}
const useStyles = makeStyles((theme) => ({
  AddNewBtnStyle: {
    backgroundColor: "#1976D2",
    color: "#FFFFFF",
  },
}));
export default PatientInvoiceItems;
