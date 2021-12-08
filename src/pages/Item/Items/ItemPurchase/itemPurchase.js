import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Tooltip } from "primereact/tooltip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditIcon from "@material-ui/icons/CreateOutlined";
import { makeStyles } from "@material-ui/core";
import TextField from "../../../../Components/TextInput";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import GetAppIcon from "@material-ui/icons/GetApp";
import { Grid, Typography } from "@material-ui/core";
import { useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import DropDownTextField from "../../../../Components/Dropdown/SearchableDropdown";
import DataGrid from "../../../../Components/GridDataTable";
import UnitForm from "../../Units/UnitForm";
import "./purchaseStyles.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteAlert from "../../../../Components/Alert/ConfirmationAlert";
import SuccessAlert from "../../../../Components/Alert/SuccessAlert";
import {
  AddItemPurchase,
  EditItemPurchase,
  DeleteItemPurchase,
  GetItemPurchase,
} from "../../../../Api/Actions/itemPurchaseActions";
import {
  ADD_PURCHASE_ITEM,
  GET_PURCHASE_ITEMS,
  DELETE_PURCHASE_ITEM,
  EDIT_PURCHASE_ITEM,
} from "../../../../Redux/Constants";
import SupplierForm from "../../../Purchase/Supplier/ModalForm";
import ErrorAlert from "../../../../Components/Alert/ErrorAlert";
import Swal from "sweetalert2";

let itemPurchaseInitialValues = {
  id: "",
  companyId: "",
  itemUnitId: "",
  itemUnitName: "",
  currencyId: "",
  currencyName: "",
  purchasePrice: 0.0,
  supplierId: "",
  supplierName: "",
  leadTime: 0,
};
const itemPurchaseValidationSchema = Yup.object().shape({
  companyId: Yup.string().label("CompanyId"),
  supplierId: Yup.string()
    .required("Please select the supplier")
    .label("Supplier"),
  itemUnitId: Yup.string().required("Please select the Unit").label("Unit"),
  currencyId: Yup.string()
    .required("Please select the Currency")
    .label("Currency"),
  purchasePrice: Yup.number()
    .required("Please enter sale price")
    .label("Sale Price"),
  leadTime: Yup.number().required("Please enter lead Time").label("Lead Time"),
});

const useStyles = makeStyles((theme) => ({
  AddNewBtnStyle: {
    backgroundColor: "#1976D2",
    color: "#FFFFFF",
    padding: "5px 30px",
  },

  deleteIconStyle: {
    cursor: "pointer",
  },
  editIconStyle: {
    marginRight: 5,
    cursor: "pointer",
  },
}));
export default function Index(props) {
  const classes = useStyles();
  const params = useParams();
  var EditUnitValue;
  var EditSupplierValue;
  var EditCurrencyValue;
  const [run, setRun] = useState(false);
  const [newUnitValue, setNewUnitValue] = useState(
    EditUnitValue === undefined ? [] : EditUnitValue[0]
  );
  const [newCustomerValue, setNewCustomerValue] = useState(
    EditSupplierValue === undefined ? [] : EditSupplierValue[0]
  );
  const [newCurrencyValue, setNewCurrencyValue] = useState(
    EditCurrencyValue === undefined ? [] : EditCurrencyValue[0]
  );
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  const purchaseItems = useSelector((state) => state.purchaseItemReducer).map(
    (item) => {
      return {
        companyId: item.companyId,
        id: item.id,
        supplierId: item.supplierId,
        supplierName: item.supplierName,
        currencyId: item.currencyId,
        currencyName: item.currencyName,
        purchasePrice: item.purchasePrice,
        itemUnitId: item.itemUnitId,
        itemUnitName: item.itemUnitName,
        leadTime: item.leadTime,
      };
    }
  );

  const purchaseFormik = useFormik({
    initialValues: itemPurchaseInitialValues,
    validationSchema: itemPurchaseValidationSchema,
    onSubmit: (values, { resetForm }) => {
      if (values.purchasePrice > 0 && values.leadTime > 0) {
        const purchaseItem = {
          id: "",
          supplierId: values.supplierId,
          supplierName: values.supplierName,
          itemId: params.productId,
          itemName: "Leather",
          purchasePrice: values.purchasePrice,
          itemUnitId: values.itemUnitId,
          itemUnitName: values.itemUnitName,
          currencyId: values.currencyId,
          currencyName: values.currencyName,
          leadTime: values.leadTime,
          companyId: companyId,
        };
        if (values.id === "") {
          AddItemPurchase(purchaseItem)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: ADD_PURCHASE_ITEM, payload: res.data });
                resetForm();
                setRun(!run);
              }
            })
            .catch((error) => {
              if (error.response === undefined) {
                setErrorMessage({ message: "Network Error" });
              } else {
                setErrorMessage(error.response.data);
              }
              setshowErrorAlert(true);
            });
        } else {
          const purchaseItem = {
            id: values.id,
            supplierId: values.supplierId,
            supplierName: values.supplierName,
            itemId: params.productId,
            itemName: "Leather",
            purchasePrice: values.purchasePrice,
            itemUnitId: values.itemUnitId,
            itemUnitName: values.itemUnitName,
            currencyId: values.currencyId,
            currencyName: values.currencyName,
            leadTime: values.leadTime,
            companyId: companyId,
          };
          EditItemPurchase(purchaseItem)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: EDIT_PURCHASE_ITEM, payload: res.data });
                resetForm();
                setRun(!run);
              }
            })
            .catch((error) => {
              if (error.response === undefined) {
                setErrorMessage({ message: "Network Error" });
              } else {
                setErrorMessage(error.response.data);
              }
              setshowErrorAlert(true);
            });
        }
      } else {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "Warning!",
          text: "Purchase Price and Lead Time must greater than zero!",
          showConfirmButton: true,
        });
      }
    },
  });

  useEffect(() => {
    GetItemPurchase(companyId, params.productId).then((res) => {
      dispatch({ type: GET_PURCHASE_ITEMS, payload: res.data });
    });
  }, []);
  var unitRecord = useSelector((state) => state.unitReducer).map((unit) => ({
    title: unit.fullName,
    value: unit.id,
    key: unit.id,
  }));
  var supplierRecord = useSelector((state) => state.supplierReducer).map(
    (supplier) => ({
      title: supplier.supplierName,
      value: supplier.supplierId,
      key: supplier.supplierId,
    })
  );
  var currencyRecord = useSelector((state) => state.currencyReducer).map(
    (currency) => ({
      title:
        currency.currencyEnglishName + "(" + currency.isoCurrencySymbol + ")",
      value: currency.id,
      key: currency.id,
    })
  );
  useEffect(() => {
    EditUnitValue = unitRecord
      .filter((x) => x.key === purchaseFormik.values.itemUnitId)
      .map((item) => ({
        title: item.title,
        value: item.value,
        key: item.key,
      }));

    EditSupplierValue = supplierRecord
      .filter((x) => x.key === purchaseFormik.values.supplierId)
      .map((supplier) => ({
        title: supplier.title,
        value: supplier.value,
        key: supplier.key,
      }));
    EditCurrencyValue = currencyRecord
      .filter((x) => x.key.toString() === purchaseFormik.values.currencyId)
      .map((currency) => ({
        title: currency.title,
        value: currency.value,
        key: currency.key,
      }));
    setNewUnitValue(EditUnitValue[0]);
    setNewCurrencyValue(EditCurrencyValue[0]);
    setNewCustomerValue(EditSupplierValue[0]);
  }, [run]);
  const [showWarningAlert, setshowWarningAlert] = useState(false);
  const [showSuccessAlert, setshowSuccessAlert] = useState(false);
  const [showErrorAlert, setshowErrorAlert] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState({});
  const [SelectedData, setSelectedData] = useState("");
  const [ShowUnitForm, setShowUnitForm] = useState(false);
  const [ShowSupplierForm, setShowSupplierForm] = useState(false);

  const columns = [
    {
      field: "checkBox",
    },
    {
      field: "supplierName",
      header: "Supplier",
      sortable: true,
    },
    {
      field: "purchasePrice",
      header: "Purchase Price",
      sortable: true,
    },
    {
      field: "currencyName",
      header: "Currency",
      sortable: true,
    },
    {
      field: "itemUnitName",
      header: "UOM",
      sortable: true,
    },
    {
      field: "leadTime",
      header: "Lead Time",
      sortable: true,
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
    },
  ];
  const EditHandler = (rowData) => {
    purchaseFormik.setFieldValue("id", rowData.id);
    purchaseFormik.setFieldValue("itemUnitId", rowData.itemUnitId);
    purchaseFormik.setFieldValue("itemUnitName", rowData.itemUnitName);
    purchaseFormik.setFieldValue("supplierId", rowData.supplierId);
    purchaseFormik.setFieldValue("purchasePrice", rowData.purchasePrice);
    purchaseFormik.setFieldValue("supplierId", rowData.supplierId);
    purchaseFormik.setFieldValue("supplierName", rowData.supplierName);
    purchaseFormik.setFieldValue("currencyName", rowData.currencyName);
    purchaseFormik.setFieldValue("currencyId", rowData.currencyId);
    purchaseFormik.setFieldValue("leadTime", rowData.leadTime);
    setRun(!run);
  };

  const DeleteHandler = (rowData) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteItemPurchase(rowData.id)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: DELETE_PURCHASE_ITEM, payload: res.data });

              purchaseFormik.resetForm();
              setRun(!run);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Deleted!",
                text: "Your file has been deleted.",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((error) => {
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
    });
  };

  return (
    <>
      {ShowUnitForm === true && (
        <UnitForm
          open={ShowUnitForm}
          close={() => {
            setShowUnitForm(false);
          }}
          SelectedData={SelectedData}
          setSelectedData={setSelectedData}
          setErrorMessage={setErrorMessage}
          setshowSuccessAlert={setshowSuccessAlert}
          setshowErrorAlert={setshowErrorAlert}
        />
      )}
      {ShowSupplierForm === true && (
        <SupplierForm
          open={ShowSupplierForm}
          close={() => {
            setShowSupplierForm(false);
          }}
          SelectedData={SelectedData}
          setSelectedData={setSelectedData}
          setErrorMessage={setErrorMessage}
          setshowSuccessAlert={setshowSuccessAlert}
          setshowErrorAlert={setshowErrorAlert}
        />
      )}

      {showSuccessAlert && (
        <SuccessAlert
          message="Deleted SuccessFully"
          title="Success"
          open={SuccessAlert}
          onClick={setshowSuccessAlert}
        />
      )}

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
      <form>
        <Grid container spacing={3} alignItems="center">
          <Grid item sm={2} md={2} lg={2} style={{ paddingTop: 20 }}>
            <DropDownTextField
              variant="standard"
              id="supplierId"
              label="Supplier *"
              value={newCustomerValue}
              size="small"
              fullWidth
              ShowForm={setShowSupplierForm}
              showAddButton
              DropDowntitle="Add Supplier"
              onChange={(event, value) => {
                purchaseFormik.setFieldValue(
                  "supplierId",
                  value === null || value === undefined
                    ? ""
                    : value.key.toString()
                );
                purchaseFormik.setFieldValue(
                  "supplierName",
                  value === null || value === undefined ? "" : value.title
                );
                setNewCustomerValue(
                  value === null || value === undefined ? "" : value
                );
              }}
              data={supplierRecord}
              formik={purchaseFormik}
              error={
                purchaseFormik.touched.supplierId &&
                Boolean(purchaseFormik.errors.supplierId)
              }
              helperText={
                purchaseFormik.touched.supplierId &&
                purchaseFormik.errors.supplierId
              }
            />
          </Grid>
          <Grid item sm={2} md={2} lg={2} style={{ paddingTop: 15 }}>
            <TextField
              variant="standard"
              id="purchasePrice"
              label="Purchase Price"
              value={
                purchaseFormik.values.purchasePrice != 0
                  ? purchaseFormik.values.purchasePrice
                  : ""
              }
              onChange={purchaseFormik.handleChange}
              size="small"
              fullWidth
              error={
                purchaseFormik.touched.purchasePrice &&
                Boolean(purchaseFormik.errors.purchasePrice)
              }
              helperText={
                purchaseFormik.touched.purchasePrice &&
                purchaseFormik.errors.purchasePrice
              }
            />
          </Grid>
          <Grid item sm={2} md={2} lg={2} style={{ paddingTop: 15 }}>
            <DropDownTextField
              variant="standard"
              id="currencyId"
              label="Currency *"
              value={newCurrencyValue}
              size="small"
              fullWidth
              DropDowntitle="Add Currency"
              showAddButton={false}
              onChange={(event, value) => {
                purchaseFormik.setFieldValue(
                  "currencyId",
                  value === null ||
                    value === undefined ||
                    value.key === null ||
                    value.key === undefined
                    ? ""
                    : value.key.toString()
                );
                purchaseFormik.setFieldValue(
                  "currencyName",
                  value === null ||
                    value === undefined ||
                    value.title === null ||
                    value.title == undefined
                    ? ""
                    : value.title
                );
                setNewCurrencyValue(
                  value === null || value === undefined ? "" : value
                );
              }}
              data={currencyRecord}
              formik={purchaseFormik}
              error={
                purchaseFormik.touched.currencyId &&
                Boolean(purchaseFormik.errors.currencyId)
              }
              helperText={
                purchaseFormik.touched.currencyId &&
                purchaseFormik.errors.currencyId
              }
            />
          </Grid>
          <Grid item sm={2} md={2} lg={2} style={{ paddingTop: 15 }}>
            <DropDownTextField
              variant="standard"
              id="itemUnitId"
              label="Unit *"
              value={newUnitValue}
              showAddButton
              size="small"
              fullWidth
              ShowForm={setShowUnitForm}
              DropDowntitle="Add Unit"
              onChange={(event, value) => {
                purchaseFormik.setFieldValue(
                  "itemUnitId",
                  value === 0 ||
                    value === undefined ||
                    value === null ||
                    value.key === undefined ||
                    value.key === null
                    ? ""
                    : value.key.toString()
                );
                purchaseFormik.setFieldValue(
                  "itemUnitName",
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
              formik={purchaseFormik}
              error={
                purchaseFormik.touched.itemUnitId &&
                Boolean(purchaseFormik.errors.itemUnitId)
              }
              helperText={
                purchaseFormik.touched.itemUnitId &&
                purchaseFormik.errors.itemUnitId
              }
            />
          </Grid>
          <Grid item sm={2} md={2} lg={2} style={{ paddingTop: 15 }}>
            <TextField
              variant="standard"
              id="leadTime"
              label="Lead Time"
              value={
                purchaseFormik.values.leadTime != 0
                  ? purchaseFormik.values.leadTime
                  : ""
              }
              onChange={purchaseFormik.handleChange}
              size="small"
              fullWidth
              error={
                purchaseFormik.touched.leadTime &&
                Boolean(purchaseFormik.errors.leadTime)
              }
              helperText={
                purchaseFormik.touched.leadTime &&
                purchaseFormik.errors.leadTime
              }
            />
          </Grid>
          <Grid
            item
            sm={1}
            md={2}
            lg={2}
            style={{
              paddingTop: 15,
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              classes={{ root: classes.AddNewBtnStyle }}
              onClick={purchaseFormik.handleSubmit}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
      <Grid container>
        <Grid item sm={12} md={12} lg={12}>
          <DataGrid
            columns={columns}
            data={purchaseItems}
            setSelectedData={setSelectedData}
            deleteIconStyle={classes.deleteIconStyle}
            editIconStyle={classes.editIconStyle}
            editFormPopUp="false"
            showHeader={false}
            EditHandler={EditHandler}
            DeleteHandler={DeleteHandler}
            setshowWarningAlert={setshowWarningAlert}
          />
        </Grid>
      </Grid>
    </>
  );
}
