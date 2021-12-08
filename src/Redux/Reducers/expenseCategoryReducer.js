import {
  ADD_EXPENSE_CATEGORY,
  GET_EXPENSE_CATEGORYS,
  EDIT_EXPENSE_CATEGORY,
  DELETE_EXPENSE_CATEGORY,
} from "../Constants";
function expenseCategoryReducer(expenseCategoryState = [], action) {
  switch (action.type) {
    case GET_EXPENSE_CATEGORYS:
      return action.payload;
    case ADD_EXPENSE_CATEGORY:
      return [...expenseCategoryState, action.payload];
    case DELETE_EXPENSE_CATEGORY:
      return expenseCategoryState.filter(
        (expenseCategory) =>
          expenseCategory.expenseCategoryId !== action.payload.toString()
      );
    case EDIT_EXPENSE_CATEGORY:
      return expenseCategoryState.map((expenseCategory) => {
        if (
          expenseCategory.expenseCategoryId === action.payload.expenseCategoryId
        ) {
          return {
            ...expenseCategory,
            ...action.payload,
          };
        } else {
          return expenseCategory;
        }
      });
    default:
      return expenseCategoryState;
  }
}

export default expenseCategoryReducer;
