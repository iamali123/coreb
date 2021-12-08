import {
  ADD_APPOINTMENTTYPE,
  EDIT_APPOINTMENTTYPE,
  DELETE_APPOINTMENTTYPE,
  GET_APPOINTMENTTYPES,
} from "../../../Constants";
export default function appointmentTypeReducer(
  appointmentTypesState = [],
  action
) {
  switch (action.type) {
    case GET_APPOINTMENTTYPES:
      return action.payload;
    case ADD_APPOINTMENTTYPE:
      return [...appointmentTypesState, action.payload];
    case DELETE_APPOINTMENTTYPE:
      return appointmentTypesState.filter(
        (type) => type.id !== action.payload.toString()
      );
    case EDIT_APPOINTMENTTYPE:
      return appointmentTypesState.map((type) => {
        if (type.id === action.payload.id) {
          return {
            ...type,
            ...action.payload,
          };
        } else {
          return type;
        }
      });
    default:
      return appointmentTypesState;
  }
}
