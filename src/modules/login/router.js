
import LoginScreen from './LoginScreen';
import BindPhoneNumbScreen from './BindPhoneNumbScreen';
import RegisterScreen from './RegisterScreen';
import RetrievePasswordScreen from './RetrievePasswordScreen';
import SetPasswordScreen from './SetPasswordScreen';
import ChangePasswordScreen from './ChangePasswordScreen';

let loginRoutes = {
	BindPhoneNumbScreen: {
		screen: BindPhoneNumbScreen,
	},
	RegisterScreen: {
		screen: RegisterScreen,
	},
	RetrievePasswordScreen: {
		screen: RetrievePasswordScreen,
	},
	ChangePasswordScreen: {
		screen: ChangePasswordScreen,
	},
	SetPasswordScreen: {
		screen: SetPasswordScreen,
	},
	LoginScreen: {
		screen: LoginScreen,
	}
};

export default loginRoutes;
