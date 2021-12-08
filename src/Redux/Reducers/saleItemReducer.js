import {
    GET_SALE_ITEMS,
    ADD_SALE_ITEM,
    DELETE_SALE_ITEM,
    EDIT_SALE_ITEM,
} from '../Constants';
function saleItemReducer(saleItemState = [], action) {
    switch (action.type) {
    case GET_SALE_ITEMS:
        return action.payload;
    case ADD_SALE_ITEM:
        return [...saleItemState, action.payload];
    case DELETE_SALE_ITEM:
        return saleItemState.filter(
            (saleItem) => saleItem.id !== action.payload.toString()
        );
    case EDIT_SALE_ITEM:
        return saleItemState.map((saleItem) => {
            if (saleItem.id === action.payload.id) {
                return {
                    ...saleItem,
                    ...action.payload,
                };
            } else {
                return saleItem;
            }
        });
    default:
        return saleItemState;
    }
}

export default saleItemReducer;
