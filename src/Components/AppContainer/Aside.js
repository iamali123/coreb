import React from "react";
import { useIntl } from "react-intl";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import { FaTachometerAlt, FaRegLaughWink } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCartPlus,
  faChartLine,
  faCartArrowDown,
  faCoins,
  faUsers,
  faGears,
  faWarehouse,
  faWallet,
  faHospitalUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const Aside = ({ collapsed, rtl, toggled, handleToggleSidebar }) => {
  const intl = useIntl();
  return (
    <ProSidebar
      image={false}
      rtl={rtl}
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div
          style={{
            padding: "24px",
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: 14,
            letterSpacing: "1px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {intl.formatMessage({ id: "sidebarTitle" })}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem icon={<FontAwesomeIcon icon={faHouse} />}>
            <Link to="/Dashboard">Dashboard</Link>
          </MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu
            title="Products"
            icon={<FontAwesomeIcon icon={faCartPlus} />}
          >
            <MenuItem>
              <Link to="/productList">Product</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/productBOM">Product BOM</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/product/productunit">Product Unit</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/product/productType">Product Types</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/product/productCategory">Product Category</Link>
            </MenuItem>
          </SubMenu>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu title="Sale" icon={<FontAwesomeIcon icon={faChartLine} />}>
            <MenuItem>
              <Link to="/CustomerList">Customers</Link>
            </MenuItem>

            <MenuItem>
              <Link to="/SalesQuotation">Quotation</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/SalesOrder">Sale Order</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/SalesInvoice">Sale Invoice</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/PatientInvoice">Patient Invoice</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/sale/saleReturn">Sale Return</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/POS">Point Of Sale</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/PaymentIn">Payment In</Link>
            </MenuItem>
          </SubMenu>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu
            title="Purchase"
            icon={<FontAwesomeIcon icon={faCartArrowDown} />}
          >
            <MenuItem>
              <Link to="/SupplierList">Suppliers</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/PurchaseOrder">Purchase Order</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/PurchaseInquiry">Purchase Inquiry</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/PurchaseBill">Purchase Bill</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/PurchaseReturn">Purchase Return</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/PaymentOut">Payment Out</Link>
            </MenuItem>
          </SubMenu>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu title="Expense" icon={<FontAwesomeIcon icon={faWallet} />}>
            <MenuItem>
              <Link to="/Expense">Expense</Link>
            </MenuItem>
            {/* <MenuItem>
              <Link to="/Expense/ExpenseItem">Expense Item</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/Expense/ExpenseCategory">Expense Category</Link>
            </MenuItem> */}
          </SubMenu>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu title="Accounts" icon={<FontAwesomeIcon icon={faCoins} />}>
            <MenuItem>
              {/* <Link to="/Accounts/Cash">Cash & Bank</Link> */}

              <Link to="/Cash">Cash</Link>
            </MenuItem>
            <MenuItem>
              {/* <Link to="/Accounts/Cash">Cash & Bank</Link> */}

              <Link to="/Bank">Bank</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/Accounts/ChartOfAccount">Chart Of Account</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/Accounts/OpeningBalance">Opening Balance</Link>
            </MenuItem>
          </SubMenu>
        </Menu>
        <Menu iconShape="circle">
          <SubMenu
            title="Human Resource"
            icon={<FontAwesomeIcon icon={faUsers} />}
          >
            <MenuItem>
              <Link to="/HumanResource/Employee">Employee</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/HumanResource/OpeningBalance">Opening Balance</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/HumanResource/Attendance">Attendance</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/HumanResource/Department">Department</Link>
            </MenuItem>
          </SubMenu>
        </Menu>
        <Menu iconShape="circle">
          <MenuItem icon={<FontAwesomeIcon icon={faGears} />}>
            <Link to="Production">Production</Link>
          </MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <MenuItem icon={<FontAwesomeIcon icon={faWarehouse} />}>
            <Link to="Inventory">Inventory</Link>
          </MenuItem>
        </Menu>
        {/***************************PATIENT*********************/}
        <Menu iconShape="circle">
          <MenuItem icon={<FontAwesomeIcon icon={faHospitalUser} />}>
            <Link to="/Patient">Patient</Link>
          </MenuItem>
        </Menu>
        <Menu iconShape="circle">
          <MenuItem icon={<FontAwesomeIcon icon={faHospitalUser} />}>
            <Link to="/Appointment">Appointment</Link>
          </MenuItem>
        </Menu>
      </SidebarContent>
      <SidebarFooter style={{ textAlign: "center" }}></SidebarFooter>
    </ProSidebar>
  );
};

export default Aside;
