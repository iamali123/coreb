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
import { useParams, useHistory } from "react-router-dom";
import DatePicker from "../../../Components/DatePicker";
import dateformat from "dateformat";
import {
  paymentOutIntitialValues,
  paymentOutValidationSchema,
} from "../../../Schema/Purchase/PaymentOutSchema/InitialValues";
import { useFormik } from "formik";
import {
  AddVouherOut,
  EditVouherOut,
} from "../../../Api/Actions/paymentOutActions";
import { ADD_PAYMENT_OUT, EDIT_PAYMENT_OUT } from "../../../Redux/Constants";
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

const PaymentOutForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  var PaymentOutId;
  var PurchaseBillId;

  if (params.PaymentOutId !== null || params.PaymentOutId !== undefined) {
    PaymentOutId = params.PaymentOutId;
  }
  if (params.PurchaseBillId !== null || params.PurchaseBillId !== undefined) {
    PurchaseBillId = params.PurchaseBillId;
  }
  const [ShowSpinner, setShowSpinner] = useState(false);
  const [run, setrun] = useState(false);
  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  var EditPartyValue;
  var EditPaymentTermValue;
  var EditPaymentOut;
  var purchaseBillAuto;

  //*************************************GET Payment Method  Record *************************/
  var PaymentTerm = useSelector((state) => state.chartOfAccountReducer)
    .filter(
      (e) =>
        e.accountLevel === 4 &&
        (e.parentCode === "10101" || e.parentCode === "10102")
    )
    .map((payment) => ({
      title: payment.accountTitle,
      value: payment.id,
      key: payment.id,
    }));
  var ChartOfAccount = useSelector((state) => state.chartOfAccountReducer)
    .filter(
      (e) =>
        e.accountLevel === 4 &&
        (e.parentCode === "20101" ||
          e.parentCode === "10103" ||
          e.parentCode === "30102")
    )
    .map((payment) => ({
      title: payment.accountTitle,
      value: payment.id,
      key: payment.id,
    }));
  if (PaymentOutId !== undefined) {
    EditPaymentOut = useSelector((state) => state.paymentOutReducer).find(
      (e) => e.id === PaymentOutId
    );
  }
  if (PurchaseBillId !== undefined) {
    EditPaymentOut = paymentOutIntitialValues;
    purchaseBillAuto = useSelector((state) => state.purchaseBillReducer).find(
      (e) => e.id === PurchaseBillId
    );
    let supplier = useSelector((state) => state.chartOfAccountReducer).find(
      (e) => e.supplierId === purchaseBillAuto.supplierId
    );
    let Bal = purchaseBillAuto.netAmount - purchaseBillAuto.amountPaid;
    EditPaymentOut.id = "";
    EditPaymentOut.companyId = companyId;
    EditPaymentOut.billId = purchaseBillAuto.id;
    EditPaymentOut.accountDebitId = supplier.id;
    EditPaymentOut.amount = Bal;
  }

  useEffect(() => {
    if (EditPaymentOut !== undefined) {
      setrun(!run);
    }
  }, [EditPaymentOut]);
  const paymentOutFormik = useFormik({
    initialValues:
      EditPaymentOut !== undefined ? EditPaymentOut : paymentOutIntitialValues,
    validationSchema: paymentOutValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      let paymentOut = {
        id: values.id !== "" ? values.id : "",
        companyId: companyId,
        voucherNo: values.voucherNo,
        voucherCode: values.voucherCode,
        voucherDate: dateformat(values.voucherDate, "yyyy-mm-dd"),
        voucherType: values.voucherType,
        chequeNo: values.chequeNo,
        chequeDate: values.chequeDate,
        createdBy: values.createdBy,
        createdDate: values.createdDate,
        invoiceId: values.invoiceId,
        billId: values.billId,
        expenseId: values.expenseId,
        referenceNo: values.referenceNo,
        accountCreditId: values.accountCreditId,
        accountTitleCredit: values.accountTitleCredit,
        accountDebitId: values.accountDebitId,
        accountTitleDebit: values.accountTitleDebit,
        description: values.description,
        amount: values.amount,
      };
      if (values.id === "") {
        setShowSpinner(true);
        AddVouherOut(paymentOut)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: ADD_PAYMENT_OUT, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Payment Out Save SuccessFully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push(`/PaymentOut`);
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
        EditVouherOut(paymentOut)
          .then((res) => {
            dispatch({ type: EDIT_PAYMENT_OUT, payload: res.data });
            setShowSpinner(false);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Saved",
              text: "Payment Out Update SuccessFully",
              showConfirmButton: false,
              timer: 1500,
            });
            resetForm();
            setrun(!run);
            setTimeout(() => {
              history.push(`/PaymentOut`);
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
    },
  });

  const [newPaymentTermValue, setNewPaymentTermValue] = useState(
    EditPartyValue === undefined ? [] : EditPartyValue[0]
  );
  const [newPartyValue, setNewPartyValue] = useState(
    EditPaymentTermValue === undefined ? [] : EditPaymentTermValue[0]
  );

  useEffect(() => {
    EditPaymentTermValue = PaymentTerm.filter(
      (x) => x.key.toString() === paymentOutFormik.values.accountCreditId
    ).map((payment) => ({
      title: payment.title,
      value: payment.value,
      key: payment.key,
    }));
    EditPartyValue = ChartOfAccount.filter(
      (x) => x.key.toString() === paymentOutFormik.values.accountDebitId
    ).map((payment) => ({
      title: payment.title,
      value: payment.value,
      key: payment.key,
    }));
    setNewPartyValue(EditPartyValue[0]);
    setNewPaymentTermValue(EditPaymentTermValue[0]);
  }, [run]);
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
                  title: "PaymentOut List",
                  url: "/PaymentOut",
                },
                {
                  title: params?.PaymentOutId
                    ? "Edit PaymentOut"
                    : "New PaymentOut",
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
                history.push(`/PaymentOut`);
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
              onClick={paymentOutFormik.handleSubmit}
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
        <form onSubmit={paymentOutFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="voucherNumber"
                label="Receipt Number"
                value={paymentOutFormik.values.voucherNo}
                onChange={paymentOutFormik.handleChange}
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                error={
                  paymentOutFormik.touched.voucherNo &&
                  Boolean(paymentOutFormik.errors.voucherNo)
                }
                helperText={
                  paymentOutFormik.touched.voucherNo &&
                  paymentOutFormik.errors.voucherNo
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DatePicker
                id="voucherDate"
                label="Voucher Date"
                defaultValue={dateformat(
                  paymentOutFormik.values.voucherDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={paymentOutFormik.handleChange}
                error={
                  paymentOutFormik.touched.voucherDate &&
                  Boolean(paymentOutFormik.errors.voucherDate)
                }
                helperText={
                  paymentOutFormik.touched.voucherDate &&
                  paymentOutFormik.errors.voucherDate
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
                id="accountDebitId"
                label="Account *"
                value={newPartyValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  paymentOutFormik.setFieldValue(
                    "accountDebitId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  paymentOutFormik.setFieldValue(
                    "accountTitleDebit",
                    value === null || value === undefined ? "" : value.title
                  );
                  setNewPartyValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={ChartOfAccount}
                error={
                  paymentOutFormik.touched.accountDebitId &&
                  Boolean(paymentOutFormik.errors.accountDebitId)
                }
                helperText={
                  paymentOutFormik.touched.accountDebitId &&
                  paymentOutFormik.errors.accountDebitId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="accountCreditId"
                label="Payment Term *"
                value={newPaymentTermValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  paymentOutFormik.setFieldValue(
                    "accountCreditId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  paymentOutFormik.setFieldValue(
                    "accountTitleCredit",
                    value === null || value === undefined ? "" : value.title
                  );

                  setNewPaymentTermValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={PaymentTerm}
                error={
                  paymentOutFormik.touched.accountCreditId &&
                  Boolean(paymentOutFormik.errors.accountCreditId)
                }
                helperText={
                  paymentOutFormik.touched.accountCreditId &&
                  paymentOutFormik.errors.accountCreditId
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
              <TextField
                variant="outlined"
                id="referenceNo"
                label="Payment Reference Number"
                value={paymentOutFormik.values.referenceNo}
                onChange={paymentOutFormik.handleChange}
                size="small"
                fullWidth
                error={
                  paymentOutFormik.touched.referenceNo &&
                  Boolean(paymentOutFormik.errors.referenceNo)
                }
                helperText={
                  paymentOutFormik.touched.referenceNo &&
                  paymentOutFormik.errors.referenceNo
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="amount"
                name="amount"
                value={
                  paymentOutFormik.values.amount != 0
                    ? paymentOutFormik.values.amount
                    : ""
                }
                placeholder="0"
                onChange={paymentOutFormik.handleChange}
                size="small"
                type="number"
                label="Amount *"
                fullWidth
                error={
                  paymentOutFormik.touched.amount &&
                  Boolean(paymentOutFormik.errors.amount)
                }
                helperText={
                  paymentOutFormik.touched.amount &&
                  paymentOutFormik.errors.amount
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
                value={paymentOutFormik.values.description}
                onChange={paymentOutFormik.handleChange}
                size="small"
                fullWidth
                error={
                  paymentOutFormik.touched.description &&
                  Boolean(paymentOutFormik.errors.description)
                }
                helperText={
                  paymentOutFormik.touched.description &&
                  paymentOutFormik.errors.description
                }
              />
            </Grid>
          </Grid>
        </form>
      </Card>
    </>
  );
};

export default PaymentOutForm;
