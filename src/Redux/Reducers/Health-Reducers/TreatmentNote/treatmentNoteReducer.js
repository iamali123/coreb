import {
  GET_TREATMENT_NOTES,
  ADD_TREATMENT_NOTE,
  DELETE_TREATMENT_NOTE,
  EDIT_TREATMENT_NOTE,
  GET_TREATMENT_NOTES_SUMMARY,
  ADD_TREATMENT_NOTE_SUMMARY,
  DELETE_TREATMENT_NOTE_SUMMARY,
  EDIT_TREATMENT_NOTE_SUMMARY,
} from "../../../Constants";
function treatmentNoteReducer(treatNoteState = [], action) {
  switch (action.type) {
    case GET_TREATMENT_NOTES:
      return action.payload;
    case ADD_TREATMENT_NOTE:
      return [...treatNoteState, action.payload];
    case DELETE_TREATMENT_NOTE:
      return treatNoteState.filter(
        (treatment_note) => treatment_note.id !== action.payload.toString()
      );
    case EDIT_TREATMENT_NOTE:
      return treatNoteState.map((treatment_note) => {
        if (treatment_note.id === action.payload.id) {
          return {
            ...treatment_note,
            ...action.payload,
          };
        } else {
          return treatment_note;
        }
      });
    default:
      return treatNoteState;
  }
}
function treatmentNoteSummaryReducer(treatNoteSummaryState = [], action) {
  switch (action.type) {
    case GET_TREATMENT_NOTES_SUMMARY:
      return action.payload;
    case ADD_TREATMENT_NOTE_SUMMARY:
      return [...treatNoteSummaryState, action.payload];
    case DELETE_TREATMENT_NOTE_SUMMARY:
      return treatNoteSummaryState.filter(
        (summary) => summary.id !== action.payload.toString()
      );
    case EDIT_TREATMENT_NOTE_SUMMARY:
      return treatNoteSummaryState.map((summary) => {
        if (summary.id === action.payload.id) {
          return {
            ...summary,
            ...action.payload,
          };
        } else {
          return summary;
        }
      });
    default:
      return treatNoteSummaryState;
  }
}

export { treatmentNoteSummaryReducer, treatmentNoteReducer };
