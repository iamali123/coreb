import {
    GET_VARIANTS,
    DELETE_VARIANT,
    ADD_VARIANT,
    EDIT_VARIANT,
} from '../Constants';
function variantReducer(variantState = [], action) {
    switch (action.type) {
    case GET_VARIANTS:
        return action.payload;
    case ADD_VARIANT:
        return [...variantState, action.payload];
    case DELETE_VARIANT:
        return variantState.filter(
            (variant) => variant.id !== action.payload.toString()
        );
    case EDIT_VARIANT:
        return variantState.map((variant) => {
            if (variant.id === action.payload.id) {
                return {
                    ...variant,
                    ...action.payload,
                };
            } else {
                return variant;
            }
        });
    default:
        return variantState;
    }
}

export default variantReducer;
