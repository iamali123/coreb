import {
  ADD_BANK_ACCOUNT,
  EDIT_BANK_ACCOUNT,
  DELETE_BANK_ACCOUNT,
  GET_BANK_ACCOUNT,
} from "../Constants";
function bankAccountReducer(bankAccountState = [], action) {
  switch (action.type) {
    case GET_BANK_ACCOUNT:
      return action.payload;
    case ADD_BANK_ACCOUNT:
      return [...bankAccountState, action.payload];
    case DELETE_BANK_ACCOUNT:
      return bankAccountState.filter(
        (bankAccount) => bankAccount.id !== action.payload.toString()
      );
    case EDIT_BANK_ACCOUNT:
      return bankAccountState.map((bankAccount) => {
        if (bankAccount.id === action.payload.id) {
          return {
            ...bankAccount,
            ...action.payload,
          };
        } else {
          return bankAccount;
        }
      });
    default:
      return bankAccountState;
  }
}

export default bankAccountReducer;
