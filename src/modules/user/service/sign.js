import store from '../../../store';
import {
	userAction
} from '../user.action';

let instance = null;
const sign = {
	init(element) {
		instance = element;
	},

	open() {
		instance.setState({
			opened: true
		});
	},

	close() {
		return instance.close();
	},

	in() {
		return this.start(undefined, 'in');
	},

	out() {
		store.dispatch(userAction.signOut());
	},

	up() {
		return this.start(undefined, 'up');
	},

	updatePassword() {
		return this.start('PasswordUpdating');
	},

	start(view = 'Initial', branch) {
		return new Promise((resolve, reject) => {
			instance.resolve = resolve;
			instance.reject = reject;
			instance.setState({
				view,
				branch
			});
			this.open();
		});
	},

	isIn() {
		let user = store.getState().user;
		console.log(user)
		return user.isSignIn;
	}
};

export default sign;
