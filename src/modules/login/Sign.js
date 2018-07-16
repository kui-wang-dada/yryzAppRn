import React from 'react';
import PropTypes from 'prop-types';
import {
	Modal,
	StyleSheet,
	Image,
	ActivityIndicator
} from 'react-native';
import {
	Container,
	Nav,
	Button,
	Right,
	View,
	Tabs,
	Tab,
	Content,
	YIcon
} from '@components';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import PasswordForgot from './components/PasswordForgot';
import PasswordUpdating from './components/PasswordUpdating';
import MobileUpdating from './components/MobileUpdating';
import MobileBinding from './components/MobileBinding';
import { YZhugeIo } from '@ydk';
import styles from '@styles';
import {
	signIn,
	signEdit,
} from '@actions/user';
import logo from '@assets/images/yryz-logo-1.png';

const branches = {
	'in': 0,
	'up': 1,
};

class Sign extends React.Component {
	render() {
		const userData = this.state.userData || {};
		const tabId = branches[this.state.branch];
		const views = {
			'Initial': (
				<View>
					<Image source={logo} style={style.logo} />
					<Tabs
						initialPage={tabId}
						contentProps={{
							keyboardShouldPersistTaps: 'handled',
							keyboardDismissMode: 'interactive'
						}}
						tabBarUnderlineStyle={style.tabBarUnderline}
					>
						<Tab
							heading="登录"
							style={style.tabPage}
							activeTextStyle={style.activeTabBarItemText}
						>
							<SignIn
								toPasswordForgot={this.toPasswordForgot.bind(this)}
								onSuccess={this.handleInSuccess}
								onThirdPartyStart={this.handleThirdPartyStart}
								onThirdPartySuccess={this.handleThirdPartySuccess}
								onThirdPartyEnd={this.handleThirdPartyEnd}
							/>
						</Tab>
						<Tab
							heading="注册"
							style={style.tabPage}
							activeTextStyle={style.activeTabBarItemText}
						>
							<SignUp />
						</Tab>
					</Tabs>
					{this.state.loading && this.renderLoading()}
				</View>
			),
			'PasswordForgot': <PasswordForgot />,
			'PasswordUpdating': <PasswordUpdating />,
			'MobileUpdating': <MobileUpdating onSuccess={this.handleMobileUpdated} />,
			'MobileBinding': <MobileBinding userId={userData.userId} mobile={userData.custPhone} onSuccess={this.handleMobileBound} />,
		};
		const currentView = views[this.state.view];
		const headRight = (
			<Button transparent onPress={this.handlePressClose.bind(this)}>
				<YIcon name="fork" style={style.closeTriggerIcon} />
			</Button>
		);
		return (
			<Modal visible={this.state.opened} animationType="slide" onRequestClose={this.handleRequestClose.bind(this)}>
				<Container style={style.screen}>
					<Nav hideLeftIcon rightComponent={headRight} style={style.head} />
					<Content keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" style={style.body} contentContainerStyle={{minHeight: '100%'}}>
						{currentView}
					</Content>
				</Container>
			</Modal>
		);
	}

	handlePressClose() {
		this.close(true);
	}

	close(manually) {
		return new Promise((resolve) => {
			if (manually) {
				this.reject();
			}

			this.setState({
				opened: false
			}, resolve);
		});
	}

	handleRequestClose() {
		this.close(true);
	}

	toPasswordForgot() {
		this.setState({
			view: 'PasswordForgot'
		});
	}

	renderLoading = () => {
		return (
			<View style={style.loading}>
				<View style={style.loadingContent}>
					<ActivityIndicator color="white" />
				</View>
			</View>
		);
	};

	toMobileBinding = () => {
		this.setState({
			view: 'MobileBinding'
		});
	};

	handleInSuccess = (userData) => {
		this.context.store.dispatch(signIn(userData));
		this.close();
		this.resolve();
	};

	handleThirdPartyStart = () => {
		this.setState({
			loading: true
		});
	};

	handleThirdPartySuccess = (userData) => {
		this.setState({
			userData,
		});

		if (!userData.custPhone || userData.type === 1) {
			this.toMobileBinding();
			return;
		}

		this.handleInSuccess(userData);

		//TrackModule.setEvent('登录成功', {
			// 'userId': ''
		});
	};

	handleThirdPartyEnd = () => {
		this.setState({
			loading: false
		});
	};

	handleMobileBound = (mobile) => {
		this.handleInSuccess(Object.assign({}, this.state.userData, {
			custPhone: mobile
		}));
	};

	handleMobileUpdated = (mobile) => {
		this.context.store.dispatch(signEdit({
			custPhone: mobile
		}));
	};

	state = {
		opened: false,
		branch: 'in',
		view: 'MobileBinding',
		userData: null,
		loading: false
	};

	resolve = null;
	reject = null;

	static contextTypes = {
		store: PropTypes.object
	};
}

const backgroundColor = 'white';
const style = StyleSheet.create({
	screen: {
		backgroundColor
	},
	head: {
		borderBottomWidth: 0
	},
	body: {
		paddingHorizontal: styles.toPercent(100),
	},
	closeTriggerIcon: {
		fontSize: styles.transformSize(56),
		color: styles.textSecondaryColor
	},
	logo: {
		alignSelf: 'center',
		marginBottom: styles.transformSize(130)
	},
	activeTabBarItemText: {
		color: styles.assistColor
	},
	tabBarUnderline: {
		backgroundColor: styles.assistColor
	},
	tabPage: {
		paddingTop: styles.transformSize(54)
	},
	loading: {
		...styles.full,
		...styles.centerWrap
	},
	loadingContent: {
		...styles.maskBackground,
		padding: styles.padding,
		borderRadius: styles.transformSize(15)
	}
});

export default Sign;