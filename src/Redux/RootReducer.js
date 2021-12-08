import { combineReducers } from "redux";
import itemReducer from "./Reducers/itemReducer";
import unitReducer from "./Reducers/unitReducer";
import userReducer from "./Reducers/userReducer";
import categoryReducer from "./Reducers/categoryReducer";
import productTypeReducer from "./Reducers/productTypeReducer";
import variantReducer from "./Reducers/variantReducer";
import customerReducer from "./Reducers/customerReducer";
import currencyReducer from "./Reducers/currencyReducer";
import saleItemReducer from "./Reducers/saleItemReducer";
import supplierReducer from "./Reducers/supplierReducer";
import countryReducer from "./Reducers/countryReducer";
import purchaseItemReducer from "./Reducers/purchaseItemReducer";
import bomReducer from "./Reducers/bomReducer";
import bomSummaryReducer from "./Reducers/bomSummaryReducer";
import bomDetailsReducer from "./Reducers/bomDetailsReducer";
import bomMaterialReducer from "./Reducers/bomMaterialReducer";
import PurchaseOrderReducer from "./Reducers/PurchaseOrderReducer";
import purchaseOrderSummaryReducer from "./Reducers/purchaseOrderSummaryReducer";
import paymentTermReducer from "./Reducers/paymentTermReducer";
import bankAccountReducer from "./Reducers/bankAccountReducer";
import salesOrderReducer from "./Reducers/salesOrderReducer";
import salesOrderSummaryReducer from "./Reducers/salesOrderSummaryReducer";
import salesQuotationReducer from "./Reducers/salesQuotationReducer";
import salesQuotationSummaryReducer from "./Reducers/salesQuotationSummaryReducer";
import salesInvoiceReducer from "./Reducers/salesInvoiceReducer";
import salesInvoiceSummaryReducer from "./Reducers/salesInvoiceSummaryReducer";
import chartOfAccountReducer from "./Reducers/chartOfAccountReducer";
import paymentOutReducer from "./Reducers/paymentOutReducer";
import paymentInReducer from "./Reducers/paymentInReducer";
import expenseSummaryReducer from "./Reducers/expenseSummaryReducer";
import expenseReducer from "./Reducers/expenseReducer";
import expenseCategoryReducer from "./Reducers/expenseCategoryReducer";
import expenseItemReducer from "./Reducers/expenseItemReducer";
import cashReducer from "./Reducers/cashReducer";
import bankVoucherReducer from "./Reducers/bankVoucherReducer";
import posSalesReducer from "./Reducers/posSalesReducer";
import posSalesSummaryReducer from "./Reducers/posSalesSummaryReducer";
import {
  purchaseInquiryReducer,
  purchaseInquirySummaryReducer,
} from "./Reducers/purchaseInquiryReducer";
import {
  shipmentModeReducer,
  shipmentTermReducer,
} from "./Reducers/shipmentReducer";
import {
  purchaseBillReducer,
  purchaseBillSummaryReducer,
} from "./Reducers/purchaseBillReducer";
import {
  patientReducer,
  patientSummaryReducer,
} from "./Reducers/Health-Reducers/Patient/patientReducer";
import appointmentReducer from "./Reducers/Health-Reducers/Appointment/AppointmentReducer";
import appointmentTypeReducer from "./Reducers/Health-Reducers/Appointment/AppointmentTypeReducer";
import doctorReducer from "./Reducers/Health-Reducers/Appointment/DoctorReducer";
import {
  patientInvoiceReducer,
  patientInvoiceSummaryReducer,
} from "./Reducers/Health-Reducers/Invoice/patientInvoiceReducer";
import {
  treatmentNoteReducer,
  treatmentNoteSummaryReducer,
} from "./Reducers/Health-Reducers/TreatmentNote/treatmentNoteReducer";
export default combineReducers({
  itemReducer,
  userReducer,
  unitReducer,
  categoryReducer,
  productTypeReducer,
  variantReducer,
  customerReducer,
  currencyReducer,
  saleItemReducer,
  purchaseItemReducer,
  countryReducer,
  supplierReducer,
  bomMaterialReducer,
  bomDetailsReducer,
  bomSummaryReducer,
  bomReducer,
  PurchaseOrderReducer,
  purchaseOrderSummaryReducer,
  paymentTermReducer,
  shipmentModeReducer,
  shipmentTermReducer,
  bankAccountReducer,
  salesOrderReducer,
  salesOrderSummaryReducer,
  salesQuotationReducer,
  salesQuotationSummaryReducer,
  salesInvoiceReducer,
  salesInvoiceSummaryReducer,
  purchaseInquiryReducer,
  purchaseInquirySummaryReducer,
  purchaseBillReducer,
  purchaseBillSummaryReducer,
  paymentInReducer,
  chartOfAccountReducer,
  paymentOutReducer,
  expenseReducer,
  expenseSummaryReducer,
  expenseCategoryReducer,
  expenseItemReducer,
  patientReducer,
  patientSummaryReducer,
  cashReducer,
  bankVoucherReducer,
  posSalesReducer,
  posSalesSummaryReducer,
  appointmentReducer,
  appointmentTypeReducer,
  doctorReducer,
  patientInvoiceReducer,
  patientInvoiceSummaryReducer,
  treatmentNoteReducer,
  treatmentNoteSummaryReducer,
});
