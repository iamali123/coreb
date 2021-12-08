import {
  ADD_CHART_OF_ACCOUNT,
  EDIT_CHART_OF_ACCOUNT,
  DELETE_CHART_OF_ACCOUNT,
  GET_CHART_OF_ACCOUNT,
} from "../Constants";
function chartOfAccountReducer(chartOfAccountState = [], action) {
  switch (action.type) {
    case GET_CHART_OF_ACCOUNT:
      return action.payload;
    case ADD_CHART_OF_ACCOUNT:
      return [...chartOfAccountState, action.payload];
    case DELETE_CHART_OF_ACCOUNT:
      return chartOfAccountState.filter(
        (chartOfAccount) => chartOfAccount.id !== action.payload.toString()
      );
    case EDIT_CHART_OF_ACCOUNT:
      return chartOfAccountState.map((chartOfAccount) => {
        if (chartOfAccount.id === action.payload.id) {
          return {
            ...chartOfAccount,
            ...action.payload,
          };
        } else {
          return chartOfAccount;
        }
      });
    default:
      return chartOfAccountState;
  }
}

export default chartOfAccountReducer;
