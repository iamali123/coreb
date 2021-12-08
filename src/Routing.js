import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import BackDrop from "./Components/BackDrop";
import WelcomView from "./Components/WelcomView";
import SignUp from "./Components/Registration/SignUp";
import SignUpScreen from "./Components/Registration/SignUpScreen";
import SignUpVerificationCode from "./Components/Registration/SignUpVerificationCode";
import SignUpRegistration from "./Components/Registration/SignUpRegistration";
import LogIn from "./Components/Registration/LogIn";
import RatesForm from "./pages/Item/Rates/RatesForm";
import UnitList from "./pages/Item/Units/UnitList";
import UnitForm from "./pages/Item/Units/UnitForm";
import ItemForm from "./pages/Item/Items/form";
import ItemTypeList from "./pages/Item/ItemType/itemTypeList";
import ItemList from "./pages/Item/Items/ItemsList";
import Dashboard from "./pages/Dashboard/Dashboard";
import CustomerList from "./pages/Sale/Customer/List";
import CustomerForm from "./pages/Sale/Customer/Form";
import SupplierForm from "./pages/Purchase/Supplier/Form";
import BOMForm from "./pages/Item/Items/ItemBom/BomForm";
import { Reports, ReportsOne, ReportsTwo, ReportsThree } from "./pages/Reports";
import Team from "./pages/Team";
import AppContainer from "./Components/AppContainer";
import { useSelector, useDispatch } from "react-redux";
import CategoryList from "./pages/Item/Category/CategoryList";
import SupplierList from "./pages/Purchase/Supplier/List";
import PurchaseInquiryForm from "./pages/Purchase/PurchaseInquiry/PurchaseInquiryForm";
import PurchaseInquiryList from "./pages/Purchase/PurchaseInquiry/PurchaseInquiryList";
import PurchaseBillForm from "./pages/Purchase/PurchaseBill/PurchaseBillForm";
import PurchaseOrderList from "./pages/Purchase/PurchaseOrder/PurchaseOrderList";
import PurchaseOrderForm from "./pages/Purchase/PurchaseOrder/PurchaseOrderForm";
import SalesOrderList from "./pages/Sale/SalesOrder/SalesOrderList";
import SalesOrderForm from "./pages/Sale/SalesOrder/SalesOrderForm";
import SalesInvoiceList from "./pages/Sale/SalesInvoice/SalesInvoiceList";
import SalesInvoiceForm from "./pages/Sale/SalesInvoice/SalesInvoiceForm";
import SalesQuotationList from "./pages/Sale/SalesQuotation/SalesQuotationList";
import SalesQuotationForm from "./pages/Sale/SalesQuotation/SalesQuotationForm";
import PurchaseBillList from "./pages/Purchase/PurchaseBill/PurchaseBillList";
import PaymentOutList from "./pages/Purchase/PaymentOut/PaymentOutList";
import PaymentOutForm from "./pages/Purchase/PaymentOut/PaymentOutForm";
import PaymentInList from "./pages/Sale/PaymentIn/PaymentInList";
import PaymentInForm from "./pages/Sale/PaymentIn/PaymentInForm";
import PatientList from "./pages/Health/Patient/PatientList";
import PatientForm from "./pages/Health/Patient/PatientForm";
import Appointment from "./pages/Health/Appointment/Appointment";
import ExpenseList from "./pages/Expense/Expense/ExpenseList";
import ExpenseForm from "./pages/Expense/Expense/ExpenseForm";
import CashList from "./pages/CashBank/Cash/CashList";
import CashForm from "./pages/CashBank/Cash/CashForm";
import BankVoucherList from "./pages/CashBank/Bank/BankList";
import BankVoucherForm from "./pages/CashBank/Bank/BankForm";
import POSList from "./pages/Sale/PointOfSale/POSList";
import POSForm from "./pages/Sale/PointOfSale/POSForm";
import PatientInvoice from "./pages/Health/Invoice/PatientInvoice";
import PatientInvoiceList from "./pages/Health/Invoice/PatientInvoiceList";
import PatientDetails from "./pages/Health/Medication/MiniAside/PatientDetails";
import PatientFile from "./pages/Health/Medication/MiniAside/PatientFile";
import PatientInvoices from "./pages/Health/Medication/MiniAside/PatientInvoice";
import TreatmentNotes from "./pages/Health/Medication/MiniAside/TreatmentNote";
import Appointments from "./pages/Health/Medication/MiniAside/Appointments";

import { GetCategories } from "./Api/Actions/categoryActions";
import { GetCustomers } from "./Api/Actions/customerActions";
import { GetProductType } from "./Api/Actions/productTypeActions";
import { GetUnits } from "./Api/Actions/unitActions";
import { GetSuppliers } from "./Api/Actions/supplierActions";
import { GetCountries } from "./Api/Actions/countryActions";
import { GetBanks } from "./Api/Actions/bankActions";
import { GetChartOfAccount } from "./Api/Actions/chartOfAccountsActions";
import { GetItems } from "./Api/Actions/itemActions";
import {
  GetShipmentMode,
  GetShipmentTerm,
} from "./Api/Actions/shipmentActions";
import { GetPaymentTerm } from "./Api/Actions/paymentTermActions";
import { GetAppointmentType } from "./Api/Actions/Health/Appointment/AppointmentTypeAction";
import { GetAppointment } from "./Api/Actions/Health/Appointment/AppointmentAction";
import { GetDoctors } from "./Api/Actions/Health/Appointment/DoctorsAction";
import {
  GET_UNITS,
  GET_CATEGORY,
  GET_PRODUCT_TYPE,
  GET_CUSTOMERS,
  GET_CURRENCY,
  GET_SUPPLIERS,
  GET_COUNTRY,
  GET_SHIPMENT_TERM,
  GET_SHIPMENT_MODE,
  GET_PAYMENT_TERM,
  GET_BANK_ACCOUNT,
  GET_CHART_OF_ACCOUNT,
  GET_EXPENSE_CATEGORYS,
  GET_DOCTORS,
  GET_APPOINTMENTTYPES,
  GET_PATIENT_SUMMARY,
  GET_PATIENTS,
  GET_ITEMS,
  GET_APPOINTMENTS,
} from "./Redux/Constants";
import { GetCurrency } from "./Api/Actions/currencyActions";
import { GetExpenseCategorys } from "./Api/Actions/expenseCategoryActions";
import {
  GetPatients,
  GetPatientsSummary,
} from "./Api/Actions/Health/Patient/PatientActions";
import TreatmentNoteForm from "./pages/Health/Medication/MiniAsidePages/TreatmentNoteForm";

const Routing = () => {
  const user = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = React.useState(true);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 15000);
  // });
  var companyId;
  useEffect(() => {
    if (user !== null) {
      if (user.UserState !== undefined) {
        companyId = user.UserState.companyId;
      } else {
        companyId = user.companyId;
      }
      GetChartOfAccount(companyId)
        .then((res) => {
          dispatch({ type: GET_CHART_OF_ACCOUNT, payload: res.data });
          setIsLoading(false);
        })
        .catch((error) => {});
      GetUnits(companyId)
        .then((res) => {
          dispatch({ type: GET_UNITS, payload: res.data });
        })
        .catch((error) => {});
      GetCategories(companyId)
        .then((res) => {
          dispatch({ type: GET_CATEGORY, payload: res.data });
        })
        .catch((error) => {});
      GetProductType(companyId)
        .then((res) => {
          dispatch({ type: GET_PRODUCT_TYPE, payload: res.data });
        })
        .catch((error) => {});
      GetCustomers(companyId)
        .then((res) => {
          dispatch({ type: GET_CUSTOMERS, payload: res.data });
        })
        .catch((error) => {});
      GetCurrency()
        .then((res) => {
          dispatch({ type: GET_CURRENCY, payload: res.data });
        })
        .catch((error) => {});
      GetItems(companyId)
        .then((res) => {
          dispatch({ type: GET_ITEMS, payload: res.data });
        })
        .catch((error) => {});
      GetSuppliers(companyId)
        .then((res) => {
          dispatch({ type: GET_SUPPLIERS, payload: res.data });
        })
        .catch((error) => {});
      GetCountries()
        .then((res) => {
          dispatch({ type: GET_COUNTRY, payload: res.data });
        })
        .catch((error) => {});

      GetShipmentTerm(companyId)
        .then((res) => {
          dispatch({ type: GET_SHIPMENT_TERM, payload: res.data });
        })
        .catch((error) => {});
      GetShipmentMode(companyId)
        .then((res) => {
          dispatch({ type: GET_SHIPMENT_MODE, payload: res.data });
        })
        .catch((error) => {});
      GetPaymentTerm(companyId)
        .then((res) => {
          dispatch({ type: GET_PAYMENT_TERM, payload: res.data });
        })
        .catch((error) => {});
      GetBanks(companyId)
        .then((res) => {
          dispatch({ type: GET_BANK_ACCOUNT, payload: res.data });
        })
        .catch((error) => {});

      GetExpenseCategorys(companyId)
        .then((res) => {
          dispatch({ type: GET_EXPENSE_CATEGORYS, payload: res.data });
        })
        .catch((error) => {});
      GetDoctors(companyId)
        .then((res) => {
          dispatch({ type: GET_DOCTORS, payload: res.data });
        })
        .catch((error) => {});
      GetAppointmentType(companyId)
        .then((res) => {
          dispatch({ type: GET_APPOINTMENTTYPES, payload: res.data });
        })
        .catch((error) => {});
      GetAppointment(companyId)
        .then((res) => {
          dispatch({ type: GET_APPOINTMENTS, payload: res.data });
        })
        .catch((error) => {});
      GetPatients(companyId)
        .then((res) => {
          dispatch({ type: GET_PATIENTS, payload: res.data });
        })
        .catch((error) => {});
    }
  }, [user]);

  {
    return user === null ? (
      <BrowserRouter>
        <Redirect to="/Login" />
        <Switch>
          <Route exact path="/" component={WelcomView} />
          <Route path="/Login" component={LogIn} />
          <Route path="/Signup" component={SignUp} />
          <Route path="/SignupScreen" component={SignUpScreen} />
          <Route
            path="/SignupVerficationCode"
            component={SignUpVerificationCode}
          />
          <Route path="/SignUpRegistration" component={SignUpRegistration} />
        </Switch>
      </BrowserRouter>
    ) : (
      <BrowserRouter>
        <Switch>
          <AppContainer>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/Dashboard" component={Dashboard} />

            {/* ************************* PRODUCT *********************** */}

            <Route path="/product" exact component={ItemForm} />
            <Route path="/product/productId=:productId" component={ItemForm} />
            <Route
              path="/productList"
              render={() => (
                <PageLoader
                  isLoading={isLoading}
                  ComponentToRender={ItemList}
                />
              )}
              // component={ItemList}
            />
            <Route path="/product/productUnit" component={UnitList} />
            <Route path="/product/ProductBOM" exact component={BOMForm} />
            <Route
              path="/product/ProductBOM/ProductId=:ProductId/BomId=:BomId"
              component={BOMForm}
            />
            <Route
              exact
              path="/product/ProductBOM/ProductId=:ProductId"
              component={BOMForm}
            />
            <Route path="/product/productType" component={ItemTypeList} />
            <Route path="/product/unitForm" component={UnitForm} />
            <Route path="/product/productCategory" component={CategoryList} />

            {/* ************************* SUPPLIER *********************** */}

            <Route path="/supplierList" exact component={SupplierList} />
            <Route path="/supplierForm" exact component={SupplierForm} />
            <Route
              path="/supplierForm/Supplier=:Supplier"
              component={SupplierForm}
            />

            {/* *************************Purchase Order*********************** */}

            <Route path="/purchase/purchaseBill" component={Reports} />
            <Route exact path="/PurchaseOrder" component={PurchaseOrderList} />
            <Route
              exact
              path="/PurchaseOrder/PurchaseOrderForm"
              component={PurchaseOrderForm}
            />
            <Route
              path="/PurchaseOrder/PurchaseOrderId=:PurchaseOrderId"
              component={PurchaseOrderForm}
            />

            {/* *****************************Purchase Inquiry*************************** */}

            <Route
              exact
              path="/PurchaseInquiry"
              component={PurchaseInquiryList}
            />
            <Route
              exact
              path="/PurchaseInquiry/PurchaseInquiryForm"
              component={PurchaseInquiryForm}
            />
            <Route
              path="/PurchaseInquiry/PurchaseInquiryId=:PurchaseInquiryId"
              component={PurchaseInquiryForm}
            />
            <Route
              path="/PurchaseOrder/PurchaseInquiryId=:PurchaseInquiryId"
              component={PurchaseOrderForm}
            />

            {/* **********************Purchase Bill*************************** */}

            <Route exact path="/PurchaseBill" component={PurchaseBillList} />
            <Route
              exact
              path="/PurchaseBill/PurchaseBillForm"
              component={PurchaseBillForm}
            />
            <Route
              path="/PurchaseBill/PurchaseBillId=:PurchaseBillId"
              component={PurchaseBillForm}
            />
            <Route
              path="/PurchaseBill/PurchaseOrderId=:PurchaseOrderId"
              component={PurchaseBillForm}
            />

            {/* **********************Payment Out*************************** */}

            <Route exact path="/PaymentOut" component={PaymentOutList} />
            <Route
              exact
              path="/PaymentOut/PaymentOutForm"
              component={PaymentOutForm}
            />
            <Route
              path="/PaymentOut/PaymentOutId=:PaymentOutId"
              component={PaymentOutForm}
            />
            <Route
              path="/PaymentOut/PurchaseBillId=:PurchaseBillId"
              component={PaymentOutForm}
            />
            <Route exact path="/customerList" component={CustomerList} />
            <Route exact path="/Customer" component={CustomerForm} />
            <Route
              path="/Customer/Customer=:Customer"
              component={CustomerForm}
            />

            {/* <Route path="/sale/saleInvoice" component={ReportsOne} /> */}

            <Route path="/sale/saleInvoice" component={ReportsOne} />

            <Route
              exact
              path="/SalesQuotation"
              component={SalesQuotationList}
            />
            <Route
              path="/SalesQuotation/SalesQuotationForm"
              component={SalesQuotationForm}
            />

            <Route
              path="/SalesQuotation/SalesQuotationId=:SalesQuotationId"
              component={SalesQuotationForm}
            />

            {/* ==================== SALES ORDER ====================*/}
            <Route exact path="/SalesOrder" component={SalesOrderList} />
            <Route
              path="/SalesOrder/SalesOrderForm"
              component={SalesOrderForm}
            />

            <Route
              path="/SalesOrder/SalesOrderId=:SalesOrderId"
              component={SalesOrderForm}
            />

            <Route
              path="/SalesOrder/SalesQuotationId=:SalesQuotationId"
              component={SalesOrderForm}
            />

            {/* ==================== SALES INVOICE ====================*/}

            <Route exact path="/SalesInvoice" component={SalesInvoiceList} />

            <Route
              path="/SalesInvoice/SalesInvoiceForm"
              component={SalesInvoiceForm}
            />

            <Route
              path="/SalesInvoice/SalesInvoiceId=:SalesInvoiceId"
              component={SalesInvoiceForm}
            />

            <Route
              path="/SalesInvoice/SalesOrderId=:SalesOrderId"
              component={SalesInvoiceForm}
            />

            <Route exact path="/PaymentIn" component={PaymentInList} />

            <Route
              exact
              path="/PaymentIn/PaymentInForm"
              // component={PaymentInForm}
              render={() => (
                <PageLoader
                  isLoading={isLoading}
                  ComponentToRender={PaymentInForm}
                />
              )}
            />
            <Route
              path="/PaymentIn/PaymentInId=:PaymentInId"
              // component={PaymentInForm}
              render={() => (
                <PageLoader
                  isLoading={isLoading}
                  ComponentToRender={PaymentInForm}
                />
              )}
            />

            <Route
              path="/PaymentIn/SalesInvoiceId=:SalesInvoiceId"
              // component={PaymentInForm}
              render={() => (
                <PageLoader
                  isLoading={isLoading}
                  ComponentToRender={PaymentInForm}
                />
              )}
            />

            {/* ==================== POINT OF SALES ====================*/}

            <Route exact path="/POS" component={POSList} />
            <Route path="/POS/POSForm" component={POSForm} />
            <Route path="/POS/PosSalesId=:PosSalesId" component={POSForm} />

            {/* ==================== EXPENSE ====================*/}

            <Route exact path="/Expense" component={ExpenseList} />
            <Route exact path="/Expense/ExpenseForm" component={ExpenseForm} />
            <Route
              path="/Expense/ExpenseId=:ExpenseId"
              component={ExpenseForm}
            />
            {/* ==================== PATIENT ====================*/}

            <Route exact path="/Patient" component={PatientList} />
            <Route
              exact
              path="/Patient/PatientForm"
              render={() => (
                <PageLoader
                  isLoading={isLoading}
                  ComponentToRender={PatientForm}
                />
              )}
            />
            <Route
              path="/Patient/PatientId=:PatientId"
              render={() => (
                <PageLoader
                  isLoading={isLoading}
                  ComponentToRender={PatientForm}
                />
              )}
            />
            {/* ==================== APPOINTMENT ====================*/}

            <Route exact path="/Appointment" component={Appointment} />
            <Route
              exact
              path="/PatientInvoice/AppointmentId=:AppointmentId"
              component={PatientInvoice}
            />
            <Route
              exact
              path="/PatientInvoice/EditPatientInvoiceId=:EditPatientInvoiceId"
              component={PatientInvoice}
            />
            <Route
              exact
              path="/PatientInvoice"
              component={PatientInvoiceList}
            />
            <Route
              exact
              path="/PatientInvoice/NewPatientInvoiceForm"
              component={PatientInvoice}
            />
            <Route
              path="/PaymentIn/PatientInvoiceId=:PatientInvoiceId"
              component={PaymentInForm}
            />

            {/* ==================== CASH ====================*/}

            <Route exact path="/Cash" component={CashList} />
            <Route exact path="/Cash/CashForm" component={CashForm} />
            <Route path="/Cash/CashId=:CashId" component={CashForm} />

            {/* ==================== BANK VOUCHER ====================*/}

            <Route exact path="/Bank" component={BankVoucherList} />
            <Route exact path="/Bank/BankForm" component={BankVoucherForm} />
            <Route
              path="/Bank/BankVoucherId=:BankVoucherId"
              component={BankVoucherForm}
            />

            <Route path="/sale/deliveryChallan" component={ReportsThree} />
            <Route path="/sale/estimate" component={ReportsThree} />
            <Route path="/sale/saleReturn" component={ReportsThree} />

            <Route path="/rates" component={RatesForm} />
            <Route path="/cashBank" exact component={Team} />
            <Route path="/cashbank/bankAccount" component={Team} />
            <Route path="/cashbank/cashInHand" component={Team} />
            <Route path="/cashbank/cheques" component={Team} />
            <Route path="/cashbank/loanAccounts" component={Team} />

            {/* ==================== MEDICATION ====================*/}
            {/* <Route exact path="/PatientDetails" component={PatientDetails} /> */}
            <Route
              path="/PatientDetails/PatientId=:PatientId"
              component={PatientDetails}
            />
            <Route
              path="/PatientFiles/PatientId=:PatientId"
              component={PatientFile}
            />
            <Route
              path="/PatientInvoices/PatientId=:PatientId"
              component={PatientInvoices}
            />
            <Route
              path="/TreatmentNotes/PatientId=:PatientId"
              component={TreatmentNotes}
            />
            <Route
              path="/TreatmentNotes/TreatmentNoteForm/PatientId=:PatientId"
              component={TreatmentNoteForm}
            />
            <Route
              path="/Appointments/PatientId=:PatientId"
              component={Appointments}
            />
          </AppContainer>
        </Switch>
      </BrowserRouter>
    );
  }
};

function PageLoader({ isLoading, ComponentToRender }) {
  if (isLoading) {
    return <BackDrop open={true} />;
  }
  return <ComponentToRender />;
}

export default Routing;
