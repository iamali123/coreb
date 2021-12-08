import {
  GET_POS_SALES,
  DELETE_POS_SALE,
  ADD_POS_SALE,
  EDIT_POS_SALE,
} from "../Constants";
function posSalesReducer(posSalesState = [], action) {
  switch (action.type) {
    case GET_POS_SALES:
      return action.payload;
    case ADD_POS_SALE:
      return [...posSalesState, action.payload];
    case DELETE_POS_SALE:
      return posSalesState.filter(
        (posSales) => posSales.posSalesId !== action.payload.toString()
      );
    case EDIT_POS_SALE:
      //console.log("PayLoad", action.payload);
      return posSalesState.map((posSales) => {
        if (posSales.posSalesId === action.payload.posSalesId) {
          return {
            ...posSales,
            ...action.payload,
          };
        } else {
          return posSales;
        }
      });
    default:
      return posSalesState;
  }
}

export default posSalesReducer;
