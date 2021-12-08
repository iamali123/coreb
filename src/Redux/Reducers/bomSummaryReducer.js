import {
  GET_BOM_SUMMARY,
  DELETE_BOM_SUMMARY,
  ADD_BOM_SUMMARY,
  EDIT_BOM_SUMMARY,
} from "../Constants";
function bomSummaryReducer(bomSummary = [], action) {
  switch (action.type) {
    case GET_BOM_SUMMARY:
      return action.payload;
    case ADD_BOM_SUMMARY:
      return [...bomSummary, action.payload];
    case DELETE_BOM_SUMMARY:
      return bomSummary.filter(
        (bom) => bom.bomId !== action.payload.toString()
      );
    case EDIT_BOM_SUMMARY:
      return bomSummary.map((bom) => {
        if (bom.bomId === action.payload.bomId) {
          return {
            ...bom,
            ...action.payload,
          };
        } else {
          return bom;
        }
      });
    default:
      return bomSummary;
  }
}

export default bomSummaryReducer;
