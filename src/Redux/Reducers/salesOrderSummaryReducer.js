import {
  GET_SALES_ORDER_SUMMARY,
  DELETE_SALES_ORDER_SUMMARY,
  ADD_SALES_ORDER_SUMMARY,
  EDIT_SALES_ORDER_SUMMARY,
} from "../Constants";
function salesOrderSummaryReducer(salesOrderSummaryState = [], action) {
  switch (action.type) {
    case GET_SALES_ORDER_SUMMARY:
      return action.payload;
    case ADD_SALES_ORDER_SUMMARY:
      return [...salesOrderSummaryState, action.payload];
    case DELETE_SALES_ORDER_SUMMARY:
      return salesOrderSummaryState.filter(
        (salesOrder) => salesOrder.salesOrderId !== action.payload.toString()
      );
    case EDIT_SALES_ORDER_SUMMARY:
      return salesOrderSummaryState.map((salesOrder) => {
        if (salesOrder.salesOrderId === action.payload.salesOrderId) {
          return {
            ...salesOrder,
            ...action.payload,
          };
        } else {
          return salesOrder;
        }
      });
    default:
      return salesOrderSummaryState;
  }
}

export default salesOrderSummaryReducer;
