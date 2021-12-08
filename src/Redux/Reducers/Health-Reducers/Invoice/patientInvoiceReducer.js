import {
  GET_PATIENT_INVOICES,
  ADD_PATIENT_INVOICE,
  EDIT_PATIENT_INVOICE,
  DELETE_PATIENT_INVOICE,
  GET_PATIENT_INVOICES_SUMMARY,
  ADD_PATIENT_INVOICE_SUMMARY,
  DELETE_PATIENT_INVOICE_SUMMARY,
  EDIT_PATIENT_INVOICE_SUMMARY,
} from "../../../Constants";
function patientInvoiceReducer(patientInvoiceState = [], action) {
  switch (action.type) {
    case GET_PATIENT_INVOICES:
      return action.payload;
    case ADD_PATIENT_INVOICE:
      return [...patientInvoiceState, action.payload];
    case DELETE_PATIENT_INVOICE:
      return patientInvoiceState.filter(
        (invoice) => invoice.id !== action.payload.toString()
      );
    case EDIT_PATIENT_INVOICE:
      return patientInvoiceState.map((invoice) => {
        if (invoice.id === action.payload.id) {
          return {
            ...invoice,
            ...action.payload,
          };
        } else {
          return invoice;
        }
      });
    default:
      return patientInvoiceState;
  }
}
function patientInvoiceSummaryReducer(patientInvoiceSummaryState = [], action) {
  switch (action.type) {
    case GET_PATIENT_INVOICES_SUMMARY:
      return action.payload;
    case ADD_PATIENT_INVOICE_SUMMARY:
      return [...patientInvoiceSummaryState, action.payload];
    case DELETE_PATIENT_INVOICE_SUMMARY:
      return patientInvoiceSummaryState.filter(
        (invoice) =>
          invoice.patientInvoiceId.toString() !== action.payload.toString()
      );
    case EDIT_PATIENT_INVOICE_SUMMARY:
      return patientInvoiceSummaryState.map((invoice) => {
        if (invoice.id === action.payload.id) {
          return {
            ...invoice,
            ...action.payload,
          };
        } else {
          return invoice;
        }
      });
    default:
      return patientInvoiceSummaryState;
  }
}

export { patientInvoiceReducer, patientInvoiceSummaryReducer };
