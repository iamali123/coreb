import {
  GET_PURCHASE_BILL,
  ADD_PURCHASE_BILL,
  DELETE_PURCHASE_BILL,
  EDIT_PURCHASE_BILL,
  GET_PURCHASE_BILL_SUMMARY,
  EDIT_PURCHASE_BILL_SUMMARY,
  DELETE_PURCHASE_BILL_SUMMARY,
  ADD_PURCHASE_BILL_SUMMARY,
} from "../Constants";
export function purchaseBillReducer(purchaseBillState = [], action) {
  switch (action.type) {
    case GET_PURCHASE_BILL:
      return action.payload;
    case ADD_PURCHASE_BILL:
      return [...purchaseBillState, action.payload];
    case DELETE_PURCHASE_BILL:
      return purchaseBillState.filter(
        (purchaseBill) =>
          purchaseBill.purchaseBillId !== action.payload.toString()
      );
    case EDIT_PURCHASE_BILL:
      return purchaseBillState.map((purchaseBill) => {
        if (purchaseBill.purchaseBillId === action.payload.purchaseBillId) {
          return {
            ...purchaseBill,
            ...action.payload,
          };
        } else {
          return purchaseBill;
        }
      });
    default:
      return purchaseBillState;
  }
}
export function purchaseBillSummaryReducer(
  purchaseBillSummaryState = [],
  action
) {
  switch (action.type) {
    case GET_PURCHASE_BILL_SUMMARY:
      return action.payload;
    case ADD_PURCHASE_BILL_SUMMARY:
      return [...purchaseBillSummaryState, action.payload];
    case DELETE_PURCHASE_BILL_SUMMARY:
      return purchaseBillSummaryState.filter(
        (summary) => summary.purchaseBillId !== action.payload.toString()
      );
    case EDIT_PURCHASE_BILL_SUMMARY:
      return purchaseBillSummaryState.map((summary) => {
        if (summary.purchaseBillId === action.payload.purchaseBillId) {
          return {
            ...summary,
            ...action.payload,
          };
        } else {
          return summary;
        }
      });
    default:
      return purchaseBillSummaryState;
  }
}

export default { purchaseBillReducer, purchaseBillSummaryReducer };
