import { GET_USER, ADD_USER, REMOVE_USER } from '../Constants';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
let userData = cookies.get('user');
function userReducer(
    UserState = userData !== undefined ? userData : null,
    action
) {
    switch (action.type) {
    case ADD_USER:
        return {
            UserState: action.payload,
        };
    case GET_USER:
        return action.payload;
    case REMOVE_USER:
        return (UserState = action.payload);
    default:
        return UserState;
    }
}
export default userReducer;
