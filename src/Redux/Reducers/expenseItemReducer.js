import {
  ADD_EXPENSE_ITEM,
  GET_EXPENSE_ITEMS,
  EDIT_EXPENSE_ITEM,
  DELETE_EXPENSE_ITEM,
} from "../Constants";
function expenseItemReducer(expenseItemState = [], action) {
  switch (action.type) {
    case GET_EXPENSE_ITEMS:
      return action.payload;
    case ADD_EXPENSE_ITEM:
      return [...expenseItemState, action.payload];
    case DELETE_EXPENSE_ITEM:
      return expenseItemState.filter(
        (expenseItem) => expenseItem.expenseItemId !== action.payload.toString()
      );
    case EDIT_EXPENSE_ITEM:
      return expenseItemState.map((expenseItem) => {
        if (expenseItem.expenseItemId === action.payload.expenseItemId) {
          return {
            ...expenseItem,
            ...action.payload,
          };
        } else {
          return expenseItem;
        }
      });
    default:
      return expenseItemState;
  }
}

export default expenseItemReducer;
