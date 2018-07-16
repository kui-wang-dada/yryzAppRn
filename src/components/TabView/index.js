import React from 'react';
import { StyleSheet, Dimensions, Animated, I18nManager, View, Platform, Text } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import TabBarLocal from './TabBar'
import { commonStyle, transformSize, isIphoneX } from '@utils'
const SCREEN_WIDTH = Dimensions.get('window').width;
class SceneComponent extends React.PureComponent {
	render() {
		return (<React.Fragment>
			{this.props.children}
		</React.Fragment>)
	}

}
const initialLayout = {
	height: 0,
	width: SCREEN_WIDTH
};
export default class extends React.Component {
	static defaultProps = {
		initRenderNum: 3
	}
	static getDerivedStateFromProps(props, state) {
		let { children } = props;
		children = React.Children.map(children, (child) => child);
		let routes = children.map((child) => {
			let { tabLabel } = child.props
			return { key: tabLabel, title: tabLabel, screen: child }
		})
		return {
			routes
		}
	}
	state = { index: 0, }
	hasRenderScreens = {}
	_renderTabBar = (props) => {

		return (<TabBarLocal
			{...props}
			initialLayout={initialLayout}
			renderIndicator={this._renderIndicator}
			renderLabel={this._renderLabel}
			style={styles.tabbar}
			tabStyle={[styles.tab]}
			onTabPress={this.onTabPress}
			bounces={true}
			useNativeDriver
			// 王逵需要的属性
			tab={this.props.tab}
			indicator={this.props.indicator}
		/>)
	}
	refLabels = {}
	_renderLabel = (scene) => {

		let { routes, index } = this.state
		let { route } = scene
		const label = route.title;
		let active = routes[index] === scene.route

		if (typeof label !== 'string') {
			return null;
		}

		return (
			<Text ref={lab => this.refLabels[`${scene.route}`] = lab} style={[styles.tabLabel, active && styles.activeTabLabel]}>
				{label}
			</Text>
		);
	}
	_renderIndicator = (props) => {
		// console.log('_renderIndicator', props.navigationState.routes)
		let { indicatorStyle } = this.props
		const { width, position, navigationState, } = props;
		const translateX = Animated.multiply(
			Animated.multiply(
				position.interpolate({
					inputRange: [0, navigationState.routes.length - 1],
					outputRange: [0, navigationState.routes.length - 1],
					extrapolate: 'clamp',
				}),
				width
			),
			I18nManager.isRTL ? -1 : 1
		);
		let indicatorWidthInput = [];
		let indicatorWidthOutput = [];
		for (let index = 0; index < navigationState.routes.length; index++) {
			indicatorWidthInput.push(index);
			let indicatorWidth = Math.min(navigationState.routes[index].title.length * 14 - 10, width);
			indicatorWidthOutput.push(indicatorWidth)
		}
		let indicatorWidth = position.interpolate({
			inputRange: indicatorWidthInput,
			outputRange: indicatorWidthOutput,
			extrapolate: 'clamp',
		})
		return (
			<Animated.View
				style={[
					styles.indicatorContainer,
					{ width, transform: [{ translateX }] },
					indicatorStyle
				]}
			><Animated.View style={[styles.indicator, { width: indicatorWidth }]} />
			</Animated.View>
		);
	}
	_renderScene = ({ route, extraData, maxRenderNum }) => {
		let { index, routes } = this.state
		if (!this.hasRenderScreens[index] && Math.abs(index - routes.indexOf(route)) > maxRenderNum) {
			return <View />;
		}
		this.hasRenderScreens[index] = route
		return (<SceneComponent extraData={extraData} >{route.screen}</SceneComponent>)
	}
	onTabPress = (item) => {
		this.props.onTabPress && this.props.onTabPress(item)
	}

	handleIndexChange = (index) => {
		this.setState({ index });
		// for (let key in this.refLabels) {
		// 	this.refLabels[key].setNativeProps({ style: [styles.tabLabel, key === index.toString() && styles.activeTabLabel] })
		// }
		this.props.onIndexChange && this.props.onIndexChange(index)
	}
	render() {

		let { onIndexChange, children, ...otherProps } = this.props;
		return (<TabView
			style={styles.container}
			navigationState={this.state}
			renderScene={this._renderScene}
			renderTabBar={this._renderTabBar}
			onIndexChange={this.handleIndexChange}
			tabBarPosition="top"
			// animationEnabled={false}
			// swipeEnabled={false}
			useNativeDriver
			{...otherProps}
		/>
		);
	}
}
const styles = StyleSheet.create({
	container: { flex: 1 },
	tabbar: {
		backgroundColor: 'white',
		elevation: 0,
		shadowOpacity: 0
	},
	tab: {
		height: transformSize(110),
	},
	indicatorContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	indicator: {
		backgroundColor: commonStyle.color_theme,
		width: 30,
		position: 'absolute',
		bottom: transformSize(16),
		height: transformSize(6),
		borderRadius: transformSize(3),
	},
	activeTabLabel: {
		color: commonStyle.color_theme,

	},
	tabLabel: {
		backgroundColor: 'transparent',
		color: '#000',
		fontWeight: 'bold',
		padding: 0,
		margin: 0,
		fontSize: transformSize(38),
	},
});