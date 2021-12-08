import {
    GET_CATEGORY,
    DELETE_CATEGORY,
    ADD_CATEGORY,
    EDIT_CATEGORY,
} from '../Constants';
function categoryReducer(categoryState = [], action) {
    switch (action.type) {
    case GET_CATEGORY:
        return action.payload;
    case ADD_CATEGORY:
        return [...categoryState, action.payload];
    case DELETE_CATEGORY:
        return categoryState.filter((category) => category.id !== action.payload);
    case EDIT_CATEGORY:
        return categoryState.map((category) => {
            if (category.id === action.payload.id) {
                return {
                    ...category,
                    ...action.payload,
                };
            } else {
                return category;
            }
        });
    default:
        return categoryState;
    }
}

export default categoryReducer;
