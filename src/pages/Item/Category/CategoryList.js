import React, { useState, useEffect } from "react";
import { getUser } from "../../../Api/Actions/registrationActions";
import {
  GetCategories,
  DeleteCategory,
} from "../../../Api/Actions/categoryActions";
import { GET_CATEGORY, DELETE_CATEGORY } from "../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import DeleteAlert from "../../../Components/Alert/ConfirmationAlert";
import SuccessAlert from "../../../Components/Alert/SuccessAlert";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";
import BackDrop from "../../../Components/BackDrop";
import CategoryForm from "./CategoryForm";
import Card from "../../../Components/Card";
import DataGrid from "../../../Components/GridDataTable";
import { useLocation } from "react-router-dom";
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
    maxHeight: "100%",
    marginRight: "1%",
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
function CategoryList() {
  const user = useSelector((state) => state.userReducer);
  const classes = useStyles();
  const [showWarningAlert, setshowWarningAlert] = useState(false);
  const [showSuccessAlert, setshowSuccessAlert] = useState(false);
  const [showErrorAlert, setshowErrorAlert] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState({});
  const [SelectedData, setSelectedData] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();

  var companyId;
  var userRecord = getUser();
  companyId = userRecord.companyId;

  var CategoryRecord = useSelector((state) => state.categoryReducer).map(
    (category, index) => {
      return {
        title: category.title,
        description: category.description,
        id: category.id,
      };
    }
  );
  useEffect(() => {
    GetCategories(companyId)
      .then((res) => {
        dispatch({ type: GET_CATEGORY, payload: res.data });
      })
      .catch((error) => { });
  }, []);
  const DeleteHandler = () => {
    setshowWarningAlert(false);
    DeleteCategory(SelectedData.id)
      .then((res) => {
        if (res.status === 200) {
          dispatch({ type: DELETE_CATEGORY, payload: res.data });
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
      field: "title",
      header: "Name",
      sortable: true,
      dataKey: "title",
    },
    {
      field: "description",
      header: "Description",
      sortable: true,
      dataKey: "description",
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
    },
  ];
  const [ShowCategoryForm, setShowCategoryForm] = useState(false);
  const ModalCloseHandler = () => {
    setShowCategoryForm(false);
    setSelectedData("");
  };
  const pageName = location.pathname.match("product");

  return (
    <>
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
            title: "Product Categoty",
            url: null,
            type: "",
          },
        ]}
        pageName="Product"
        show={true}
      />
      {ShowCategoryForm === true && (
        <CategoryForm
          open={ShowCategoryForm}
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
      {CategoryRecord.length === 0 && <BackDrop open={true} />}
      <Card root={classes.root}>
        <DataGrid
          columns={columns}
          data={CategoryRecord.reverse()}
          setSelectedData={setSelectedData}
          setshowWarningAlert={setshowWarningAlert}
          ListTitle="Category List"
          showTitle
          showExportButton
          AddNewHandler={setShowCategoryForm}
          EditHandler={setShowCategoryForm}
          deleteIconStyle={classes.deleteIconStyle}
          editIconStyle={classes.editIconStyle}
          editFormPopUp="true"
          showHeader={true}
        />
      </Card>
    </>
  );
}

export default CategoryList;
