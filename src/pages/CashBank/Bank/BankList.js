import React, { useState, useEffect } from "react";
import {
  GetBankVoucher,
  DeleteBankVoucher,
} from "../../../Api/Actions/bankVoucherActions";
import {
  GET_BANK_VOUCHERS,
  DELETE_BANK_VOUCHER,
} from "../../../Redux/Constants";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core";
import DataGrid from "../../../Components/GridDataTable";
import { useLocation, useHistory } from "react-router-dom";
import Card from "../../../Components/Card";
import BreadCrumb from "../../../Components/BreadCrumb";
import Swal from "sweetalert2";
import BackDrop from "../../../Components/BackDrop";
import dateFormat from "dateformat";

function BankVoucherList() {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const [Spinner, setSpinner] = useState(false);
  const dispatch = useDispatch();

  const pageName = location.pathname.match("Bank");
  var companyId;
  const user = useSelector((state) => state.userReducer);
  companyId =
    user.UserState === undefined ? user.companyId : user.UserState.companyId;

  const bankVoucherList = useSelector((state) => state.bankVoucherReducer).map(
    (e) => {
      e.voucherDate = dateFormat(e.voucherDate, "dd mmm,yyyy");
      e.status = e.voucherType == 5 ? "Deposit" : "Withdraw";
      return e;
    }
  );
  useEffect(() => {
    setSpinner(true);
    GetBankVoucher(companyId)
      .then((res) => {
        setSpinner(false);
        dispatch({ type: GET_BANK_VOUCHERS, payload: res.data });
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

  const DeleteBankVoucherHandler = (rowData) => {
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
        DeleteBankVoucher(rowData.id)
          .then((res) => {
            if (res.status === 200) {
              dispatch({ type: DELETE_BANK_VOUCHER, payload: res.data });
              setSpinner(false);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "Deleted!",
                text: "Delete successfully.",
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
      } else setSpinner(false);
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
      field: "accountTitle",
      header: "Account",
      sortable: true,
      dataKey: "accountTitle",
    },
    {
      field: "bankAccountTitle",
      header: "Bank",
      sortable: true,
      dataKey: "bankAccountTitle",
    },
    {
      field: "status",
      header: "Mode",
      sortable: true,
      dataKey: "status",
    },
    {
      field: "referenceNo",
      header: "Ref No",
      sortable: true,
      dataKey: "referenceNo",
    },
    {
      field: "description",
      header: "Description",
      sortable: true,
      dataKey: "description",
    },
    {
      field: "amount",
      header: "Amount",
      sortable: true,
      dataKey: "amount",
    },

    {
      field: "Action",
      header: "Action",
      sortable: false,
    },
  ];

  const EditHandler = (rowData) => {
    history.push(`/Bank/BankVoucherId=${rowData.id}`);
  };

  return (
    <>
      <BackDrop open={Spinner} />
      <BreadCrumb
        pathname={location.pathname}
        pageName={pageName !== null ? "Bank" : location.pathname}
        show={true}
      />
      <Card root={classes.root}>
        <DataGrid
          columns={columns}
          data={bankVoucherList.reverse()}
          AddNewHandler={() => {
            history.push(`/Bank/BankForm`);
          }}
          ListTitle="Bank Voucher List"
          showTitle={true}
          showExportButton={true}
          EditHandler={EditHandler}
          DeleteHandler={DeleteBankVoucherHandler}
          deleteIconStyle={classes.deleteIconStyle}
          editIconStyle={classes.editIconStyle}
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

export default BankVoucherList;
