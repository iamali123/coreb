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
import {
  SalesInvoiceItemDetailValidationSchema,
  SalesInvoiceItemDetailsInitialValues,
  salesInvoiceInitialValues,
  SalesInvoiceValidationSchema,
} from "../../../Schema/Sales/SalesInvoice/InitialValues";
import { useFormik } from "formik";
import {
  AddSalesInvoice,
  EditSalesInvoiceAction,
} from "../../../Api/Actions/salesInvoiceActions";
import {
  ADD_SALES_INVOICE,
  EDIT_SALES_INVOICE,
} from "../../../Redux/Constants";
import SalesInvoiceItemDetailsForm from "./SalesInvoiceItemDetailsForm";
import SalesInvoiceItemDetailList from "./SalesInvoiceItemDetailsList";
import Swal from "sweetalert2";
import dateFormat from "dateformat";

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

const SalesInvoiceForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  var itemId;
  var SalesInvoiceId;
  var SalesOrderIds;

  if (params.SalesInvoiceId !== null || params.SalesInvoiceId !== undefined) {
    SalesInvoiceId = params.SalesInvoiceId;
  }

  if (params.SalesOrderId !== null || params.SalesOrderId !== undefined) {
    SalesOrderIds = params.SalesOrderId;
  }

  const [ShowSpinner, setShowSpinner] = useState(false);
  const [SalesInvoiceMaterials, setSalesInvoiceMaterials] = useState([]);
  const [run, setrun] = useState(false);

  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  var EditCustomerListValue;
  var EditSalesInvoice;
  var SalesOrder;

  var EditCurrencyValue;
  var EditPaymentTermValue;
  var EditBankAccountValue;
  var EditShipmentTermValue;
  var EditShipmentModeValue;
  //*************************************GET Customer  Record *************************/
  var CustomerList = useSelector((state) => state.customerReducer).map(
    (customer) => ({
      title: customer.customerCode + " | " + customer.customerName,
      name: customer.customerName,
      value: customer.customerId,
      key: customer.customerId,
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

  if (SalesInvoiceId !== undefined) {
    EditSalesInvoice = useSelector((state) => state.salesInvoiceReducer).find(
      (e) => e.id === SalesInvoiceId
    );
  }

  if (SalesOrderIds !== undefined) {
    EditSalesInvoice = salesInvoiceInitialValues;
    SalesOrder = useSelector((state) => state.salesOrderReducer).find(
      (e) => e.id === SalesOrderIds
    );

    EditSalesInvoice.id = "";
    EditSalesInvoice.companyId = SalesOrder.companyId;
    EditSalesInvoice.invoiceCode = "";
    EditSalesInvoice.invoiceDate = SalesOrder.invoiceDate;
    EditSalesInvoice.orderReceiveDate = SalesOrder.invoiceDate;
    EditSalesInvoice.shipmentDate = SalesOrder.shipmentDate;
    EditSalesInvoice.customerId = SalesOrder.customerId;
    EditSalesInvoice.customerName = SalesOrder.customerName;
    EditSalesInvoice.currencyId = SalesOrder.currencyId;
    EditSalesInvoice.currencyName = SalesOrder.currencyName;
    EditSalesInvoice.accountId = SalesOrder.accountId;
    EditSalesInvoice.accountName = SalesOrder.accountName;
    EditSalesInvoice.shipmentTermId = SalesOrder.shipmentTermId;
    EditSalesInvoice.supplierTermName = SalesOrder.shipmentTermName;
    EditSalesInvoice.shipmentModeId = SalesOrder.shipmentModeId;
    EditSalesInvoice.shipmentModeName = SalesOrder.shipmentModeName;
    EditSalesInvoice.paymentTermId = SalesOrder.paymentTermId;
    EditSalesInvoice.paymentTermName = SalesOrder.paymentTermName;
    EditSalesInvoice.referenceNo = SalesOrder.referenceNo;
    EditSalesInvoice.description = SalesOrder.description;
    EditSalesInvoice.discount = SalesOrder.discount;
    EditSalesInvoice.discountAmount = SalesOrder.discountAmount;
    EditSalesInvoice.gross = SalesOrder.gross;
    EditSalesInvoice.taxId = SalesOrder.taxId;
    EditSalesInvoice.taxName = SalesOrder.taxName;
    EditSalesInvoice.tax = SalesOrder.tax;
    EditSalesInvoice.taxAmount = SalesOrder.taxAmount;
    EditSalesInvoice.totalAmount = SalesOrder.totalAmount;
    EditSalesInvoice.freightAmount = SalesOrder.freightAmount;
    EditSalesInvoice.netAmount = SalesOrder.netAmount;
    EditSalesInvoice.salesOrderId = SalesOrder.id;
    EditSalesInvoice.salesInvoiceItemDetailModel =
      SalesOrder.salesOrderItemDetailModel.map((mode) => ({
        id: "0",
        salesInvoiceId: "",
        itemDetailId: mode.itemDetailId,
        itemDetailCode: mode.itemDetailCode,
        itemDetailName: mode.itemDetailName,
        quantity: mode.quantity,
        unitPrice: mode.unitPrice,
        totalPrice: mode.totalPrice,
        description: mode.description,
      }));
  }

  useEffect(() => {
    if (EditSalesInvoice !== undefined) {
      setSalesInvoiceMaterials(EditSalesInvoice.salesInvoiceItemDetailModel);
      setrun(!run);
    }
  }, [EditSalesInvoice]);

  const salesInvoiceFormik = useFormik({
    initialValues:
      EditSalesInvoice !== undefined
        ? EditSalesInvoice
        : salesInvoiceInitialValues,
    validationSchema: SalesInvoiceValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const salesInvoice = {
        id: values.id !== "" ? values.id : "",
        companyId: companyId,
        invoiceCode: values.invoiceCode,
        invoiceDate: values.invoiceDate,
        orderReceiveDate: values.invoiceDate,
        shipmentDate: values.shipmentDate,
        customerId: values.customerId,
        customerName: values.customerName,
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
        referenceNo: values.referenceNo,
        description: values.description,
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
        salesOrderId: values.salesOrderId,
        salesInvoiceItemDetailModel: SalesInvoiceMaterials,
      };
      //console.log("values", salesInvoice);
      if (SalesInvoiceMaterials.length > 0) {
        if (salesInvoice.id === "") {
          setShowSpinner(true);
          AddSalesInvoice(salesInvoice)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: ADD_SALES_INVOICE, payload: res.data });
                setShowSpinner(false);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Saved",
                  text: "Sales Invoice Save SuccessFully",
                  showConfirmButton: false,
                  timer: 1500,
                });
                resetForm();
                setrun(!run);
                setTimeout(() => {
                  history.push(`/SalesInvoice`);
                }, 1200);
              }
            })
            .catch((error) => {
              Swal.fire({
                title: `${error.response.data.title}`,
                text: `${error.response.data.message}`,
                icon: "error",
                showConfirmButton: true,
              });
              setShowSpinner(false);
            });
        } else {
          setShowSpinner(true);
          EditSalesInvoiceAction(salesInvoice)
            .then((res) => {
              dispatch({ type: EDIT_SALES_INVOICE, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Sales Invoice Update SuccessFully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push(`/SalesInvoice`);
              }, 1200);
            })
            .catch((error) => {
              Swal.fire({
                title: `${error.response.data.title}`,
                text: `${error.response.data.message}`,
                icon: "error",
                showConfirmButton: true,
              });
              setShowSpinner(false);
            });
        }
      } else {
        Swal.fire({
          title: "Error",
          text: "Please add Sales Invoice Material ",
          icon: "error",
          showConfirmButton: true,
        });
      }
    },
  });

  const [SelectedData, setSelectedData] = useState("");
  const [NewCustomerValue, setNewCustomerValue] = useState(
    EditCustomerListValue === undefined ? [] : EditCustomerListValue[0]
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
    EditCustomerListValue = CustomerList.filter(
      (x) => x.key === salesInvoiceFormik.values.customerId
    ).map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
    }));
    EditCurrencyValue = currencyRecord
      .filter((x) => x.key.toString() === salesInvoiceFormik.values.currencyId)
      .map((currency) => ({
        title: currency.title,
        value: currency.value,
        key: currency.key,
      }));
    EditPaymentTermValue = paymentMethodRecord
      .filter(
        (x) => x.key.toString() === salesInvoiceFormik.values.paymentTermId
      )
      .map((payment) => ({
        title: payment.title,
        value: payment.value,
        key: payment.key,
      }));
    EditBankAccountValue = bankAccountsRecord
      .filter((x) => x.key.toString() === salesInvoiceFormik.values.accountId)
      .map((bank) => ({
        title: bank.title,
        value: bank.value,
        key: bank.key,
      }));
    EditShipmentTermValue = shipmentTermRecord
      .filter(
        (x) => x.key.toString() === salesInvoiceFormik.values.shipmentTermId
      )
      .map((term) => ({
        title: term.title,
        value: term.value,
        key: term.key,
      }));
    EditShipmentModeValue = shipmentModeRecord
      .filter(
        (x) => x.key.toString() === salesInvoiceFormik.values.shipmentModeId
      )
      .map((term) => ({
        title: term.title,
        value: term.value,
        key: term.key,
      }));
    setNewCustomerValue(EditCustomerListValue[0]);
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
    if (SalesInvoiceMaterials.length > 0) {
      sum = SalesInvoiceMaterials.map((o) => o.totalPrice).reduce((a, c) => {
        return a + c;
      });
    }
    salesInvoiceFormik.setFieldValue("totalAmount", sum);
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

    salesInvoiceFormik.setFieldValue("discountAmount", disAmount);
    salesInvoiceFormik.setFieldValue("gross", gross);
    salesInvoiceFormik.setFieldValue("taxAmount", taxAmount);
    salesInvoiceFormik.setFieldValue("freightAmount", freightAmount);
    salesInvoiceFormik.setFieldValue("netAmount", netAmount);
  };

  useEffect(() => {
    if (SalesInvoiceMaterials.length > 0) {
      calculation(salesInvoiceFormik.values);
    }
  }, [SalesInvoiceMaterials]);

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
                  title: "Sale Invoice List",
                  url: "/SalesInvoice",
                },
                {
                  title: params?.SalesInvoiceId
                    ? "Edit Invoice"
                    : "New Invoice",
                  url: null,
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
                history.push(`/SalesInvoice`);
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
              onClick={salesInvoiceFormik.handleSubmit}
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
        <form onSubmit={salesInvoiceFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="invoiceCode"
                label="Invoice Number"
                disabled
                value={salesInvoiceFormik.values.invoiceCode}
                onChange={salesInvoiceFormik.handleChange}
                size="small"
                fullWidth
                error={
                  salesInvoiceFormik.touched.invoiceCode &&
                  Boolean(salesInvoiceFormik.errors.invoiceCode)
                }
                helperText={
                  salesInvoiceFormik.touched.invoiceCode &&
                  salesInvoiceFormik.errors.invoiceCode
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="referenceNo"
                label="Inquiry Ref Number"
                value={salesInvoiceFormik.values.referenceNo}
                onChange={salesInvoiceFormik.handleChange}
                size="small"
                fullWidth
                error={
                  salesInvoiceFormik.touched.referenceNumber &&
                  Boolean(salesInvoiceFormik.errors.referenceNo)
                }
                helperText={
                  salesInvoiceFormik.touched.referenceNo &&
                  salesInvoiceFormik.errors.referenceNo
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
                id="customerId"
                label="Customer Code *"
                value={NewCustomerValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  salesInvoiceFormik.setFieldValue(
                    "customerId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesInvoiceFormik.setFieldValue(
                    "customerName",
                    value === null || value === undefined ? "" : value.name
                  );
                  setNewCustomerValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={CustomerList}
                error={
                  salesInvoiceFormik.touched.customerId &&
                  Boolean(salesInvoiceFormik.errors.customerId)
                }
                helperText={
                  salesInvoiceFormik.touched.customerId &&
                  salesInvoiceFormik.errors.customerId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="customerName"
                label="Customer Name"
                value={salesInvoiceFormik.values.customerName}
                onChange={salesInvoiceFormik.handleChange}
                size="small"
                disabled
                fullWidth
                error={
                  salesInvoiceFormik.touched.customerName &&
                  Boolean(salesInvoiceFormik.errors.customerName)
                }
                helperText={
                  salesInvoiceFormik.touched.customerName &&
                  salesInvoiceFormik.errors.customerName
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
                  salesInvoiceFormik.setFieldValue(
                    "currencyId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesInvoiceFormik.setFieldValue(
                    "currencyId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesInvoiceFormik.setFieldValue(
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
                  salesInvoiceFormik.touched.currencyId &&
                  Boolean(salesInvoiceFormik.errors.currencyId)
                }
                helperText={
                  salesInvoiceFormik.touched.currencyId &&
                  salesInvoiceFormik.errors.currencyId
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
                  salesInvoiceFormik.setFieldValue(
                    "accountId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesInvoiceFormik.setFieldValue(
                    "accountId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesInvoiceFormik.setFieldValue(
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
                  salesInvoiceFormik.touched.accountId &&
                  Boolean(salesInvoiceFormik.errors.accountId)
                }
                helperText={
                  salesInvoiceFormik.touched.accountId &&
                  salesInvoiceFormik.errors.accountId
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
                id="invoiceDate"
                label="Invoice Date"
                defaultValue={dateFormat(
                  salesInvoiceFormik.values.invoiceDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={salesInvoiceFormik.handleChange}
                error={
                  salesInvoiceFormik.touched.invoiceDate &&
                  Boolean(salesInvoiceFormik.errors.invoiceDate)
                }
                helperText={
                  salesInvoiceFormik.touched.invoiceDate &&
                  salesInvoiceFormik.errors.invoiceDate
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DatePicker
                id="shipmentDate"
                label="Shipment Date"
                defaultValue={dateFormat(
                  salesInvoiceFormik.values.shipmentDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={salesInvoiceFormik.handleChange}
                error={
                  salesInvoiceFormik.touched.shipmentDate &&
                  Boolean(salesInvoiceFormik.errors.shipmentDate)
                }
                helperText={
                  salesInvoiceFormik.touched.shipmentDate &&
                  salesInvoiceFormik.errors.shipmentDate
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
                  salesInvoiceFormik.setFieldValue(
                    "shipmentTermId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesInvoiceFormik.setFieldValue(
                    "shipmentTermName",
                    value === null || value === undefined ? "" : value.title
                  );
                  setNewShipmentTermValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={shipmentTermRecord}
                error={
                  salesInvoiceFormik.touched.shipmentTermId &&
                  Boolean(salesInvoiceFormik.errors.shipmentTermId)
                }
                helperText={
                  salesInvoiceFormik.touched.shipmentTermId &&
                  salesInvoiceFormik.errors.shipmentTermId
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
                  salesInvoiceFormik.setFieldValue(
                    "shipmentModeId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesInvoiceFormik.setFieldValue(
                    "shipmentModeId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesInvoiceFormik.setFieldValue(
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
                  salesInvoiceFormik.touched.shipmentModeId &&
                  Boolean(salesInvoiceFormik.errors.shipmentModeId)
                }
                helperText={
                  salesInvoiceFormik.touched.shipmentModeId &&
                  salesInvoiceFormik.errors.shipmentModeId
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
                aria-label="maximum height"
                id="description"
                placeholder="Description"
                style={{ height: 100 }}
                value={salesInvoiceFormik.values.description}
                onChange={salesInvoiceFormik.handleChange}
                size="small"
                fullWidth
                error={
                  salesInvoiceFormik.touched.description &&
                  Boolean(salesInvoiceFormik.errors.description)
                }
                helperText={
                  salesInvoiceFormik.touched.description &&
                  salesInvoiceFormik.errors.description
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
                    salesInvoiceFormik.setFieldValue(
                      "paymentTermId",
                      value === null || value === undefined
                        ? ""
                        : value.key.toString()
                    );
                    salesInvoiceFormik.setFieldValue(
                      "paymentTermName",
                      value === null || value === undefined ? "" : value.title
                    );
                    setNewPaymentTermValue(
                      value === null || value === undefined ? "" : value
                    );
                  }}
                  data={paymentMethodRecord}
                  error={
                    salesInvoiceFormik.touched.paymentTermId &&
                    Boolean(salesInvoiceFormik.errors.paymentTermId)
                  }
                  helperText={
                    salesInvoiceFormik.touched.paymentTermId &&
                    salesInvoiceFormik.errors.paymentTermId
                  }
                />
              </Grid>
            </div>
          </div>
          <SalesInvoiceItemDetailsForm
            SalesInvoiceMaterials={SalesInvoiceMaterials}
            setSalesInvoiceMaterials={setSalesInvoiceMaterials}
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
                  bInvoiceBottom: "1px solid #707070",
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
                  value={salesInvoiceFormik.values.totalAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    salesInvoiceFormik.touched.totalAmount &&
                    Boolean(salesInvoiceFormik.errors.totalAmount)
                  }
                  helperText={
                    salesInvoiceFormik.touched.totalAmount &&
                    salesInvoiceFormik.errors.totalAmount
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
                  bInvoiceBottom: "1px solid #707070",
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
                    salesInvoiceFormik.values.discount != 0
                      ? salesInvoiceFormik.values.discount
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var v = parseInt(x.target.value, 10);
                    //console.log("Dis", v);
                    if (v >= 0 && v <= 100) {
                      salesInvoiceFormik.setFieldValue("discount", v);
                      //SalesQuotationFormik.handleChange;
                    } else {
                      salesInvoiceFormik.setFieldValue("discount", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(salesInvoiceFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    salesInvoiceFormik.touched.discount &&
                    Boolean(salesInvoiceFormik.errors.discount)
                  }
                  helperText={
                    salesInvoiceFormik.touched.discount &&
                    salesInvoiceFormik.errors.discount
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
                  bInvoiceBottom: "1px solid #707070",
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
                    salesInvoiceFormik.values.tax != 0
                      ? salesInvoiceFormik.values.tax
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var t = parseInt(x.target.value, 10);
                    //console.log("Tax", t);
                    if (t >= 0 && t <= 100) {
                      salesInvoiceFormik.setFieldValue("tax", t);
                      //SalesQuotationFormik.handleChange;
                    } else {
                      salesInvoiceFormik.setFieldValue("tax", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(salesInvoiceFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    salesInvoiceFormik.touched.tax &&
                    Boolean(salesInvoiceFormik.errors.tax)
                  }
                  helperText={
                    salesInvoiceFormik.touched.tax &&
                    salesInvoiceFormik.errors.tax
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
                  bInvoiceBottom: "1px solid #707070",
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
                    salesInvoiceFormik.values.freightAmount != 0
                      ? salesInvoiceFormik.values.freightAmount
                      : ""
                  }
                  placeholder="0"
                  onChange={salesInvoiceFormik.handleChange}
                  onBlur={() => {
                    calculation(salesInvoiceFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    salesInvoiceFormik.touched.freightAmount &&
                    Boolean(salesInvoiceFormik.errors.freightAmount)
                  }
                  helperText={
                    salesInvoiceFormik.touched.freightAmount &&
                    salesInvoiceFormik.errors.freightAmount
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
                  bInvoiceBottom: "1px solid #707070",
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
                  value={salesInvoiceFormik.values.netAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    salesInvoiceFormik.touched.netAmount &&
                    Boolean(salesInvoiceFormik.errors.netAmount)
                  }
                  helperText={
                    salesInvoiceFormik.touched.netAmount &&
                    salesInvoiceFormik.errors.netAmount
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

export default SalesInvoiceForm;
