import React, { useState, useEffect } from "react";
import {
  GetSalesQuotationSummary,
  GetSalesQuotation,
  DeleteSalesQuotation,
} from "../../../Api/Actions/salesQuotationActions";
import {
  GET_SALES_QUOTATION_SUMMARY,
  DELETE_SALES_QUOTATION_SUMMARY,
  GET_SALES_QUOTATIONS,
  DELETE_SALES_QUOTATION,
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

function SalesQuotationList() {
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
  const pageName = location.pathname.match("Sale");
  var companyId;
  const user = useSelector((state) => state.userReducer);
  companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;

  const SalesQuotationSummaryList = useSelector(
    (state) => state.salesQuotationSummaryReducer
  );
  useEffect(() => {
    setSpinner(true);
    GetSalesQuotationSummary(companyId)
      .then((res) => {
        setSpinner(false);
        dispatch({ type: GET_SALES_QUOTATION_SUMMARY, payload: res.data });
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
    GetSalesQuotation(companyId)
      .then((res) => {
        dispatch({ type: GET_SALES_QUOTATIONS, payload: res.data });
      })
      .catch((error) => {});
  }, []);

  const DeleteSalesQuotationSummaryHandler = (rowData) => {
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
        DeleteSalesQuotation(rowData.salesQuotationId)
          .then((res) => {
            if (res.status === 200) {
              console.log("res", res.data);
              dispatch({ type: DELETE_SALES_QUOTATION, payload: res.data });
              dispatch({
                type: DELETE_SALES_QUOTATION_SUMMARY,
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
      field: "orderCode",
      header: "Order Number",
      sortable: true,
      dataKey: "orderCode",
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
      field: "orderReceiveDate",
      header: "Order Received",
      sortable: true,
      dataKey: "orderReceiveDate",
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

  const EditSQHandler = (rowData) => {
    history.push(
      `/SalesQuotation/SalesQuotationId=${rowData.salesQuotationId}`
    );
  };

  const AutoGenerateHandler = (rowData) => {
    history.push(`/SalesOrder/SalesQuotationId=${rowData.salesQuotationId}`);
  };

  const EditBomHandler = (rowData) => {
    // history.push(
    //   `/Product/ProductBom/ProductId=${itemId}/BomId=${rowData.itemDetailId}`
    // );
  };
  const FilterHandler = (event) => {
    setFilterValue(event.target.value);
    if (event.target.value === "Open") {
      const filteredArray = SalesQuotationSummaryList.filter(
        (e) => e.status === "Open"
      );
      setFilteredItem(filteredArray);
    } else if (event.target.value === "Close") {
      const filteredArray = SalesQuotationSummaryList.filter(
        (e) => e.status === "Close"
      );
      setFilteredItem(filteredArray);
    } else {
      setFilteredItem(SalesQuotationSummaryList);
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
            title: "Quotation List",
            url: null,
          },
        ]}
        pageName="Sale"
        show={true}
      />
      <BackDrop open={Spinner} />
      <Card root={classes.root}>
        <DataGrid
          columns={columns}
          data={
            filterValue === "All" ? SalesQuotationSummaryList : filteredItem
          }
          setSelectedData={setSelectedData}
          setshowWarningAlert={showWarningAlert}
          AddNewHandler={() => {
            history.push(`/SalesQuotation/SalesQuotationForm`);
          }}
          ListTitle="Sales Quotation List"
          showTitle={true}
          showExportButton={true}
          AutoGenerateHandler={AutoGenerateHandler}
          AutoGenerateIconTitle="Auto Generate Sale Order"
          EditHandler={EditSQHandler}
          DeleteHandler={DeleteSalesQuotationSummaryHandler}
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

export default SalesQuotationList;
