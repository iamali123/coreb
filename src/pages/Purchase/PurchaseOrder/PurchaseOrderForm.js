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
  purchaseOrderInitialValues,
  PurchaseOrderValidationSchema,
} from "../../../Schema/Purchase/PurchaseOrderSchema/InitialValues";
import { useFormik } from "formik";
import {
  AddPurchaseOrder,
  EditPurchaseOrderAction,
} from "../../../Api/Actions/purchaseOrder";
import {
  ADD_PURCHASE_ORDER,
  EDIT_PURCHASE_ORDER,
} from "../../../Redux/Constants";
import PurchaseOrderItemDetailsForm from "./PurchaseOrderItemDetailsForm";
import PurchaseOrderItemDetailList from "./PurchaseOrderItemDetailsList";
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

const PurchaseOrderForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  var PurchaseInquiryIds;
  var PurchaseOrderId;

  if (params.PurchaseOrderId !== null || params.PurchaseOrderId !== undefined) {
    PurchaseOrderId = params.PurchaseOrderId;
  }
  if (
    params.PurchaseInquiryId !== null ||
    params.PurchaseInquiryId !== undefined
  ) {
    PurchaseInquiryIds = params.PurchaseInquiryId;
  }
  const [ShowSpinner, setShowSpinner] = useState(false);
  const [PurchaseOrderMaterials, setPurchaseOrderMaterials] = useState([]);
  const [run, setrun] = useState(false);
  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  var EditSupplierListValue;
  var PurchaseInquiry;
  var EditPurchaseOrder;
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

  if (PurchaseOrderId !== undefined) {
    EditPurchaseOrder = useSelector((state) => state.PurchaseOrderReducer).find(
      (e) => e.id === PurchaseOrderId
    );
  }
  if (PurchaseInquiryIds !== undefined) {
    EditPurchaseOrder = purchaseOrderInitialValues;
    PurchaseInquiry = useSelector((state) => state.purchaseInquiryReducer).find(
      (e) => e.id === PurchaseInquiryIds
    );
    EditPurchaseOrder.id = "";
    EditPurchaseOrder.companyId = PurchaseInquiry.companyId;
    EditPurchaseOrder.OrderCode = "";
    EditPurchaseOrder.orderDate = PurchaseInquiry.orderDate;
    EditPurchaseOrder.orderReceiveDate = PurchaseInquiry.orderDate;
    EditPurchaseOrder.shipmentDate = PurchaseInquiry.shipmentDate;
    EditPurchaseOrder.supplierId = PurchaseInquiry.supplierId;
    EditPurchaseOrder.supplierName = PurchaseInquiry.supplierName;
    EditPurchaseOrder.currencyId = PurchaseInquiry.currencyId;
    EditPurchaseOrder.currencyName = PurchaseInquiry.currencyName;
    EditPurchaseOrder.accountId = PurchaseInquiry.accountId;
    EditPurchaseOrder.accountName = PurchaseInquiry.accountName;
    EditPurchaseOrder.shipmentTermId = PurchaseInquiry.shipmentTermId;
    EditPurchaseOrder.supplierTermName = PurchaseInquiry.shipmentTermName;
    EditPurchaseOrder.shipmentModeId = PurchaseInquiry.shipmentModeId;
    EditPurchaseOrder.shipmentModeName = PurchaseInquiry.shipmentModeName;
    EditPurchaseOrder.paymentTermId = PurchaseInquiry.paymentTermId;
    EditPurchaseOrder.paymentTermName = PurchaseInquiry.paymentTermName;
    EditPurchaseOrder.referenceNo = PurchaseInquiry.referenceNo;
    EditPurchaseOrder.description = PurchaseInquiry.description;
    EditPurchaseOrder.discount = PurchaseInquiry.discount;
    EditPurchaseOrder.discountAmount = PurchaseInquiry.discountAmount;
    EditPurchaseOrder.gross = PurchaseInquiry.gross;
    EditPurchaseOrder.taxId = PurchaseInquiry.taxId;
    EditPurchaseOrder.taxName = PurchaseInquiry.taxName;
    EditPurchaseOrder.tax = PurchaseInquiry.tax;
    EditPurchaseOrder.taxAmount = PurchaseInquiry.taxAmount;
    EditPurchaseOrder.totalAmount = PurchaseInquiry.totalAmount;
    EditPurchaseOrder.freightAmount = PurchaseInquiry.freightAmount;
    EditPurchaseOrder.netAmount = PurchaseInquiry.netAmount;
    EditPurchaseOrder.PurchaseInquiryId = PurchaseInquiry.id;
    EditPurchaseOrder.purchaseOrderItemDetails =
      PurchaseInquiry.purchaseInquiryItemDetails.map((mode) => ({
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
    if (EditPurchaseOrder !== undefined) {
      setPurchaseOrderMaterials(EditPurchaseOrder.purchaseOrderItemDetails);
      setrun(!run);
    }
  }, [EditPurchaseOrder]);

  const purchaseOrderFormik = useFormik({
    initialValues:
      EditPurchaseOrder !== undefined
        ? EditPurchaseOrder
        : purchaseOrderInitialValues,
    validationSchema: PurchaseOrderValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      const purchaseOrder = {
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
        PurchaseInquiryId: values.PurchaseInquiryId,
        purchaseOrderItemDetails: PurchaseOrderMaterials,
      };
      if (PurchaseOrderMaterials.length > 0) {
        if (purchaseOrder.Id === "") {
          setShowSpinner(true);
          AddPurchaseOrder(purchaseOrder)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: ADD_PURCHASE_ORDER, payload: res.data });
                setShowSpinner(false);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Saved",
                  text: "Purchase Order Save SuccessFully",
                  showConfirmButton: false,
                  timer: 1500,
                });
                resetForm();
                setrun(!run);
                setTimeout(() => {
                  history.push(`/PurchaseOrder`);
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
          EditPurchaseOrderAction(purchaseOrder)
            .then((res) => {
              dispatch({ type: EDIT_PURCHASE_ORDER, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Purchase Order Update SuccessFully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push(`/PurchaseOrder`);
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
      (x) => x.key === purchaseOrderFormik.values.supplierId
    ).map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
    }));
    EditCurrencyValue = currencyRecord
      .filter((x) => x.key.toString() === purchaseOrderFormik.values.currencyId)
      .map((currency) => ({
        title: currency.title,
        value: currency.value,
        key: currency.key,
      }));
    EditPaymentTermValue = paymentMethodRecord
      .filter(
        (x) => x.key.toString() === purchaseOrderFormik.values.paymentTermId
      )
      .map((payment) => ({
        title: payment.title,
        value: payment.value,
        key: payment.key,
      }));
    EditBankAccountValue = bankAccountsRecord
      .filter((x) => x.key.toString() === purchaseOrderFormik.values.accountId)
      .map((bank) => ({
        title: bank.title,
        value: bank.value,
        key: bank.key,
      }));
    EditShipmentTermValue = shipmentTermRecord
      .filter(
        (x) => x.key.toString() === purchaseOrderFormik.values.shipmentTermId
      )
      .map((term) => ({
        title: term.title,
        value: term.value,
        key: term.key,
      }));
    EditShipmentModeValue = shipmentModeRecord
      .filter(
        (x) => x.key.toString() === purchaseOrderFormik.values.shipmentModeId
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
    if (PurchaseOrderMaterials.length > 0) {
      sum = PurchaseOrderMaterials.map((o) => o.totalPrice).reduce((a, c) => {
        return a + c;
      });
    }
    purchaseOrderFormik.setFieldValue("totalAmount", sum);
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

    purchaseOrderFormik.setFieldValue("discountAmount", disAmount);
    purchaseOrderFormik.setFieldValue("gross", gross);
    purchaseOrderFormik.setFieldValue("taxAmount", taxAmount);
    purchaseOrderFormik.setFieldValue("freightAmount", freightAmount);
    purchaseOrderFormik.setFieldValue("netAmount", netAmount);
  };

  useEffect(() => {
    if (PurchaseOrderMaterials.length > 0) {
      calculation(purchaseOrderFormik.values);
    }
  }, [PurchaseOrderMaterials]);

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
                  title: "Purchase Order List",
                  url: "/PurchaseOrder",
                },
                {
                  title: params?.PurchaseOrderId
                    ? "Edit Purchase Order"
                    : "New Purchase Order",
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
                history.push(`/PurchaseOrder`);
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
              onClick={purchaseOrderFormik.handleSubmit}
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
        <form onSubmit={purchaseOrderFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="orderCode"
                label="Order Number"
                InputProps={{
                  readOnly: true,
                }}
                value={purchaseOrderFormik.values.orderCode}
                onChange={purchaseOrderFormik.handleChange}
                size="small"
                fullWidth
                error={
                  purchaseOrderFormik.touched.orderCode &&
                  Boolean(purchaseOrderFormik.errors.orderCode)
                }
                helperText={
                  purchaseOrderFormik.touched.orderCode &&
                  purchaseOrderFormik.errors.orderCode
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="referenceNumber"
                label="Inquiry Ref Number"
                value={purchaseOrderFormik.values.referenceNumber}
                onChange={purchaseOrderFormik.handleChange}
                size="small"
                fullWidth
                error={
                  purchaseOrderFormik.touched.referenceNumber &&
                  Boolean(purchaseOrderFormik.errors.referenceNumber)
                }
                helperText={
                  purchaseOrderFormik.touched.referenceNumber &&
                  purchaseOrderFormik.errors.referenceNumber
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
                  purchaseOrderFormik.setFieldValue(
                    "supplierId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseOrderFormik.setFieldValue(
                    "supplierName",
                    value === null || value === undefined ? "" : value.name
                  );
                  setNewSupplierValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={SupplierList}
                error={
                  purchaseOrderFormik.touched.supplierId &&
                  Boolean(purchaseOrderFormik.errors.supplierId)
                }
                helperText={
                  purchaseOrderFormik.touched.supplierId &&
                  purchaseOrderFormik.errors.supplierId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="supplierName"
                label="Supplier Name"
                value={purchaseOrderFormik.values.supplierName}
                onChange={purchaseOrderFormik.handleChange}
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                error={
                  purchaseOrderFormik.touched.supplierName &&
                  Boolean(purchaseOrderFormik.errors.supplierName)
                }
                helperText={
                  purchaseOrderFormik.touched.supplierName &&
                  purchaseOrderFormik.errors.supplierName
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
                  purchaseOrderFormik.setFieldValue(
                    "currencyId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseOrderFormik.setFieldValue(
                    "currencyId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseOrderFormik.setFieldValue(
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
                  purchaseOrderFormik.touched.currencyId &&
                  Boolean(purchaseOrderFormik.errors.currencyId)
                }
                helperText={
                  purchaseOrderFormik.touched.currencyId &&
                  purchaseOrderFormik.errors.currencyId
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
                  purchaseOrderFormik.setFieldValue(
                    "accountId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseOrderFormik.setFieldValue(
                    "accountId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseOrderFormik.setFieldValue(
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
                  purchaseOrderFormik.touched.accountId &&
                  Boolean(purchaseOrderFormik.errors.accountId)
                }
                helperText={
                  purchaseOrderFormik.touched.accountId &&
                  purchaseOrderFormik.errors.accountId
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
                  purchaseOrderFormik.values.orderDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={purchaseOrderFormik.handleChange}
                error={
                  purchaseOrderFormik.touched.orderDate &&
                  Boolean(purchaseOrderFormik.errors.orderDate)
                }
                helperText={
                  purchaseOrderFormik.touched.orderDate &&
                  purchaseOrderFormik.errors.orderDate
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DatePicker
                id="orderShipmentDate"
                label="Shipment Date"
                defaultValue={dateformat(
                  purchaseOrderFormik.values.orderShipmentDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={purchaseOrderFormik.handleChange}
                error={
                  purchaseOrderFormik.touched.orderShipmentDate &&
                  Boolean(purchaseOrderFormik.errors.orderShipmentDate)
                }
                helperText={
                  purchaseOrderFormik.touched.orderShipmentDate &&
                  purchaseOrderFormik.errors.orderShipmentDate
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
                  purchaseOrderFormik.setFieldValue(
                    "shipmentTermId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseOrderFormik.setFieldValue(
                    "shipmentTermName",
                    value === null || value === undefined ? "" : value.title
                  );
                  setNewShipmentTermValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={shipmentTermRecord}
                error={
                  purchaseOrderFormik.touched.shipmentTermId &&
                  Boolean(purchaseOrderFormik.errors.shipmentTermId)
                }
                helperText={
                  purchaseOrderFormik.touched.shipmentTermId &&
                  purchaseOrderFormik.errors.shipmentTermId
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
                  purchaseOrderFormik.setFieldValue(
                    "shipmentModeId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseOrderFormik.setFieldValue(
                    "shipmentModeId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseOrderFormik.setFieldValue(
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
                  purchaseOrderFormik.touched.shipmentModeId &&
                  Boolean(purchaseOrderFormik.errors.shipmentModeId)
                }
                helperText={
                  purchaseOrderFormik.touched.shipmentModeId &&
                  purchaseOrderFormik.errors.shipmentModeId
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
                value={purchaseOrderFormik.values.description}
                onChange={purchaseOrderFormik.handleChange}
                size="small"
                fullWidth
                error={
                  purchaseOrderFormik.touched.description &&
                  Boolean(purchaseOrderFormik.errors.description)
                }
                helperText={
                  purchaseOrderFormik.touched.description &&
                  purchaseOrderFormik.errors.description
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
                    purchaseOrderFormik.setFieldValue(
                      "paymentTermId",
                      value === null || value === undefined
                        ? ""
                        : value.key.toString()
                    );
                    purchaseOrderFormik.setFieldValue(
                      "paymentTermName",
                      value === null || value === undefined ? "" : value.title
                    );
                    setNewPaymentTermValue(
                      value === null || value === undefined ? "" : value
                    );
                  }}
                  data={paymentMethodRecord}
                  error={
                    purchaseOrderFormik.touched.paymentTermId &&
                    Boolean(purchaseOrderFormik.errors.paymentTermId)
                  }
                  helperText={
                    purchaseOrderFormik.touched.paymentTermId &&
                    purchaseOrderFormik.errors.paymentTermId
                  }
                />
              </Grid>
            </div>
          </div>
          <PurchaseOrderItemDetailsForm
            PurchaseOrderMaterials={PurchaseOrderMaterials}
            setPurchaseOrderMaterials={setPurchaseOrderMaterials}
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
                  value={purchaseOrderFormik.values.totalAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    purchaseOrderFormik.touched.totalAmount &&
                    Boolean(purchaseOrderFormik.errors.totalAmount)
                  }
                  helperText={
                    purchaseOrderFormik.touched.totalAmount &&
                    purchaseOrderFormik.errors.totalAmount
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
                    purchaseOrderFormik.values.discount != 0
                      ? purchaseOrderFormik.values.discount
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var v = parseInt(x.target.value, 10);
                    if (v >= 0 && v <= 100) {
                      purchaseOrderFormik.setFieldValue("discount", v);
                    } else {
                      purchaseOrderFormik.setFieldValue("discount", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(purchaseOrderFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    purchaseOrderFormik.touched.discount &&
                    Boolean(purchaseOrderFormik.errors.discount)
                  }
                  helperText={
                    purchaseOrderFormik.touched.discount &&
                    purchaseOrderFormik.errors.discount
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
                    purchaseOrderFormik.values.tax != 0
                      ? purchaseOrderFormik.values.tax
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var t = parseInt(x.target.value, 10);
                    if (t >= 0 && t <= 100) {
                      purchaseOrderFormik.setFieldValue("tax", t);
                    } else {
                      purchaseOrderFormik.setFieldValue("tax", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(purchaseOrderFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    purchaseOrderFormik.touched.tax &&
                    Boolean(purchaseOrderFormik.errors.tax)
                  }
                  helperText={
                    purchaseOrderFormik.touched.tax &&
                    purchaseOrderFormik.errors.tax
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
                    purchaseOrderFormik.values.freightAmount != 0
                      ? purchaseOrderFormik.values.freightAmount
                      : ""
                  }
                  placeholder="0"
                  onChange={purchaseOrderFormik.handleChange}
                  onBlur={() => {
                    calculation(purchaseOrderFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    purchaseOrderFormik.touched.freightAmount &&
                    Boolean(purchaseOrderFormik.errors.freightAmount)
                  }
                  helperText={
                    purchaseOrderFormik.touched.freightAmount &&
                    purchaseOrderFormik.errors.freightAmount
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
                  value={purchaseOrderFormik.values.netAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    purchaseOrderFormik.touched.netAmount &&
                    Boolean(purchaseOrderFormik.errors.netAmount)
                  }
                  helperText={
                    purchaseOrderFormik.touched.netAmount &&
                    purchaseOrderFormik.errors.netAmount
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

export default PurchaseOrderForm;
