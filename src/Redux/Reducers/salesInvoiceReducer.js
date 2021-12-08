import {
  GET_SALES_INVOICES,
  DELETE_SALES_INVOICE,
  ADD_SALES_INVOICE,
  EDIT_SALES_INVOICE,
} from "../Constants";
function salesInvoiceReducer(salesInvoiceState = [], action) {
  switch (action.type) {
    case GET_SALES_INVOICES:
      return action.payload;
    case ADD_SALES_INVOICE:
      return [...salesInvoiceState, action.payload];
    case DELETE_SALES_INVOICE:
      return salesInvoiceState.filter(
        (salesInvoice) =>
          salesInvoice.salesInvoiceId !== action.payload.toString()
      );
    case EDIT_SALES_INVOICE:
      //console.log("PayLoad", action.payload);
      return salesInvoiceState.map((salesInvoice) => {
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
      return salesInvoiceState;
  }
}

export default salesInvoiceReducer;
