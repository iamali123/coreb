import {
  ADD_APPOINTMENT,
  EDIT_APPOINTMENT,
  DELETE_APPOINTMENT,
  GET_APPOINTMENTS,
} from "../../../Constants";
export default function appointmentReducer(appointmentState = [], action) {
  switch (action.type) {
    case GET_APPOINTMENTS:
      return action.payload;
    case ADD_APPOINTMENT:
      return [...appointmentState, action.payload];
    case DELETE_APPOINTMENT:
      return appointmentState.filter(
        (appointment) => appointment.id !== action.payload.toString()
      );
    case EDIT_APPOINTMENT:
      return appointmentState.map((appointment) => {
        if (appointment.id === action.payload.id.toString()) {
          return {
            ...appointment,
            ...action.payload,
          };
        } else {
          return appointment;
        }
      });

    default:
      return appointmentState;
  }
}
