import {
  GET_PAYMENT_INS,
  DELETE_PAYMENT_IN,
  ADD_PAYMENT_IN,
  EDIT_PAYMENT_IN,
} from "../Constants";
function paymentInReducer(paymentInState = [], action) {
  switch (action.type) {
    case GET_PAYMENT_INS:
      return action.payload;
    case ADD_PAYMENT_IN:
      return [...paymentInState, action.payload];
    case DELETE_PAYMENT_IN:
      return paymentInState.filter(
        (paymentIn) => paymentIn.id !== action.payload.toString()
      );
    case EDIT_PAYMENT_IN:
      //console.log("PayLoad", action.payload);
      return paymentInState.map((paymentIn) => {
        if (paymentIn.id === action.payload.id) {
          return {
            ...paymentIn,
            ...action.payload,
          };
        } else {
          return paymentIn;
        }
      });
    default:
      return paymentInState;
  }
}

export default paymentInReducer;
