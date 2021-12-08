import {
  GET_EXPENSE_SUMMARY,
  DELETE_EXPENSE_SUMMARY,
  ADD_EXPENSE_SUMMARY,
  EDIT_EXPENSE_SUMMARY,
} from "../Constants";
function expenseSummaryReducer(expenseSummaryState = [], action) {
  switch (action.type) {
    case GET_EXPENSE_SUMMARY:
      return action.payload;
    case ADD_EXPENSE_SUMMARY:
      return [...expenseSummaryState, action.payload];
    case DELETE_EXPENSE_SUMMARY:
      return expenseSummaryState.filter(
        (expense) => expense.expenseId !== action.payload.toString()
      );
    case EDIT_EXPENSE_SUMMARY:
      return expenseSummaryState.map((expense) => {
        if (expense.expenseId === action.payload.expenseId) {
          return {
            ...expense,
            ...action.payload,
          };
        } else {
          return expense;
        }
      });
    default:
      return expenseSummaryState;
  }
}

export default expenseSummaryReducer;
