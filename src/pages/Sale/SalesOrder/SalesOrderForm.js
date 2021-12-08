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
  SalesOrderItemDetailValidationSchema,
  SalesOrderItemDetailsInitialValues,
  salesOrderInitialValues,
  SalesOrderValidationSchema,
} from "../../../Schema/Sales/SalesOrder/InitialValues";
import { useFormik } from "formik";
import {
  AddSalesOrder,
  EditSalesOrderAction,
} from "../../../Api/Actions/salesOrderActions";
import { ADD_SALES_ORDER, EDIT_SALES_ORDER } from "../../../Redux/Constants";
import SalesOrderItemDetailsForm from "./SalesOrderItemDetailsForm";
import SalesOrderItemDetailList from "./SalesOrderItemDetailsList";
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

const SalesOrderForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  var itemId;
  var SalesOrderId;
  var SalesQuotationIds;

  if (params.SalesOrderId !== null || params.SalesOrderId !== undefined) {
    SalesOrderId = params.SalesOrderId;
  }

  if (
    params.SalesQuotationId !== null ||
    params.SalesQuotationId !== undefined
  ) {
    SalesQuotationIds = params.SalesQuotationId;
  }

  const [ShowSpinner, setShowSpinner] = useState(false);
  const [SalesOrderMaterials, setSalesOrderMaterials] = useState([]);
  const [run, setrun] = useState(false);

  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  var EditCustomerListValue;
  var EditSalesOrder;
  var SalesQuotation;

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

  if (SalesOrderId !== undefined) {
    EditSalesOrder = useSelector((state) => state.salesOrderReducer).find(
      (e) => e.id === SalesOrderId
    );
  }

  if (SalesQuotationIds !== undefined) {
    EditSalesOrder = salesOrderInitialValues;
    SalesQuotation = useSelector((state) => state.salesQuotationReducer).find(
      (e) => e.id === SalesQuotationIds
    );

    EditSalesOrder.id = "";
    EditSalesOrder.companyId = SalesQuotation.companyId;
    EditSalesOrder.OrderCode = "";
    EditSalesOrder.orderDate = SalesQuotation.orderDate;
    EditSalesOrder.orderReceiveDate = SalesQuotation.orderDate;
    EditSalesOrder.shipmentDate = SalesQuotation.shipmentDate;
    EditSalesOrder.customerId = SalesQuotation.customerId;
    EditSalesOrder.customerName = SalesQuotation.customerName;
    EditSalesOrder.currencyId = SalesQuotation.currencyId;
    EditSalesOrder.currencyName = SalesQuotation.currencyName;
    EditSalesOrder.accountId = SalesQuotation.accountId;
    EditSalesOrder.accountName = SalesQuotation.accountName;
    EditSalesOrder.shipmentTermId = SalesQuotation.shipmentTermId;
    EditSalesOrder.supplierTermName = SalesQuotation.shipmentTermName;
    EditSalesOrder.shipmentModeId = SalesQuotation.shipmentModeId;
    EditSalesOrder.shipmentModeName = SalesQuotation.shipmentModeName;
    EditSalesOrder.paymentTermId = SalesQuotation.paymentTermId;
    EditSalesOrder.paymentTermName = SalesQuotation.paymentTermName;
    EditSalesOrder.referenceNo = SalesQuotation.referenceNo;
    EditSalesOrder.description = SalesQuotation.description;
    EditSalesOrder.discount = SalesQuotation.discount;
    EditSalesOrder.discountAmount = SalesQuotation.discountAmount;
    EditSalesOrder.gross = SalesQuotation.gross;
    EditSalesOrder.taxId = SalesQuotation.taxId;
    EditSalesOrder.taxName = SalesQuotation.taxName;
    EditSalesOrder.tax = SalesQuotation.tax;
    EditSalesOrder.taxAmount = SalesQuotation.taxAmount;
    EditSalesOrder.totalAmount = SalesQuotation.totalAmount;
    EditSalesOrder.freightAmount = SalesQuotation.freightAmount;
    EditSalesOrder.netAmount = SalesQuotation.netAmount;
    EditSalesOrder.salesQuotationId = SalesQuotation.id;
    EditSalesOrder.salesOrderItemDetailModel =
      SalesQuotation.salesQuotationItemDetailModel.map((mode) => ({
        id: "0",
        salesOrderId: "",
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
    if (EditSalesOrder !== undefined) {
      setSalesOrderMaterials(EditSalesOrder.salesOrderItemDetailModel);
      setrun(!run);
    }
  }, [EditSalesOrder]);

  const salesOrderFormik = useFormik({
    initialValues:
      EditSalesOrder !== undefined ? EditSalesOrder : salesOrderInitialValues,
    validationSchema: SalesOrderValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const salesOrder = {
        id: values.id !== "" ? values.id : "",
        companyId: companyId,
        OrderCode: values.OrderCode,
        orderDate: values.orderDate,
        orderReceiveDate: values.orderDate,
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
        salesQuotationId: values.salesQuotationId,
        salesOrderItemDetailModel: SalesOrderMaterials,
      };
      //console.log("values", salesOrder);
      if (SalesOrderMaterials.length > 0) {
        if (salesOrder.id === "") {
          setShowSpinner(true);
          AddSalesOrder(salesOrder)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: ADD_SALES_ORDER, payload: res.data });
                setShowSpinner(false);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Saved",
                  text: "Sales Order Save SuccessFully",
                  showConfirmButton: false,
                  timer: 1500,
                });
                resetForm();
                setrun(!run);
                setTimeout(() => {
                  history.push(`/SalesOrder`);
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
          EditSalesOrderAction(salesOrder)
            .then((res) => {
              dispatch({ type: EDIT_SALES_ORDER, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Sales Order Update SuccessFully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push(`/SalesOrder`);
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
          text: "Please add Sales Order Material ",
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
      (x) => x.key === salesOrderFormik.values.customerId
    ).map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
    }));
    EditCurrencyValue = currencyRecord
      .filter((x) => x.key.toString() === salesOrderFormik.values.currencyId)
      .map((currency) => ({
        title: currency.title,
        value: currency.value,
        key: currency.key,
      }));
    EditPaymentTermValue = paymentMethodRecord
      .filter((x) => x.key.toString() === salesOrderFormik.values.paymentTermId)
      .map((payment) => ({
        title: payment.title,
        value: payment.value,
        key: payment.key,
      }));
    EditBankAccountValue = bankAccountsRecord
      .filter((x) => x.key.toString() === salesOrderFormik.values.accountId)
      .map((bank) => ({
        title: bank.title,
        value: bank.value,
        key: bank.key,
      }));
    EditShipmentTermValue = shipmentTermRecord
      .filter(
        (x) => x.key.toString() === salesOrderFormik.values.shipmentTermId
      )
      .map((term) => ({
        title: term.title,
        value: term.value,
        key: term.key,
      }));
    EditShipmentModeValue = shipmentModeRecord
      .filter(
        (x) => x.key.toString() === salesOrderFormik.values.shipmentModeId
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
    if (SalesOrderMaterials.length > 0) {
      sum = SalesOrderMaterials.map((o) => o.totalPrice).reduce((a, c) => {
        return a + c;
      });
    }
    salesOrderFormik.setFieldValue("totalAmount", sum);
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

    salesOrderFormik.setFieldValue("discountAmount", disAmount);
    salesOrderFormik.setFieldValue("gross", gross);
    salesOrderFormik.setFieldValue("taxAmount", taxAmount);
    salesOrderFormik.setFieldValue("freightAmount", freightAmount);
    salesOrderFormik.setFieldValue("netAmount", netAmount);
  };

  useEffect(() => {
    // console.log("SalesOrderMaterials", SalesOrderMaterials);
    if (SalesOrderMaterials.length > 0) {
      calculation(salesOrderFormik.values);
    }
  }, [SalesOrderMaterials]);

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
                  title: "Sales Order List",
                  url: "/SalesOrder",
                },
                {
                  title: params?.SalesOrderId
                    ? "Edit Sale Order"
                    : "New Sale Order",
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
                history.push(`/SalesOrder`);
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
              onClick={salesOrderFormik.handleSubmit}
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
        <form onSubmit={salesOrderFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="orderCode"
                label="Order Number"
                InputProps={{
                  readOnly: true,
                }}
                value={salesOrderFormik.values.orderCode}
                onChange={salesOrderFormik.handleChange}
                size="small"
                fullWidth
                error={
                  salesOrderFormik.touched.orderCode &&
                  Boolean(salesOrderFormik.errors.orderCode)
                }
                helperText={
                  salesOrderFormik.touched.orderCode &&
                  salesOrderFormik.errors.orderCode
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="referenceNo"
                label="Inquiry Ref Number"
                value={salesOrderFormik.values.referenceNo}
                onChange={salesOrderFormik.handleChange}
                size="small"
                fullWidth
                error={
                  salesOrderFormik.touched.referenceNumber &&
                  Boolean(salesOrderFormik.errors.referenceNo)
                }
                helperText={
                  salesOrderFormik.touched.referenceNo &&
                  salesOrderFormik.errors.referenceNo
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
                  salesOrderFormik.setFieldValue(
                    "customerId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesOrderFormik.setFieldValue(
                    "customerName",
                    value === null || value === undefined ? "" : value.name
                  );
                  setNewCustomerValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={CustomerList}
                error={
                  salesOrderFormik.touched.customerId &&
                  Boolean(salesOrderFormik.errors.customerId)
                }
                helperText={
                  salesOrderFormik.touched.customerId &&
                  salesOrderFormik.errors.customerId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="customerName"
                label="Customer Name"
                InputProps={{
                  readOnly: true,
                }}
                value={salesOrderFormik.values.customerName}
                onChange={salesOrderFormik.handleChange}
                size="small"
                fullWidth
                error={
                  salesOrderFormik.touched.customerName &&
                  Boolean(salesOrderFormik.errors.customerName)
                }
                helperText={
                  salesOrderFormik.touched.customerName &&
                  salesOrderFormik.errors.customerName
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
                  salesOrderFormik.setFieldValue(
                    "currencyId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesOrderFormik.setFieldValue(
                    "currencyId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesOrderFormik.setFieldValue(
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
                  salesOrderFormik.touched.currencyId &&
                  Boolean(salesOrderFormik.errors.currencyId)
                }
                helperText={
                  salesOrderFormik.touched.currencyId &&
                  salesOrderFormik.errors.currencyId
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
                  salesOrderFormik.setFieldValue(
                    "accountId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesOrderFormik.setFieldValue(
                    "accountId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesOrderFormik.setFieldValue(
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
                  salesOrderFormik.touched.accountId &&
                  Boolean(salesOrderFormik.errors.accountId)
                }
                helperText={
                  salesOrderFormik.touched.accountId &&
                  salesOrderFormik.errors.accountId
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
                defaultValue={dateFormat(
                  salesOrderFormik.values.orderDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={salesOrderFormik.handleChange}
                error={
                  salesOrderFormik.touched.orderDate &&
                  Boolean(salesOrderFormik.errors.orderDate)
                }
                helperText={
                  salesOrderFormik.touched.orderDate &&
                  salesOrderFormik.errors.orderDate
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DatePicker
                id="shipmentDate"
                label="Shipment Date"
                defaultValue={dateFormat(
                  salesOrderFormik.values.shipmentDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={salesOrderFormik.handleChange}
                error={
                  salesOrderFormik.touched.shipmentDate &&
                  Boolean(salesOrderFormik.errors.shipmentDate)
                }
                helperText={
                  salesOrderFormik.touched.shipmentDate &&
                  salesOrderFormik.errors.shipmentDate
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
                  salesOrderFormik.setFieldValue(
                    "shipmentTermId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesOrderFormik.setFieldValue(
                    "shipmentTermName",
                    value === null || value === undefined ? "" : value.title
                  );
                  setNewShipmentTermValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={shipmentTermRecord}
                error={
                  salesOrderFormik.touched.shipmentTermId &&
                  Boolean(salesOrderFormik.errors.shipmentTermId)
                }
                helperText={
                  salesOrderFormik.touched.shipmentTermId &&
                  salesOrderFormik.errors.shipmentTermId
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
                  salesOrderFormik.setFieldValue(
                    "shipmentModeId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesOrderFormik.setFieldValue(
                    "shipmentModeId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  salesOrderFormik.setFieldValue(
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
                  salesOrderFormik.touched.shipmentModeId &&
                  Boolean(salesOrderFormik.errors.shipmentModeId)
                }
                helperText={
                  salesOrderFormik.touched.shipmentModeId &&
                  salesOrderFormik.errors.shipmentModeId
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
                value={salesOrderFormik.values.description}
                onChange={salesOrderFormik.handleChange}
                size="small"
                fullWidth
                error={
                  salesOrderFormik.touched.description &&
                  Boolean(salesOrderFormik.errors.description)
                }
                helperText={
                  salesOrderFormik.touched.description &&
                  salesOrderFormik.errors.description
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
                    salesOrderFormik.setFieldValue(
                      "paymentTermId",
                      value === null || value === undefined
                        ? ""
                        : value.key.toString()
                    );
                    salesOrderFormik.setFieldValue(
                      "paymentTermName",
                      value === null || value === undefined ? "" : value.title
                    );
                    setNewPaymentTermValue(
                      value === null || value === undefined ? "" : value
                    );
                  }}
                  data={paymentMethodRecord}
                  error={
                    salesOrderFormik.touched.paymentTermId &&
                    Boolean(salesOrderFormik.errors.paymentTermId)
                  }
                  helperText={
                    salesOrderFormik.touched.paymentTermId &&
                    salesOrderFormik.errors.paymentTermId
                  }
                />
              </Grid>
            </div>
          </div>
          <SalesOrderItemDetailsForm
            SalesOrderMaterials={SalesOrderMaterials}
            setSalesOrderMaterials={setSalesOrderMaterials}
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
                  value={salesOrderFormik.values.totalAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    salesOrderFormik.touched.totalAmount &&
                    Boolean(salesOrderFormik.errors.totalAmount)
                  }
                  helperText={
                    salesOrderFormik.touched.totalAmount &&
                    salesOrderFormik.errors.totalAmount
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
                    salesOrderFormik.values.discount != 0
                      ? salesOrderFormik.values.discount
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var v = parseInt(x.target.value, 10);
                    //console.log("Dis", v);
                    if (v >= 0 && v <= 100) {
                      salesOrderFormik.setFieldValue("discount", v);
                      //SalesQuotationFormik.handleChange;
                    } else {
                      salesOrderFormik.setFieldValue("discount", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(salesOrderFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    salesOrderFormik.touched.discount &&
                    Boolean(salesOrderFormik.errors.discount)
                  }
                  helperText={
                    salesOrderFormik.touched.discount &&
                    salesOrderFormik.errors.discount
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
                    salesOrderFormik.values.tax != 0
                      ? salesOrderFormik.values.tax
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var t = parseInt(x.target.value, 10);
                    //console.log("Tax", t);
                    if (t >= 0 && t <= 100) {
                      salesOrderFormik.setFieldValue("tax", t);
                      //SalesQuotationFormik.handleChange;
                    } else {
                      salesOrderFormik.setFieldValue("tax", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(salesOrderFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    salesOrderFormik.touched.tax &&
                    Boolean(salesOrderFormik.errors.tax)
                  }
                  helperText={
                    salesOrderFormik.touched.tax && salesOrderFormik.errors.tax
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
                    salesOrderFormik.values.freightAmount != 0
                      ? salesOrderFormik.values.freightAmount
                      : ""
                  }
                  placeholder="0"
                  onChange={salesOrderFormik.handleChange}
                  onBlur={() => {
                    calculation(salesOrderFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    salesOrderFormik.touched.freightAmount &&
                    Boolean(salesOrderFormik.errors.freightAmount)
                  }
                  helperText={
                    salesOrderFormik.touched.freightAmount &&
                    salesOrderFormik.errors.freightAmount
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
                  value={salesOrderFormik.values.netAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    salesOrderFormik.touched.netAmount &&
                    Boolean(salesOrderFormik.errors.netAmount)
                  }
                  helperText={
                    salesOrderFormik.touched.netAmount &&
                    salesOrderFormik.errors.netAmount
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

export default SalesOrderForm;
