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
import "./saleStyles.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import DeleteAlert from "../../../../Components/Alert/ConfirmationAlert";
import SuccessAlert from "../../../../Components/Alert/SuccessAlert";
import CustomerForm from "../../../Sale/Customer/ModalForm";
import {
  AddItemSales,
  DeleteItemSale,
  EditItemSale,
  GetItemSales,
} from "../../../../Api/Actions/itemSaleActions";
import {
  ADD_SALE_ITEM,
  DELETE_SALE_ITEM,
  GET_SALE_ITEMS,
  EDIT_SALE_ITEM,
} from "../../../../Redux/Constants";
import ErrorAlert from "../../../../Components/Alert/ErrorAlert";
import Swal from "sweetalert2";
let itemSaleInitialValues = {
  saleId: "",
  companyId: "",
  itemUnitId: "",
  itemUnitTitle: "",
  currencyId: "",
  currencyTitle: "",
  salePrice: 0.0,
  customerId: "",
  customerTitle: "",
};
const itemSaleValidationSchema = Yup.object().shape({
  companyId: Yup.string().label("CompanyId"),
  customerId: Yup.string()
    .required("Please select the customer")
    .label("Customer"),
  itemUnitId: Yup.string().required("Please select the Unit").label("Unit"),
  currencyId: Yup.string()
    .required("Please select the Currency")
    .label("Currency"),
  salePrice: Yup.number()
    .required("Please enter sale price")
    .label("Sale Price"),
});

const useStyles = makeStyles((theme) => ({
  AddNewBtnStyle: {
    backgroundColor: "#1976D2",
    color: "#FFFFFF",
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
  var EditCustomerValue;
  var EditCurrencyValue;
  const [run, setRun] = useState(false);
  const [newUnitValue, setNewUnitValue] = useState(
    EditUnitValue === undefined ? [] : EditUnitValue[0]
  );
  const [newCustomerValue, setNewCustomerValue] = useState(
    EditCustomerValue === undefined ? [] : EditCustomerValue[0]
  );
  const [newCurrencyValue, setNewCurrencyValue] = useState(
    EditCurrencyValue === undefined ? [] : EditCurrencyValue[0]
  );
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  const saleItems = useSelector((state) => state.saleItemReducer).map(
    (item) => {
      return {
        companyId: item.companyId,
        saleId: item.id,
        customerId: item.customerId,
        customerTitle: item.customerName,
        currencyId: item.currencyId,
        currencyTitle: item.currencyName,
        salePrice: item.salesPrice,
        itemUnitId: item.itemUnitId,
        itemUnitTitle: item.itemUnitName,
      };
    }
  );

  const saleFormik = useFormik({
    initialValues: itemSaleInitialValues,
    validationSchema: itemSaleValidationSchema,
    onSubmit: (values, { resetForm }) => {
      if (values.salePrice > 0) {
        const saleItem = {
          id: "",
          customerId: values.customerId,
          customerName: values.customerTitle,
          itemId: params.productId,
          itemName: "Leather",
          salesPrice: values.salePrice,
          itemUnitId: values.itemUnitId,
          itemUnitName: values.itemUnitTitle,
          currencyId: values.currencyId,
          currencyName: values.currencyTitle,
          companyId: companyId,
        };
        if (values.saleId === "") {
          AddItemSales(saleItem)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: ADD_SALE_ITEM, payload: res.data });
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
          const saleItem = {
            id: values.saleId,
            customerId: values.customerId,
            customerName: values.customerTitle,
            itemId: params.productId,
            itemName: "Leather",
            salesPrice: values.salePrice,
            itemUnitId: values.itemUnitId,
            itemUnitName: values.itemUnitTitle,
            currencyId: values.currencyId,
            currencyName: values.currencyTitle,
            companyId: companyId,
          };
          EditItemSale(saleItem)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: EDIT_SALE_ITEM, payload: res.data });
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
          text: "Sales Price must greater than zero!",
          showConfirmButton: true,
        });
      }
    },
  });

  useEffect(() => {
    GetItemSales(companyId, params.productId).then((res) => {
      dispatch({ type: GET_SALE_ITEMS, payload: res.data });
    });
  }, []);
  var unitRecord = useSelector((state) => state.unitReducer).map((unit) => ({
    title: unit.fullName,
    value: unit.id,
    key: unit.id,
  }));
  var customerRecord = useSelector((state) => state.customerReducer).map(
    (customer) => ({
      title: customer.customerName,
      value: customer.customerId,
      key: customer.customerId,
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
      .filter((x) => x.key === saleFormik.values.itemUnitId)
      .map((item) => ({
        title: item.title,
        value: item.value,
        key: item.key,
      }));

    EditCustomerValue = customerRecord
      .filter((x) => x.key === saleFormik.values.customerId)
      .map((customer) => ({
        title: customer.title,
        value: customer.value,
        key: customer.key,
      }));
    EditCurrencyValue = currencyRecord
      .filter((x) => x.key.toString() === saleFormik.values.currencyId)
      .map((currency) => ({
        title: currency.title,
        value: currency.value,
        key: currency.key,
      }));
    setNewUnitValue(EditUnitValue[0]);
    setNewCurrencyValue(EditCurrencyValue[0]);
    setNewCustomerValue(EditCustomerValue[0]);
  }, [run]);
  const [showWarningAlert, setshowWarningAlert] = useState(false);
  const [showSuccessAlert, setshowSuccessAlert] = useState(false);
  const [showErrorAlert, setshowErrorAlert] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState({});
  const [SelectedData, setSelectedData] = useState("");
  const [ShowUnitForm, setShowUnitForm] = useState(false);
  const [ShowCustomerForm, setShowCustomerForm] = useState(false);
  const columns = [
    { field: "checkBox", header: "" },
    {
      field: "customerTitle",
      header: "Customer",
      sortable: true,
    },
    {
      field: "salePrice",
      header: "Sale Price",
      sortable: true,
    },
    {
      field: "currencyTitle",
      header: "Currency",
      sortable: true,
    },
    {
      field: "itemUnitTitle",
      header: "UOM",
      sortable: true,
    },
    {
      field: "Action",
      header: "Action",
      sortable: true,
    },
  ];
  const EditHandler = (rowData) => {
    saleFormik.setFieldValue("saleId", rowData.saleId);
    saleFormik.setFieldValue("itemUnitId", rowData.itemUnitId);
    saleFormik.setFieldValue("itemUnitTitle", rowData.itemUnitTitle);
    saleFormik.setFieldValue("customerId", rowData.customerId);
    saleFormik.setFieldValue("salePrice", rowData.salePrice);
    saleFormik.setFieldValue("customerId", rowData.customerId);
    saleFormik.setFieldValue("customerTitle", rowData.customerTitle);
    saleFormik.setFieldValue("currencyTitle", rowData.currencyTitle);
    saleFormik.setFieldValue("currencyId", rowData.currencyId);
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
        DeleteItemSale(rowData.saleId)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: DELETE_SALE_ITEM, payload: res.data });
              //setshowSuccessAlert(true);
              saleFormik.resetForm();
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
      {ShowCustomerForm === true && (
        <CustomerForm
          open={ShowCustomerForm}
          close={() => {
            setShowCustomerForm(false);
          }}
          SelectedData={SelectedData}
          setSelectedData={setSelectedData}
          setErrorMessage={setErrorMessage}
          setshowSuccessAlert={setshowSuccessAlert}
          setshowErrorAlert={setshowErrorAlert}
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
      {showSuccessAlert && (
        <SuccessAlert
          message="Deleted SuccessFully"
          title="Success"
          open={SuccessAlert}
          onClick={setshowSuccessAlert}
        />
      )}

      <form>
        <Grid container spacing={3} alignItems="center">
          <Grid item sm={2} md={3} lg={3} style={{ paddingTop: 20 }}>
            <DropDownTextField
              variant="standard"
              id="customerId"
              label="Customer *"
              value={newCustomerValue}
              size="small"
              ShowForm={setShowCustomerForm}
              fullWidth
              showAddButton
              DropDowntitle="Add Customer"
              onChange={(event, value) => {
                saleFormik.setFieldValue(
                  "customerId",
                  value === null || value === undefined
                    ? ""
                    : value.key.toString()
                );
                saleFormik.setFieldValue(
                  "customerTitle",
                  value === null || value === undefined ? "" : value.title
                );
                setNewCustomerValue(
                  value === null || value === undefined ? "" : value
                );
              }}
              data={customerRecord}
              formik={saleFormik}
              error={
                saleFormik.touched.customerId &&
                Boolean(saleFormik.errors.customerId)
              }
              helperText={
                saleFormik.touched.customerId && saleFormik.errors.customerId
              }
            />
          </Grid>
          <Grid item sm={2} md={2} lg={2} style={{ paddingTop: 15 }}>
            <TextField
              variant="standard"
              id="salePrice"
              label="Sale Price"
              value={
                saleFormik.values.salePrice != 0
                  ? saleFormik.values.salePrice
                  : ""
              }
              onChange={saleFormik.handleChange}
              size="small"
              fullWidth
              error={
                saleFormik.touched.salePrice &&
                Boolean(saleFormik.errors.salePrice)
              }
              helperText={
                saleFormik.touched.salePrice && saleFormik.errors.salePrice
              }
            />
          </Grid>
          <Grid item sm={3} md={3} lg={3} style={{ paddingTop: 15 }}>
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
                saleFormik.setFieldValue(
                  "currencyId",
                  value === null ||
                    value === undefined ||
                    value.key === null ||
                    value.key === undefined
                    ? ""
                    : value.key.toString()
                );
                saleFormik.setFieldValue(
                  "currencyTitle",
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
              formik={saleFormik}
              error={
                saleFormik.touched.currencyId &&
                Boolean(saleFormik.errors.currencyId)
              }
              helperText={
                saleFormik.touched.currencyId && saleFormik.errors.currencyId
              }
            />
          </Grid>
          <Grid item sm={2} md={3} lg={3} style={{ paddingTop: 15 }}>
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
                saleFormik.setFieldValue(
                  "itemUnitId",
                  value === 0 ||
                    value === undefined ||
                    value === null ||
                    value.key === undefined ||
                    value.key === null
                    ? ""
                    : value.key.toString()
                );
                saleFormik.setFieldValue(
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
              formik={saleFormik}
              error={
                saleFormik.touched.itemUnitId &&
                Boolean(saleFormik.errors.itemUnitId)
              }
              helperText={
                saleFormik.touched.itemUnitId && saleFormik.errors.itemUnitId
              }
            />
          </Grid>
          <Grid item sm={1} md={1} lg={1} style={{ paddingTop: 15 }}>
            <Button
              variant="contained"
              color="primary"
              classes={{ root: classes.AddNewBtnStyle }}
              onClick={saleFormik.handleSubmit}
              fullWidth
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
            data={saleItems}
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
