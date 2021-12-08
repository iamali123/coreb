import {
  GET_PURCHASE_ORDERS,
  DELETE_PURCHASE_ORDER,
  ADD_PURCHASE_ORDER,
  EDIT_PURCHASE_ORDER,
} from "../Constants";
function purchaseOrderReducer(purchaseOrderState = [], action) {
  switch (action.type) {
    case GET_PURCHASE_ORDERS:
      return action.payload;
    case ADD_PURCHASE_ORDER:
      return [...purchaseOrderState, action.payload];
    case DELETE_PURCHASE_ORDER:
      return purchaseOrderState.filter(
        (purchaseOrder) =>
          purchaseOrder.purchaseOrderId !== action.payload.toString()
      );
    case EDIT_PURCHASE_ORDER:
      return purchaseOrderState.map((purchaseOrder) => {
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
      return purchaseOrderState;
  }
}

export default purchaseOrderReducer;
