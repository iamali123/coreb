import React, { useState, useEffect } from "react";
import {
  PurchaseInquiryItemDetailValidationSchema,
  purchaseInquiryItemDetailsInitialValues,
} from "../../../Schema/Purchase/PurchaseInquirySchema/InitialValues";
import { GET_BOM_MATERIALS } from "../../../Redux/Constants";
import DropDownTextField from "../../../Components/Dropdown/SearchableDropdown";
import Button from "../../../Components/Button";
import { makeStyles, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import Grid from "@material-ui/core/Grid";
import TextField from "../../../Components/TextInput";
import { GetBOMMaterials } from "../../../Api/Actions/bomDetailsAction";
import PurchaseInquiryItemDetailList from "./PurchaseInquiryItemDetailList";
function PurchaseInquiryItemDetailsForm(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState(
    purchaseInquiryItemDetailsInitialValues
  );
  const [run, setrun] = useState(false);
  const qtyRef = React.useRef();
  const priceRef = React.useRef();
  const totalPriceRef = React.useRef();
  const addRef = React.useRef();

  useEffect(() => {
    GetBOMMaterials(props.companyId)
      .then((res) => {
        dispatch({ type: GET_BOM_MATERIALS, payload: res.data });
      })
      .catch((error) => {});
  }, []);
  var Materials = useSelector((state) => state.bomMaterialReducer).map(
    (material) => ({
      title: material.description,
      value: material.itemDetailId,
      key: material.itemDetailId,
      unitPrice: material.unitPrice,
      code: material.itemDetailCode,
    })
  );
  var EditMaterial;
  const itemDetailFormik = useFormik({
    initialValues: formValues,
    validationSchema: PurchaseInquiryItemDetailValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      let isDuplicateEntry = props.PurchaseInquiryMaterials.filter(
        (material) => material.itemDetailId === values.itemDetailId
      ).length;
      if (isDuplicateEntry > 0) {
        props.setPurchaseInquiryMaterials(
          props.PurchaseInquiryMaterials.map((material) => {
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
        setrun(!run);
      } else {
        props.setPurchaseInquiryMaterials([
          ...props.PurchaseInquiryMaterials,
          values,
        ]);
        resetForm();
        setrun(!run);
      }
    },
  });
  const [NewMaterialValue, setNewMaterialValue] = useState(
    EditMaterial === undefined ? [] : EditMaterial[0]
  );

  useEffect(() => {
    EditMaterial = Materials.filter(
      (x) => x.key === itemDetailFormik.values.itemDetailId
    ).map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
      unitPrice: item.unitPrice,
      code: item.ItemDetailCode,
    }));
    setNewMaterialValue(EditMaterial[0]);

    qtyRef.current && qtyRef.current.focus();
  }, [run]);
  const EditPurchaseInquiryItemDetail = (rowData) => {
    itemDetailFormik.setFieldValue("itemDetailId", rowData.itemDetailId);
    itemDetailFormik.setFieldValue("itemDetailName", rowData.itemDetailName);
    itemDetailFormik.setFieldValue("itemDetailCode", rowData.itemDetailCode);
    itemDetailFormik.setFieldValue("purchaseOrderId", rowData.purchaseOrderId);
    itemDetailFormik.setFieldValue("quantity", rowData.quantity);
    itemDetailFormik.setFieldValue("unitPrice", rowData.unitPrice);
    itemDetailFormik.setFieldValue("totalPrice", rowData.totalPrice);
    itemDetailFormik.setFieldValue("description", rowData.description);
    itemDetailFormik.setFieldValue("id", rowData.id);
    setrun(!run);
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
                //itemDetailFormik.setFieldValue("quantity", 1);
                setNewMaterialValue(
                  value === null || value === undefined ? "" : value
                );
                qtyRef.current && qtyRef.current.focus();
              }}
              data={Materials}
              error={
                itemDetailFormik.touched.ite &&
                Boolean(itemDetailFormik.errors.ite)
              }
              helperText={
                itemDetailFormik.touched.ite && itemDetailFormik.errors.ite
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
              type="number"
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
              type="number"
              value={
                itemDetailFormik.values.unitPrice != 0
                  ? itemDetailFormik.values.unitPrice
                  : ""
              }
              placeholder="0"
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
              type="number"
              value={itemDetailFormik.values.totalPrice}
              onChange={itemDetailFormik.handleChange}
              onKeyDown={(event) => {
                const ENTER_KEY = 13;
                if (event.keyCode === ENTER_KEY) {
                  itemDetailFormik.handleSubmit();
                }
              }}
              // InputProps={{
              //   readOnly: true,
              // }}
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
      <PurchaseInquiryItemDetailList
        SelectedData={props.SelectedData}
        setSelectedData={props.setSelectedData}
        PurchaseInquiryMaterials={props.PurchaseInquiryMaterials}
        setPurchaseInquiryMaterials={props.setPurchaseInquiryMaterials}
        EditPurchaseInquiryItemDetail={EditPurchaseInquiryItemDetail}
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
export default PurchaseInquiryItemDetailsForm;
