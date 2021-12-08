import React, { useState, useEffect } from "react";
import { getUser } from "../../../Api/Actions/registrationActions";
import { DELETE_CUSTOMER } from "../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import DeleteAlert from "../../../Components/Alert/ConfirmationAlert";
import SuccessAlert from "../../../Components/Alert/SuccessAlert";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";
import BackDrop from "../../../Components/BackDrop";
import Card from "../../../Components/Card";
import DataGrid from "../../../Components/GridDataTable";
import { useLocation, useHistory } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import BreadCrumb from "../../../Components/BreadCrumb1";
import { DeleteCustomer } from "../../../Api/Actions/customerActions";
import CustomerForm from "./ModalForm";
import { Message } from "@material-ui/icons";
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
function List() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const [showWarningAlert, setshowWarningAlert] = useState(false);
  const [showSuccessAlert, setshowSuccessAlert] = useState(false);
  const [showErrorAlert, setshowErrorAlert] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState({});
  const [SelectedData, setSelectedData] = useState("");
  const [ShowCustomerForm, setShowCustomerForm] = useState(false);
  const dispatch = useDispatch();
  const pageName = location.pathname.match("CustomerList");
  const user = useSelector((state) => state.userReducer);
  var companyId;
  var userRecord = getUser();
  companyId = userRecord.companyId;

  const customers = useSelector((state) => state.customerReducer).map(
    (customer, index) => {
      return {
        customerId: customer.customerId,
        customerCode: customer.customerCode,
        customerName: customer.customerName,
        contact: customer.contact,
        address: customer.address,
        email: customer.email,
        openingBalance: customer.openingBalance,
        asofDate: customer.asOfDate,
        balanceType: customer.balanceType,
      };
    }
  );
  const DeleteHandler = () => {
    setshowWarningAlert(false);
    const customerId = SelectedData.customerId;
    DeleteCustomer(customerId)
      .then((res) => {
        if (res.status === 200) {
          dispatch({ type: DELETE_CUSTOMER, payload: res.data });
          setshowSuccessAlert(true);
        }
      })
      .catch((error) => {
        if (error.response === undefined) {
          setErrorMessage({ message: "Network Error" });
        } else {
          if (error.response.data.message !== undefined) {
            setErrorMessage({
              message: error.response.data.message,
              title: error.response.data.title,
            });
          } else {
            setErrorMessage({ message: error.response.data });
          }
        }
        setshowErrorAlert(true);
        setSelectedData("");
      });
  };
  const columns = [
    {},
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
      field: "email",
      header: "Email",
      sortable: true,
      dataKey: "email",
    },
    {
      field: "contact",
      header: "Contact",
      sortable: true,
      dataKey: "contact",
    },

    {
      field: "address",
      header: "Address",
      sortable: true,
      dataKey: "address",
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
    },
  ];

  const EditCustomerHandler = (rowData) => {
    history.push(`/Customer/Customer=${rowData.customerId}`);
  };
  return (
    <>
      {showWarningAlert && (
        <DeleteAlert
          title="Are You Sure ? "
          message={"you want to delete this."}
          open={showWarningAlert}
          onClose={() => {
            setshowWarningAlert(false);
            setSelectedData("");
          }}
          onClick={DeleteHandler}
        />
      )}
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
      {/* {customers.length === 0 && <BackDrop open={true} />} */}

      <BreadCrumb
        items={[
          {
            title: `Welcome ${
              user?.UserState?.username ?? user?.username ?? ""
            } to CoreB`,
            url: "/",
          },
          {
            title: "Customer List",
            url: null,
          },
        ]}
        pageName="Customer"
        show={true}
      />
      <Card root={classes.root}>
        <DataGrid
          columns={columns}
          data={customers}
          showTitle
          showExportButton
          setSelectedData={setSelectedData}
          setshowWarningAlert={setshowWarningAlert}
          AddNewHandler={() => {
            history.push("/Customer");
          }}
          ListTitle="Customer List"
          EditHandler={EditCustomerHandler}
          deleteIconStyle={classes.deleteIconStyle}
          editIconStyle={classes.editIconStyle}
          editFormPopUp="false"
          showHeader={true}
        />
      </Card>
    </>
  );
}

export default List;
