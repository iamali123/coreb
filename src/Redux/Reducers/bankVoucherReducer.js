import {
  GET_BANK_VOUCHERS,
  DELETE_BANK_VOUCHER,
  ADD_BANK_VOUCHER,
  EDIT_BANK_VOUCHER,
} from "../Constants";
function bankVoucherReducer(bankVoucherState = [], action) {
  switch (action.type) {
    case GET_BANK_VOUCHERS:
      return action.payload;
    case ADD_BANK_VOUCHER:
      return [...bankVoucherState, action.payload];
    case DELETE_BANK_VOUCHER:
      return bankVoucherState.filter(
        (bankVoucher) => bankVoucher.id !== action.payload.toString()
      );
    case EDIT_BANK_VOUCHER:
      //console.log("PayLoad", action.payload);
      return bankVoucherState.map((bankVoucher) => {
        if (bankVoucher.id === action.payload.id) {
          return {
            ...bankVoucher,
            ...action.payload,
          };
        } else {
          return bankVoucher;
        }
      });
    default:
      return bankVoucherState;
  }
}

export default bankVoucherReducer;
