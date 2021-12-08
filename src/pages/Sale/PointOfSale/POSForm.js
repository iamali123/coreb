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
  PosSalesItemDetailValidationSchema,
  posSalesItemDetailsInitialValues,
  posSalesInitialValues,
  PosSalesValidationSchema,
} from "../../../Schema/Sales/PosSales/InitialValues";
import { useFormik } from "formik";
import {
  AddPosSales,
  EditPosSalesAction,
} from "../../../Api/Actions/posSalesActions";
import { ADD_POS_SALE, EDIT_POS_SALE } from "../../../Redux/Constants";
import POSItemDetailsForm from "./POSItemDetailsForm";
//import SalesInvoiceItemDetailList from "./SalesInvoiceItemDetailsList";
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

const PosSalesForm = () => {
  const params = useParams();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  var itemId;
  var PosSalesId;
  var SalesOrderIds;

  if (params.PosSalesId !== null || params.PosSalesId !== undefined) {
    PosSalesId = params.PosSalesId;
  }

  const [ShowSpinner, setShowSpinner] = useState(false);
  const [PosSalesMaterials, setPosSalesMaterials] = useState([]);
  const [run, setrun] = useState(false);

  const user = useSelector((state) => state.userReducer);
  const companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  var EditCustomerListValue;
  var EditPosSales;
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
  // var bankAccountsRecord = useSelector((state) => state.bankAccountReducer).map(
  //   (bank) => ({
  //     title: bank.bankName,
  //     value: bank.bankId,
  //     key: bank.bankId,
  //   })
  // );

  var bankAccountsRecord = useSelector((state) => state.chartOfAccountReducer)
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

  if (PosSalesId !== undefined) {
    EditPosSales = useSelector((state) => state.posSalesReducer).find(
      (e) => e.id === PosSalesId
    );
  }

  useEffect(() => {
    if (EditPosSales !== undefined) {
      setPosSalesMaterials(EditPosSales.posSalesItemDetailModel);
      setrun(!run);
    }
  }, [EditPosSales]);

  const posSalesFormik = useFormik({
    initialValues:
      EditPosSales !== undefined ? EditPosSales : posSalesInitialValues,
    validationSchema: PosSalesValidationSchema,
    onSubmit: (values, { resetForm }) => {
      const posSales = {
        id: values.id !== "" ? values.id : "",
        companyId: companyId,
        invoiceCode: values.invoiceCode,
        invoiceDate: values.invoiceDate,
        customerId: values.customerId,
        customerName: values.customerName,
        accountId: values.accountId,
        accountName: values.accountName,
        referenceNo: values.referenceNo,
        description: values.description,
        totalAmount: values.totalAmount,
        discount: values.discount,
        discountAmount: values.discountAmount,
        gross: values.gross,
        taxId: "0",
        taxName: "GST",
        tax: values.tax,
        taxAmount: values.taxAmount,
        netAmount: values.netAmount,
        tendered: values.tendered,

        posSalesItemDetailModel: PosSalesMaterials,
      };
      //console.log("values", salesInvoice);
      if (PosSalesMaterials.length > 0) {
        if (posSales.id === "") {
          setShowSpinner(true);
          AddPosSales(posSales)
            .then((res) => {
              if (res.status === 200) {
                dispatch({ type: ADD_POS_SALE, payload: res.data });
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
                  history.push(`/POS`);
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
          EditPosSalesAction(posSales)
            .then((res) => {
              dispatch({ type: EDIT_POS_SALE, payload: res.data });
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
                history.push(`/POS`);
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
      (x) => x.key === posSalesFormik.values.customerId
    ).map((item) => ({
      title: item.title,
      value: item.value,
      key: item.key,
    }));

    EditPaymentTermValue = paymentMethodRecord
      .filter((x) => x.key.toString() === posSalesFormik.values.paymentTermId)
      .map((payment) => ({
        title: payment.title,
        value: payment.value,
        key: payment.key,
      }));
    EditBankAccountValue = bankAccountsRecord
      .filter((x) => x.key.toString() === posSalesFormik.values.accountId)
      .map((bank) => ({
        title: bank.title,
        value: bank.value,
        key: bank.key,
      }));

    setNewCustomerValue(EditCustomerListValue[0]);

    setNewPaymentTermValue(EditPaymentTermValue[0]);
    setNewBankAccountValue(EditBankAccountValue[0]);
  }, [run]);

  const calculation = (values) => {
    let disPercent = values.discount;
    let disAmount = 0;
    let gross = 0;
    let taxPer = values.tax;
    let taxAmount = 0;
    let tendered = values.tendered;
    let netAmount = 0;
    let sum = 0;
    if (PosSalesMaterials.length > 0) {
      sum = PosSalesMaterials.map((o) => o.totalPrice).reduce((a, c) => {
        return a + c;
      });
    }
    posSalesFormik.setFieldValue("totalAmount", sum);
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

    // tendered = 0;
    // if (values.tendered > 0 && values.tendered < netAmount) {
    //   tendered = values.tendered;
    //   netAmount = netAmount + tendered;
    // }

    posSalesFormik.setFieldValue("discountAmount", disAmount);
    posSalesFormik.setFieldValue("gross", gross);
    posSalesFormik.setFieldValue("taxAmount", taxAmount);
    // posSalesFormik.setFieldValue("tendered", tendered);
    posSalesFormik.setFieldValue("netAmount", netAmount);
  };

  useEffect(() => {
    // console.log("PosSalesMaterials", PosSalesMaterials);
    if (PosSalesMaterials.length > 0) {
      calculation(posSalesFormik.values);
    }
  }, [PosSalesMaterials]);

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
                  title: "Point Of Sale",
                  url: "/Pos",
                },
                {
                  title: params?.PosSalesId ? "Edit POS" : "New POS",
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
                history.push(`/POS`);
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
              onClick={posSalesFormik.handleSubmit}
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
        <form onSubmit={posSalesFormik.handleSubmit}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid xs={12} sm={5} md={5} lg={5}>
              <TextField
                variant="outlined"
                id="invoiceCode"
                label="Invoice Number"
                disabled
                value={posSalesFormik.values.invoiceCode}
                onChange={posSalesFormik.handleChange}
                size="small"
                fullWidth
                error={
                  posSalesFormik.touched.invoiceCode &&
                  Boolean(posSalesFormik.errors.invoiceCode)
                }
                helperText={
                  posSalesFormik.touched.invoiceCode &&
                  posSalesFormik.errors.invoiceCode
                }
              />
            </Grid>
            <Grid xs={12} sm={5} md={5} lg={5}>
              <DatePicker
                id="invoiceDate"
                label="Invoice Date"
                defaultValue={dateFormat(
                  posSalesFormik.values.invoiceDate,
                  "yyyy-mm-dd"
                )}
                type="date"
                size="small"
                fullWidth
                onChange={posSalesFormik.handleChange}
                error={
                  posSalesFormik.touched.invoiceDate &&
                  Boolean(posSalesFormik.errors.invoiceDate)
                }
                helperText={
                  posSalesFormik.touched.invoiceDate &&
                  posSalesFormik.errors.invoiceDate
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
                  posSalesFormik.setFieldValue(
                    "customerId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  posSalesFormik.setFieldValue(
                    "customerName",
                    value === null || value === undefined ? "" : value.name
                  );
                  setNewCustomerValue(
                    value === null || value === undefined ? "" : value
                  );
                }}
                data={CustomerList}
                error={
                  posSalesFormik.touched.customerId &&
                  Boolean(posSalesFormik.errors.customerId)
                }
                helperText={
                  posSalesFormik.touched.customerId &&
                  posSalesFormik.errors.customerId
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
                  posSalesFormik.setFieldValue(
                    "accountId",
                    value === null || value === undefined
                      ? ""
                      : value.key.toString()
                  );
                  posSalesFormik.setFieldValue(
                    "accountId",
                    value === null ||
                      value === undefined ||
                      value.key === null ||
                      value.key === undefined
                      ? ""
                      : value.key.toString()
                  );
                  posSalesFormik.setFieldValue(
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
                  posSalesFormik.touched.accountId &&
                  Boolean(posSalesFormik.errors.accountId)
                }
                helperText={
                  posSalesFormik.touched.accountId &&
                  posSalesFormik.errors.accountId
                }
              />
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            style={{ marginTop: 20 }}
          ></Grid>

          <POSItemDetailsForm
            PosSalesMaterials={PosSalesMaterials}
            setPosSalesMaterials={setPosSalesMaterials}
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
                  value={posSalesFormik.values.totalAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    posSalesFormik.touched.totalAmount &&
                    Boolean(posSalesFormik.errors.totalAmount)
                  }
                  helperText={
                    posSalesFormik.touched.totalAmount &&
                    posSalesFormik.errors.totalAmount
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
                    posSalesFormik.values.discount != 0
                      ? posSalesFormik.values.discount
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var v = parseInt(x.target.value, 10);
                    //console.log("Dis", v);
                    if (v >= 0 && v <= 100) {
                      posSalesFormik.setFieldValue("discount", v);
                      calculation(posSalesFormik.values);
                      //SalesQuotationFormik.handleChange;
                    } else {
                      posSalesFormik.setFieldValue("discount", 0);
                      calculation(posSalesFormik.values);
                    }
                  }}
                  onBlur={() => {
                    calculation(posSalesFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    posSalesFormik.touched.discount &&
                    Boolean(posSalesFormik.errors.discount)
                  }
                  helperText={
                    posSalesFormik.touched.discount &&
                    posSalesFormik.errors.discount
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
                    posSalesFormik.values.tax != 0
                      ? posSalesFormik.values.tax
                      : ""
                  }
                  placeholder="0"
                  onChange={(x) => {
                    var t = parseInt(x.target.value, 10);
                    //console.log("Tax", t);
                    if (t >= 0 && t <= 100) {
                      posSalesFormik.setFieldValue("tax", t);
                      //SalesQuotationFormik.handleChange;
                    } else {
                      posSalesFormik.setFieldValue("tax", 0);
                    }
                  }}
                  onBlur={() => {
                    calculation(posSalesFormik.values);
                  }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    posSalesFormik.touched.tax &&
                    Boolean(posSalesFormik.errors.tax)
                  }
                  helperText={
                    posSalesFormik.touched.tax && posSalesFormik.errors.tax
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
                  Net-Total
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="netAmount"
                  value={posSalesFormik.values.netAmount}
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                  error={
                    posSalesFormik.touched.netAmount &&
                    Boolean(posSalesFormik.errors.netAmount)
                  }
                  helperText={
                    posSalesFormik.touched.netAmount &&
                    posSalesFormik.errors.netAmount
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
                  Tendered
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="tendered"
                  value={
                    posSalesFormik.values.tendered != 0
                      ? posSalesFormik.values.tendered
                      : ""
                  }
                  placeholder="0"
                  onChange={(e) => {
                    var v = e.target.value;
                    posSalesFormik.setFieldValue("tendered", v);
                    // posSalesFormik.handleChange;
                  }}
                  // onBlur={() => {
                  //   calculation(posSalesFormik.values);
                  // }}
                  size="small"
                  type="number"
                  fullWidth
                  error={
                    posSalesFormik.touched.tendered &&
                    Boolean(posSalesFormik.errors.tendered)
                  }
                  helperText={
                    posSalesFormik.touched.tendered &&
                    posSalesFormik.errors.tendered
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
                  Remaining
                </Typography>
              </Grid>
              <Grid sm={2} md={2} lg={2} style={{ paddingTop: 2 }}>
                <TextField
                  variant="outlined"
                  id="remaining"
                  value={
                    posSalesFormik.values.tendered -
                    posSalesFormik.values.netAmount
                  }
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  type="number"
                  fullWidth
                />
              </Grid>
            </Grid>
          </>
        </form>
      </Card>
    </>
  );
};

export default PosSalesForm;
