import {
    GET_CUSTOMERS,
    DELETE_CUSTOMER,
    EDIT_CUSTOMER,
    ADD_CUSTOMER,
} from '../Constants';
function customerReducer(customerState = [], action) {
    switch (action.type) {
    case GET_CUSTOMERS:
        return action.payload;
    case ADD_CUSTOMER:
        return [...customerState, action.payload];
    case DELETE_CUSTOMER:
        return customerState.filter(
            (customer) => customer.customerId !== action.payload.toString()
        );
    case EDIT_CUSTOMER:
        return customerState.map((customer) => {
            if (customer.customerId === action.payload.customerId) {
                return {
                    ...customer,
                    ...action.payload,
                };
            } else {
                return customer;
            }
        });
    default:
        return customerState;
    }
}

export default customerReducer;
