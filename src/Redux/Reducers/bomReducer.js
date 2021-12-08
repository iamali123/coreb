import { GET_BOM, DELETE_BOM, ADD_BOM, EDIT_BOM } from "../Constants";
function bomReducer(bomState = [], action) {
  switch (action.type) {
    case GET_BOM:
      return action.payload;
    case ADD_BOM:
      return [...bomState, action.payload];
    case DELETE_BOM:
      return bomState.filter((bom) => bom.id !== action.payload.toString());
    case EDIT_BOM:
      return bomState.map((bom) => {
        if (bom.id === action.payload.id) {
          return {
            ...bom,
            ...action.payload,
          };
        } else {
          return bom;
        }
      });
    default:
      return bomState;
  }
}

export default bomReducer;
