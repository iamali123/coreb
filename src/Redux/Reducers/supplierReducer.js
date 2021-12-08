import {
    GET_SUPPLIERS,
    DELETE_SUPPLIER,
    EDIT_SUPPLIER,
    ADD_SUPPLIER,
} from '../Constants';
function supplierReducer(supplierState = [], action) {
    switch (action.type) {
    case GET_SUPPLIERS:
        return action.payload;
    case ADD_SUPPLIER:
        return [...supplierState, action.payload];
    case DELETE_SUPPLIER:
        return supplierState.filter(
            (supplier) => supplier.supplierId !== action.payload.toString()
        );
    case EDIT_SUPPLIER:
        return supplierState.map((supplier) => {
            if (supplier.supplierId === action.payload.supplierId) {
                return {
                    ...supplier,
                    ...action.payload,
                };
            } else {
                return supplier;
            }
        });
    default:
        return supplierState;
    }
}

export default supplierReducer;
