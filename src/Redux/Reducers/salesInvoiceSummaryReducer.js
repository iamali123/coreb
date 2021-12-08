import {
  GET_SALES_INVOICE_SUMMARY,
  DELETE_SALES_INVOICE_SUMMARY,
  ADD_SALES_INVOICE_SUMMARY,
  EDIT_SALES_INVOICE_SUMMARY,
} from "../Constants";
function salesInvoiceSummaryReducer(salesInvoiceSummaryState = [], action) {
  switch (action.type) {
    case GET_SALES_INVOICE_SUMMARY:
      return action.payload;
    case ADD_SALES_INVOICE_SUMMARY:
      return [...salesInvoiceSummaryState, action.payload];
    case DELETE_SALES_INVOICE_SUMMARY:
      return salesInvoiceSummaryState.filter(
        (salesInvoice) =>
          salesInvoice.salesInvoiceId !== action.payload.toString()
      );
    case EDIT_SALES_INVOICE_SUMMARY:
      return salesInvoiceSummaryState.map((salesInvoice) => {
        if (salesInvoice.salesInvoiceId === action.payload.salesInvoiceId) {
          return {
            ...salesInvoice,
            ...action.payload,
          };
        } else {
          return salesInvoice;
        }
      });
    default:
      return salesInvoiceSummaryState;
  }
}

export default salesInvoiceSummaryReducer;
