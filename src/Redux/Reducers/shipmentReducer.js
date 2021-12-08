import {
  ADD_SHIPMENT_TERM,
  DELETE_SHIPMENT_TERM,
  EDIT_SHIPMENT_TERM,
  GET_SHIPMENT_TERM,
  ADD_SHIPMENT_MODE,
  DELETE_SHIPMENT_MODE,
  EDIT_SHIPMENT_MODE,
  GET_SHIPMENT_MODE,
} from "../Constants";
function shipmentTermReducer(shipmentTermState = [], action) {
  switch (action.type) {
    case GET_SHIPMENT_TERM:
      return action.payload;
    case ADD_SHIPMENT_TERM:
      return [...shipmentTermState, action.payload];
    case DELETE_SHIPMENT_TERM:
      return shipmentTermState.filter(
        (shipmentTerm) => shipmentTerm.id !== action.payload.toString()
      );
    case EDIT_SHIPMENT_TERM:
      return shipmentTermState.map((shipmentTerm) => {
        if (shipmentTerm.id === action.payload.id) {
          return {
            ...shipmentTerm,
            ...action.payload,
          };
        } else {
          return shipmentTerm;
        }
      });
    default:
      return shipmentTermState;
  }
}
function shipmentModeReducer(shipmentModeState = [], action) {
  switch (action.type) {
    case GET_SHIPMENT_MODE:
      return action.payload;
    case ADD_SHIPMENT_MODE:
      return [...shipmentModeState, action.payload];
    case DELETE_SHIPMENT_MODE:
      return shipmentModeState.filter(
        (shipmentMode) => shipmentMode.id !== action.payload.toString()
      );
    case EDIT_SHIPMENT_MODE:
      return shipmentModeState.map((shipmentMode) => {
        if (shipmentMode.id === action.payload.id) {
          return {
            ...shipmentMode,
            ...action.payload,
          };
        } else {
          return shipmentMode;
        }
      });
    default:
      return shipmentModeState;
  }
}

export { shipmentModeReducer, shipmentTermReducer };
