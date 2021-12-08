import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Button from "../../../Components/Button";
import { Grid, Typography, TextareaAutosize } from "@material-ui/core";
import TextField from "../../../Components/TextInput";
import DropDownTextField from "../../../Components/Dropdown/SearchableDropdown";
import BackDrop from "../../../Components/BackDrop";
import Card from "../../../Components/Card";
import BreadCrumb from "../../../Components/BreadCrumb1";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useHistory } from "react-router-dom";
import DatePicker from "../../../Components/DatePicker";
import dateformat from "dateformat";
import {
  purchaseInquiryInitialValues,
  PurchaseInquiryValidationSchema,
} from "../../../Schema/Purchase/PurchaseInquirySchema/InitialValues";
import { useFormik } from "formik";
import {
  AddPurchaseInquiry,
  EditPurchaseInquiryAction,
} from "../../../Api/Actions/purchaseInquiryActions";
import {
  ADD_PURCHASE_ORDER,
  EDIT_PURCHASE_ORDER,
} from "../../../Redux/Constants";
import PurchaseInquiryItemDetailsForm from "./PurchaseInquiryItemDetailForm";
import Swal from "sweetalert2";
const useStyles = makeStyles((theme) => ({
  CardrootStyle: {
    Width: 200,
    maxHeight: "100%",
    marginRight: "1%",
    paddingLeft: "2%",
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

const PurchaseInquiryForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  var itemId;
  var PurchaseInquiryId;

  if (
    params.PurchaseInquiryId !== null ||
    params.PurchaseInquiryId !== undefined
  ) {
    PurchaseInquiryId = params.PurchaseInquiryId;
  }
  const [ShowSpinner, setShowSpinner] = useState(false);
  const [PurchaseInquiryMaterials, setPurchaseInquiryMaterials] = useState([]);
  const [run, setrun] = useState(false);
  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  var EditSupplierListValue;
  var EditPurchaseInquiry;
  var EditCurrencyValue;
  var EditPaymentTermValue;
  var EditBankAccountValue;
  var EditShipmentTermValue;
  var EditShipmentModeValue;
  //*************************************GET Supplier  Record *************************/
  var SupplierList = useSelector((state) => state.supplierReducer).map(
    (supplier) => ({
      title: supplier.supplierCode + " | " + supplier.supplierName,
      name: supplier.supplierName,
      value: supplier.supplierId,
      key: supplier.supplierId,
    })
  );
  //*************************************GET Currency  Record *************************/
  var currencyRecord = useSelector((state) => state.currencyReducer).map(
    (currency) => ({
      title:
        currency.currencyEnglishName + "(" + currency.isoCurrencySymbol + ")",
      value: currency.id,
      key: currency.id,
    })
  );
  //*************************************GET Payment Method  Record *************************/
  var paymentMethodRecord = useSelector(
    (state) => state.paymentTermReducer
  ).map((payment) => ({
    title: payment.paymentTermName,
    value: payment.id,
    key: payment.id,
  }));
  //*************************************GET BANK ACCOUNT Record *************************/

  var bankAccountsRecord = useSelector((state) => state.bankAccountReducer).map(
    (bank) => ({
      title: bank.bankName,
      value: bank.bankId,
      key: bank.bankId,
    })
  );

  var shipmentModeRecord = useSelector(
    (state) => state.shipmentModeReducer
  ).map((mode) => ({
    title: mode.shipmentModeName,
    value: mode.id,
    key: mode.id,
  }));

  var shipmentTermRecord = useSelector(
    (state) => state.shipmentTermReducer
  ).map((mode) => ({
    title: mode.shipmentTermName,
    value: mode.id,
    key: mode.id,
  }));

  if (PurchaseInquiryId !== undefined) {
    EditPurchaseInquiry = useSelector(
      (state) => state.purchaseInquiryReducer
    ).find((e) => e.id === PurchaseInquiryId);
  }

  useEffect(() => {
    if (EditPurchaseInquiry !== undefined) {
      setPurchaseInquiryMaterials(
        EditPurchaseInquiry.purchaseInquiryItemDetails
      );
      setrun(!run);
    }
  }, [EditPurchaseInquiry]);

  const purchaseInquiryFormik = useFormik({
    initialValues:
      EditPurchaseInquiry !== undefined
        ? EditPurchaseInquiry
        : purchaseInquiryInitialValues,
    validationSchema: PurchaseInquiryValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      const PurchaseInquiry = {
        Id: values.id !== "" ? values.id : "",
        companyId: companyId,
        referenceNumber: values.referenceNumber,
        orderCode: values.orderCode,
        orderNumber: values.orderNumber,
        description: values.description,
        orderDate: values.orderDate,
        orderReceiveDate: values.orderDate,
        orderShipmentDate: values.orderShipmentDate,
        supplierId: values.supplierId,
        supplierName: values.supplierName,
        currencyId: values.currencyId,
        currencyName: values.currencyName,
        accountId: values.accountId,
        accountName: values.accountName,
        shipmentTermId: values.shipmentTermId,
        supplierTermName: values.shipmentTermName,
        shipmentModeId: values.shipmentModeId,
        shipmentModeName: values.shipmentModeName,
        paymentTermId: values.paymentTermId,
        paymentTermName: values.paymentTermName,
        discount: values.discount,
        discountAmount: values.discountAmount,
        gross: values.gross,
        taxId: "0",
        taxName: "GST",
        tax: values.tax,
        taxAmount: values.taxAmount,
        totalAmount: values.totalAmount,
        freightAmount: values.freightAmount,
        netAmount: values.netAmount,
        purchaseInquiryItemDetails: PurchaseInquiryMaterials,
      };
      if (PurchaseInquiryMaterials.length > 0) {
        if (PurchaseInquiry.Id === "") {
          setShowSpinner(true);
          AddPurchaseInquiry(PurchaseInquiry)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: ADD_PURCHASE_ORDER, payload: res.data });
                setShowSpinner(false);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Saved",
                  text: "Purchase Inquiry Save SuccessFully",
                  showConfirmButton: false,
                  timer: 1500,
                });
                resetForm();
                setrun(!run);
                setTimeout(() => {
                  history.push(`/PurchaseInquiry`);
                }, 1200);
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
              setShowSpinner(false);
            });
        } else {
          setShowSpinner(true);
          EditPurchaseInquiryAction(PurchaseInquiry)
            .then((res) => {
              dispatch({ type: EDIT_PURCHASE_ORDER, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Purchase Inquiry Update SuccessFully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push(`/PurchaseInquiry`);
              }, 1200);
            })
            .catch((error) => {
              setShowSpinner(false);
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
      } else {
        Swal.fire({
          title: "Error",
          text: "Please add Purchase Order Material ",
          icon: "error",
          showConfirmButton: true,
        });
      }
    },
  });
  const [SelectedData, setSelectedData] = useState("");
  const [NewSupplierValue, setNewSupplierValue] = useState(
    EditSupplierListValue === undefined ? [] : EditSupplierListValue[0]
  );
  const [newCurrencyValue, setNewCurrencyValue] = useState(
    EditCurrencyValue === undefined ? [] : EditCurrencyValue[0]
  );
  const [newPaymentTermValue, setNewPaymentTermValue] = useState(
    EditPaymentTermValue === undefined ? [] : EditPaymentTermValue[0]
  );
  const [newBankAccountValue, setNewBankAccountValue] = useState(
    EditBankAccountValue === undefined ? [] : EditBankAccountValue[0]
  );
  const [newShipmentTermValue, setNewShipmentTermValue] = useState(
    EditShipmentTermValue === undefined ? [] : EditShipmentTermValue[0]
  );
  const [newShipmentModeValue, setNewShipmentModeValue] = useState(
    EditShipmentModeValue === undefined ? [] : EditShipmentModeValue[0]
  );

  useEffect(() => {
    EditSupplierListValue = SupplierList.filter(
      (x) => x.key === purchaseInquiryFormik.values.supplierId
    ).map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
    }));
    EditCurrencyValue = currencyRecord
      .filter(
        (x) => x.key.toString() === purchaseInquiryFormik.values.currencyId
      )
      .map((currency) => ({
        title: currency.title,
        value: currency.value,
        key: currency.key,
      }));
    EditPaymentTermValue = paymentMethodRecord
      .filter(
        (x) => x.key.toString() === purchaseInquiryFormik.values.paymentTermId
      )
      .map((payment) => ({
        title: payment.title,
        value: payment.value,
        key: payment.key,
      }));
    EditBankAccountValue = bankAccountsRecord
      .filter(
        (x) => x.key.toString() === purchaseInquiryFormik.values.accountId
      )
      .map((bank) => ({
        title: bank.title,
        value: bank.value,
        key: bank.key,
      }));
    EditShipmentTermValue = shipmentTermRecord
      .filter(
        (x) => x.key.toString() === purchaseInquiryFormik.values.shipmentTermId
      )
      .map((term) => ({
        title: term.title,
        value: term.value,
        key: term.key,
      }));
    EditShipmentModeValue = shipmentModeRecord
      .filter(
        (x) => x.key.toString() === purchaseInquiryFormik.values.shipmentModeId
      )
      .map((term) => ({
        title: term.title,
        value: term.value,
        key: term.key,
      }));
    setNewSupplierValue(EditSupplierListValue[0]);
    setNewCurrencyValue(EditCurrencyValue[0]);
    setNewPaymentTermValue(EditPaymentTermValue[0]);
    setNewBankAccountValue(EditBankAccountValue[0]);
    setNewShipmentModeValue(EditShipmentModeValue[0]);
    setNewShipmentTermValue(EditShipmentTermValue[0]);
  }, [run]);
  const calculation = (values) => {
    let disPercent = values.discount;
    let disAmount = 0;
    let gross = 0;
    let taxPer = values.tax;
    let taxAmount = 0;
    let freightAmount = values.freightAmount;
    let netAmount = 0;
    let sum = 0;
    if (PurchaseInquiryMaterials.length > 0) {
      sum = PurchaseInquiryMaterials.map((o) => o.totalPrice).reduce((a, c) => {
        return a + c;
      });
    }
    purchaseInquiryFormik.setFieldValue("totalAmount", sum);
    let amount = sum;

    if (values.discount != null && values.discount != 0) {
      disPercent = values.discount;
    }
    gross = amount;
    if (amount > 0 && disPercent > 0) {
      disAmount = amount * (disPercent / 100);
      gross = amount - disAmount;
    }
    netAmount = gross;
    if (values.tax > 0 && gross > 0) {
      taxPer = values.tax;
      taxAmount = gross * (taxPer / 100);
      netAmount = gross + taxAmount;
    }
    freightAmount = 0;
    if (values.freightAmount > 0 && values.freightAmount < netAmount) {
      freightAmount = values.freightAmount;
      netAmount = netAmount + freightAmount;
    }

    purchaseInquiryFormik.setFieldValue("discountAmount", disAmount);
    purchaseInquiryFormik.setFieldValue("gross", gross);
    purchaseInquiryFormik.setFieldValue("taxAmount", taxAmount);
    purchaseInquiryFormik.setFieldValue("freightAmount", freightAmount);
    purchaseInquiryFormik.setFieldValue("netAmount", netAmount);
  };

  useEffect(() => {
    if (PurchaseInquiryMaterials.length > 0) {
      calculation(purchaseInquiryFormik.values);
    }
  }, [PurchaseInquiryMaterials]);

  return (
    <>
      <BackDrop open={ShowSpinner} />
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
                },
                {
                  title: "Purchase Inquiry List",
                  url: "/PurchaseInquiry",
                },
                {
                  title: params?.PurchaseInquiryId
                    ? "Edit Purchase Inquiry"
                    : "New Purchase Inquiry",
                },
              ]}
              show={false}
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
                history.push(`/PurchaseInquiry`);
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
              onClick={purchaseInquiryFormik.handleSubmit}
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
        <form onSubmit={purchaseInquiryFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="orderCode"
                label="Order Number"
                InputProps={{
                  readOnly: true,
                }}
                value={purchaseInquiryFormik.values.orderCode}
                onChange={purchaseInquiryFormik.handleChange}
                size="small"
                fullWidth
                error={
                  purchaseInquiryFormik.touched.orderCode &&
                  Boolean(purchaseInquiryFormik.errors.orderCode)
                }
                helperText={
                  purchaseInquiryFormik.touched.orderCode &&
                  purchaseInquiryFormik.errors.orderCode
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="referenceNumber"
                label="Inquiry Ref Number"
                value={purchaseInquiryFormik.values.referenceNumber}
                onChange={purchaseInquiryFormik.handleChange}
                size="small"
                fullWidth
                error={
                  purchaseInquiryFormik.touched.referenceNumber &&
                  Boolean(purchaseInquiryFormik.errors.referenceNumber)
                }
                helperText={
                  purchaseInquiryFormik.touched.referenceNumber &&
                  purchaseInquiryFormik.errors.referenceNumber
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginTop: 20 }}
          >
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="supplierId"
                label="Supplier Code *"
                value={NewSupplierValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  purchaseInquiryFormik.setFieldValue(
                    "supplierId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseInquiryFormik.setFieldValue(
                    "supplierName",
                    value === null || value === undefined ? "" : value.name
                  );
                  setNewSupplierValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={SupplierList}
                error={
                  purchaseInquiryFormik.touched.supplierId &&
                  Boolean(purchaseInquiryFormik.errors.supplierId)
                }
                helperText={
                  purchaseInquiryFormik.touched.supplierId &&
                  purchaseInquiryFormik.errors.supplierId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="supplierName"
                label="Supplier Name"
                value={purchaseInquiryFormik.values.supplierName}
                onChange={purchaseInquiryFormik.handleChange}
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                error={
                  purchaseInquiryFormik.touched.supplierName &&
                  Boolean(purchaseInquiryFormik.errors.supplierName)
                }
                helperText={
                  purchaseInquiryFormik.touched.supplierName &&
                  purchaseInquiryFormik.errors.supplierName
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginTop: 20 }}
          >
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="currencyId"
                label="Currency"
                value={newCurrencyValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  purchaseInquiryFormik.setFieldValue(
                    "currencyId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseInquiryFormik.setFieldValue(
                    "currencyId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseInquiryFormik.setFieldValue(
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
                error={
                  purchaseInquiryFormik.touched.currencyId &&
                  Boolean(purchaseInquiryFormik.errors.currencyId)
                }
                helperText={
                  purchaseInquiryFormik.touched.currencyId &&
                  purchaseInquiryFormik.errors.currencyId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="accountId"
                label="Bank"
                value={newBankAccountValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  purchaseInquiryFormik.setFieldValue(
                    "accountId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseInquiryFormik.setFieldValue(
                    "accountId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseInquiryFormik.setFieldValue(
                    "accountName",
                    value === null ||
                      value === undefined ||
                      value.title === null ||
                      value.title == undefined
                      ? ""
                      : value.title
                  );
                  setNewBankAccountValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={bankAccountsRecord}
                error={
                  purchaseInquiryFormik.touched.accountId &&
                  Boolean(purchaseInquiryFormik.errors.accountId)
                }
                helperText={
                  purchaseInquiryFormik.touched.accountId &&
                  purchaseInquiryFormik.errors.accountId
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginTop: 20 }}
          >
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DatePicker
                id="orderDate"
                label="Order Date"
                defaultValue={dateformat(
                  purchaseInquiryFormik.values.orderDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={purchaseInquiryFormik.handleChange}
                error={
                  purchaseInquiryFormik.touched.orderDate &&
                  Boolean(purchaseInquiryFormik.errors.orderDate)
                }
                helperText={
                  purchaseInquiryFormik.touched.orderDate &&
                  purchaseInquiryFormik.errors.orderDate
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DatePicker
                id="orderShipmentDate"
                label="Shipment Date"
                defaultValue={dateformat(
                  purchaseInquiryFormik.values.orderShipmentDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={purchaseInquiryFormik.handleChange}
                error={
                  purchaseInquiryFormik.touched.orderShipmentDate &&
                  Boolean(purchaseInquiryFormik.errors.orderShipmentDate)
                }
                helperText={
                  purchaseInquiryFormik.touched.orderShipmentDate &&
                  purchaseInquiryFormik.errors.orderShipmentDate
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginTop: 20 }}
          >
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="shipmentTermId"
                label="Shipment Term"
                value={newShipmentTermValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  purchaseInquiryFormik.setFieldValue(
                    "shipmentTermId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseInquiryFormik.setFieldValue(
                    "shipmentTermName",
                    value === null || value === undefined ? "" : value.title
                  );
                  setNewShipmentTermValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={shipmentTermRecord}
                error={
                  purchaseInquiryFormik.touched.shipmentTermId &&
                  Boolean(purchaseInquiryFormik.errors.shipmentTermId)
                }
                helperText={
                  purchaseInquiryFormik.touched.shipmentTermId &&
                  purchaseInquiryFormik.errors.shipmentTermId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="shipmentModeId"
                label="Shipment Mode"
                value={newShipmentModeValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  purchaseInquiryFormik.setFieldValue(
                    "shipmentModeId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseInquiryFormik.setFieldValue(
                    "shipmentModeId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseInquiryFormik.setFieldValue(
                    "shipmentModeName",
                    value === null ||
                      value === undefined ||
                      value.title === null ||
                      value.title == undefined
                      ? ""
                      : value.title
                  );
                  setNewShipmentModeValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={shipmentModeRecord}
                error={
                  purchaseInquiryFormik.touched.shipmentModeId &&
                  Boolean(purchaseInquiryFormik.errors.shipmentModeId)
                }
                helperText={
                  purchaseInquiryFormik.touched.shipmentModeId &&
                  purchaseInquiryFormik.errors.shipmentModeId
                }
              />
            </Grid>
          </Grid>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <div style={{ width: "40%" }}>
              <TextareaAutosize
                maxRows={4}
                id="description"
                aria-label="maximum height"
                placeholder="Description"
                style={{ height: 100 }}
                value={purchaseInquiryFormik.values.description}
                onChange={purchaseInquiryFormik.handleChange}
                size="small"
                fullWidth
                error={
                  purchaseInquiryFormik.touched.description &&
                  Boolean(purchaseInquiryFormik.errors.description)
                }
                helperText={
                  purchaseInquiryFormik.touched.description &&
                  purchaseInquiryFormik.errors.description
                }
              />
            </div>
            <div
              style={{
                width: "50%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Grid xs={12} sm={10} md={10} lg={10}>
                <DropDownTextField
                  variant="standard"
                  id="paymentTermId"
                  label="Payment Term"
                  value={newPaymentTermValue}
                  size="small"
                  fullWidth
                  onChange={(event, value) => {
                    purchaseInquiryFormik.setFieldValue(
                      "paymentTermId",
                      value === null || value === undefined
                        ? ""
                        : value.key.toString()
                    );
                    purchaseInquiryFormik.setFieldValue(
                      "paymentTermName",
                      value === null || value === undefined ? "" : value.title
                    );
                    setNewPaymentTermValue(
                      value === null || value === undefined ? "" : value
                    );
                  }}
                  data={paymentMethodRecord}
                  error={
                    purchaseInquiryFormik.touched.paymentTermId &&
                    Boolean(purchaseInquiryFormik.errors.paymentTermId)
                  }
                  helperText={
                    purchaseInquiryFormik.touched.paymentTermId &&
                    purchaseInquiryFormik.errors.paymentTermId
                  }
                />
              </Grid>
            </div>
          </div>
          <PurchaseInquiryItemDetailsForm
            PurchaseInquiryMaterials={PurchaseInquiryMaterials}
            setPurchaseInquiryMaterials={setPurchaseInquiryMaterials}
            companyId={companyId}
            SelectedData={SelectedData}
            setSelectedData={setSelectedData}
          />
          <>
            <Grid container justifyContent="flex-end" style={{ marginTop: 20 }}>
              <Grid
                sm={2}
                md={2}
                lg={2}
                alignItems="center"
                style={{
                  backgroundColor: "#F2EDED",
                  alignSelf: "center",
                  padding: 10,
                  borderBottom: "1px solid #707070",
                }}
              >
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    textTransform: "capitalize",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  sub-total
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="totalAmount"
                  value={purchaseInquiryFormik.values.totalAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    purchaseInquiryFormik.touched.totalAmount &&
                    Boolean(purchaseInquiryFormik.errors.totalAmount)
                  }
                  helperText={
                    purchaseInquiryFormik.touched.totalAmount &&
                    purchaseInquiryFormik.errors.totalAmount
                  }
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid
                sm={2}
                md={2}
                lg={2}
                alignItems="center"
                style={{
                  backgroundColor: "#F2EDED",
                  alignSelf: "center",
                  padding: 10,
                  borderBottom: "1px solid #707070",
                }}
              >
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    textTransform: "capitalize",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  discount%
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="discount"
                  name="discount"
                  value={
                    purchaseInquiryFormik.values.discount != 0
                      ? purchaseInquiryFormik.values.discount
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var v = parseInt(x.target.value, 10);
                    if (v >= 0 && v <= 100) {
                      purchaseInquiryFormik.setFieldValue("discount", v);
                    } else {
                      purchaseInquiryFormik.setFieldValue("discount", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(purchaseInquiryFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    purchaseInquiryFormik.touched.discount &&
                    Boolean(purchaseInquiryFormik.errors.discount)
                  }
                  helperText={
                    purchaseInquiryFormik.touched.discount &&
                    purchaseInquiryFormik.errors.discount
                  }
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid
                sm={2}
                md={2}
                lg={2}
                alignItems="center"
                style={{
                  backgroundColor: "#F2EDED",
                  alignSelf: "center",
                  padding: 10,
                  borderBottom: "1px solid #707070",
                }}
              >
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    textTransform: "capitalize",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  tax%
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="tax"
                  value={
                    purchaseInquiryFormik.values.tax != 0
                      ? purchaseInquiryFormik.values.tax
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var t = parseInt(x.target.value, 10);
                    if (t >= 0 && t <= 100) {
                      purchaseInquiryFormik.setFieldValue("tax", t);
                    } else {
                      purchaseInquiryFormik.setFieldValue("tax", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(purchaseInquiryFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    purchaseInquiryFormik.touched.tax &&
                    Boolean(purchaseInquiryFormik.errors.tax)
                  }
                  helperText={
                    purchaseInquiryFormik.touched.tax &&
                    purchaseInquiryFormik.errors.tax
                  }
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid
                sm={2}
                md={2}
                lg={2}
                alignItems="center"
                style={{
                  backgroundColor: "#F2EDED",
                  alignSelf: "center",
                  padding: 10,
                  borderBottom: "1px solid #707070",
                }}
              >
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    textTransform: "capitalize",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  freight
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="freightAmount"
                  value={
                    purchaseInquiryFormik.values.freightAmount != 0
                      ? purchaseInquiryFormik.values.freightAmount
                      : ""
                  }
                  placeholder="0"
                  onChange={purchaseInquiryFormik.handleChange}
                  onBlur={() => {
                    calculation(purchaseInquiryFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    purchaseInquiryFormik.touched.freightAmount &&
                    Boolean(purchaseInquiryFormik.errors.freightAmount)
                  }
                  helperText={
                    purchaseInquiryFormik.touched.freightAmount &&
                    purchaseInquiryFormik.errors.freightAmount
                  }
                />
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid
                sm={2}
                md={2}
                lg={2}
                alignItems="center"
                style={{
                  backgroundColor: "#F2EDED",
                  alignSelf: "center",
                  padding: 10,
                  borderBottom: "1px solid #707070",
                }}
              >
                <Typography
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    textTransform: "capitalize",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                  }}
                >
                  grand-total
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="netAmount"
                  value={purchaseInquiryFormik.values.netAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    purchaseInquiryFormik.touched.netAmount &&
                    Boolean(purchaseInquiryFormik.errors.netAmount)
                  }
                  helperText={
                    purchaseInquiryFormik.touched.netAmount &&
                    purchaseInquiryFormik.errors.netAmount
                  }
                />
              </Grid>
            </Grid>
          </>
        </form>
      </Card>
    </>
  );
};

export default PurchaseInquiryForm;
