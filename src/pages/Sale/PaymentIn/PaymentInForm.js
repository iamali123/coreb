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
  PaymentInInitialValues,
  PaymentInValidationSchema,
} from "../../../Schema/Sales/PaymentIn/InitialValues";
import { salesInvoiceInitialValues } from "../../../Schema/Sales/SalesInvoice/InitialValues";
import { useFormik } from "formik";
import {
  AddPaymentIn,
  EditPaymentIn,
} from "../../../Api/Actions/paymentInActions";
import { ADD_PAYMENT_IN, EDIT_PAYMENT_IN } from "../../../Redux/Constants";
import Swal from "sweetalert2";
import { patientInvoiceInitialValues } from "../../../Schema/PatientInvoiceSchema/InitialValues";
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

const PaymentInForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  var PaymentInIds = params?.PaymentInId ?? 0;
  var SalesInvoiceIds = params?.SalesInvoiceId ?? 0;
  var PatientInvoiceIds = params?.PatientInvoiceId ?? 0;
  const [ShowSpinner, setShowSpinner] = useState(false);
  const [run, setrun] = useState(false);
  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  let [EditPaymentIns, setEditPaymentIns] = useState(PaymentInInitialValues);
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
          e.parentCode === "30102" ||
          e.parentCode === "10105")
    )
    .map((payment) => ({
      title: payment.accountTitle,
      value: payment.id,
      key: payment.id,
    }));

  var AccountPatient = useSelector((state) => state.chartOfAccountReducer)
    .filter((e) => e.accountLevel === 4 && e.parentCode === "10105")
    .map((payment) => ({
      title: payment.accountTitle,
      value: payment.id,
      key: payment.id,
    }));
  let RelatedPaymentIn = useSelector((state) => state.paymentInReducer).find(
    (e) => e.id === PaymentInIds
  );
  let RelatedSalesInvoice = useSelector((st) => st.salesInvoiceReducer).find(
    (x) => x.id === SalesInvoiceIds
  );
  let RelatedCustomer = useSelector((s) => s.chartOfAccountReducer).find(
    (e) => e.customerId === RelatedSalesInvoice?.customerId
  );
  let RelatedPatientInvoice = useSelector(
    (patient) => patient.patientInvoiceReducer
  ).find((e) => e.id === PatientInvoiceIds);
  useEffect(() => {
    if (PaymentInIds !== 0) {
      setEditPaymentIns(
        RelatedPaymentIn !== undefined
          ? RelatedPaymentIn
          : PaymentInInitialValues
      );
      updateDropDownValues(
        RelatedPaymentIn !== undefined
          ? RelatedPaymentIn
          : PaymentInInitialValues
      );
    } else if (PatientInvoiceIds !== 0) {
      let Bal =
        RelatedPatientInvoice?.netAmount -
        RelatedPatientInvoice?.amountReceived;
      EditPaymentIns.id = "";
      EditPaymentIns.companyId = companyId;
      EditPaymentIns.patientInvoiceId = PatientInvoiceIds;
      EditPaymentIns.amount = Bal;
      EditPaymentIns.accountCreditId = AccountPatient[0].key;
      updateDropDownValues(EditPaymentIns);
    } else if (SalesInvoiceIds !== 0) {
      let Bal =
        RelatedSalesInvoice.netAmount - RelatedSalesInvoice.amountReceived;
      EditPaymentIns.id = "";
      EditPaymentIns.companyId = companyId;
      EditPaymentIns.invoiceId = SalesInvoiceIds;
      EditPaymentIns.amount = Bal;
      EditPaymentIns.accountCreditId = RelatedCustomer?.id ?? 0;
      updateDropDownValues(EditPaymentIns);
    } else {
      let newPaymentInObject = {
        id: "",
        companyId: "",
        voucherNo: "",
        voucherCode: "",
        voucherDate: new Date(),
        voucherType: 1,
        chequeNo: "",
        chequeDate: new Date(1121),
        createdBy: "",
        createdDate: new Date(),
        invoiceId: "0",
        patientInvoiceId: "0",
        billId: "0",
        expenseId: "0",
        referenceNo: "",
        accountDebitId: "",
        accountTitleDebit: "",
        accountCreditId: "",
        accountTitleCredit: "",
        description: "",
        amount: 0,
      };
      setEditPaymentIns(newPaymentInObject);
      updateDropDownValues(newPaymentInObject);
    }
  }, []);

  const paymentInFormik = useFormik({
    initialValues: EditPaymentIns,
    validationSchema: PaymentInValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      let paymentIn = {
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
        patientInvoiceId: values.patientInvoiceId,
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
        AddPaymentIn(paymentIn)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: ADD_PAYMENT_IN, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Payment-In Save SuccessFully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push(`/PaymentIn`);
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
        EditPaymentIn(paymentIn)
          .then((res) => {
            dispatch({ type: EDIT_PAYMENT_IN, payload: res.data });
            setShowSpinner(false);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Saved",
              text: "Payment-In Update SuccessFully",
              showConfirmButton: false,
              timer: 1500,
            });
            resetForm();
            setrun(!run);
            setTimeout(() => {
              history.push(`/PaymentIn`);
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
  const [newPaymentTermValue, setNewPaymentTermValue] = useState([]);
  const [newPartyValue, setNewPartyValue] = useState([]);

  function updateDropDownValues(data) {
    const EditPaymentTermValue = PaymentTerm.find(
      (x) => x.key.toString() === data.accountDebitId
    );
    const EditPartyValue = ChartOfAccount.find(
      (x) => x.key.toString() === data.accountCreditId
    );
    setNewPartyValue({ ...EditPartyValue });
    setNewPaymentTermValue({ ...EditPaymentTermValue });
  }

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
                  title: "PaymentIn List",
                  url: "/PaymentIn",
                },
                {
                  title: params?.PaymentInId
                    ? "Edit PaymentIn"
                    : "New PaymentIn",
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
                history.push(`/PaymentIn`);
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
              onClick={paymentInFormik.handleSubmit}
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
        <form onSubmit={paymentInFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="voucherNumber"
                label="Receipt Number"
                value={paymentInFormik.values.voucherNo}
                onChange={paymentInFormik.handleChange}
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                error={
                  paymentInFormik.touched.voucherNo &&
                  Boolean(paymentInFormik.errors.voucherNo)
                }
                helperText={
                  paymentInFormik.touched.voucherNo &&
                  paymentInFormik.errors.voucherNo
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DatePicker
                id="voucherDate"
                label="Voucher Date"
                defaultValue={dateformat(
                  paymentInFormik.values.voucherDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={paymentInFormik.handleChange}
                error={
                  paymentInFormik.touched.voucherDate &&
                  Boolean(paymentInFormik.errors.voucherDate)
                }
                helperText={
                  paymentInFormik.touched.voucherDate &&
                  paymentInFormik.errors.voucherDate
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
                id="accountCreditId"
                label="Account *"
                value={newPartyValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  paymentInFormik.setFieldValue(
                    "accountCreditId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  paymentInFormik.setFieldValue(
                    "accountTitleCredit",
                    value === null || value === undefined ? "" : value.title
                  );
                  setNewPartyValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={ChartOfAccount}
                error={
                  paymentInFormik.touched.accountCreditId &&
                  Boolean(paymentInFormik.errors.accountCreditId)
                }
                helperText={
                  paymentInFormik.touched.accountCreditId &&
                  paymentInFormik.errors.accountCreditId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="accountDebitId"
                label="Payment Type *"
                value={newPaymentTermValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  paymentInFormik.setFieldValue(
                    "accountDebitId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  paymentInFormik.setFieldValue(
                    "accountTitleDebit",
                    value === null || value === undefined ? "" : value.title
                  );

                  setNewPaymentTermValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={PaymentTerm}
                error={
                  paymentInFormik.touched.accountDebitId &&
                  Boolean(paymentInFormik.errors.accountDebitId)
                }
                helperText={
                  paymentInFormik.touched.accountDebitId &&
                  paymentInFormik.errors.accountDebitId
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
                value={paymentInFormik.values.referenceNo}
                onChange={paymentInFormik.handleChange}
                size="small"
                fullWidth
                error={
                  paymentInFormik.touched.referenceNo &&
                  Boolean(paymentInFormik.errors.referenceNo)
                }
                helperText={
                  paymentInFormik.touched.referenceNo &&
                  paymentInFormik.errors.referenceNo
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="amount"
                name="amount"
                value={
                  paymentInFormik.values.amount != 0
                    ? paymentInFormik.values.amount
                    : ""
                }
                placeholder="0"
                onChange={paymentInFormik.handleChange}
                size="small"
                type="number"
                label="Amount *"
                fullWidth
                error={
                  paymentInFormik.touched.amount &&
                  Boolean(paymentInFormik.errors.amount)
                }
                helperText={
                  paymentInFormik.touched.amount &&
                  paymentInFormik.errors.amount
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
                style={{ height: 100, fontFamily: "Roboto" }}
                value={paymentInFormik.values.description}
                onChange={paymentInFormik.handleChange}
                size="small"
                fullWidth
                error={
                  paymentInFormik.touched.description &&
                  Boolean(paymentInFormik.errors.description)
                }
                helperText={
                  paymentInFormik.touched.description &&
                  paymentInFormik.errors.description
                }
              />
            </Grid>
          </Grid>
        </form>
      </Card>
    </>
  );
};

export default PaymentInForm;
