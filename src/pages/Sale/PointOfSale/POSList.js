import React, { useState, useEffect } from "react";
import {
  GetPosSalesSummary,
  GetPosSales,
  DeletePosSales,
} from "../../../Api/Actions/posSalesActions";
import {
  GET_POS_SALE_SUMMARY,
  DELETE_POS_SALE_SUMMARY,
  GET_POS_SALES,
  DELETE_POS_SALE,
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
import BackDrop from "../../../Components/BackDrop";

function PosSalesList() {
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
  const [Spinner, setSpinner] = useState(false);
  const dispatch = useDispatch();
  const pageName = location.pathname.match("POS");
  var companyId;
  const user = useSelector((state) => state.userReducer);
  companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;

  const posSalesSummaryList = useSelector(
    (state) => state.posSalesSummaryReducer
  );
  useEffect(() => {
    setSpinner(true);
    GetPosSalesSummary(companyId)
      .then((res) => {
        setSpinner(false);
        dispatch({ type: GET_POS_SALE_SUMMARY, payload: res.data });
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
    GetPosSales(companyId)
      .then((res) => {
        dispatch({ type: GET_POS_SALES, payload: res.data });
      })
      .catch((error) => {});
  }, []);

  const DeletePosSalesSummaryHandler = (rowData) => {
    console.log("rowData", rowData);
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
        DeletePosSales(rowData.posSalesId)
          .then((res) => {
            if (res.status === 200) {
              console.log("res", res.data);
              dispatch({ type: DELETE_POS_SALE, payload: res.data });
              dispatch({
                type: DELETE_POS_SALE_SUMMARY,
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
      field: "invoiceCode",
      header: "Invoice Number",
      sortable: true,
      dataKey: "invoiceCode",
    },
    {
      field: "invoiceDate",
      header: "Invoice Date",
      sortable: true,
      dataKey: "invoiceDate",
    },
    {
      field: "customerCode",
      header: "Customer Code",
      sortable: true,
      dataKey: "customerCode",
    },
    {
      field: "customerName",
      header: "Customer Name",
      sortable: true,
      dataKey: "customerName",
    },
    {
      field: "totalQuantity",
      header: "Total Quantity",
      sortable: true,
      dataKey: "totalQuantity",
    },
    {
      field: "totalAmount",
      header: "Total Amount",
      sortable: true,
      dataKey: "totalAmount",
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

  const EditSoHandler = (rowData) => {
    history.push(`/POS/PosSalesId=${rowData.posSalesId}`);
  };

  const PaymentInHandler = (rowData) => {
    history.push(`/PaymentIn/PosSalesId=${rowData.posSalesId}`);
  };

  const FilterHandler = (event) => {
    setFilterValue(event.target.value);
    if (event.target.value === "Paid") {
      const filteredArray = posSalesSummaryList.filter(
        (e) => e.status === "Paid"
      );
      setFilteredItem(filteredArray);
    } else if (event.target.value === "Partial-Paid") {
      const filteredArray = posSalesSummaryList.filter(
        (e) => e.status === "Partial-Paid"
      );
      setFilteredItem(filteredArray);
    } else if (event.target.value === "UnPaid") {
      const filteredArray = posSalesSummaryList.filter(
        (e) => e.status === "UnPaid"
      );
      setFilteredItem(filteredArray);
    } else {
      setFilteredItem(posSalesSummaryList);
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
      <BackDrop open={Spinner} />
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
            url: null,
          },
        ]}
        pageName="Sale"
        show={true}
      />
      <Card root={classes.root}>
        <DataGrid
          columns={columns}
          data={
            filterValue === "All"
              ? posSalesSummaryList.reverse()
              : filteredItem.reverse()
          }
          setSelectedData={setSelectedData}
          setshowWarningAlert={showWarningAlert}
          AddNewHandler={() => {
            history.push(`/POS/POSForm`);
          }}
          ListTitle="POS List"
          showTitle={true}
          showExportButton={true}
          EditHandler={EditSoHandler}
          DeleteHandler={DeletePosSalesSummaryHandler}
          deleteIconStyle={classes.deleteIconStyle}
          editIconStyle={classes.editIconStyle}
          editFormPopUp="false"
          // filterName={filterNames}
          // filterValue={filterValue}
          // FilterHandler={FilterHandler}
          showHeader={true}
          showCopyIcon
          showPrintIcon
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

export default PosSalesList;
