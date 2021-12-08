import React, { useState, useEffect } from "react";
import {
  GetExpenseSummary,
  GetExpense,
  DeleteExpense,
} from "../../../Api/Actions/expenseActions";
import {
  GET_EXPENSE_SUMMARY,
  DELETE_EXPENSE_SUMMARY,
  GET_EXPENSES,
  DELETE_EXPENSE,
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
import Swal from "sweetalert2";
import dateformat from "dateformat";
function ExpenseList() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [showWarningAlert, setshowWarningAlert] = useState(false);
  const [showSuccessAlert, setshowSuccessAlert] = useState(false);
  const [showErrorAlert, setshowErrorAlert] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState({});
  const [SelectedData, setSelectedData] = useState("");
  const [filterValue, setFilterValue] = useState("All");
  const [filteredItem, setFilteredItem] = useState([]);
  const dispatch = useDispatch();
  const pageName = location.pathname.match("Expense");
  var companyId;
  const user = useSelector((state) => state.userReducer);
  companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;

  const expenseSummaryList = useSelector((state) =>
    state.expenseSummaryReducer.map((e) => {
      e.expenseDate = dateformat(e.expenseDate, "dd mmm,yyyy");
      e.balance = e.totalAmount - e.paid;
      return e;
    })
  );

  useEffect(() => {
    GetExpenseSummary(companyId)
      .then((res) => {
        dispatch({ type: GET_EXPENSE_SUMMARY, payload: res.data });
      })
      .catch((error) => {});
    GetExpense(companyId)
      .then((res) => {
        dispatch({ type: GET_EXPENSES, payload: res.data });
      })
      .catch((error) => {});
  }, []);

  const DeleteExpenseSummaryHandler = (rowData) => {
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
        DeleteExpense(rowData.expenseId)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: DELETE_EXPENSE, payload: res.data });
              dispatch({
                type: DELETE_EXPENSE_SUMMARY,
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
              title: `${error.response.data.title}`,
              text: `${error.response.data.message}`,
              icon: "error",
              showConfirmButton: true,
            });
          });
        setSelectedData("");
      } else {
        setSelectedData("");
      }
    });
  };

  const columns = [
    {},
    {
      field: "expenseCode",
      header: "Expense Number",
      sortable: true,
      dataKey: "expenseCode",
    },
    {
      field: "expenseCategoryName",
      header: "Name",
      sortable: true,
      dataKey: "expenseCategoryName",
    },
    {
      field: "expenseDate",
      header: "Date",
      sortable: true,
      dataKey: "expenseDate",
    },
    {
      field: "paymentTerm",
      header: "Payment Term",
      sortable: true,
      dataKey: "paymentTerm",
    },
    {
      field: "totalAmount",
      header: "Total Amount",
      sortable: true,
      dataKey: "totalAmount",
    },
    {
      field: "paid",
      header: "Paid",
      sortable: true,
      dataKey: "paid",
    },
    {
      field: "balance",
      header: "Balance",
      sortable: true,
      dataKey: "balance",
    },

    {
      field: "Action",
      header: "Action",
      sortable: false,
    },
  ];
  const filterNames = ["All", "Open", "Close"];

  const EditSoHandler = (rowData) => {
    history.push(`/Expense/ExpenseId=${rowData.expenseId}`);
  };

  const PaymentOutHandler = (rowData) => {
    history.push(`/PaymentOut/ExpenseId=${rowData.expenseId}`);
  };

  const FilterHandler = (event) => {
    setFilterValue(event.target.value);
    if (event.target.value === "Open") {
      const filteredArray = expenseSummaryList.filter(
        (e) => e.status === "Open"
      );
      setFilteredItem(filteredArray);
    } else if (event.target.value === "Close") {
      const filteredArray = expenseSummaryList.filter(
        (e) => e.status === "Close"
      );
      setFilteredItem(filteredArray);
    } else {
      setFilteredItem(expenseSummaryList);
    }
  };

  return (
    <>
      {showSuccessAlert && (
        <SuccessAlert
          message="Updated SuccessFully"
          title="Success"
          open={SuccessAlert}
          onClick={setshowSuccessAlert}
        />
      )}
      {showErrorAlert && (
        <ErrorAlert
          open={setshowErrorAlert}
          onClick={() => {
            setshowErrorAlert(false);
          }}
          title={ErrorMessage.title}
          message={ErrorMessage.message}
        />
      )}
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
            url: null,
          },
        ]}
        show={true}
        pageName="Expense"
      />
      <Card root={classes.root}>
        <DataGrid
          columns={columns}
          data={filterValue === "All" ? expenseSummaryList : filteredItem}
          setSelectedData={setSelectedData}
          setshowWarningAlert={showWarningAlert}
          AddNewHandler={() => {
            history.push(`/Expense/ExpenseForm`);
          }}
          ListTitle="Expense List"
          showTitle={true}
          showExportButton={true}
          EditHandler={EditSoHandler}
          DeleteHandler={DeleteExpenseSummaryHandler}
          deleteIconStyle={classes.deleteIconStyle}
          editIconStyle={classes.editIconStyle}
          editFormPopUp="false"
          filterName={filterNames}
          filterValue={filterValue}
          FilterHandler={FilterHandler}
          showHeader={true}
          showCopyIcon
          showPrintIcon
          AutoGenerateHandler={PaymentOutHandler}
          AutoGenerateIconPurchaseOrderTitle="PaymentIn"
          showAutoGenerateIcon={true}
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

export default ExpenseList;
