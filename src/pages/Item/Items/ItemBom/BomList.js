import React, { useState, useEffect } from "react";
import { getUser } from "../../../../Api/Actions/registrationActions";
import {
  GetBOM,
  DeleteBOM,
  GetBOMDetail,
  GetBOMSummary,
} from "../../../../Api/Actions/bomActions";
import {
  GET_BOM,
  DELETE_BOM,
  GET_BOM_DETAIL,
  GET_BOM_SUMMARY,
  DELETE_BOM_SUMMARY,
} from "../../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import DeleteAlert from "../../../../Components/Alert/ConfirmationAlert";
import SuccessAlert from "../../../../Components/Alert/SuccessAlert";
import ErrorAlert from "../../../../Components/Alert/ErrorAlert";
import DataGrid from "../../../../Components/GridDataTable";
import { useLocation, useParams, useHistory } from "react-router-dom";

function BomList() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const params = useParams();
  const [showWarningAlert, setshowWarningAlert] = useState(false);
  const [showSuccessAlert, setshowSuccessAlert] = useState(false);
  const [showErrorAlert, setshowErrorAlert] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState({});
  const [SelectedData, setSelectedData] = useState("");
  const dispatch = useDispatch();
  const pageName = location.pathname.match("product");
  var companyId;
  var itemId;
  const user = useSelector((state) => state.userReducer);
  companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;

  const BomSmmaryList = useSelector((state) => state.bomSummaryReducer);
  if (params.productId !== null || params.productId !== undefined) {
    itemId = params.productId;
  }
  useEffect(() => {
    GetBOMSummary(companyId, itemId)
      .then((res) => {
        dispatch({ type: GET_BOM_SUMMARY, payload: res.data });
      })
      .catch((error) => {});
    GetBOM(companyId, itemId)
      .then((res) => {
        dispatch({ type: GET_BOM, payload: res.data });
      })
      .catch((error) => {});
  }, []);

  const DeleteBomSummaryHandler = () => {
    setshowWarningAlert(false);
    DeleteBOM(SelectedData.bomId)
      .then((res) => {
        if (res.status === 200) {
          dispatch({ type: DELETE_BOM, payload: res.data });
          dispatch({ type: DELETE_BOM_SUMMARY, payload: res.data });
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
      field: "itemDetailDescription",
      header: "BOM Name",
      sortable: true,
    },
    {
      field: "totalMaterial",
      header: "Total Material",
      sortable: true,
    },
    {
      field: "materialCost",
      header: "Material Cost",
      sortable: true,
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
    },
  ];
  const EditBomHandler = (rowData) => {
    history.push(
      `/Product/ProductBom/ProductId=${itemId}/BomId=${rowData.itemDetailId}`
    );
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
          onClick={DeleteBomSummaryHandler}
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

      <DataGrid
        columns={columns}
        data={BomSmmaryList}
        setSelectedData={setSelectedData}
        setshowWarningAlert={setshowWarningAlert}
        AddNewHandler={() => {
          history.push(`/Product/ProductBom/ProductId=${itemId}`);
        }}
        ListTitle="BOM"
        showTitle={false}
        showExportButton={false}
        EditHandler={EditBomHandler}
        deleteIconStyle={classes.deleteIconStyle}
        editIconStyle={classes.editIconStyle}
        editFormPopUp="false"
        showHeader={true}
        showCopyIcon
        showPrintIcon
      />
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

export default BomList;
