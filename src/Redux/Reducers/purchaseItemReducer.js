import {
    GET_PURCHASE_ITEMS,
    ADD_PURCHASE_ITEM,
    DELETE_PURCHASE_ITEM,
    EDIT_PURCHASE_ITEM,
} from '../Constants';
function purchaseItemReducer(purchaseItemState = [], action) {
    switch (action.type) {
    case GET_PURCHASE_ITEMS:
        return action.payload;
    case ADD_PURCHASE_ITEM:
        return [...purchaseItemState, action.payload];
    case DELETE_PURCHASE_ITEM:
        return purchaseItemState.filter(
            (purchaseItem) => purchaseItem.id !== action.payload.toString()
        );
    case EDIT_PURCHASE_ITEM:
        return purchaseItemState.map((purchase) => {
            if (purchase.id === action.payload.id) {
                return {
                    ...purchase,
                    ...action.payload,
                };
            } else {
                return purchase;
            }
        });
    default:
        return purchaseItemState;
    }
}

export default purchaseItemReducer;
