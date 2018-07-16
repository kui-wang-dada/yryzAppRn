import React from 'react';
import PropTypes from 'prop-types';
import {
	connect
} from 'react-redux';
import {
	goBack,
	navigation
} from '@services';
import store from '../../../store';
function mapStateToProps({ user }) {
	return {
		user
	};
}
export default function withUser(shoudSignIn = true) {
	return (Component) => {
		@connect(mapStateToProps)
		class ComponentWithUser extends React.Component {
			render() {
				if (this.willSignIn()) {
					return null;
				}

				return <Component {...this.props} ref={this.props.setRef} />;
			}

			willSignIn() {
				let { user } = store.getState();
				return shoudSignIn && !user.isSignIn;
			}

			async componentWillMount() {
				if (this.willSignIn()) {
					navigation.navigate('LoginScreen');
				}
			}

			static propTypes = {
				setRef: PropTypes.func
			};

		}
		// dont lose static props
		for (let key of Object.keys(Component)) {
			ComponentWithUser[key] = Component[key]
		}
		return ComponentWithUser;
	};
}
