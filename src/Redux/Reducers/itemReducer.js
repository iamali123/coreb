import { ADD_ITEM, GET_ITEMS, EDIT_ITEM, DELETE_ITEM } from '../Constants';
function itemReducer(itemState = [], action) {
    switch (action.type) {
    case GET_ITEMS:
        return action.payload;
    case ADD_ITEM:
        return [...itemState, action.payload];
    case DELETE_ITEM:
        return itemState.filter(
            (item) => item.itemId !== action.payload.toString()
        );
    case EDIT_ITEM:
        return itemState.map((item) => {
            if (item.itemId === action.payload.itemId) {
                return {
                    ...item,
                    ...action.payload,
                };
            } else {
                return item;
            }
        });
    default:
        return itemState;
    }
}

export default itemReducer;
