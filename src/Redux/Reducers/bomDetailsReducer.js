import { GET_BOM_DETAIL } from "../Constants";
function bomDetailsReducer(bomDetails = [], action) {
  switch (action.type) {
    case GET_BOM_DETAIL:
      bomDetails = action.payload;
      return bomDetails;
    default:
      return bomDetails;
  }
}

export default bomDetailsReducer;
