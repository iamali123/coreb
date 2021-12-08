import React, { useState, useEffect } from "react";
import {
  GetPurchaseInquirySummary,
  GetPurchaseInquiry,
  DeletePurchaseInquiry,
} from "../../../Api/Actions/purchaseInquiryActions";
import {
  GET_PURCHASE_INQUIRY_SUMMARY,
  DELETE_PURCHASE_INQUIRY_SUMMARY,
  GET_PURCHASE_INQUIRY,
  DELETE_PURCHASE_INQUIRY,
} from "../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import SuccessAlert from "../../../Components/Alert/SuccessAlert";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";
import DataGrid from "../../../Components/GridDataTable";
import { useLocation, useParams, useHistory } from "react-router-dom";
import Card from "../../../Components/Card";
import BreadCrumb from "../../../Components/BreadCrumb1";
import Swal from "sweetalert2";
import BackDrop from "../../../Components/BackDrop";

function PurchaseInquiryList() {
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

  const purchaseInquirySummaryList = useSelector(
    (state) => state.purchaseInquirySummaryReducer
  );
  useEffect(() => {
    setSpinner(true);
    GetPurchaseInquirySummary(companyId)
      .then((res) => {
        setSpinner(false);
        dispatch({ type: GET_PURCHASE_INQUIRY_SUMMARY, payload: res.data });
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
    GetPurchaseInquiry(companyId)
      .then((res) => {
        dispatch({ type: GET_PURCHASE_INQUIRY, payload: res.data });
      })
      .catch((error) => {});
  }, []);

  const DeletePurchaseInquirySummaryHandler = (rowData) => {
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
        DeletePurchaseInquiry(rowData.purchaseInquiryId)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: DELETE_PURCHASE_INQUIRY, payload: res.data });
              dispatch({
                type: DELETE_PURCHASE_INQUIRY_SUMMARY,
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
      field: "purchaseInquiryCode",
      header: "Order Number",
      sortable: true,
      dataKey: "purchaseInquiryCode",
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
  const EditHandler = (rowData) => {
    history.push(
      `/PurchaseInquiry/PurchaseInquiryId=${rowData.purchaseInquiryId}`
    );
  };
  const FilterHandler = (event) => {
    setFilterValue(event.target.value);
    if (event.target.value === "Open") {
      const filteredArray = purchaseInquirySummaryList.filter(
        (e) => e.status === "Open"
      );
      setFilteredItem(filteredArray);
    } else if (event.target.value === "Close") {
      const filteredArray = purchaseInquirySummaryList.filter(
        (e) => e.status === "Close"
      );
      setFilteredItem(filteredArray);
    } else {
      setFilteredItem(purchaseInquirySummaryList);
    }
  };
  const AutoGenerateHandler = (rowData) => {
    history.push(
      `/PurchaseOrder/PurchaseInquiryId=${rowData.purchaseInquiryId}`
    );
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
            title: "Purchase Inquiry List",
            url: null,
          },
        ]}
        show={true}
        pageName="Purchase"
      />
      <Card root={classes.root}>
        <DataGrid
          columns={columns}
          data={
            filterValue === "All"
              ? purchaseInquirySummaryList.reverse()
              : filteredItem.reverse()
          }
          setSelectedData={setSelectedData}
          setshowWarningAlert={showWarningAlert}
          AddNewHandler={() => {
            history.push(`/PurchaseInquiry/PurchaseInquiryForm`);
          }}
          ListTitle="Purchase Inquiry List"
          showTitle={true}
          showExportButton={true}
          EditHandler={EditHandler}
          AutoGenerateHandler={AutoGenerateHandler}
          AutoGenerateIconTitle="Auto Generate PurchaseOrder"
          DeleteHandler={DeletePurchaseInquirySummaryHandler}
          deleteIconStyle={classes.deleteIconStyle}
          editIconStyle={classes.editIconStyle}
          editFormPopUp="false"
          filterName={filterNames}
          filterValue={filterValue}
          FilterHandler={FilterHandler}
          showHeader={true}
          showCopyIcon
          showPrintIcon
          showAutoGenerateIcon
          showEditIcon
          showDeleteIcon
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

export default PurchaseInquiryList;
