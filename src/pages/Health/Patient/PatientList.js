import React, { useState, useEffect } from "react";
import {
  GetPatientsSummary,
  DeletePatient,
  GetPatients,
} from "../../../Api/Actions/Health/Patient/PatientActions";
import {
  GET_PATIENT_SUMMARY,
  DELETE_PATIENT_SUMMARY,
  DELETE_PATIENT,
  GET_PATIENTS,
} from "../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import DataGrid from "../../../Components/GridDataTable";
import { useLocation, useHistory } from "react-router-dom";
import Card from "../../../Components/Card";
import BreadCrumb from "../../../Components/BreadCrumb1";
import Swal from "sweetalert2";
import dateformat from "dateformat";
import BackDrop from "../../../Components/BackDrop";
function PatientList() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [Spinner, setSpinner] = useState(false);
  const dispatch = useDispatch();
  const pageName = location.pathname.match("Patient");
  var companyId;
  const user = useSelector((state) => state.userReducer);
  companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;

  const PatientList = useSelector((state) => state.patientSummaryReducer).map(
    (e) => {
      e.dateOfBirth = dateformat(e.dateOfBirth, "dd mmm,yyyy");
      e.appointment = dateformat(e.appointment, "dd mmm,yyyy");
      return e;
    }
  );
  useEffect(() => {
    setSpinner(true);
    GetPatientsSummary(companyId)
      .then((res) => {
        setSpinner(false);
        dispatch({ type: GET_PATIENT_SUMMARY, payload: res.data });
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
    GetPatients(companyId)
      .then((res) => {
        setSpinner(false);
        dispatch({ type: GET_PATIENTS, payload: res.data });
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
        setSpinner(true);
        DeletePatient(rowData.id)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: DELETE_PATIENT, payload: res.data });
              dispatch({ type: DELETE_PATIENT_SUMMARY, payload: res.data });
              setSpinner(false);
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
      }
    });
  };

  const columns = [
    {},
    {
      field: "patientNumber",
      header: "Patient No",
      sortable: true,
      dataKey: "patientNumber",
    },
    {
      field: "patientName",
      header: "Patient Name",
      sortable: true,
      dataKey: "patientName",
    },
    {
      field: "contactNumber",
      header: "Phone Number",
      sortable: true,
      dataKey: "contactNumber",
    },
    {
      field: "dateOfBirth",
      header: "DOB",
      sortable: true,
      dataKey: "dateOfBirth",
    },
    {
      field: "appointment",
      header: "Next Appointment",
      sortable: true,
      dataKey: "appointment",
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
    },
  ];
  const EditHandler = (rowData) => {
    history.push(`/Patient/PatientId=${rowData.id}`);
  };

  return (
    <>
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
            title: "Patient List",
            url: null,
          },
        ]}
        show={true}
        pageName="Patient"
      />
      <Card root={classes.root}>
        <DataGrid
          columns={columns}
          data={PatientList.reverse()}
          AddNewHandler={() => {
            history.push(`/Patient/PatientForm`);
          }}
          ListTitle="Patient List"
          showTitle={true}
          showExportButton={true}
          EditHandler={EditHandler}
          DeleteHandler={DeleteHandler}
          editFormPopUp="false"
          showHeader={true}
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

export default PatientList;
