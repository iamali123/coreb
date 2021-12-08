import React, { useState, useEffect } from "react";
import { getUser } from "../../../../Api/Actions/registrationActions";
import {
  GetVariants,
  DeleteVariant,
} from "../../../../Api/Actions/variantActions";
import { GET_VARIANTS, DELETE_VARIANT } from "../../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import VariantForm from "../../Items/Variants/variantForm";
import DataGrid from "../../../../Components/GridDataTable";
import { useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
function VariantList(props) {
  const classes = useStyles();
  const location = useLocation();
  const params = useParams();
  const [SelectedData, setSelectedData] = useState("");
  const [ShowSpinner, setShowSpinner] = useState(false);
  const dispatch = useDispatch();
  const pageName = location.pathname.match("product");
  var companyId;
  var itemId;
  var userRecord = getUser();
  companyId = userRecord.companyId;
  if (params.productId !== null || params.productId !== undefined) {
    itemId = params.productId;
  }

  const variants = useSelector((state) => state.variantReducer).map(
    (variant, index) => {
      return {
        id: variant.id,
        AttributeName: variant.attributeName,
        ItemId: variant.itemId,
        CompanyId: variant.companyId,
        ItemVariantValues: variant.itemVariantValues,
      };
    }
  );

  useEffect(() => {
    GetVariants(companyId, itemId)
      .then((res) => {
        dispatch({ type: GET_VARIANTS, payload: res.data });
      })
      .catch((error) => {});
  }, []);

  const DeleteHandler = (rowData) => {
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
        DeleteVariant(rowData.id)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: DELETE_VARIANT, payload: res.data });
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
      field: "AttributeName",
      header: "Attribute",
      sortable: true,
      width: 150,
    },
    {
      field: "Chips",
      header: "Values",
      sortable: false,
      width: 500,
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
      width: 150,
    },
  ];
  const [ShowVariantForm, setShowVariantForm] = useState(false);
  const ModalCloseHandler = () => {
    setShowVariantForm(false);
    setSelectedData("");
  };
  return (
    <>
      {ShowVariantForm === true && (
        <VariantForm
          open={ShowVariantForm}
          close={ModalCloseHandler}
          SelectedData={SelectedData}
          setSelectedData={setSelectedData}
          setShowSpinner={props.setShowSpinner}
        />
      )}

      <DataGrid
        columns={columns}
        data={variants}
        setSelectedData={setSelectedData}
        AddNewHandler={setShowVariantForm}
        ListTitle="Variants"
        showTitle={false}
        showExportButton={false}
        EditHandler={setShowVariantForm}
        DeleteHandler={DeleteHandler}
        deleteIconStyle={classes.deleteIconStyle}
        editIconStyle={classes.editIconStyle}
        editFormPopUp="true"
        showHeader={true}
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

export default VariantList;
