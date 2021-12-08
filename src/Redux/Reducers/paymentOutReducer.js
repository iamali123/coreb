import {
  ADD_PAYMENT_OUT,
  GET_PAYMENT_OUT,
  EDIT_PAYMENT_OUT,
  DELETE_PAYMENT_OUT,
} from "../Constants";
function paymentOutReducer(paymentOutState = [], action) {
  switch (action.type) {
    case GET_PAYMENT_OUT:
      return action.payload;
    case ADD_PAYMENT_OUT:
      return [...paymentOutState, action.payload];
    case DELETE_PAYMENT_OUT:
      return paymentOutState.filter(
        (paymentOut) => paymentOut.id !== action.payload.toString()
      );
    case EDIT_PAYMENT_OUT:
      return paymentOutState.map((paymentOut) => {
        if (paymentOut.id === action.payload.id) {
          return {
            ...paymentOut,
            ...action.payload,
          };
        } else {
          return paymentOut;
        }
      });
    default:
      return paymentOutState;
  }
}

export default paymentOutReducer;
