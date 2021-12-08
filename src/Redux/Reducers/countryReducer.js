import { GET_COUNTRY } from '../Constants';
function countryReducer(countryState = [], action) {
    switch (action.type) {
    case GET_COUNTRY:
        return action.payload;
    default:
        return countryState;
    }
}

export default countryReducer;
