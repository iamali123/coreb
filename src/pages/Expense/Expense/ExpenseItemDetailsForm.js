import React, { useState, useEffect, useRef } from "react";
import {
  expenseItemDetailsInitialValues,
  ExpenseItemDetailValidationSchema,
} from "../../../Schema/Expense/ExpenseIntialValues";
import { GET_BOM_MATERIALS, GET_EXPENSE_ITEMS } from "../../../Redux/Constants";
import DropDownTextField from "../../../Components/Dropdown/SearchableDropdown";
import Button from "../../../Components/Button";
import { makeStyles } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";
import Grid from "@material-ui/core/Grid";
import TextField from "../../../Components/TextInput";
import { GetExpenseItems } from "../../../Api/Actions/expenseItemActions";
import ExpenseItemDetailsList from "./ExpenseItemDetailsList";

function ExpenseItemDetailsForm(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [run, setrun] = useState(false);
  useEffect(() => {
    GetExpenseItems(props.companyId)
      .then((res) => {
        dispatch({ type: GET_EXPENSE_ITEMS, payload: res.data });
      })
      .catch((error) => {});
  }, []);
  var Materials = useSelector((state) => state.expenseItemReducer).map(
    (material) => ({
      title: material.expenseItemName,
      value: material.id,
      key: material.id,
      price: material.expenseItemPrice,
      code: material.id,
    })
  );
  var EditMaterial;
  const expenseItemDetailFormik = useFormik({
    initialValues: expenseItemDetailsInitialValues,
    validationSchema: ExpenseItemDetailValidationSchema,
    onSubmit: (values, { resetForm }) => {
      let isDuplicateEntry = props.ExpenseMaterials.filter(
        (material) => material.id === values.id
      ).length;
      if (isDuplicateEntry > 0) {
        props.setExpenseMaterials(
          props.ExpenseMaterials.map((material) => {
            if (material.id === values.id) {
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
        props.setExpenseMaterials([...props.ExpenseMaterials, values]);
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
      (x) => x.key === expenseItemDetailFormik.values.expenseItemId
    ).map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
      price: item.price,
      code: item.code,
    }));
    setNewMaterialValue(EditMaterial[0]);
  }, [run]);
  const EditExpenseItemDetail = (rowData) => {
    expenseItemDetailFormik.setFieldValue(
      "expenseItemId",
      rowData.expenseItemId
    );
    expenseItemDetailFormik.setFieldValue(
      "expenseItemName",
      rowData.expenseItemName
    );

    expenseItemDetailFormik.setFieldValue("expenseId", rowData.expenseId);
    expenseItemDetailFormik.setFieldValue("quantity", rowData.quantity);
    expenseItemDetailFormik.setFieldValue("price", rowData.price);
    expenseItemDetailFormik.setFieldValue("amount", rowData.amount);
    expenseItemDetailFormik.setFieldValue("description", rowData.description);
    expenseItemDetailFormik.setFieldValue("id", rowData.id);
    setrun(!run);
  };

  useEffect(() => {
    expenseItemDetailFormik.setFieldValue(
      "amount",
      expenseItemDetailFormik.values.quantity *
        expenseItemDetailFormik.values.price
    );
  }, [
    expenseItemDetailFormik.values.quantity,
    expenseItemDetailFormik.values.price,
  ]);

  return (
    <>
      <form onSubmit={expenseItemDetailFormik.handleSubmit}>
        <Grid
          container
          style={{ marginTop: 20 }}
          justifyContent="space-between"
        >
          <Grid xs={2} sm={2} md={2} lg={2}>
            <DropDownTextField
              variant="standard"
              id="expenseItemId"
              label="Expense Item *"
              value={NewMaterialValue}
              size="small"
              fullWidth
              onChange={(event, value) => {
                expenseItemDetailFormik.setFieldValue(
                  "expenseItemId",
                  value === null || value === undefined
                    ? ""
                    : value.key.toString()
                );
                expenseItemDetailFormik.setFieldValue(
                  "price",
                  value === null || value === undefined ? 0 : value.price
                );

                expenseItemDetailFormik.setFieldValue(
                  "expenseItemName",
                  value === null || value === undefined ? "" : value.title
                );

                expenseItemDetailFormik.setFieldValue(
                  "description",
                  value === null || value === undefined ? "" : value.title
                );
                expenseItemDetailFormik.setFieldValue("quantity", 1);
                setNewMaterialValue(
                  value === null || value === undefined ? "" : value
                );
              }}
              data={Materials}
              error={
                expenseItemDetailFormik.touched.ite &&
                Boolean(expenseItemDetailFormik.errors.ite)
              }
              helperText={
                expenseItemDetailFormik.touched.ite &&
                expenseItemDetailFormik.errors.ite
              }
            />
          </Grid>
          <Grid xs={2} sm={2} md={2} lg={2}>
            <TextField
              variant="standard"
              id="description"
              label="Description"
              value={expenseItemDetailFormik.values.description}
              onChange={expenseItemDetailFormik.handleChange}
              size="small"
              fullWidth
              error={
                expenseItemDetailFormik.touched.description &&
                Boolean(expenseItemDetailFormik.errors.description)
              }
              helperText={
                expenseItemDetailFormik.touched.description &&
                expenseItemDetailFormik.errors.description
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
                expenseItemDetailFormik.values.quantity != 0
                  ? expenseItemDetailFormik.values.quantity
                  : ""
              }
              onChange={expenseItemDetailFormik.handleChange}
              size="small"
              fullWidth
              error={
                expenseItemDetailFormik.touched.quantity &&
                Boolean(expenseItemDetailFormik.errors.quantity)
              }
              helperText={
                expenseItemDetailFormik.touched.quantity &&
                expenseItemDetailFormik.errors.quantity
              }
            />
          </Grid>
          <Grid xs={2} sm={2} md={2} lg={2}>
            <TextField
              variant="standard"
              id="price"
              label="Price"
              placeholder="0"
              value={
                expenseItemDetailFormik.values.price != 0
                  ? expenseItemDetailFormik.values.price
                  : ""
              }
              onChange={expenseItemDetailFormik.handleChange}
              size="small"
              fullWidth
              error={
                expenseItemDetailFormik.touched.price &&
                Boolean(expenseItemDetailFormik.errors.price)
              }
              helperText={
                expenseItemDetailFormik.touched.price &&
                expenseItemDetailFormik.errors.price
              }
            />
          </Grid>
          <Grid xs={2} sm={2} md={2} lg={2}>
            <TextField
              variant="standard"
              id="amount"
              label="Amount"
              value={expenseItemDetailFormik.values.amount}
              onChange={expenseItemDetailFormik.handleChange}
              size="small"
              fullWidth
              error={
                expenseItemDetailFormik.touched.amount &&
                Boolean(expenseItemDetailFormik.errors.amount)
              }
              helperText={
                expenseItemDetailFormik.touched.amount &&
                expenseItemDetailFormik.errors.amount
              }
            />
          </Grid>
          <Grid item sm={1} md={1} lg={1} style={{ paddingTop: 15 }}>
            <Button
              variant="contained"
              color="primary"
              classes={{ root: classes.AddNewBtnStyle }}
              onClick={expenseItemDetailFormik.handleSubmit}
              fullWidth
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
      <ExpenseItemDetailsList
        SelectedData={props.SelectedData}
        setSelectedData={props.setSelectedData}
        ExpenseMaterials={props.ExpenseMaterials}
        setExpenseMaterials={props.setExpenseMaterials}
        EditExpenseItemDetail={EditExpenseItemDetail}
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
export default ExpenseItemDetailsForm;
