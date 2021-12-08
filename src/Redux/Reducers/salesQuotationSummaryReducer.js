import {
  GET_SALES_QUOTATION_SUMMARY,
  DELETE_SALES_QUOTATION_SUMMARY,
  ADD_SALES_QUOTATION_SUMMARY,
  EDIT_SALES_QUOTATION_SUMMARY,
} from "../Constants";
function salesQuotationSummaryReducer(salesQuotationSummaryState = [], action) {
  switch (action.type) {
    case GET_SALES_QUOTATION_SUMMARY:
      return action.payload;
    case ADD_SALES_QUOTATION_SUMMARY:
      return [...salesQuotationSummaryState, action.payload];
    case DELETE_SALES_QUOTATION_SUMMARY:
      return salesQuotationSummaryState.filter(
        (salesQuotation) =>
          salesQuotation.salesQuotationId !== action.payload.toString()
      );
    case EDIT_SALES_QUOTATION_SUMMARY:
      return salesQuotationSummaryState.map((salesQuotation) => {
        if (
          salesQuotation.salesQuotationId === action.payload.salesQuotationId
        ) {
          return {
            ...salesQuotation,
            ...action.payload,
          };
        } else {
          return salesQuotation;
        }
      });
    default:
      return salesQuotationSummaryState;
  }
}

export default salesQuotationSummaryReducer;
