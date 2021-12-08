import React, { useState, useEffect } from "react";
import { getUser } from "../../../Api/Actions/registrationActions";
import { GetItems, DeleteItem } from "../../../Api/Actions/itemActions";
import { GET_ITEMS, DELETE_ITEM } from "../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import DeleteAlert from "../../../Components/Alert/ConfirmationAlert";
import SuccessAlert from "../../../Components/Alert/SuccessAlert";
import ErrorAlert from "../../../Components/Alert/ErrorAlert";
import BackDrop from "../../../Components/BackDrop";
import Card from "../../../Components/Card";
import DataGrid from "../../../Components/GridDataTable";
import { useHistory, useLocation } from "react-router-dom";
import BreadCrumb from "../../../Components/BreadCrumb1";
import Swal from "sweetalert2";
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
    maxHeight: "100%",
    margin: "0 auto",
    marginTop: "1%",
    marginBottom: "3%",
  },
  deleteIconStyle: {
    cursor: "pointer",
    fontSize: "18px",
  },
  editIconStyle: {
    marginRight: 5,
    cursor: "pointer",
    fontSize: "18px",
  },
}));
function ItemList() {
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
  const pageName = location.pathname.match("product");
  const [Spinner, setSpinner] = useState(false);
  const dispatch = useDispatch();
  var companyId;
  var userRecord = getUser();
  companyId = userRecord.companyId;
  const user = useSelector((state) => state.userReducer);
  const item = useSelector((state) => state.itemReducer).map((e) => {
    e.itemTypeName = e.type == 0 ? "Product" : " Service";
    return { ...e, id: e.itemId };
  });

  const DeleteHandler = () => {
    setshowWarningAlert(false);
    DeleteItem(SelectedData.itemId)
      .then((res) => {
        if (res.status === 200) {
          dispatch({ type: DELETE_ITEM, payload: res.data });
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

  const options = ["Edit", "Copy", "Print", "Delete"];
  const filterNames = ["All", "Products", "Service"];
  const columns = [
    {},
    {
      field: "itemCode",
      header: "Code",
      sortable: true,
      dataKey: "itemCode",
    },
    {
      field: "itemName",
      header: "Name",
      sortable: true,
      dataKey: "itemName",
    },
    {
      field: "itemCatgoryTitle",
      header: "Category",
      sortable: true,
      dataKey: "itemCatgoryTitle",
    },

    {
      field: "itemTypeName",
      header: "Type",
      sortable: true,
      dataKey: "itemTypeName",
    },
    {
      field: "itemUnitTitle",
      header: "UOM",
      sortable: true,
      dataKey: "itemUnitTitle",
    },
    {
      field: "salePrice",
      header: "Sale Price",
      sortable: true,
      dataKey: "salePrice",
    },
    {
      field: "purchasePrice",
      header: "Purchase Price",
      sortable: true,
      dataKey: "purchasePrice",
    },

    {
      field: "Action",
      header: "Action",
      sortable: false,
      dataKey: "Action",
    },
  ];
  const EditItemHandler = (rowData) => {
    history.push(`product/productId=${rowData.itemId}`);
  };
  const AddNewItemHandler = () => {
    history.push("/product");
  };
  const FilterHandler = (event) => {
    setFilterValue(event.target.value);
    if (event.target.value === "Products") {
      const filteredArray = item.filter((e) => e.type === 0);
      setFilteredItem(filteredArray);
    } else if (event.target.value === "Service") {
      const filteredArray = item.filter((e) => e.type === 1);
      setFilteredItem(filteredArray);
    } else {
      setFilteredItem(item);
    }
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
      <BackDrop open={Spinner} />

      <BreadCrumb
        items={[
          {
            title: `Welcome ${
              user?.UserState?.username ?? user?.username ?? ""
            } to CoreB`,
            url: "/",
            type: "",
          },
          {
            title: "Product List",
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
          data={filterValue === "All" ? item.reverse() : filteredItem.reverse()}
          showTitle
          showExportButton
          setSelectedData={setSelectedData}
          setshowWarningAlert={setshowWarningAlert}
          AddNewHandler={AddNewItemHandler}
          ListTitle="Product List"
          MenuActionOptions={options}
          EditHandler={EditItemHandler}
          deleteIconStyle={classes.deleteIconStyle}
          editIconStyle={classes.editIconStyle}
          editFormPopUp="false"
          filterName={filterNames}
          filterValue={filterValue}
          FilterHandler={FilterHandler}
          showHeader={true}
          showCopyIcon
          showPrintIcon
        />
      </Card>
    </>
  );
}

export default ItemList;
