import {
  GET_PURCHASE_ORDER_SUMMARY,
  DELETE_PURCHASE_ORDER_SUMMARY,
  ADD_PURCHASE_ORDER_SUMMARY,
  EDIT_PURCHASE_ORDER_SUMMARY,
} from "../Constants";
function purchaseOrderSummaryReducer(purchaseOrderSummaryState = [], action) {
  switch (action.type) {
    case GET_PURCHASE_ORDER_SUMMARY:
      return action.payload;
    case ADD_PURCHASE_ORDER_SUMMARY:
      return [...purchaseOrderSummaryState, action.payload];
    case DELETE_PURCHASE_ORDER_SUMMARY:
      return purchaseOrderSummaryState.filter(
        (purchaseOrder) =>
          purchaseOrder.purchaseOrderId !== action.payload.toString()
      );
    case EDIT_PURCHASE_ORDER_SUMMARY:
      return purchaseOrderSummaryState.map((purchaseOrder) => {
        if (purchaseOrder.purchaseOrderId === action.payload.purchaseOrderId) {
          return {
            ...purchaseOrder,
            ...action.payload,
          };
        } else {
          return purchaseOrder;
        }
      });
    default:
      return purchaseOrderSummaryState;
  }
}

export default purchaseOrderSummaryReducer;
