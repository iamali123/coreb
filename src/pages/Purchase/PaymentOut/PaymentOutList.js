import React, { useState, useEffect } from "react";
import {
  GetVouherOut,
  DeleteVouherOut,
} from "../../../Api/Actions/paymentOutActions";
import { GET_PAYMENT_OUT, DELETE_PAYMENT_OUT } from "../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import DataGrid from "../../../Components/GridDataTable";
import { useLocation, useParams, useHistory } from "react-router-dom";
import Card from "../../../Components/Card";
import BreadCrumb from "../../../Components/BreadCrumb1";
import Swal from "sweetalert2";
import dateformat from "dateformat";
import BackDrop from "../../../Components/BackDrop";
function PaymentOutList() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [Spinner, setSpinner] = useState(false);
  const dispatch = useDispatch();
  const pageName = location.pathname.match("PaymentOut");
  var companyId;
  const user = useSelector((state) => state.userReducer);
  companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;

  const paymentOutList = useSelector((state) => state.paymentOutReducer).map(
    (e) => {
      e.voucherDate = dateformat(e.voucherDate, "dd mmm,yyyy");
      return e;
    }
  );
  useEffect(() => {
    setSpinner(true);
    GetVouherOut(companyId)
      .then((res) => {
        setSpinner(false);
        dispatch({ type: GET_PAYMENT_OUT, payload: res.data });
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

  const DeletePaymentOutHandler = (rowData) => {
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
        DeleteVouherOut(rowData.id)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: DELETE_PAYMENT_OUT, payload: res.data });
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
      field: "voucherCode",
      header: "Receipt No",
      sortable: true,
      dataKey: "voucherCode",
    },
    {
      field: "voucherDate",
      header: "Date",
      sortable: true,
      dataKey: "voucherDate",
    },
    {
      field: "accountTitleDebit",
      header: "Account",
      sortable: true,
      dataKey: "accountTitleDebit",
    },
    {
      field: "accountTitleCredit",
      header: "Payment Type",
      sortable: true,
      dataKey: "accountTitleCredit",
    },
    {
      field: "description",
      header: "Description",
      sortable: false,
      dataKey: "description",
    },
    {
      field: "amount",
      header: "Amount",
      sortable: false,
      dataKey: "amount",
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
    },
  ];
  const EditHandler = (rowData) => {
    history.push(`/PaymentOut/PaymentOutId=${rowData.id}`);
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
            title: "PaymentOut List",
            url: null,
          },
        ]}
        show={true}
        pageName="Purchase"
      />
      <Card root={classes.root}>
        <DataGrid
          columns={columns}
          data={paymentOutList.reverse()}
          AddNewHandler={() => {
            history.push(`/PaymentOut/PaymentOutForm`);
          }}
          ListTitle="Payment Out List"
          showTitle={true}
          showExportButton={true}
          EditHandler={EditHandler}
          DeleteHandler={DeletePaymentOutHandler}
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

export default PaymentOutList;
