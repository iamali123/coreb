import {
  ADD_PAYMENT_TERM,
  DELETE_PAYMENT_TERM,
  EDIT_PAYMENT_TERM,
  GET_PAYMENT_TERM,
} from "../Constants";
function paymentTermReducer(paymentTermState = [], action) {
  switch (action.type) {
    case GET_PAYMENT_TERM:
      return action.payload;
    case ADD_PAYMENT_TERM:
      return [...paymentTermState, action.payload];
    case DELETE_PAYMENT_TERM:
      return paymentTermState.filter(
        (paymentTerm) => paymentTerm.id !== action.payload.toString()
      );
    case EDIT_PAYMENT_TERM:
      return paymentTermState.map((paymentTerm) => {
        if (paymentTerm.id === action.payload.id) {
          return {
            ...paymentTerm,
            ...action.payload,
          };
        } else {
          return paymentTerm;
        }
      });
    default:
      return paymentTermState;
  }
}

export default paymentTermReducer;
