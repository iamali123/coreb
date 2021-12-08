import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import "./style.css";
import { makeStyles } from "@material-ui/core";
import ButtonMUI from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import GetAppIcon from "@material-ui/icons/GetApp";
import { Typography } from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import RadioButtons from "../RadioButtons";
import { useLocation } from "react-router-dom";
import { Badge } from "primereact/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrashCan,
  faCopy,
  faPrint,
  faFileInvoice,
  faFileInvoiceDollar,
} from "@fortawesome/free-solid-svg-icons";
import MenuItem from "@material-ui/core//MenuItem";
import MenuButton from "../MenuButton";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
const useStyles = makeStyles((theme) => ({
  exportBtnStyles: {
    marginRight: 10,
    backgroundColor: "#C21212",
  },
  AddNewBtnStyle: {
    backgroundColor: "#1976D2",
    color: "#FFFFFF",
    marginRight: 5,
  },
  CardRoot: {
    width: "100%",
    marginTop: 30,
  },
}));
export default function Index(props) {
  const ITEM_HEIGHT = 48;
  const classes = useStyles();
  const location = useLocation();
  const dt = useRef(null);
  let menu = useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(10);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  let columns = props.columns.slice(1);
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };
  const [Data, setData] = useState({});
  const items = [
    {
      label: "Edit",
      icon: "pi pi-pencil",
      command: (e) => {
        if (props.setSelectedData !== undefined) {
          props.setSelectedData(Data);
        }
        if (props.editFormPopUp === "true") {
          props.EditHandler(true);
        } else {
          props.EditHandler(Data);
        }
        setData("");
      },
    },
    {
      label: "Delete",
      icon: "pi pi-trash",
      command: (e) => {
        if (props.DeleteHandler !== undefined) {
          props.DeleteHandler(Data);
        } else {
          props.setSelectedData(Data);
          props.setshowWarningAlert(true);
        }
        setData("");
      },
    },
    {
      label: "Copy",
      icon: "pi pi-copy",
      command: (e) => {
        setData("");
      },
    },
    {
      label: props.AutoGenerateIconTitle,
      icon: "pi pi-reply",
      command: (e) => {
        if (props.setSelectedData !== undefined) {
          props.setSelectedData(Data);
        }
        if (props.editFormPopUp === "true") {
          props.EditHandler(true);
        } else {
          props.AutoGenerateHandler(Data);
        }
        setData("");
      },
    },
    {
      label: "Print",
      icon: "pi pi-print",
      command: (e) => {
        setData("");
      },
    },
  ];
  const template2 = {
    layout: "RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink",
    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 5, value: 5 },
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
      ];

      return (
        <>
          <span
            className="p-mx-1"
            style={{ color: "var(--text-color)", userSelect: "none" }}
          >
            Items per page:{" "}
          </span>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
            appendTo={document.body}
          />
        </>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "120px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      );
    },
  };
  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setSelectedColumns(orderedSelectedColumns);
  };
  const exportCSV = (selectionOnly) => {
    dt.current.exportCSV(props.data);
    handleClose();
  };

  const exportPdf = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        var doc = new jsPDF.default(0, 0);

        doc.autoTable(
          columns.filter((e) => e.header !== "Action"),
          props.data
        );
        doc.save(props.ListTitle);
      });
      handleClose();
    });
  };
  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(props.data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      saveAsExcelFile(excelBuffer, props.ListTitle);
    });
  };

  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((FileSaver) => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(data, fileName + new Date().getTime() + EXCEL_EXTENSION);
      handleClose();
    });
  };
  function actionTemplate(rowData, column) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <div>
          {props.showPrintIcon && (
            <FontAwesomeIcon
              icon={faPrint}
              fontSize="medium"
              color="#1976D2"
              cursor="pointer"
              title="Print"
            // onClick={() => {
            //   props.setSelectedData(rowData);
            //   props.setshowWarningAlert(true);
            // }}
            />
          )}
        </div>

        <div>
          {props.showCopyIcon && (
            <FontAwesomeIcon
              icon={faCopy}
              fontSize="medium"
              color="#1976D2"
              cursor="pointer"
              title="Copy"
            />
          )}
        </div>
        {/* {rowData.status === "Open" && ( */}
        <div>
          <FontAwesomeIcon
            icon={faPenToSquare}
            fontSize="medium"
            color="#1976D2"
            cursor="pointer"
            title="Edit"
            onClick={() => {
              if (props.setSelectedData !== undefined) {
                props.setSelectedData(rowData);
              }
              if (props.editFormPopUp === "true") {
                props.EditHandler(true);
              } else {
                props.EditHandler(rowData);
              }
            }}
          />
        </div>
        {/* )} */}
        {/* {rowData.status === "Open" && ( */}
        <div>
          <FontAwesomeIcon
            icon={faTrashCan}
            fontSize="medium"
            color="#1976D2"
            cursor="pointer"
            title="Delete"
            onClick={() => {
              if (props.DeleteHandler !== undefined) {
                props.DeleteHandler(rowData);
              } else {
                props.setSelectedData(rowData);
                props.setshowWarningAlert(true);
              }
            }}
          />
        </div>
        {/* )} */}
        <div>
          {props.showAutoGenerateIcon && (
            <FontAwesomeIcon
              icon={faFileInvoice}
              fontSize="medium"
              color="#1976D2"
              cursor="pointer"
              title={props.AutoGenerateIconTitle}
              onClick={() => {
                if (props.setSelectedData !== undefined) {
                  props.setSelectedData(rowData);
                }
                if (props.editFormPopUp === "true") {
                  props.EditHandler(true);
                } else {
                  props.AutoGenerateHandler(rowData);
                }
              }}
            />
          )}
        </div>
        <div>
          {props.showMakePayment && (
            <FontAwesomeIcon
              icon={faFileInvoiceDollar}
              fontSize="medium"
              color="#1976D2"
              cursor="pointer"
              title={props.AutoGenerateIconTitle}
              onClick={() => {
                if (props.setSelectedData !== undefined) {
                  props.setSelectedData(rowData);
                }
                if (props.editFormPopUp === "true") {
                  props.EditHandler(true);
                } else {
                  props.AutoGenerateHandler(rowData);
                }
              }}
            />
          )}
        </div>
      </div>
    );
  }
  function chipsTemplate(rowData) {
    const chipData = rowData.ItemVariantValues.map((item) => {
      return item.valueName;
    }).filter((item) => item !== null);
    return (
      <div>
        {chipData.map((item) => (
          <Badge
            value={item}
            style={{
              marginRight: 10,
              fontSize: 14,
              borderRadius: 10,
              fontWeight: "normal",
              fontFamily: "Roboto",
              color: "#1A59D6",
              backgroundColor: "#DEE9FF",
            }}
          ></Badge>
        ))}
      </div>
    );
  }
  function badgeTemplate(rowData) {
    return rowData.status === "Open" ||
      rowData.status === "Paid" ||
      rowData.status === "Deposit" ||
      rowData.status === "Add" ? (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Badge
          value={rowData.status}
          style={{
            marginRight: 10,
            fontSize: 14,
            borderRadius: 10,
            fontWeight: "normal",
            fontFamily: "Roboto",
            color: "#098215",
            backgroundColor: "#BBD9B4",
          }}
        ></Badge>
      </div>
    ) : rowData.status === "Close" ||
      rowData.status === "UnPaid" ||
      rowData.status === "Withdraw" ||
      rowData.status === "Reduce" ? (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Badge
          value={rowData.status}
          style={{
            marginRight: 10,
            fontSize: 14,
            borderRadius: 10,
            fontWeight: "normal",
            fontFamily: "Roboto",
            color: "#C21212",
            backgroundColor: "#EE9797",
          }}
        ></Badge>
      </div>
    ) : (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Badge
          value={rowData.status}
          style={{
            marginRight: 10,
            fontSize: 14,
            borderRadius: 10,
            fontWeight: "normal",
            fontFamily: "Roboto",
            color: "#CB8700",
            backgroundColor: "#FFF4AA",
          }}
        ></Badge>
      </div>
    );
  }

  function menuTemplate(rowData) {
    return (
      <>
        <Menu model={items} ref={menu} id="popup_menu" popup />
        <Button
          style={{ background: "transparent", color: "black", border: "none" }}
          icon="pi pi-ellipsis-v"
          onClick={(event) => {
            menu.current.toggle(event);
            setData(rowData);
          }}
          aria-controls="popup_menu"
          aria-haspopup
        />
      </>
    );
  }

  const header = (
    <>
      <div
        className="table-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          className="p-m-0"
          style={{
            fontSize: "15px",
            fontFamily: "Roboto",
            fontWeight: "normal",
            color: "#857D7D",
          }}
        >
          {props.showTitle && props.ListTitle}

          {props.filterName !== undefined && (
            <>
              <Typography style={{ fontFamily: "Roboto" }}></Typography>
              <RadioButtons
                filterName={props.filterName}
                filterValue={props.filterValue}
                FilterHandler={props.FilterHandler}
              />
            </>
          )}
        </Typography>

        <div>
          {props.AddNewHandler !== undefined && (
            <ButtonMUI
              classes={{ root: classes.AddNewBtnStyle }}
              variant="contained"
              color="primary"
              onClick={() => {
                props.AddNewHandler(true);
              }}
            >
              <AddIcon fontSize="small" />
              Add New
            </ButtonMUI>
          )}
          {props.showExportButton === true && (
            <>
              <ButtonMUI
                aria-controls="fade-menu-2"
                aria-haspopup="true"
                onClick={handleClick}
                variant="contained"
                color="secondary"
                classes={{ root: classes.exportBtnStyles }}
              >
                <GetAppIcon fontSize="small" /> Export
              </ButtonMUI>
              <Menu
                id="fade-menu-2"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
              >
                <MenuItem onClick={exportPdf}>PDF </MenuItem>
                <MenuItem onClick={exportExcel}>EXCEL </MenuItem>
                <MenuItem onClick={exportCSV}>CSV </MenuItem>
              </Menu>
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  type="search"
                  onInput={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search..."
                />
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );

  const columnComponents = selectedColumns.map((col, index) => {
    if (col.field === "Action") {
      if (props.ActionMenu) {
        return (
          <Column
            body={menuTemplate}
            className="p-column-title"
            field={col.field}
            header={col.header}
            headerStyle={{
              width: "120px",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
            style={{
              fontSize: "14px",
              fontFamily: "Roboto",
            }}
          />
        );
      } else {
        return (
          <Column
            body={actionTemplate}
            className="p-column-title"
            field={col.field}
            header={col.header}
            headerStyle={{
              width: "120px",
              fontWeight: "bold",
              fontSize: "0.8rem",
            }}
            style={{
              fontSize: "14px",
              fontFamily: "Roboto",
            }}
          />
        );
      }
    }
    if (col.field === "Chips") {
      return (
        <Column
          body={chipsTemplate}
          className="p-column-title"
          field={col.field}
          header={col.header}
          style={{
            fontSize: "14px",
            fontFamily: "Roboto",
          }}
        />
      );
    }
    if (col.field === "status") {
      return (
        <Column
          body={badgeTemplate}
          className="p-column-title"
          field={col.field}
          header={col.header}
          style={{
            fontSize: "14px",
            fontFamily: "Roboto",
          }}
        />
      );
    } else
      return (
        <Column
          field={col.field}
          className="p-column-title"
          header={col.header}
          sortable={col.sortable && true}
          style={{
            fontSize: "0.8rem",
            fontFamily: "Roboto",
          }}
        />
      );
  });
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <ButtonMUI
          label="Add New"
          icon="pi pi-plus"
          className="p-button-success p-mr-2"
          onClick={() => {
            props.AddNewHandler(true);
          }}
        />
        <ButtonMUI
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => { }}
          disabled={!selectedProducts || !selectedProducts.length}
        />
      </React.Fragment>
    );
  };
  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <ButtonMUI
          label="Export CSV"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
          style={{ fontSize: 13, fontWeight: "bold" }}
        />
        <ButtonMUI
          label="Export PDF"
          icon="pi pi-upload"
          className=" p-ml-1 p-button-danger"
          onClick={exportPdf}
          style={{ fontSize: 13, fontWeight: "bold" }}
        />
        <ButtonMUI
          label="Export EXCEL"
          icon="pi pi-upload"
          className="p-ml-1 p-button-success"
          onClick={exportExcel}
          style={{ fontSize: 13, fontWeight: "bold" }}
        />
      </React.Fragment>
    );
  };

  return (
    <div className="datatable-responsive-demo">
      <div className="card">
        <DataTable
          className="p-datatable-responsive-demo"
          header="Responsive"
          value={props.data}
          header={props.showHeader && header}
          paginator={props.showPagination == false ? false : true}
          paginatorTemplate={template2}
          first={first2}
          rows={rows2}
          selectionMode="checkbox"
          selection={selectedProducts}
          onSelectionChange={(e) => {
            setSelectedProducts(e.value);
          }}
          dataKey="id"
          onPage={onCustomPage2}
          paginatorClassName="p-jc-end"
          className="p-mt-3"
          showGridlines
          stripedRows
          scrollable
          scrollHeight="500px"
          ref={dt}
          globalFilter={globalFilter}
        >
          {props.columns.map((col, index) => {
            if (index === 0 && col.field !== "checkBox") {
              return (
                <Column
                  selectionMode="multiple"
                  headerStyle={{ width: "3em" }}
                  className="p-column-title"
                ></Column>
              );
            }
          })}
          {columnComponents}
        </DataTable>
      </div>
    </div>
  );
}
