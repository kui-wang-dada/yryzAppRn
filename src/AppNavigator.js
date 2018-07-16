import React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import { getAppRoutes } from './services/modules';
import { commonStyle, umengTrack } from './utils';
import { Icon, StyleSheet, View, Platform } from '@components';
import LoginScreen from '@modules/login/LoginScreen'
import { transformSize } from '@utils/commonStyle';
import sign from '@modules/user/service/sign';


let appRoutes = getAppRoutes();
let tabNavRouteConfig = [
	{
		name: '首页',
		screen: appRoutes.HomeScreen.screen,
		tabBarIcon: ({ tintColor, focused }) => (
			<Icon
				name={focused ? 'home-b' : 'home-a'}
				size={16}
				style={{ color: tintColor }}
			/>
		)
	},
	{
		name: '发现',
		screen: appRoutes.DiscoverScreen.screen,
		tabBarIcon: ({ tintColor, focused }) => (
			<Icon
				name={focused ? 'found-b' : 'found-a'}
				size={16}
				style={{ color: tintColor }}
			/>
		)
	},
	{
		name: '找到',
		screen: appRoutes.SeekOutScreen.screen,
		tabBarIcon: ({ tintColor, focused }) => (
			<Icon
				name={focused ? 'find-b' : 'find-a'}
				size={16}
				style={{ color: tintColor }}
			/>
		)
	},
	{
		name: '我的',
		screen: appRoutes.PersonalScreen.screen,
		tabBarIcon: ({ tintColor, focused }) => (
			<Icon
				name={focused ? 'my-b' : 'my-a'}
				size={16}
				style={{ color: tintColor }}
			/>
		)
	}
]

if (__DEV__) {
	tabNavRouteConfig.push({
		name: 'Demo',
		screen: appRoutes.DemoScreen.screen,
		tabBarIcon: ({ tintColor, focused }) => (
			<Icon
				name="my-b"
				size={16}
				style={{ color: tintColor }}
			/>
		)
	})
}

let appTabNav = tabNavRouteConfig.reduce((prev, next) => {

	prev[next.name] = {
		screen: next.screen,
		navigationOptions: ({ navigation, navigationOptions }) => ({
			tabBarLabel: next.name,
			tabBarIcon: next.tabBarIcon,
			header: next.header,
		})
	}
	return prev;
}, {})

const TabNav = createBottomTabNavigator(appTabNav,
	{
		animationEnabled: false,
		swipeEnabled: false,
		lazy: true,
		tabBarPosition: 'bottom',
		tabBarOptions: {

			showIcon: true,
			activeTintColor: commonStyle.color_theme,
			inactiveTintColor: '#494949',
			labelStyle: {
				fontSize: 12,
				marginTop: Platform.OS === 'android' ? 3 : 4,
			},
			style: {
				backgroundColor: '#fff',
				height: transformSize(100),
				borderTopColor: '#e8e8e8',
				borderTopWidth: StyleSheet.hairlineWidth,
				elevation: 0,
				paddingBottom: 4,
			},
			tabStyle: {
				padding: 0,
				paddingTop: 4,
				justifyContent: 'center',
			},
			indicatorStyle: { backgroundColor: "transparent" },
		}
	}
);

TabNav.navigationOptions = (options) => {

	let { index, routes } = options.navigation.state;
	let { routeName } = routes[index];

	let { navigationOptions } = appTabNav[routeName].screen;

	if (index === 1) { // /发现埋点
		umengTrack('首页_发现')
	}
	if (index === 2) { // /找到埋点
		umengTrack('首页_找到')
	}

	if (typeof navigationOptions === 'function') {
		return navigationOptions(options)
	} return navigationOptions
}

const ModalNav = createStackNavigator(
	{
		LoginScreen: {
			screen: LoginScreen,
		},
	}, {
		headerMode: 'screen',
		mode: 'modal'
	}
);

let routes = {
	App: TabNav,
	// Modal: ModalNav,
	...appRoutes,
};

const StackOptions = ({ navigation }) => {
	const tabBarVisible = false;
	const headerBackTitle = false;
	const headerStyle = {
		backgroundColor: '#fff',
		borderBottomWidth: 0,
		elevation: 0,
	}

	const headerTitleStyle = {
		flex: 1,
		textAlign: 'center',
		fontWeight: '400',
		fontSize: transformSize(34),
	}
	const headerTintColor = commonStyle.themeColor;
	const headerLeft = (
		<Icon name={'arrow-left'} style={s.backButton} onPress={() => { navigation.goBack() }} />
	);
	const headerRight = (
		<View style={s.rightView} />
	);
	return { tabBarVisible, headerBackTitle, headerStyle, headerTitleStyle, headerTintColor, headerLeft, headerRight }

};

const s = StyleSheet.create({
	backButton: {
		fontSize: commonStyle.transformSize(36),
		width: 30,
		marginLeft: 12
	},
	rightView: {
		width: 30,
		marginRight: 12
	}
});


const AppNavigator = createStackNavigator(
	routes,
	{
		navigationOptions: ({ navigation }) => StackOptions({ navigation })
	}
)

export default AppNavigator;
