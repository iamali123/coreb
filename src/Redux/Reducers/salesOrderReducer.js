import {
  GET_SALES_ORDERS,
  DELETE_SALES_ORDER,
  ADD_SALES_ORDER,
  EDIT_SALES_ORDER,
} from "../Constants";
function salesOrderReducer(salesOrderState = [], action) {
  switch (action.type) {
    case GET_SALES_ORDERS:
      return action.payload;
    case ADD_SALES_ORDER:
      return [...salesOrderState, action.payload];
    case DELETE_SALES_ORDER:
      return salesOrderState.filter(
        (salesOrder) => salesOrder.salesOrderId !== action.payload.toString()
      );
    case EDIT_SALES_ORDER:
      //console.log("PayLoad", action.payload);
      return salesOrderState.map((salesOrder) => {
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
      return salesOrderState;
  }
}

export default salesOrderReducer;
