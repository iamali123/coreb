import {
  GET_EXPENSES,
  DELETE_EXPENSE,
  ADD_EXPENSE,
  EDIT_EXPENSE,
} from "../Constants";
function expenseReducer(expenseState = [], action) {
  switch (action.type) {
    case GET_EXPENSES:
      return action.payload;
    case ADD_EXPENSE:
      return [...expenseState, action.payload];
    case DELETE_EXPENSE:
      return expenseState.filter(
        (expense) => expense.expenseId !== action.payload.toString()
      );
    case EDIT_EXPENSE:
      //console.log("PayLoad", action.payload);
      return expenseState.map((expense) => {
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
      return expenseState;
  }
}

export default expenseReducer;
