import {
  GET_SALES_QUOTATIONS,
  DELETE_SALES_QUOTATION,
  ADD_SALES_QUOTATION,
  EDIT_SALES_QUOTATION,
} from "../Constants";
function salesQuotationReducer(salesQuotationState = [], action) {
  switch (action.type) {
    case GET_SALES_QUOTATIONS:
      return action.payload;
    case ADD_SALES_QUOTATION:
      return [...salesQuotationState, action.payload];
    case DELETE_SALES_QUOTATION:
      return salesQuotationState.filter(
        (salesQuotation) =>
          salesQuotation.salesQuotationId !== action.payload.toString()
      );
    case EDIT_SALES_QUOTATION:
      return salesQuotationState.map((salesQuotation) => {
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
      return salesQuotationState;
  }
}

export default salesQuotationReducer;
