import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Button from "../../../Components/Button";
import { Grid, Typography, TextareaAutosize } from "@material-ui/core";
import TextField from "../../../Components/TextInput";
import DropDownTextField from "../../../Components/Dropdown/SearchableDropdown";
import BackDrop from "../../../Components/BackDrop";
import Card from "../../../Components/Card";
import BreadCrumb from "../../../Components/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import DatePicker from "../../../Components/DatePicker";
import dateformat from "dateformat";
import {
  BankVoucherInitialValues,
  BankVoucherValidationSchema,
} from "../../../Schema/CashBank/Bank/InitialValues";

import { useFormik } from "formik";
import {
  AddBankVoucher,
  EditBankVoucher,
} from "../../../Api/Actions/bankVoucherActions";
import { ADD_BANK_VOUCHER, EDIT_BANK_VOUCHER } from "../../../Redux/Constants";

import Swal from "sweetalert2";
import RadioButtons from "../../../Components/RadioButtons";

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

const BankVoucherForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  var BankVoucherIds;
  var SalesInvoiceIds;

  if (params.BankVoucherId !== null || params.BankVoucherId !== undefined) {
    BankVoucherIds = params.BankVoucherId;
  }

  const [ShowSpinner, setShowSpinner] = useState(false);
  const [run, setrun] = useState(false);
  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  var EditPartyValue;
  var EditBankValue;
  var EditBankVouchers;
  var SalesInvoice;
  var Customer;

  const [filterValue, setFilterValue] = useState("Deposit");
  const filterNames = ["Deposit", "WithDraw"];
  const [filteredItem, setFilteredItem] = useState([]);

  const FilterHandler = (event) => {
    setFilterValue(event.target.value);
    if (event.target.value === "Deposit") {
      bankVoucherFormik.setFieldValue("voucherType", 5);
    } else {
      bankVoucherFormik.setFieldValue("voucherType", 6);
    }
  };

  //*************************************GET Payment Method  Record *************************/
  var Bank = useSelector((state) => state.chartOfAccountReducer)
    .filter((e) => e.accountLevel === 4 && e.parentCode === "10102")
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
          e.parentCode === "10102" ||
          e.parentCode === "10101")
    )
    .map((payment) => ({
      title: payment.accountTitle,
      value: payment.id,
      key: payment.id,
    }));

  if (BankVoucherIds !== undefined) {
    EditBankVouchers = useSelector((state) => state.bankVoucherReducer).find(
      (e) => e.id === BankVoucherIds
    );
  }

  useEffect(() => {
    if (EditBankVouchers !== undefined) {
      setFilterValue("Deposit");
      if (EditBankVouchers.voucherType === 6) {
        setFilterValue("WithDraw");
      }
      setrun(!run);
    }
  }, [EditBankVouchers]);
  const bankVoucherFormik = useFormik({
    initialValues:
      EditBankVouchers !== undefined
        ? EditBankVouchers
        : BankVoucherInitialValues,
    validationSchema: BankVoucherValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      let bankVoucher = {
        id: values.id !== "" ? values.id : "",
        companyId: companyId,
        voucherNo: values.voucherNo,
        voucherCode: values.voucherCode,
        voucherDate: dateformat(values.voucherDate, "yyyy-mm-dd"),
        voucherType: values.voucherType,

        createdBy: values.createdBy,
        createdDate: values.createdDate,
        referenceNo: values.referenceNo,
        accountId: values.accountId,
        accountTitle: values.accountTitle,
        bankAccountId: values.bankAccountId,
        bankAccountTitle: values.bankAccountTitle,
        description: values.description,
        amount: values.amount,
      };
      if (values.id === "") {
        setShowSpinner(true);
        AddBankVoucher(bankVoucher)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: ADD_BANK_VOUCHER, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Save SuccessFully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push(`/Bank`);
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
        EditBankVoucher(bankVoucher)
          .then((res) => {
            dispatch({ type: EDIT_BANK_VOUCHER, payload: res.data });
            setShowSpinner(false);
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Saved",
              text: "Update SuccessFully",
              showConfirmButton: false,
              timer: 1500,
            });
            resetForm();
            setrun(!run);
            setTimeout(() => {
              history.push(`/Bank`);
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

  const [newBankValue, setNewBankValue] = useState(
    EditBankValue === undefined ? [] : EditBankValue[0]
  );
  const [newPartyValue, setNewPartyValue] = useState(
    EditPartyValue === undefined ? [] : EditPartyValue[0]
  );

  useEffect(() => {
    EditBankValue = Bank.filter(
      (x) => x.key.toString() === bankVoucherFormik.values.bankAccountId
    ).map((payment) => ({
      title: payment.title,
      value: payment.value,
      key: payment.key,
    }));
    EditPartyValue = ChartOfAccount.filter(
      (x) => x.key.toString() === bankVoucherFormik.values.accountId
    ).map((payment) => ({
      title: payment.title,
      value: payment.value,
      key: payment.key,
    }));
    setNewPartyValue(EditPartyValue[0]);
    setNewBankValue(EditBankValue[0]);
  }, [run]);
  return (
    <>
      <BackDrop open={ShowSpinner} />
      <Card root={classes.CardRoot}>
        <Grid container spacing={3}>
          <Grid item sm={6} xs={6} md={6}>
            <BreadCrumb pathname={location.pathname} show={false} />
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
              color=""
              classes={{ root: classes.CancelButtonStyle }}
              onClick={() => {
                history.push(`/Bank`);
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
              onClick={bankVoucherFormik.handleSubmit}
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
        <form onSubmit={bankVoucherFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="voucherNumber"
                label="Receipt Number"
                value={bankVoucherFormik.values.voucherNo}
                onChange={bankVoucherFormik.handleChange}
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                error={
                  bankVoucherFormik.touched.voucherNo &&
                  Boolean(bankVoucherFormik.errors.voucherNo)
                }
                helperText={
                  bankVoucherFormik.touched.voucherNo &&
                  bankVoucherFormik.errors.voucherNo
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DatePicker
                id="voucherDate"
                label="Voucher Date"
                defaultValue={dateformat(
                  bankVoucherFormik.values.voucherDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={bankVoucherFormik.handleChange}
                error={
                  bankVoucherFormik.touched.voucherDate &&
                  Boolean(bankVoucherFormik.errors.voucherDate)
                }
                helperText={
                  bankVoucherFormik.touched.voucherDate &&
                  bankVoucherFormik.errors.voucherDate
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
                id="accountId"
                label="Account *"
                value={newPartyValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  bankVoucherFormik.setFieldValue(
                    "accountId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  bankVoucherFormik.setFieldValue(
                    "accountTitle",
                    value === null || value === undefined ? "" : value.title
                  );
                  setNewPartyValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={ChartOfAccount}
                error={
                  bankVoucherFormik.touched.accountId &&
                  Boolean(bankVoucherFormik.errors.accountId)
                }
                helperText={
                  bankVoucherFormik.touched.accountId &&
                  bankVoucherFormik.errors.accountId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <RadioButtons
                filterName={filterNames}
                filterValue={filterValue}
                FilterHandler={FilterHandler}
              />
              <DropDownTextField
                variant="standard"
                id="BankAccountId"
                label="Bank *"
                value={newBankValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  bankVoucherFormik.setFieldValue(
                    "bankAccountId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  bankVoucherFormik.setFieldValue(
                    "bankAccountTitle",
                    value === null || value === undefined ? "" : value.title
                  );

                  setNewBankValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={Bank}
                error={
                  bankVoucherFormik.touched.bankAccountId &&
                  Boolean(bankVoucherFormik.errors.bankAccountId)
                }
                helperText={
                  bankVoucherFormik.touched.bankAccountId &&
                  bankVoucherFormik.errors.bankAccountId
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
                label="Reference Number"
                value={bankVoucherFormik.values.referenceNo}
                onChange={bankVoucherFormik.handleChange}
                size="small"
                fullWidth
                error={
                  bankVoucherFormik.touched.referenceNo &&
                  Boolean(bankVoucherFormik.errors.referenceNo)
                }
                helperText={
                  bankVoucherFormik.touched.referenceNo &&
                  bankVoucherFormik.errors.referenceNo
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="amount"
                name="amount"
                value={
                  bankVoucherFormik.values.amount != 0
                    ? bankVoucherFormik.values.amount
                    : ""
                }
                placeholder="0"
                onChange={bankVoucherFormik.handleChange}
                size="small"
                type="number"
                label="Amount *"
                fullWidth
                error={
                  bankVoucherFormik.touched.amount &&
                  Boolean(bankVoucherFormik.errors.amount)
                }
                helperText={
                  bankVoucherFormik.touched.amount &&
                  bankVoucherFormik.errors.amount
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
                value={bankVoucherFormik.values.description}
                onChange={bankVoucherFormik.handleChange}
                size="small"
                fullWidth
                error={
                  bankVoucherFormik.touched.description &&
                  Boolean(bankVoucherFormik.errors.description)
                }
                helperText={
                  bankVoucherFormik.touched.description &&
                  bankVoucherFormik.errors.description
                }
              />
            </Grid>
          </Grid>
        </form>
      </Card>
    </>
  );
};

export default BankVoucherForm;
