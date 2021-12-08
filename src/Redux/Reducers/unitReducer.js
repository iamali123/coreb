import { GET_UNITS, DELETE_UNITS, ADD_UNITS, EDIT_UNITS } from '../Constants';
function unitReducer(unitState = [], action) {
    switch (action.type) {
    case GET_UNITS:
        return action.payload;
    case ADD_UNITS:
        return [...unitState, action.payload];
    case DELETE_UNITS:
        return unitState.filter((unit) => unit.id !== action.payload.toString());
    case EDIT_UNITS:
        return unitState.map((unit) => {
            if (unit.id === action.payload.id) {
                return {
                    ...unit,
                    ...action.payload,
                };
            } else {
                return unit;
            }
        });
    default:
        return unitState;
    }
}

export default unitReducer;
