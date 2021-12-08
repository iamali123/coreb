import { GET_CASHS, DELETE_CASH, ADD_CASH, EDIT_CASH } from "../Constants";
function cashReducer(cashState = [], action) {
  switch (action.type) {
    case GET_CASHS:
      return action.payload;
    case ADD_CASH:
      return [...cashState, action.payload];
    case DELETE_CASH:
      return cashState.filter((cash) => cash.id !== action.payload.toString());
    case EDIT_CASH:
      //console.log("PayLoad", action.payload);
      return cashState.map((cash) => {
        if (cash.id === action.payload.id) {
          return {
            ...cash,
            ...action.payload,
          };
        } else {
          return cash;
        }
      });
    default:
      return cashState;
  }
}

export default cashReducer;
