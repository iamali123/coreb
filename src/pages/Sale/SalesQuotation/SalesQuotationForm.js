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
  SalesQuotationItemDetailValidationSchema,
  SalesQuotationItemDetailsInitialValues,
  salesQuotationInitialValues,
  salesQuotationValidationSchema,
} from "../../../Schema/Sales/SalesQuotation/InitialValues";
import { useFormik } from "formik";
import {
  AddSalesQuotation,
  EditSalesQuotation,
} from "../../../Api/Actions/salesQuotationActions";
import { ADD_SALES_ORDER, EDIT_SALES_ORDER } from "../../../Redux/Constants";
import SalesQuotationItemDetailsForm from "./SalesQuotationItemDetailsForm";
import SalesQuotationItemDetailList from "./SalesQuotationItemDetailsList";
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

const SalesQuotationForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  var itemId;
  var SalesQuotationId;

  if (
    params.SalesQuotationId !== null ||
    params.SalesQuotationId !== undefined
  ) {
    SalesQuotationId = params.SalesQuotationId;
  }
  const [ShowSpinner, setShowSpinner] = useState(false);
  const [SalesQuotationMaterials, setSalesQuotationMaterials] = useState([]);
  const [run, setrun] = useState(false);
  const user = useSelector((state) => state.userReducer);

  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  var EditCustomerListValue;
  var EditSalesQuotations;
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

  if (SalesQuotationId !== undefined) {
    EditSalesQuotations = useSelector(
      (state) => state.salesQuotationReducer
    ).find((e) => e.id === SalesQuotationId);
  }

  useEffect(() => {
    if (EditSalesQuotations !== undefined) {
      setSalesQuotationMaterials(
        EditSalesQuotations.salesQuotationItemDetailModel
      );
      setrun(!run);
    }
  }, [EditSalesQuotations]);

  const SalesQuotationFormik = useFormik({
    initialValues:
      EditSalesQuotations !== undefined
        ? EditSalesQuotations
        : salesQuotationInitialValues,
    validationSchema: salesQuotationValidationSchema,
    onSubmit: (values, { resetForm }) => {
      //console.log("valys", values);
      const SalesQuotation = {
        id: values.id !== "" ? values.id : "",
        companyId: companyId,

        orderCode: values.orderCode,

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
        SalesQuotationItemDetailModel: SalesQuotationMaterials,
      };
      //console.log("values", SalesQuotation);
      if (SalesQuotationMaterials.length > 0) {
        if (SalesQuotation.id === "") {
          setShowSpinner(true);
          AddSalesQuotation(SalesQuotation)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: ADD_SALES_ORDER, payload: res.data });
                setShowSpinner(false);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Saved",
                  text: "Sales Quotation Save SuccessFully",
                  showConfirmButton: false,
                  timer: 1500,
                });
                resetForm();
                setrun(!run);
                setTimeout(() => {
                  history.push(`/SalesQuotation`);
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
          EditSalesQuotation(SalesQuotation)
            .then((res) => {
              dispatch({ type: EDIT_SALES_ORDER, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Sales Quotation Update SuccessFully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push(`/SalesQuotation`);
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
          title: "Warning",
          text: "Please add aleast one product.",
          icon: "warning",
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
      (x) => x.key === SalesQuotationFormik.values.customerId
    ).map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
    }));
    EditCurrencyValue = currencyRecord
      .filter(
        (x) => x.key.toString() === SalesQuotationFormik.values.currencyId
      )
      .map((currency) => ({
        title: currency.title,
        value: currency.value,
        key: currency.key,
      }));
    EditPaymentTermValue = paymentMethodRecord
      .filter(
        (x) => x.key.toString() === SalesQuotationFormik.values.paymentTermId
      )
      .map((payment) => ({
        title: payment.title,
        value: payment.value,
        key: payment.key,
      }));
    EditBankAccountValue = bankAccountsRecord
      .filter((x) => x.key.toString() === SalesQuotationFormik.values.accountId)
      .map((bank) => ({
        title: bank.title,
        value: bank.value,
        key: bank.key,
      }));
    EditShipmentTermValue = shipmentTermRecord
      .filter(
        (x) => x.key.toString() === SalesQuotationFormik.values.shipmentTermId
      )
      .map((term) => ({
        title: term.title,
        value: term.value,
        key: term.key,
      }));
    EditShipmentModeValue = shipmentModeRecord
      .filter(
        (x) => x.key.toString() === SalesQuotationFormik.values.shipmentModeId
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
    if (SalesQuotationMaterials.length > 0) {
      sum = SalesQuotationMaterials.map((o) => o.totalPrice).reduce((a, c) => {
        return a + c;
      });
    }
    SalesQuotationFormik.setFieldValue("totalAmount", sum);
    let amount = sum;

    if (values.discount != null && values.discount != 0) {
      disPercent = values.discount;
    }
    gross = amount;
    if (amount > 0 && disPercent >= 0) {
      disAmount = amount * (disPercent / 100);
      gross = amount - disAmount;
    }
    netAmount = gross;
    if (values.tax >= 0 && gross >= 0) {
      taxPer = values.tax;
      taxAmount = gross * (taxPer / 100);
      netAmount = gross + taxAmount;
    }
    freightAmount = 0;
    if (values.freightAmount >= 0 && values.freightAmount < netAmount) {
      freightAmount = values.freightAmount;
      netAmount = netAmount + freightAmount;
    }

    SalesQuotationFormik.setFieldValue("discountAmount", disAmount);
    SalesQuotationFormik.setFieldValue("gross", gross);
    SalesQuotationFormik.setFieldValue("taxAmount", taxAmount);
    SalesQuotationFormik.setFieldValue("freightAmount", freightAmount);
    SalesQuotationFormik.setFieldValue("netAmount", netAmount);
  };

  useEffect(() => {
    // console.log("SalesOrderMaterials", SalesOrderMaterials);
    if (SalesQuotationMaterials.length > 0) {
      calculation(SalesQuotationFormik.values);
    }
  }, [SalesQuotationMaterials]);

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
                  title: "Quotation List",
                  url: "/SalesQuotation",
                },
                {
                  title: params?.SalesQuotationId
                    ? `Edit Quotation `
                    : "New Quotation",
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
                history.push(`/SalesQuotation`);
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
              onClick={SalesQuotationFormik.handleSubmit}
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
        <form onSubmit={SalesQuotationFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="orderCode"
                label="Order Number"
                InputProps={{
                  readOnly: true,
                }}
                value={SalesQuotationFormik.values.orderCode}
                onChange={SalesQuotationFormik.handleChange}
                size="small"
                fullWidth
                error={
                  SalesQuotationFormik.touched.orderCode &&
                  Boolean(SalesQuotationFormik.errors.orderCode)
                }
                helperText={
                  SalesQuotationFormik.touched.orderCode &&
                  SalesQuotationFormik.errors.orderCode
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="referenceNo"
                label="Inquiry Ref Number"
                value={SalesQuotationFormik.values.referenceNo}
                onChange={SalesQuotationFormik.handleChange}
                size="small"
                fullWidth
                error={
                  SalesQuotationFormik.touched.referenceNumber &&
                  Boolean(SalesQuotationFormik.errors.referenceNo)
                }
                helperText={
                  SalesQuotationFormik.touched.referenceNo &&
                  SalesQuotationFormik.errors.referenceNo
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
                  SalesQuotationFormik.setFieldValue(
                    "customerId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  SalesQuotationFormik.setFieldValue(
                    "customerName",
                    value === null || value === undefined ? "" : value.name
                  );
                  setNewCustomerValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={CustomerList}
                error={
                  SalesQuotationFormik.touched.customerId &&
                  Boolean(SalesQuotationFormik.errors.customerId)
                }
                helperText={
                  SalesQuotationFormik.touched.customerId &&
                  SalesQuotationFormik.errors.customerId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="customerName"
                label="Customer Name"
                value={SalesQuotationFormik.values.customerName}
                onChange={SalesQuotationFormik.handleChange}
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                error={
                  SalesQuotationFormik.touched.customerName &&
                  Boolean(SalesQuotationFormik.errors.customerName)
                }
                helperText={
                  SalesQuotationFormik.touched.customerName &&
                  SalesQuotationFormik.errors.customerName
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
                  SalesQuotationFormik.setFieldValue(
                    "currencyId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  SalesQuotationFormik.setFieldValue(
                    "currencyId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  SalesQuotationFormik.setFieldValue(
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
                  SalesQuotationFormik.touched.currencyId &&
                  Boolean(SalesQuotationFormik.errors.currencyId)
                }
                helperText={
                  SalesQuotationFormik.touched.currencyId &&
                  SalesQuotationFormik.errors.currencyId
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
                  SalesQuotationFormik.setFieldValue(
                    "accountId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  SalesQuotationFormik.setFieldValue(
                    "accountId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  SalesQuotationFormik.setFieldValue(
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
                  SalesQuotationFormik.touched.accountId &&
                  Boolean(SalesQuotationFormik.errors.accountId)
                }
                helperText={
                  SalesQuotationFormik.touched.accountId &&
                  SalesQuotationFormik.errors.accountId
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
                  SalesQuotationFormik.values.orderDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={SalesQuotationFormik.handleChange}
                error={
                  SalesQuotationFormik.touched.orderDate &&
                  Boolean(SalesQuotationFormik.errors.orderDate)
                }
                helperText={
                  SalesQuotationFormik.touched.orderDate &&
                  SalesQuotationFormik.errors.orderDate
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DatePicker
                id="shipmentDate"
                label="Shipment Date"
                defaultValue={dateFormat(
                  SalesQuotationFormik.values.shipmentDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={SalesQuotationFormik.handleChange}
                error={
                  SalesQuotationFormik.touched.shipmentDate &&
                  Boolean(SalesQuotationFormik.errors.shipmentDate)
                }
                helperText={
                  SalesQuotationFormik.touched.shipmentDate &&
                  SalesQuotationFormik.errors.shipmentDate
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
                  SalesQuotationFormik.setFieldValue(
                    "shipmentTermId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  SalesQuotationFormik.setFieldValue(
                    "shipmentTermName",
                    value === null || value === undefined ? "" : value.title
                  );
                  setNewShipmentTermValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={shipmentTermRecord}
                error={
                  SalesQuotationFormik.touched.shipmentTermId &&
                  Boolean(SalesQuotationFormik.errors.shipmentTermId)
                }
                helperText={
                  SalesQuotationFormik.touched.shipmentTermId &&
                  SalesQuotationFormik.errors.shipmentTermId
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
                  SalesQuotationFormik.setFieldValue(
                    "shipmentModeId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  SalesQuotationFormik.setFieldValue(
                    "shipmentModeId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  SalesQuotationFormik.setFieldValue(
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
                  SalesQuotationFormik.touched.shipmentModeId &&
                  Boolean(SalesQuotationFormik.errors.shipmentModeId)
                }
                helperText={
                  SalesQuotationFormik.touched.shipmentModeId &&
                  SalesQuotationFormik.errors.shipmentModeId
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
                value={SalesQuotationFormik.values.description}
                onChange={SalesQuotationFormik.handleChange}
                size="small"
                fullWidth
                error={
                  SalesQuotationFormik.touched.description &&
                  Boolean(SalesQuotationFormik.errors.description)
                }
                helperText={
                  SalesQuotationFormik.touched.description &&
                  SalesQuotationFormik.errors.description
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
                    SalesQuotationFormik.setFieldValue(
                      "paymentTermId",
                      value === null || value === undefined
                        ? ""
                        : value.key.toString()
                    );
                    SalesQuotationFormik.setFieldValue(
                      "paymentTermName",
                      value === null || value === undefined ? "" : value.title
                    );
                    setNewPaymentTermValue(
                      value === null || value === undefined ? "" : value
                    );
                  }}
                  data={paymentMethodRecord}
                  error={
                    SalesQuotationFormik.touched.paymentTermId &&
                    Boolean(SalesQuotationFormik.errors.paymentTermId)
                  }
                  helperText={
                    SalesQuotationFormik.touched.paymentTermId &&
                    SalesQuotationFormik.errors.paymentTermId
                  }
                />
              </Grid>
            </div>
          </div>
          <SalesQuotationItemDetailsForm
            SalesQuotationMaterials={SalesQuotationMaterials}
            setSalesQuotationMaterials={setSalesQuotationMaterials}
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
                  value={SalesQuotationFormik.values.totalAmount}
                  InputProps={{
                    readOnly: true,
                  }}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    SalesQuotationFormik.touched.totalAmount &&
                    Boolean(SalesQuotationFormik.errors.totalAmount)
                  }
                  helperText={
                    SalesQuotationFormik.touched.totalAmount &&
                    SalesQuotationFormik.errors.totalAmount
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
                    SalesQuotationFormik.values.discount != 0
                      ? SalesQuotationFormik.values.discount
                      : ""
                  }
                  placeholder="0"
                  type="number"
                  onChange={(x) => {
                    var v = parseInt(x.target.value, 10);
                    //console.log("Dis", v);
                    if (v >= 0 && v <= 100) {
                      SalesQuotationFormik.setFieldValue("discount", v);
                      //SalesQuotationFormik.handleChange;
                    } else {
                      SalesQuotationFormik.setFieldValue("discount", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(SalesQuotationFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    SalesQuotationFormik.touched.discount &&
                    Boolean(SalesQuotationFormik.errors.discount)
                  }
                  helperText={
                    SalesQuotationFormik.touched.discount &&
                    SalesQuotationFormik.errors.discount
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
                    SalesQuotationFormik.values.tax != 0
                      ? SalesQuotationFormik.values.tax
                      : ""
                  }
                  placeholder="0"
                  type="number"
                  onChange={(x) => {
                    var t = parseInt(x.target.value, 10);
                    //console.log("Tax", t);
                    if (t >= 0 && t <= 100) {
                      SalesQuotationFormik.setFieldValue("tax", t);
                      //SalesQuotationFormik.handleChange;
                    } else {
                      SalesQuotationFormik.setFieldValue("tax", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(SalesQuotationFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    SalesQuotationFormik.touched.tax &&
                    Boolean(SalesQuotationFormik.errors.tax)
                  }
                  helperText={
                    SalesQuotationFormik.touched.tax &&
                    SalesQuotationFormik.errors.tax
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
                    SalesQuotationFormik.values.freightAmount != 0
                      ? SalesQuotationFormik.values.freightAmount
                      : ""
                  }
                  placeholder="0"
                  type="number"
                  onChange={SalesQuotationFormik.handleChange}
                  onBlur={() => {
                    calculation(SalesQuotationFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    SalesQuotationFormik.touched.freightAmount &&
                    Boolean(SalesQuotationFormik.errors.freightAmount)
                  }
                  helperText={
                    SalesQuotationFormik.touched.freightAmount &&
                    SalesQuotationFormik.errors.freightAmount
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
                  value={SalesQuotationFormik.values.netAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    SalesQuotationFormik.touched.netAmount &&
                    Boolean(SalesQuotationFormik.errors.netAmount)
                  }
                  helperText={
                    SalesQuotationFormik.touched.netAmount &&
                    SalesQuotationFormik.errors.netAmount
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

export default SalesQuotationForm;
