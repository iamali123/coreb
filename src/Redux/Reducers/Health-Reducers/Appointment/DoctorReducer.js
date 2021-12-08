import {
  ADD_DOCTOR,
  EDIT_DOCTOR,
  DELETE_DOCTOR,
  GET_DOCTORS,
} from "../../../Constants";
export default function doctorReducer(doctorState = [], action) {
  switch (action.type) {
    case GET_DOCTORS:
      return action.payload;
    case ADD_DOCTOR:
      return [...doctorState, action.payload];
    case DELETE_DOCTOR:
      return doctorState.filter((doc) => doc.id !== action.payload.toString());
    case EDIT_DOCTOR:
      return doctorState.map((doc) => {
        if (doc.id === action.payload.id) {
          return {
            ...doc,
            ...action.payload,
          };
        } else {
          return doc;
        }
      });
    default:
      return doctorState;
  }
}
