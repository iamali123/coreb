import {
  GET_POS_SALE_SUMMARY,
  DELETE_POS_SALE_SUMMARY,
  ADD_POS_SALE_SUMMARY,
  EDIT_POS_SALE_SUMMARY,
} from "../Constants";
function posSalesSummaryReducer(posSalesSummaryState = [], action) {
  switch (action.type) {
    case GET_POS_SALE_SUMMARY:
      return action.payload;
    case ADD_POS_SALE_SUMMARY:
      return [...posSalesSummaryState, action.payload];
    case DELETE_POS_SALE_SUMMARY:
      return posSalesSummaryState.filter(
        (posSales) => posSales.posSalesId !== action.payload.toString()
      );
    case EDIT_POS_SALE_SUMMARY:
      return posSalesSummaryState.map((posSales) => {
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
      return posSalesSummaryState;
  }
}

export default posSalesSummaryReducer;
