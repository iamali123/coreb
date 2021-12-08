import {
  ADD_PATIENT,
  EDIT_PATIENT,
  DELETE_PATIENT,
  GET_PATIENTS,
  GET_PATIENT_SUMMARY,
  DELETE_PATIENT_SUMMARY,
  EDIT_PATIENT_SUMMARY,
  ADD_PATIENT_SUMMARY,
} from "../../../Constants";
function patientReducer(patientState = [], action) {
  switch (action.type) {
    case GET_PATIENTS:
      return action.payload;
    case ADD_PATIENT:
      return [...patientState, action.payload];
    case DELETE_PATIENT:
      return patientState.filter(
        (patient) => patient.id !== action.payload.toString()
      );
    case EDIT_PATIENT:
      return patientState.map((patient) => {
        if (patient.id === action.payload.id) {
          return {
            ...patient,
            ...action.payload,
          };
        } else {
          return patient;
        }
      });
    default:
      return patientState;
  }
}
function patientSummaryReducer(patientSummaryState = [], action) {
  switch (action.type) {
    case GET_PATIENT_SUMMARY:
      return action.payload;
    case ADD_PATIENT_SUMMARY:
      return [...patientSummaryState, action.payload];
    case DELETE_PATIENT_SUMMARY:
      return patientSummaryState.filter(
        (patientSummary) => patientSummary.id !== action.payload.toString()
      );
    case EDIT_PATIENT_SUMMARY:
      return patientSummaryState.map((patientSummary) => {
        if (patientSummary.id === action.payload.id) {
          return {
            ...patientSummary,
            ...action.payload,
          };
        } else {
          return patientSummary;
        }
      });
    default:
      return patientSummaryState;
  }
}

export { patientSummaryReducer, patientReducer };
