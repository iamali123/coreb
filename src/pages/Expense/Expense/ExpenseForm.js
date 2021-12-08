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
  expenseItemDetailValidationSchema,
  expenseItemDetailsInitialValues,
  expenseInitialValues,
  ExpenseValidationSchema,
} from "../../../Schema/Expense/ExpenseIntialValues";
import { useFormik } from "formik";
import {
  AddExpense,
  EditExpenseAction,
} from "../../../Api/Actions/expenseActions";
import { ADD_EXPENSE, EDIT_EXPENSE } from "../../../Redux/Constants";
import ExpenseItemDetailsForm from "./ExpenseItemDetailsForm";
import ExpenseItemDetailList from "./ExpenseItemDetailsList";
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

const ExpenseForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  var itemId;
  var ExpenseId;
  var SalesOrderIds;

  if (params.ExpenseId !== null || params.ExpenseId !== undefined) {
    ExpenseId = params.ExpenseId;
  }

  if (params.SalesOrderId !== null || params.SalesOrderId !== undefined) {
    SalesOrderIds = params.SalesOrderId;
  }

  const [ShowSpinner, setShowSpinner] = useState(false);
  const [ExpenseMaterials, setExpenseMaterials] = useState([]);
  const [run, setrun] = useState(false);

  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  var EditExpenseCategoryListValue;
  var EditExpense;
  var SalesOrder;

  var EditCurrencyValue;
  var EditPaymentTermValue;
  var EditBankAccountValue;

  //*************************************GET EXPENSE CATEGORY  Record *************************/
  var ExpenseCategoryList = useSelector(
    (state) => state.expenseCategoryReducer
  ).map((category) => ({
    title: category.expenseCategoryName,
    name: category.expenseCategoryName,
    value: category.id,
    key: category.id,
  }));

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

  if (ExpenseId !== undefined) {
    EditExpense = useSelector((state) => state.expenseReducer).find(
      (e) => e.id === ExpenseId
    );
  }

  if (SalesOrderIds !== undefined) {
    EditExpense = expenseInitialValues;
    SalesOrder = useSelector((state) => state.salesOrderReducer).find(
      (e) => e.id === SalesOrderIds
    );

    EditExpense.id = "";
    EditExpense.companyId = SalesOrder.companyId;
    EditExpense.expenseCode = "";
    EditExpense.invoiceDate = SalesOrder.invoiceDate;
    EditExpense.orderReceiveDate = SalesOrder.invoiceDate;
    EditExpense.shipmentDate = SalesOrder.shipmentDate;
    EditExpense.expenseCategoryId = SalesOrder.expenseCategoryId;
    EditExpense.expenseCategoryName = SalesOrder.expenseCategoryName;
    EditExpense.currencyId = SalesOrder.currencyId;
    EditExpense.currencyName = SalesOrder.currencyName;
    EditExpense.accountId = SalesOrder.accountId;
    EditExpense.accountName = SalesOrder.accountName;
    EditExpense.shipmentTermId = SalesOrder.shipmentTermId;
    EditExpense.supplierTermName = SalesOrder.shipmentTermName;
    EditExpense.shipmentModeId = SalesOrder.shipmentModeId;
    EditExpense.shipmentModeName = SalesOrder.shipmentModeName;
    EditExpense.paymentTermId = SalesOrder.paymentTermId;
    EditExpense.paymentTermName = SalesOrder.paymentTermName;
    EditExpense.referenceNo = SalesOrder.referenceNo;
    EditExpense.description = SalesOrder.description;
    EditExpense.paid = SalesOrder.paid;
    EditExpense.paidAmount = SalesOrder.paidAmount;
    EditExpense.gross = SalesOrder.gross;
    EditExpense.taxId = SalesOrder.taxId;
    EditExpense.taxName = SalesOrder.taxName;
    EditExpense.tax = SalesOrder.tax;
    EditExpense.taxAmount = SalesOrder.taxAmount;
    EditExpense.totalAmount = SalesOrder.totalAmount;
    EditExpense.freightAmount = SalesOrder.freightAmount;
    EditExpense.balance = SalesOrder.balance;
    EditExpense.salesOrderId = SalesOrder.id;
    EditExpense.expenseItemDetailModel =
      SalesOrder.salesOrderItemDetailModel.map((mode) => ({
        id: "0",
        expenseId: "",
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
    if (EditExpense !== undefined) {
      setExpenseMaterials(EditExpense.expenseItemDetailModel);
      setrun(!run);
    }
  }, [EditExpense]);

  const expenseFormik = useFormik({
    initialValues:
      EditExpense !== undefined ? EditExpense : expenseInitialValues,
    validationSchema: ExpenseValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const expense = {
        id: values.id !== "" ? values.id : "",
        companyId: companyId,
        expenseCode: values.expenseCode,
        expenseDate: values.expenseDate,
        expenseCategoryId: values.expenseCategoryId,
        expenseCategoryName: values.expenseCategoryName,
        currencyId: values.currencyId,
        currencyName: values.currencyName,
        accountId: values.accountId,
        accountName: values.accountName,

        paymentTermId: values.paymentTermId,
        paymentTermName: values.paymentTermName,

        description: values.description,

        totalAmount: values.totalAmount,

        paid: values.paid,

        expenseItemDetailModel: ExpenseMaterials,
      };
      if (ExpenseMaterials.length > 0) {
        if (expense.id === "") {
          setShowSpinner(true);
          AddExpense(expense)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: ADD_EXPENSE, payload: res.data });
                setShowSpinner(false);
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Saved",
                  text: "Expense Save SuccessFully",
                  showConfirmButton: false,
                  timer: 1500,
                });
                resetForm();
                setrun(!run);
                setTimeout(() => {
                  history.push(`/Expense`);
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
          EditExpenseAction(expense)
            .then((res) => {
              dispatch({ type: EDIT_EXPENSE, payload: res.data });
              setShowSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Saved",
                text: "Expense Update SuccessFully",
                showConfirmButton: false,
                timer: 1500,
              });
              resetForm();
              setrun(!run);
              setTimeout(() => {
                history.push(`/Expense`);
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
          text: "Please add Expense Item ",
          icon: "error",
          showConfirmButton: true,
        });
      }
    },
  });

  const [SelectedData, setSelectedData] = useState("");

  const [NewCategoryValue, setNewCategoryValue] = useState(
    EditExpenseCategoryListValue === undefined
      ? []
      : EditExpenseCategoryListValue[0]
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
    EditExpenseCategoryListValue = ExpenseCategoryList.filter(
      (x) => x.key === expenseFormik.values.expenseCategoryId.toString()
    ).map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
    }));
    EditCurrencyValue = currencyRecord
      .filter((x) => x.key.toString() === expenseFormik.values.currencyId)
      .map((currency) => ({
        title: currency.title,
        value: currency.value,
        key: currency.key,
      }));
    EditPaymentTermValue = paymentMethodRecord
      .filter((x) => x.key.toString() === expenseFormik.values.paymentTermId)
      .map((payment) => ({
        title: payment.title,
        value: payment.value,
        key: payment.key,
      }));
    EditBankAccountValue = bankAccountsRecord
      .filter((x) => x.key.toString() === expenseFormik.values.accountId)
      .map((bank) => ({
        title: bank.title,
        value: bank.value,
        key: bank.key,
      }));
    setNewCategoryValue(EditExpenseCategoryListValue[0]);
    setNewCurrencyValue(EditCurrencyValue[0]);
    setNewPaymentTermValue(EditPaymentTermValue[0]);
    setNewBankAccountValue(EditBankAccountValue[0]);
  }, [run]);

  const calculation = (values) => {
    let bal = 0;
    let Paid = 0;
    let balance = 0;
    let sum = 0;

    if (ExpenseMaterials.length > 0) {
      sum = ExpenseMaterials.map((o) => o.amount).reduce((a, c) => {
        return a + c;
      });
    }
    expenseFormik.setFieldValue("totalAmount", sum);
    let amount = sum;

    bal = amount;
    if (values.paid != null && values.paid != 0) {
      Paid = values.paid;
      bal = amount - Paid;
    }

    expenseFormik.setFieldValue("balance", bal);
  };
  useEffect(() => {
    if (ExpenseMaterials.length > 0) {
      calculation(expenseFormik.values);
    }
  }, [ExpenseMaterials]);

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
                  title: "Expense List",
                  url: "/Expense",
                },
                {
                  title: params?.ExpenseId ? "Edit Expense" : "New Expense",
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
                history.push(`/Expense`);
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
              onClick={expenseFormik.handleSubmit}
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
        <form onSubmit={expenseFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="expenceCode"
                label="Expense Number"
                disabled
                value={expenseFormik.values.expenseCode}
                onChange={expenseFormik.handleChange}
                size="small"
                fullWidth
                error={
                  expenseFormik.touched.expenseCode &&
                  Boolean(expenseFormik.errors.expenseCode)
                }
                helperText={
                  expenseFormik.touched.expenseCode &&
                  expenseFormik.errors.expenseCode
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
                id="expenseCategoryId"
                label="Type *"
                value={NewCategoryValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  expenseFormik.setFieldValue(
                    "expenseCategoryId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  expenseFormik.setFieldValue(
                    "expenseCategoryName",
                    value === null || value === undefined ? "" : value.name
                  );
                  setNewCategoryValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={ExpenseCategoryList}
                error={
                  expenseFormik.touched.expenseCategoryId &&
                  Boolean(expenseFormik.errors.expenseCategoryId)
                }
                helperText={
                  expenseFormik.touched.expenseCategoryId &&
                  expenseFormik.errors.expenseCategoryId
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="expenseCategoryName"
                label="Expense Name"
                value={expenseFormik.values.expenseCategoryName}
                onChange={expenseFormik.handleChange}
                size="small"
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                error={
                  expenseFormik.touched.expenseCategoryName &&
                  Boolean(expenseFormik.errors.expenseCategoryName)
                }
                helperText={
                  expenseFormik.touched.expenseCategoryName &&
                  expenseFormik.errors.expenseCategoryName
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
                  expenseFormik.setFieldValue(
                    "currencyId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  expenseFormik.setFieldValue(
                    "currencyId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  expenseFormik.setFieldValue(
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
                  expenseFormik.touched.currencyId &&
                  Boolean(expenseFormik.errors.currencyId)
                }
                helperText={
                  expenseFormik.touched.currencyId &&
                  expenseFormik.errors.currencyId
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
                  expenseFormik.setFieldValue(
                    "accountId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  expenseFormik.setFieldValue(
                    "accountId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  expenseFormik.setFieldValue(
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
                  expenseFormik.touched.accountId &&
                  Boolean(expenseFormik.errors.accountId)
                }
                helperText={
                  expenseFormik.touched.accountId &&
                  expenseFormik.errors.accountId
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
                id="expenseDate"
                label="Expense Date"
                defaultValue={dateFormat(
                  expenseFormik.values.expenseDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={expenseFormik.handleChange}
                error={
                  expenseFormik.touched.expenseDate &&
                  Boolean(expenseFormik.errors.expenseDate)
                }
                helperText={
                  expenseFormik.touched.expenseDate &&
                  expenseFormik.errors.expenseDate
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DropDownTextField
                variant="standard"
                id="paymentTermId"
                label="Payment Term"
                value={newPaymentTermValue}
                size="small"
                fullWidth
                onChange={(event, value) => {
                  expenseFormik.setFieldValue(
                    "paymentTermId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  expenseFormik.setFieldValue(
                    "paymentTermName",
                    value === null || value === undefined ? "" : value.title
                  );
                  setNewPaymentTermValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={paymentMethodRecord}
                error={
                  expenseFormik.touched.paymentTermId &&
                  Boolean(expenseFormik.errors.paymentTermId)
                }
                helperText={
                  expenseFormik.touched.paymentTermId &&
                  expenseFormik.errors.paymentTermId
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
                value={expenseFormik.values.description}
                onChange={expenseFormik.handleChange}
                size="small"
                fullWidth
                error={
                  expenseFormik.touched.description &&
                  Boolean(expenseFormik.errors.description)
                }
                helperText={
                  expenseFormik.touched.description &&
                  expenseFormik.errors.description
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
            ></div>
          </div>
          <ExpenseItemDetailsForm
            ExpenseMaterials={ExpenseMaterials}
            setExpenseMaterials={setExpenseMaterials}
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
                  Total
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="totalAmount"
                  value={expenseFormik.values.totalAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    expenseFormik.touched.totalAmount &&
                    Boolean(expenseFormik.errors.totalAmount)
                  }
                  helperText={
                    expenseFormik.touched.totalAmount &&
                    expenseFormik.errors.totalAmount
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
                  Paid
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="paid"
                  name="paid"
                  value={
                    expenseFormik.values.paid != 0
                      ? expenseFormik.values.paid
                      : ""
                  }
                  placeholder="0"
                  onChange={expenseFormik.handleChange}
                  onBlur={() => {
                    calculation(expenseFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    expenseFormik.touched.paid &&
                    Boolean(expenseFormik.errors.paid)
                  }
                  helperText={
                    expenseFormik.touched.paid && expenseFormik.errors.paid
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
                  Balance
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="balance"
                  value={expenseFormik.values.balance}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    expenseFormik.touched.balance &&
                    Boolean(expenseFormik.errors.balance)
                  }
                  helperText={
                    expenseFormik.touched.balance &&
                    expenseFormik.errors.balance
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

export default ExpenseForm;
