import {
    GET_PRODUCT_TYPE,
    DELETE_PRODUCT_TYPE,
    EDIT_PRODUCT_TYPE,
    ADD_PRODUCT_TYPE,
} from '../Constants';
function productTypeReducer(productTypeState = [], action) {
    switch (action.type) {
    case GET_PRODUCT_TYPE:
        return action.payload;
    case ADD_PRODUCT_TYPE:
        return [...productTypeState, action.payload];
    case DELETE_PRODUCT_TYPE:
        return productTypeState.filter(
            (product) => product.id !== action.payload.toString()
        );
    case EDIT_PRODUCT_TYPE:
        return productTypeState.map((productType) => {
            if (productType.id === action.payload.id) {
                return {
                    ...productType,
                    ...action.payload,
                };
            } else {
                return productType;
            }
        });
    default:
        return productTypeState;
    }
}

export default productTypeReducer;
