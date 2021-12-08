import { GET_CURRENCY } from '../Constants';
function currencyReducer(currencyState = [], action) {
    switch (action.type) {
    case GET_CURRENCY:
        return action.payload;
    default:
        return currencyState;
    }
}

export default currencyReducer;
