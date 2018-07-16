import * as userAction from './user.action';
import userReducer from './user.reducer';
import withUser from "./service/withUser";
import sign from "./service/sign";
import ButtonWithAuth from './components/ButtonWithAuth';
let reducers = { user: userReducer }
export default { userAction, reducers, withUser, sign, ButtonWithAuth }
export { userAction, reducers, withUser, sign, ButtonWithAuth }