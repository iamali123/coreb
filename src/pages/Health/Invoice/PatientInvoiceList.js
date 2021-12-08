import React, { useState, useEffect } from "react";
import {
  GetSalesOrderSummary,
  GetSalesOrder,
  DeleteSalesOrder,
} from "../../../Api/Actions/salesOrderActions";
import {
  DELETE_SALES_ORDER_SUMMARY,
  DELETE_SALES_ORDER,
  GET_PATIENT_INVOICES_SUMMARY,
  GET_PATIENT_INVOICES,
  DELETE_PATIENT_INVOICE,
  DELETE_PATIENT_INVOICE_SUMMARY,
} from "../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import DeleteAlert from "../../../Components/Alert/ConfirmationAlert";
import SuccessAlert from "../../../Components/Alert/SuccessAlert";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";
import DataGrid from "../../../Components/GridDataTable";
import { useLocation, useParams, useHistory } from "react-router-dom";
import Card from "../../../Components/Card";
import BreadCrumb from "../../../Components/BreadCrumb1";
import BackDrop from "../../../Components/BackDrop";
import Swal from "sweetalert2";
import {
  DeletePatientInvoice,
  GetPatientInvoices,
  GetPatientInvoiceSummary,
} from "../../../Api/Actions/Health/Invoice/PatientInvoiceAction";
import dateformat from "dateformat";
function PatientInvoiceList() {
  const classes = useStyles();
  const location = useLocation();
  const params = useParams();
  const history = useHistory();
  const [filterValue, setFilterValue] = useState("All");
  const [filteredItem, setFilteredItem] = useState([]);
  const [Spinner, setSpinner] = useState(false);
  const dispatch = useDispatch();
  const pageName = location.pathname.match("Patient");
  var companyId;
  const user = useSelector((state) => state.userReducer);
  companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;

  const patientInvoiceSummaryList = useSelector(
    (state) => state.patientInvoiceSummaryReducer
  ).map((e) => {
    e.date = dateformat(e.date, "dd mmm,yyyy");
    return e;
  });
  const RelatedPatientInvoice = useSelector(
    (invoice) => invoice.patientInvoiceSummaryReducer
  ).filter(
    (e) => e?.patientId?.toString() === params?.PatientId?.toString() ?? 0
  );
  useEffect(() => {
    setSpinner(true);
    GetPatientInvoiceSummary(companyId)
      .then((res) => {
        setSpinner(false);
        dispatch({ type: GET_PATIENT_INVOICES_SUMMARY, payload: res.data });
      })
      .catch((error) => {
        setSpinner(false);
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
    GetPatientInvoices(companyId)
      .then((res) => {
        dispatch({ type: GET_PATIENT_INVOICES, payload: res.data });
      })
      .catch((error) => {});
  }, []);

  const DeleteSalesOrderSummaryHandler = (rowData) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        DeletePatientInvoice(rowData.patientInvoiceId)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: DELETE_PATIENT_INVOICE, payload: res.data });
              dispatch({
                type: DELETE_PATIENT_INVOICE_SUMMARY,
                payload: res.data,
              });
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Deleted!",
                text: "Your file has been deleted.",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          })
          .catch((error) => {
            Swal.fire({
              title: `${error?.response?.data?.title}`,
              text: `${error?.response?.data?.message}`,
              icon: "error",
              showConfirmButton: true,
            });
          });
      }
    });
  };

  const columns = [
    {},
    {
      field: "invoiceCode",
      header: "Invoice Code",
      sortable: true,
      dataKey: "invoiceCode",
    },
    {
      field: "patientName",
      header: "Patient Name",
      sortable: true,
      dataKey: "patientName",
    },
    {
      field: "doctorName",
      header: "Doctor Name",
      sortable: true,
      dataKey: "doctorName",
    },
    {
      field: "date",
      header: "Date",
      sortable: true,
      dataKey: "date",
    },
    {
      field: "amount",
      header: "Amount",
      sortable: true,
      dataKey: "amount",
    },
    {
      field: "status",
      header: "Status",
      sortable: false,
      dataKey: "status",
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
    },
  ];
  const filterNames = ["All", "Paid", "Partial-Paid", "UnPaid"];
  const EditPatientInvoice = (rowData) => {
    history.push(
      `/PatientInvoice/EditPatientInvoiceId=${rowData.patientInvoiceId}`
    );
  };

  const AutoGenerateHandler = (rowData) => {
    history.push(`/PaymentIn/PatientInvoiceId=${rowData.patientInvoiceId}`);
  };

  const FilterHandler = (event) => {
    setFilterValue(event.target.value);
    if (event.target.value === "Paid") {
      const filteredArray = (
        RelatedPatientInvoice.length > 0
          ? RelatedPatientInvoice
          : patientInvoiceSummaryList
      ).filter((e) => e.status === "Paid");
      setFilteredItem(filteredArray);
    } else if (event.target.value === "Partial-Paid") {
      const filteredArray = (
        RelatedPatientInvoice.length > 0
          ? RelatedPatientInvoice
          : patientInvoiceSummaryList
      ).filter((e) => e.status === "Partial-Paid");
      setFilteredItem(filteredArray);
    } else if (event.target.value === "UnPaid") {
      const filteredArray = (
        RelatedPatientInvoice.length > 0
          ? RelatedPatientInvoice
          : patientInvoiceSummaryList
      ).filter((e) => e.status === "UnPaid");
      setFilteredItem(filteredArray);
    } else {
      setFilteredItem(
        RelatedPatientInvoice.length > 0
          ? RelatedPatientInvoice
          : patientInvoiceSummaryList
      );
    }
  };

  return (
    <>
      <BackDrop open={Spinner} />
      {params.PatientId === undefined && (
        <BreadCrumb
          items={[
            {
              title: `Welcome ${
                user?.UserState?.username ?? user?.username ?? ""
              } to CoreB`,
              url: "/",
            },
            {
              title: "Patient Invoice List",
              url: null,
            },
          ]}
          show={true}
          pageName="Sale"
        />
      )}

      <Card root={classes.root}>
        <DataGrid
          columns={columns}
          data={
            filterValue === "All"
              ? RelatedPatientInvoice.length > 0
                ? RelatedPatientInvoice
                : patientInvoiceSummaryList
              : filteredItem
          }
          AddNewHandler={() => {
            history.push(`/PatientInvoice/NewPatientInvoiceForm`);
          }}
          ListTitle="Invoice List"
          showTitle={true}
          showExportButton={true}
          EditHandler={EditPatientInvoice}
          DeleteHandler={DeleteSalesOrderSummaryHandler}
          deleteIconStyle={classes.deleteIconStyle}
          editIconStyle={classes.editIconStyle}
          editFormPopUp="false"
          filterName={filterNames}
          filterValue={filterValue}
          FilterHandler={FilterHandler}
          showHeader={true}
          AutoGenerateHandler={AutoGenerateHandler}
          AutoGenerateIconTitle="Auto Generate Payment In"
          showCopyIcon
          showPrintIcon
          showMakePayment
        />
      </Card>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  button: {
    marginRight: 10,
  },
  buttonAdd: {
    marginLeft: "500px",
  },
  buttonStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  badgeRoot: {
    marginLeft: 40,
  },
  PartialBadgeRoot: {
    marginLeft: 40,
  },
  root: {
    minWidth: 200,
    width: "98%",
    margin: "0 auto",
    maxHeight: "100%",
    marginTop: "1%",
    marginBottom: "3%",
  },
  deleteIconStyle: {
    cursor: "pointer",
  },
  editIconStyle: {
    marginRight: 5,
    cursor: "pointer",
  },
}));

export default PatientInvoiceList;
