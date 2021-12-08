import React, { useState, useEffect } from "react";
import {
  GetPurchaseOrderSummary,
  GetPurchaseOrder,
  DeletePurchaseOrder,
} from "../../../Api/Actions/purchaseOrder";
import {
  GET_PURCHASE_ORDER_SUMMARY,
  DELETE_PURCHASE_ORDER_SUMMARY,
  GET_PURCHASE_ORDERS,
  DELETE_PURCHASE_ORDER,
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

function PurchaseOrderList() {
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
  const pageName = location.pathname.match("Purchase");
  var companyId;
  const user = useSelector((state) => state.userReducer);
  companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;

  const purchaseOrderSummaryList = useSelector(
    (state) => state.purchaseOrderSummaryReducer
  );
  useEffect(() => {
    setSpinner(true);
    GetPurchaseOrderSummary(companyId)
      .then((res) => {
        setSpinner(false);
        dispatch({ type: GET_PURCHASE_ORDER_SUMMARY, payload: res.data });
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
    GetPurchaseOrder(companyId)
      .then((res) => {
        dispatch({ type: GET_PURCHASE_ORDERS, payload: res.data });
      })
      .catch((error) => {});
  }, []);

  const DeletePurchaseOrderSummaryHandler = (rowData) => {
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
        DeletePurchaseOrder(rowData.purchaseOrderId)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: DELETE_PURCHASE_ORDER, payload: res.data });
              dispatch({
                type: DELETE_PURCHASE_ORDER_SUMMARY,
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
        setSelectedData("");
      } else {
        setSelectedData("");
      }
    });
  };

  const columns = [
    {},
    {
      field: "purchaseOrderCode",
      header: "Order Number",
      sortable: true,
      dataKey: "purchaseOrderCode",
    },
    {
      field: "supplierCode",
      header: "Supplier Code",
      sortable: true,
      dataKey: "supplierCode",
    },
    {
      field: "supplierName",
      header: "Supplier Name",
      sortable: true,
      dataKey: "supplierName",
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
      field: "orderReceived",
      header: "Order Received",
      sortable: true,
      dataKey: "orderReceived",
    },
    {
      field: "shipmentDate",
      header: "Shipment Date",
      sortable: true,
      dataKey: "shipmentDate",
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
  const filterNames = ["All", "Open", "Close"];
  const EditPoHandler = (rowData) => {
    history.push(`/PurchaseOrder/PurchaseOrderId=${rowData.purchaseOrderId}`);
  };
  const FilterHandler = (event) => {
    setFilterValue(event.target.value);
    if (event.target.value === "Open") {
      const filteredArray = purchaseOrderSummaryList.filter(
        (e) => e.status === "Open"
      );
      setFilteredItem(filteredArray);
    } else if (event.target.value === "Close") {
      const filteredArray = purchaseOrderSummaryList.filter(
        (e) => e.status === "Close"
      );
      setFilteredItem(filteredArray);
    } else {
      setFilteredItem(purchaseOrderSummaryList);
    }
  };
  const AutoGenerateHandler = (rowData) => {
    history.push(`/PurchaseBill/PurchaseOrderId=${rowData.purchaseOrderId}`);
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
            title: "Purchase Order List",
            url: null,
          },
        ]}
        show={true}
        pageName="Purchase"
      />
      <BackDrop open={Spinner} />
      <Card root={classes.root}>
        <DataGrid
          columns={columns}
          data={
            filterValue === "All"
              ? purchaseOrderSummaryList.reverse()
              : filteredItem.reverse()
          }
          setSelectedData={setSelectedData}
          setshowWarningAlert={showWarningAlert}
          AddNewHandler={() => {
            history.push(`/PurchaseOrder/PurchaseOrderForm`);
          }}
          ListTitle="Purchase Order List"
          showTitle={true}
          showExportButton={true}
          EditHandler={EditPoHandler}
          DeleteHandler={DeletePurchaseOrderSummaryHandler}
          deleteIconStyle={classes.deleteIconStyle}
          editIconStyle={classes.editIconStyle}
          AutoGenerateHandler={AutoGenerateHandler}
          AutoGenerateIconTitle="Auto Generate Purchase Bill"
          editFormPopUp="false"
          filterName={filterNames}
          filterValue={filterValue}
          FilterHandler={FilterHandler}
          showHeader={true}
          showCopyIcon
          showPrintIcon
          showDeleteIcon
          showEditIcon
          showAutoGenerateIcon={true}
          // ActionMenu
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

export default PurchaseOrderList;
