import React, { useState, useEffect } from "react";
import { getUser } from "../../../Api/Actions/registrationActions";
import {
  GetProductType,
  DeleteProductType,
} from "../../../Api/Actions/productTypeActions";
import {
  GET_PRODUCT_TYPE,
  DELETE_PRODUCT_TYPE,
} from "../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import DeleteAlert from "../../../Components/Alert/ConfirmationAlert";
import SuccessAlert from "../../../Components/Alert/SuccessAlert";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";
import BackDrop from "../../../Components/BackDrop";
import ItemTypeForm from "./itemTypeForm";
import Card from "../../../Components/Card";
import DataGrid from "../../../Components/GridDataTable";
import { useLocation } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import BreadCrumb from "../../../Components/BreadCrumb1";
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
function ItemTypeList() {
  const classes = useStyles();
  const location = useLocation();
  const [showWarningAlert, setshowWarningAlert] = useState(false);
  const [showSuccessAlert, setshowSuccessAlert] = useState(false);
  const [showErrorAlert, setshowErrorAlert] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState({});
  const [SelectedData, setSelectedData] = useState("");
  const [ShowProductTypeForm, setShowProductTypeForm] = useState(false);
  const dispatch = useDispatch();
  const pageName = location.pathname.match("product");
  var companyId;
  var userRecord = getUser();
  companyId = userRecord.companyId;
  const user = useSelector((state) => state.userReducer);

  const productTypes = useSelector((state) => state.productTypeReducer).map(
    (type, index) => {
      return {
        id: type.id,
        name: type.name,
      };
    }
  );
  useEffect(() => {
    GetProductType(companyId)
      .then((res) => {
        dispatch({ type: GET_PRODUCT_TYPE, payload: res.data });
      })
      .catch((error) => { });
  }, []);
  const DeleteHandler = () => {
    setshowWarningAlert(false);
    DeleteProductType(SelectedData.id)
      .then((res) => {
        if (res.status === 200) {
          dispatch({ type: DELETE_PRODUCT_TYPE, payload: res.data });
          setshowSuccessAlert(true);
        }
      })
      .catch((error) => {
        setErrorMessage({
          message: error.response.data.message,
          title: error.response.data.title,
        });
        setshowErrorAlert(true);
      });
    setSelectedData("");
  };
  const columns = [
    {},
    {
      field: "name",
      header: "Name",
      sortable: true,
      dataKey: "name",
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
    },
  ];

  const ModalCloseHandler = () => {
    setShowProductTypeForm(false);
    setSelectedData("");
  };
  return (
    <>
      {ShowProductTypeForm === true && (
        <ItemTypeForm
          open={ShowProductTypeForm}
          close={ModalCloseHandler}
          SelectedData={SelectedData}
          setSelectedData={setSelectedData}
          setErrorMessage={setErrorMessage}
          setshowSuccessAlert={setshowSuccessAlert}
          setshowErrorAlert={setshowErrorAlert}
        />
      )}

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
      {productTypes.length === 0 && <BackDrop open={true} />}


      <BreadCrumb
        items={[
          {
            title: `Welcome ${user?.UserState?.username ?? user?.username ?? ""
              } to CoreB`,
            url: "/",
            type: "",
          },
          {
            title: "Product",
            url: "/ProductList",
            type: "",
          },
          {
            title: "Product Type",
            url: null,
            type: "",
          },
        ]}
        show={true}
        pageName="Product"
      />
      <Card root={classes.root}>
        <DataGrid
          columns={columns}
          showTitle
          showExportButton
          data={productTypes.reverse()}
          setSelectedData={setSelectedData}
          setshowWarningAlert={setshowWarningAlert}
          AddNewHandler={setShowProductTypeForm}
          ListTitle="Product Type List"
          EditHandler={setShowProductTypeForm}
          deleteIconStyle={classes.deleteIconStyle}
          editIconStyle={classes.editIconStyle}
          editFormPopUp="true"
          showHeader={true}
        />
      </Card>
    </>
  );
}

export default ItemTypeList;
