
import React from 'react';
import {
	Animated,
	Text,
	StyleSheet,
	View,
	I18nManager,
} from 'react-native';
import { TabBar } from 'react-native-tab-view';
import { commonStyle, transformSize } from '@utils'


export default class extends React.Component {
	_renderIndicator = (props) => {

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
			><Animated.View style={[styles.indicator, { width: indicatorWidth }, this.props.indicator]} />
			</Animated.View>
		);
	}
	refLabels = {}
	_renderLabel = (scene) => {
		let { routes, index } = this.props.navigationState;
		let { route } = scene;
		const label = route.title;
		let active = routes[index] === scene.route

		let isLastTab = routes[routes.length - 1] === scene.route
		if (typeof label !== 'string') {
			return null;
		}
		return (
			<View style={{ flexDirection: 'row', width: commonStyle.transformSize(140), position: 'relative', }}>
				<Text ref={lab => this.refLabels[`${scene.route}`] = lab} style={[styles.tabLabel, active && styles.activeTabLabel]}>
					{label}
				</Text>
				{
					isLastTab ? null : this.renderLine()
				}
			</View >
		);
	}

	renderLine = () => {
		return (
			<View style={{ height: 10, width: 1, backgroundColor: '#ccc', position: 'absolute', right: 0, top: 10 }}></View>
		)
	}
	render() {
		let { props } = this

		let { routes } = props.navigationState;
		// let tabWidth = commonStyle.SCREEN_WIDTH / (routes.length + 1)
		// const initialLayout = {
		// 	height: 0,
		// 	width: tabWidth * routes.length
		// };
		let tabWidth = commonStyle.transformSize(140)
		const initialLayout = {
			height: 0,
			width: commonStyle.SCREEN_WIDTH
		};
		let paddingLeft = (commonStyle.SCREEN_WIDTH - (tabWidth * routes.length)) / 2
		return (<View style={{ paddingLeft: paddingLeft }}>
			<TabBar
				{...props}
				initialLayout={initialLayout}
				renderIndicator={this._renderIndicator}
				renderLabel={this._renderLabel}
				style={styles.tabbar}
				tabStyle={[styles.tab, { width: tabWidth }, this.props.tab]}
				bounces={true}
				useNativeDriver
			/>
		</View>
		)
	}

}

const styles = StyleSheet.create({
	container: {
		width: '100%', justifyContent: 'center'
		// , alignItems: 'center'
	},
	tabbar: {
		backgroundColor: 'white',
		elevation: 0,
		shadowOpacity: 0,
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
		flex: 1,
		color: '#000',
		fontWeight: 'bold',
		padding: 0,
		margin: 0,
		fontSize: transformSize(38),
		textAlign: 'center',
	},
});