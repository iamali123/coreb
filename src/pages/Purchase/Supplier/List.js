import React, { useState, useEffect } from "react";
import { getUser } from "../../../Api/Actions/registrationActions";
import { DELETE_SUPPLIER } from "../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import DeleteAlert from "../../../Components/Alert/ConfirmationAlert";
import SuccessAlert from "../../../Components/Alert/SuccessAlert";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";
import BackDrop from "../../../Components/BackDrop";
import Card from "../../../Components/Card";
import DataGrid from "../../../Components/GridDataTable";
import { useLocation, useHistory } from "react-router-dom";
import BreadCrumb from "../../../Components/BreadCrumb1";
import { DeleteSupplier } from "../../../Api/Actions/supplierActions";

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
  const location = useLocation();
  const history = useHistory();
  const [showWarningAlert, setshowWarningAlert] = useState(false);
  const [showSuccessAlert, setshowSuccessAlert] = useState(false);
  const [showErrorAlert, setshowErrorAlert] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState({});
  const [SelectedData, setSelectedData] = useState("");
  const dispatch = useDispatch();
  const pageName = location.pathname.match("SupplierList");
  var companyId;
  var userRecord = getUser();
  companyId = userRecord.companyId;

  const suppliers = useSelector((state) => state.supplierReducer).map(
    (supplier, index) => {
      return {
        supplierId: supplier.supplierId,
        supplierCode: supplier.supplierCode,
        supplierName: supplier.supplierName,
        contact: supplier.contact,
        address: supplier.address,
        email: supplier.email,
        openingBalance: supplier.openingBalance,
        asofDate: supplier.asOfDate,
        balanceType: supplier.balanceType,
      };
    }
  );
  const DeleteHandler = () => {
    setshowWarningAlert(false);
    const supplierId = SelectedData.supplierId;
    DeleteSupplier(supplierId)
      .then((res) => {
        if (res.status === 200) {
          dispatch({ type: DELETE_SUPPLIER, payload: res.data });
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
  const EditSupplierHandler = (rowData) => {
    history.push(`/supplierForm/Supplier=${rowData.supplierId}`);
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
      <BreadCrumb
        items={[
          {
            title: `Welcome ${
              userRecord?.UserState?.username ?? userRecord?.username ?? ""
            } to CoreB`,
            url: "/",
          },
          {
            title: "Supplier List",
            url: null,
          },
        ]}
        show={true}
        pageName="Purchase"
      />
      <Card root={classes.root}>
        <DataGrid
          columns={columns}
          data={suppliers}
          showTitle
          showExportButton
          setSelectedData={setSelectedData}
          setshowWarningAlert={setshowWarningAlert}
          AddNewHandler={() => {
            history.push("/supplierForm");
          }}
          ListTitle="Supplier List"
          EditHandler={EditSupplierHandler}
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
