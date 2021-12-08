import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import Button from "../../../Components/Button";
import {
  Grid,
  Typography,
  TextareaAutosize,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
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
  CashInitialValues,
  CashValidationSchema,
} from "../../../Schema/CashBank/Cash/InitialValues";

import { useFormik } from "formik";
import { AddCash, EditCash } from "../../../Api/Actions/cashActions";
import { ADD_CASH, EDIT_CASH } from "../../../Redux/Constants";
import Swal from "sweetalert2";
import RadioButtons from "../../../Components/RadioButtons";
//import Radio from "@mui/material/Radio";
//import FormControlLabel from "@mui/material/FormControlLabel";

//import Radio from '@material-ui/core/Radio';

//import FormControlLabel from '@material-ui/core/FormControlLabel';

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

const CashForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  var CashIds;

  if (params.CashId !== null || params.CashId !== undefined) {
    CashIds = params.CashId;
  }

  const [ShowSpinner, setShowSpinner] = useState(false);
  const [run, setrun] = useState(false);
  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  var EditAccountValue;
  var EditCashs;

  const [paymentMode, SetpaymentMode] = useState(false);

  const [filterValue, setFilterValue] = useState("AddCash");
  const filterNames = ["AddCash", "ReduceCash"];
  const [filteredItem, setFilteredItem] = useState([]);

  const FilterHandler = (event) => {
    setFilterValue(event.target.value);
    if (event.target.value === "AddCash") {
      cashFormik.setFieldValue("voucherType", 3);
    } else {
      cashFormik.setFieldValue("voucherType", 4);
    }
  };

  //*************************************GET Payment Method  Record *************************/
  var CashAccount = useSelector((state) => state.chartOfAccountReducer)
    .filter((e) => e.accountLevel === 4 && e.parentCode === "10101")
    .map((cash) => ({
      title: cash.accountTitle,
      value: cash.id,
      key: cash.id,
    }))
    .reverse();
  var ChartOfAccount = useSelector((state) => state.chartOfAccountReducer)
    .filter(
      (e) =>
        e.accountLevel === 4 &&
        (e.parentCode === "20101" ||
          e.parentCode === "10103" ||
          e.parentCode === "30102" ||
          e.parentCode === "10102")
    )
    .map((payment) => ({
      title: payment.accountTitle,
      value: payment.id,
      key: payment.id,
    }));
  if (CashIds !== undefined) {
    EditCashs = useSelector((state) => state.cashReducer).find(
      (e) => e.id === CashIds
    );
  }

  useEffect(() => {
    if (EditCashs !== undefined) {
      setFilterValue("AddCash");
      if (EditCashs.voucherType === 4) {
        setFilterValue("ReduceCash");
      }

      setrun(!run);
    }
  }, [EditCashs]);
  const cashFormik = useFormik({
    initialValues: EditCashs !== undefined ? EditCashs : CashInitialValues,
    validationSchema: CashValidationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      let cash = {
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
        cashAccountId: CashAccount[0].key, //values.cashAccountId,
        cashAccountTitle: values.cashAccountTitle,
        description: values.description,
        amount: values.amount,
      };
      if (values.id === "") {
        setShowSpinner(true);
        AddCash(cash)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: ADD_CASH, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Save Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push(`/Cash`);
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
        EditCash(cash)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: EDIT_CASH, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Update Successfully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push(`/Cash`);
              }, 1200);
            }
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

  const [newAccountValue, setNewAccountValue] = useState(
    EditAccountValue === undefined ? [] : EditAccountValue[0]
  );

  useEffect(() => {
    EditAccountValue = ChartOfAccount.filter(
      (x) => x.key.toString() === cashFormik.values.accountId
    ).map((payment) => ({
      title: payment.title,
      value: payment.value,
      key: payment.key,
    }));
    setNewAccountValue(EditAccountValue[0]);
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
              color="#857D7D"
              classes={{ root: classes.CancelButtonStyle }}
              onClick={() => {
                history.push(`/Cash`);
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
              onClick={cashFormik.handleSubmit}
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
        <form onSubmit={cashFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="voucherNumber"
                label="Receipt Number"
                value={cashFormik.values.voucherNo}
                onChange={cashFormik.handleChange}
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                error={
                  cashFormik.touched.voucherNo &&
                  Boolean(cashFormik.errors.voucherNo)
                }
                helperText={
                  cashFormik.touched.voucherNo && cashFormik.errors.voucherNo
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DatePicker
                id="voucherDate"
                label="Voucher Date"
                defaultValue={dateformat(
                  cashFormik.values.voucherDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={cashFormik.handleChange}
                error={
                  cashFormik.touched.voucherDate &&
                  Boolean(cashFormik.errors.voucherDate)
                }
                helperText={
                  cashFormik.touched.voucherDate &&
                  cashFormik.errors.voucherDate
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
              {/* <RadioGroup>
                <FormControlLabel
                  key="addCash"
                  value="addCash"
                  status={paymentMode === false ? "checked" : "unchecked"}
                  onChange={() => {
                    SetpaymentMode(false);
                    cashFormik.setFieldValue("voucherType", 3);
                  }}
                  control={<Radio />}
                  label="Add Cash"
                />
                <FormControlLabel
                  key="reduceCash"
                  value="reduceCash"
                  status={paymentMode === true ? "checked" : "unchecked"}
                  onChange={() => {
                    SetpaymentMode(true);
                    cashFormik.setFieldValue("voucherType", 4);
                  }}
                  control={<Radio />}
                  label="Reduce Cash"
                />
              </RadioGroup> */}

              <RadioButtons
                filterName={filterNames}
                filterValue={filterValue}
                FilterHandler={FilterHandler}
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="accountId"
                label="Account *"
                value={newAccountValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  cashFormik.setFieldValue(
                    "accountId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  cashFormik.setFieldValue(
                    "accountTitle",
                    value === null || value === undefined ? "" : value.title
                  );
                  setNewAccountValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={ChartOfAccount}
                error={
                  cashFormik.touched.accountId &&
                  Boolean(cashFormik.errors.accountId)
                }
                helperText={
                  cashFormik.touched.accountId && cashFormik.errors.accountId
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
                value={cashFormik.values.referenceNo}
                onChange={cashFormik.handleChange}
                size="small"
                fullWidth
                error={
                  cashFormik.touched.referenceNo &&
                  Boolean(cashFormik.errors.referenceNo)
                }
                helperText={
                  cashFormik.touched.referenceNo &&
                  cashFormik.errors.referenceNo
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="amount"
                name="amount"
                value={
                  cashFormik.values.amount != 0 ? cashFormik.values.amount : ""
                }
                placeholder="0"
                onChange={cashFormik.handleChange}
                size="small"
                type="number"
                label="Amount *"
                fullWidth
                error={
                  cashFormik.touched.amount && Boolean(cashFormik.errors.amount)
                }
                helperText={
                  cashFormik.touched.amount && cashFormik.errors.amount
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
                value={cashFormik.values.description}
                onChange={cashFormik.handleChange}
                size="small"
                fullWidth
                error={
                  cashFormik.touched.description &&
                  Boolean(cashFormik.errors.description)
                }
                helperText={
                  cashFormik.touched.description &&
                  cashFormik.errors.description
                }
              />
            </Grid>
          </Grid>
        </form>
      </Card>
    </>
  );
};

export default CashForm;
