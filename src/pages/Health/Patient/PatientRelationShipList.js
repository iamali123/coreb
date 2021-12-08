import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import DataGrid from "../../../Components/GridDataTable";
import { useLocation, useHistory } from "react-router-dom";
import Swal from "sweetalert2";
function PatientRelationShipList({
  PatientRelations,
  setPatientRelations,
  SelectedData,
  setSelectedData,
  open,
}) {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [Spinner, setSpinner] = useState(false);
  const dispatch = useDispatch();
  var companyId;
  const user = useSelector((state) => state.userReducer);
  companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;
  const columns = [
    {},
    {
      field: "relativeName",
      header: "Relative Name",
      sortable: true,
      dataKey: "relativeName",
    },
    {
      field: "relation",
      header: "Relation",
      sortable: true,
      dataKey: "relation",
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
    },
  ];
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
        setPatientRelations(
          PatientRelations.filter(
            (patient) => patient.patientId !== rowData.patientId
          )
        );
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Deleted!",
          text: "Your file has been deleted.",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };
  return (
    <>
      <DataGrid
        columns={columns}
        data={PatientRelations}
        showTitle={false}
        showExportButton={false}
        EditHandler={open}
        DeleteHandler={DeleteHandler}
        editFormPopUp={"true"}
        showHeader
        showPagination={false}
        SelectedData={SelectedData}
        setSelectedData={setSelectedData}
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

export default PatientRelationShipList;
