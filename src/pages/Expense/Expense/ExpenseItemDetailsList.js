import React from "react";
import { makeStyles } from "@material-ui/core";
import DataGrid from "../../../Components/GridDataTable";
import Swal from "sweetalert2";
const useStyles = makeStyles((theme) => ({
  CardrootStyle: {
    Width: 200,
    maxHeight: "100%",
    marginRight: "1%",
    paddingLeft: "2%",
    marginTop: "1%",
    marginBottom: "3%",
  },
  CardRoot: {
    width: "99%",
    marginTop: 50,
  },
  CancelButtonStyle: {
    marginRight: 20,
    backgroundColor: "#D4D4D4",
  },
  savebtnStyle: {
    backgroundColor: "#1976D2",
    padding: "8px 30px",
  },
}));

const ExpenseItemList = (props) => {
  const classes = useStyles();

  const columns = [
    {},
    {
      field: "expenseItemName",
      header: "Expense Item",
      sortable: true,
    },
    {
      field: "description",
      header: "Description",
      sortable: true,
    },

    {
      field: "quantity",
      header: "Quantity",
      sortable: true,
    },
    {
      field: "price",
      header: "Price",
      sortable: true,
    },

    {
      field: "amount",
      header: "Amount",
      sortable: true,
    },

    {
      field: "Action",
      header: "Action",
      sortable: false,
    },
  ];
  const DeleteExpenseItemMaterialHandler = (rowData) => {
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
        props.setExpenseMaterials(
          props.ExpenseMaterials.filter(
            (poMaterials) => poMaterials.expenseItemId !== rowData.expenseItemId
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
        data={props.ExpenseMaterials}
        setSelectedData={props.setSelectedData}
        showTitle={false}
        showExportButton={false}
        EditHandler={props.EditExpenseItemDetail}
        DeleteHandler={DeleteExpenseItemMaterialHandler}
        editFormPopUp="false"
        showHeader={false}
      />
    </>
  );
};

export default ExpenseItemList;
