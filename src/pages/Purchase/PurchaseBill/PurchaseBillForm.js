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
  PurchaseBillValidationSchema,
  purchaseBillInitialValues,
} from "../../../Schema/Purchase/PurchaseBillSchema/InitialValues";
import { useFormik } from "formik";
import {
  AddPurchaseBill,
  EditPurchaseBillAction,
} from "../../../Api/Actions/purchaseBillActions";
import {
  ADD_PURCHASE_BILL,
  EDIT_PURCHASE_BILL,
} from "../../../Redux/Constants";
import PurchaseBillItemDetailForm from "./PurchaseBillItemDetailForm";
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

const PurchaseBillForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  var PurchaseBillId;
  var PurchaseOrderId;

  if (params.PurchaseBillId !== null || params.PurchaseBillId !== undefined) {
    PurchaseBillId = params.PurchaseBillId;
  }
  if (params.PurchaseOrderId !== null || params.PurchaseOrderId !== undefined) {
    PurchaseOrderId = params.PurchaseOrderId;
  }
  const [ShowSpinner, setShowSpinner] = useState(false);
  const [PurchaseBillMaterials, setPurchaseBillMaterials] = useState([]);
  const [run, setrun] = useState(false);
  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  var EditSupplierListValue;
  var PurchaseOrder;
  var EditPurchaseBill;
  var EditCurrencyValue;
  var EditPaymentTermValue;
  var EditBankAccountValue;
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

  if (PurchaseBillId !== undefined) {
    EditPurchaseBill = useSelector((state) => state.purchaseBillReducer).find(
      (e) => e.id === PurchaseBillId
    );
  }

  if (PurchaseOrderId !== undefined) {
    EditPurchaseBill = purchaseBillInitialValues;
    PurchaseOrder = useSelector((state) => state.PurchaseOrderReducer).find(
      (e) => e.id === PurchaseOrderId
    );
    EditPurchaseBill.id = "";
    EditPurchaseBill.companyId = PurchaseOrder.companyId;
    EditPurchaseBill.billCode = "";
    EditPurchaseBill.billDate = PurchaseOrder.orderDate;
    EditPurchaseBill.orderReceiveDate = PurchaseOrder.orderDate;
    EditPurchaseBill.shipmentDate = PurchaseOrder.shipmentDate;
    EditPurchaseBill.supplierId = PurchaseOrder.supplierId;
    EditPurchaseBill.supplierName = PurchaseOrder.supplierName;
    EditPurchaseBill.currencyId = PurchaseOrder.currencyId;
    EditPurchaseBill.currencyName = PurchaseOrder.currencyName;
    EditPurchaseBill.accountId = PurchaseOrder.accountId;
    EditPurchaseBill.accountName = PurchaseOrder.accountName;
    EditPurchaseBill.shipmentTermId = PurchaseOrder.shipmentTermId;
    EditPurchaseBill.supplierTermName = PurchaseOrder.shipmentTermName;
    EditPurchaseBill.shipmentModeId = PurchaseOrder.shipmentModeId;
    EditPurchaseBill.shipmentModeName = PurchaseOrder.shipmentModeName;
    EditPurchaseBill.paymentTermId = PurchaseOrder.paymentTermId;
    EditPurchaseBill.paymentTermName = PurchaseOrder.paymentTermName;
    EditPurchaseBill.referenceNo = PurchaseOrder.referenceNo;
    EditPurchaseBill.description = PurchaseOrder.description;
    EditPurchaseBill.discount = PurchaseOrder.discount;
    EditPurchaseBill.discountAmount = PurchaseOrder.discountAmount;
    EditPurchaseBill.gross = PurchaseOrder.gross;
    EditPurchaseBill.taxId = PurchaseOrder.taxId;
    EditPurchaseBill.taxName = PurchaseOrder.taxName;
    EditPurchaseBill.tax = PurchaseOrder.tax;
    EditPurchaseBill.taxAmount = PurchaseOrder.taxAmount;
    EditPurchaseBill.totalAmount = PurchaseOrder.totalAmount;
    EditPurchaseBill.freightAmount = PurchaseOrder.freightAmount;
    EditPurchaseBill.netAmount = PurchaseOrder.netAmount;
    EditPurchaseBill.PurchaseOrderId = PurchaseOrder.id;
    EditPurchaseBill.purchaseBillItemDetails =
      PurchaseOrder.purchaseOrderItemDetails.map((mode) => ({
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
    if (EditPurchaseBill !== undefined) {
      setPurchaseBillMaterials(EditPurchaseBill.purchaseBillItemDetails);
      setrun(!run);
    }
  }, [EditPurchaseBill]);
  const purchaseBillFormik = useFormik({
    initialValues:
      EditPurchaseBill !== undefined
        ? EditPurchaseBill
        : purchaseBillInitialValues,
    validationSchema: PurchaseBillValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      const PurchaseBill = {
        Id: values.id !== "" ? values.id : "",
        companyId: companyId,
        referenceNumber: values.referenceNumber,
        billNumber: values.billNumber,
        billCode: values.billCode,
        description: values.description,
        billDate: values.billDate,
        supplierId: values.supplierId,
        supplierName: values.supplierName,
        currencyId: values.currencyId,
        currencyName: values.currencyName,
        accountId: values.accountId,
        accountName: values.accountName,
        paymentTermId: values.paymentTermId,
        paymentTermName: values.paymentTermName,
        shipmentTermId: values.shipmentTermId,
        supplierTermName: values.shipmentTermName,
        shipmentModeId: values.shipmentModeId,
        shipmentModeName: values.shipmentModeName,
        discount: values.discount,
        discountAmount: values.discountAmount,
        gross: values.gross,
        taxId: values.taxId,
        tax: values.tax,
        taxName: values.taxName,
        taxAmount: values.taxAmount,
        totalAmount: values.totalAmount,
        freightAmount: values.freightAmount,
        netAmount: values.netAmount,
        purchaseOrderId: values.PurchaseOrderId,
        purchaseBillItemDetails: PurchaseBillMaterials,
      };
      if (PurchaseBillMaterials.length > 0) {
        if (PurchaseBill.Id === "") {
          setShowSpinner(true);
          AddPurchaseBill(PurchaseBill)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: ADD_PURCHASE_BILL, payload: res.data });
                setShowSpinner(false);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Saved",
                  text: "Purchase Bill Save SuccessFully",
                  showConfirmButton: false,
                  timer: 1500,
                });
                resetForm();
                setrun(!run);
                setTimeout(() => {
                  history.push(`/PurchaseBill`);
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
          EditPurchaseBillAction(PurchaseBill)
            .then((res) => {
              dispatch({ type: EDIT_PURCHASE_BILL, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Purchase Bill Update SuccessFully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push(`/PurchaseBill`);
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
          text: "Please add Purchase Bill Material ",
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

  useEffect(() => {
    EditSupplierListValue = SupplierList.filter(
      (x) => x.key === purchaseBillFormik.values.supplierId
    ).map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
    }));
    EditCurrencyValue = currencyRecord
      .filter((x) => x.key.toString() === purchaseBillFormik.values.currencyId)
      .map((currency) => ({
        title: currency.title,
        value: currency.value,
        key: currency.key,
      }));
    EditPaymentTermValue = paymentMethodRecord
      .filter(
        (x) => x.key.toString() === purchaseBillFormik.values.paymentTermId
      )
      .map((payment) => ({
        title: payment.title,
        value: payment.value,
        key: payment.key,
      }));
    EditBankAccountValue = bankAccountsRecord
      .filter((x) => x.key.toString() === purchaseBillFormik.values.accountId)
      .map((bank) => ({
        title: bank.title,
        value: bank.value,
        key: bank.key,
      }));
    setNewSupplierValue(EditSupplierListValue[0]);
    setNewCurrencyValue(EditCurrencyValue[0]);
    setNewPaymentTermValue(EditPaymentTermValue[0]);
    setNewBankAccountValue(EditBankAccountValue[0]);
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
    if (PurchaseBillMaterials.length > 0) {
      sum = PurchaseBillMaterials.map((o) => o.totalPrice).reduce((a, c) => {
        return a + c;
      });
    }
    purchaseBillFormik.setFieldValue("totalAmount", sum);
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

    purchaseBillFormik.setFieldValue("discountAmount", disAmount);
    purchaseBillFormik.setFieldValue("gross", gross);
    purchaseBillFormik.setFieldValue("taxAmount", taxAmount);
    purchaseBillFormik.setFieldValue("freightAmount", freightAmount);
    purchaseBillFormik.setFieldValue("netAmount", netAmount);
  };

  useEffect(() => {
    if (PurchaseBillMaterials.length > 0) {
      calculation(purchaseBillFormik.values);
    }
  }, [PurchaseBillMaterials]);

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
                  title: "Purchase Bill List",
                  url: "/PurchaseBill",
                },
                {
                  title: params?.PurchaseBillId
                    ? "Edit Purchase Bill"
                    : "New Purchase Bill",
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
                history.push(`/PurchaseBill`);
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
              onClick={purchaseBillFormik.handleSubmit}
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
        <form onSubmit={purchaseBillFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="billCode"
                label="Bill Number"
                InputProps={{
                  readOnly: true,
                }}
                value={purchaseBillFormik.values.billCode}
                onChange={purchaseBillFormik.handleChange}
                size="small"
                fullWidth
                error={
                  purchaseBillFormik.touched.billCode &&
                  Boolean(purchaseBillFormik.errors.billCode)
                }
                helperText={
                  purchaseBillFormik.touched.billCode &&
                  purchaseBillFormik.errors.billCode
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="referenceNumber"
                label="Inquiry Ref Number"
                value={purchaseBillFormik.values.referenceNumber}
                onChange={purchaseBillFormik.handleChange}
                size="small"
                fullWidth
                error={
                  purchaseBillFormik.touched.referenceNumber &&
                  Boolean(purchaseBillFormik.errors.referenceNumber)
                }
                helperText={
                  purchaseBillFormik.touched.referenceNumber &&
                  purchaseBillFormik.errors.referenceNumber
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
                  purchaseBillFormik.setFieldValue(
                    "supplierId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseBillFormik.setFieldValue(
                    "supplierName",
                    value === null || value === undefined ? "" : value.name
                  );
                  setNewSupplierValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={SupplierList}
                error={
                  purchaseBillFormik.touched.supplierId &&
                  Boolean(purchaseBillFormik.errors.supplierId)
                }
                helperText={
                  purchaseBillFormik.touched.supplierId &&
                  purchaseBillFormik.errors.supplierId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="supplierName"
                label="Supplier Name"
                value={purchaseBillFormik.values.supplierName}
                onChange={purchaseBillFormik.handleChange}
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                error={
                  purchaseBillFormik.touched.supplierName &&
                  Boolean(purchaseBillFormik.errors.supplierName)
                }
                helperText={
                  purchaseBillFormik.touched.supplierName &&
                  purchaseBillFormik.errors.supplierName
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
                id="billDate"
                label="Bill Date"
                defaultValue={dateformat(
                  purchaseBillFormik.values.billDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={purchaseBillFormik.handleChange}
                error={
                  purchaseBillFormik.touched.billDate &&
                  Boolean(purchaseBillFormik.errors.billDate)
                }
                helperText={
                  purchaseBillFormik.touched.billDate &&
                  purchaseBillFormik.errors.billDate
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="currencyId"
                label="Currency"
                value={newCurrencyValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  purchaseBillFormik.setFieldValue(
                    "currencyId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseBillFormik.setFieldValue(
                    "currencyId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseBillFormik.setFieldValue(
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
                  purchaseBillFormik.touched.currencyId &&
                  Boolean(purchaseBillFormik.errors.currencyId)
                }
                helperText={
                  purchaseBillFormik.touched.currencyId &&
                  purchaseBillFormik.errors.currencyId
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
                id="paymentTermId"
                label="Payment Term"
                value={newPaymentTermValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  purchaseBillFormik.setFieldValue(
                    "paymentTermId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseBillFormik.setFieldValue(
                    "paymentTermName",
                    value === null || value === undefined ? "" : value.title
                  );
                  setNewPaymentTermValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={paymentMethodRecord}
                error={
                  purchaseBillFormik.touched.paymentTermId &&
                  Boolean(purchaseBillFormik.errors.paymentTermId)
                }
                helperText={
                  purchaseBillFormik.touched.paymentTermId &&
                  purchaseBillFormik.errors.paymentTermId
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
                  purchaseBillFormik.setFieldValue(
                    "accountId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseBillFormik.setFieldValue(
                    "accountId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  purchaseBillFormik.setFieldValue(
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
                  purchaseBillFormik.touched.accountId &&
                  Boolean(purchaseBillFormik.errors.accountId)
                }
                helperText={
                  purchaseBillFormik.touched.accountId &&
                  purchaseBillFormik.errors.accountId
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
              <TextareaAutosize
                maxRows={4}
                id="description"
                aria-label="maximum height"
                placeholder="Description"
                style={{ height: 100 }}
                value={purchaseBillFormik.values.description}
                onChange={purchaseBillFormik.handleChange}
                size="small"
                fullWidth
                error={
                  purchaseBillFormik.touched.description &&
                  Boolean(purchaseBillFormik.errors.description)
                }
                helperText={
                  purchaseBillFormik.touched.description &&
                  purchaseBillFormik.errors.description
                }
              />
            </Grid>
          </Grid>
          <PurchaseBillItemDetailForm
            PurchaseBillMaterials={PurchaseBillMaterials}
            setPurchaseBillMaterials={setPurchaseBillMaterials}
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
                  value={purchaseBillFormik.values.totalAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    purchaseBillFormik.touched.totalAmount &&
                    Boolean(purchaseBillFormik.errors.totalAmount)
                  }
                  helperText={
                    purchaseBillFormik.touched.totalAmount &&
                    purchaseBillFormik.errors.totalAmount
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
                    purchaseBillFormik.values.discount != 0
                      ? purchaseBillFormik.values.discount
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var v = parseInt(x.target.value, 10);
                    if (v >= 0 && v <= 100) {
                      purchaseBillFormik.setFieldValue("discount", v);
                    } else {
                      purchaseBillFormik.setFieldValue("discount", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(purchaseBillFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    purchaseBillFormik.touched.discount &&
                    Boolean(purchaseBillFormik.errors.discount)
                  }
                  helperText={
                    purchaseBillFormik.touched.discount &&
                    purchaseBillFormik.errors.discount
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
                    purchaseBillFormik.values.tax != 0
                      ? purchaseBillFormik.values.tax
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var t = parseInt(x.target.value, 10);
                    if (t >= 0 && t <= 100) {
                      purchaseBillFormik.setFieldValue("tax", t);
                    } else {
                      purchaseBillFormik.setFieldValue("tax", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(purchaseBillFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    purchaseBillFormik.touched.tax &&
                    Boolean(purchaseBillFormik.errors.tax)
                  }
                  helperText={
                    purchaseBillFormik.touched.tax &&
                    purchaseBillFormik.errors.tax
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
                    purchaseBillFormik.values.freightAmount != 0
                      ? purchaseBillFormik.values.freightAmount
                      : ""
                  }
                  placeholder="0"
                  onChange={purchaseBillFormik.handleChange}
                  onBlur={() => {
                    calculation(purchaseBillFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    purchaseBillFormik.touched.freightAmount &&
                    Boolean(purchaseBillFormik.errors.freightAmount)
                  }
                  helperText={
                    purchaseBillFormik.touched.freightAmount &&
                    purchaseBillFormik.errors.freightAmount
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
                  value={purchaseBillFormik.values.netAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    purchaseBillFormik.touched.netAmount &&
                    Boolean(purchaseBillFormik.errors.netAmount)
                  }
                  helperText={
                    purchaseBillFormik.touched.netAmount &&
                    purchaseBillFormik.errors.netAmount
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

export default PurchaseBillForm;
