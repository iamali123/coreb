import React from "react";
import { makeStyles } from "@material-ui/core";
import DataGrid from "../../../../Components/GridDataTable";

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

const BomMaterialList = (props) => {
  const classes = useStyles();

  const columns = [
    {},
    {
      field: "itemDetailName",
      header: "Item Name",
      sortable: true,
    },
    {
      field: "description",
      header: "Item Description",
      sortable: true,
    },
    {
      field: "unitName",
      header: "UOM",
      sortable: true,
    },

    {
      field: "quantity",
      header: "Quantity",
      sortable: true,
    },
    {
      field: "unitPrice",
      header: "Unit Price",
      sortable: true,
    },
    {
      field: "Action",
      header: "Action",
      sortable: false,
    },
  ];

  return (
    <>
      <DataGrid
        columns={columns}
        data={props.BOMMaterials}
        setSelectedData={props.setSelectedData}
        setshowWarningAlert={props.setshowWarningAlert}
        ListTitle="BOM Materials"
        showTitle={false}
        showExportButton={false}
        EditHandler={props.EditBomMaterialHandler}
        deleteIconStyle={classes.deleteIconStyle}
        editIconStyle={classes.editIconStyle}
        editFormPopUp="false"
        showHeader={false}
        showCopyIcon
        showPrintIcon
      />
    </>
  );
};

export default BomMaterialList;
